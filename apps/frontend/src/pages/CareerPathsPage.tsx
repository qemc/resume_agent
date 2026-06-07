import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import { LanguageToggle } from '@/components/LanguageToggle';
import { PageLoading } from '@/components/PageLoading';
import { ErrorBanner } from '@/components/ErrorBanner';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { CareerPathFormFields } from '@/components/career-paths/CareerPathFormFields';
import type { ResumeLang, CareerPath } from '@/types';
import {
    getCareerPaths,
    createCareerPath,
    updateCareerPath,
    deleteCareerPath,
} from '@/services/careerPaths';
import { pickLang, careerPathsPage as labels, common as commonLabels } from '@/lib/translations';
import { getApiErrorMessage } from '@/lib/api-error';

export function CareerPathsPage() {
    const navigate = useNavigate();
    const [activeLang, setActiveLang] = useState<ResumeLang>('EN');
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
    const [showNewForm, setShowNewForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [savingId, setSavingId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteModalPath, setDeleteModalPath] = useState<CareerPath | null>(null);

    const t = pickLang(labels, activeLang);
    const tc = pickLang(commonLabels, activeLang);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const paths = await getCareerPaths(activeLang);
                setCareerPaths(paths);
            } catch (error) {
                setErrorMessage(getApiErrorMessage(error, 'Failed to load career paths.'));
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [activeLang]);

    const handleCreate = async () => {
        if (!newName.trim() || !newDescription.trim()) return;

        setSavingId(-1);
        try {
            const created = await createCareerPath({
                resume_lang: activeLang,
                name: newName.trim(),
                description: newDescription.trim(),
            });
            setCareerPaths((prev) => [...prev, created]);
            setNewName('');
            setNewDescription('');
            setShowNewForm(false);
        } catch (error) {
            setErrorMessage(getApiErrorMessage(error, 'Failed to create career path.'));
        } finally {
            setSavingId(null);
        }
    };

    const handleSaveEdit = async (id: number) => {
        const path = careerPaths.find((cp) => cp.id === id);
        if (!path) return;

        setSavingId(id);
        try {
            const updated = await updateCareerPath(id, {
                name: path.name,
                description: path.description,
            });
            setCareerPaths((prev) => prev.map((cp) => (cp.id === id ? updated : cp)));
            setEditingId(null);
        } catch (error) {
            setErrorMessage(getApiErrorMessage(error, 'Failed to update career path.'));
        } finally {
            setSavingId(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteModalPath) return;

        try {
            await deleteCareerPath(deleteModalPath.id);
            setCareerPaths((prev) => prev.filter((cp) => cp.id !== deleteModalPath.id));
        } catch (error) {
            setErrorMessage(getApiErrorMessage(error, 'Failed to delete career path.'));
        } finally {
            setDeleteModalPath(null);
        }
    };

    const handleLocalEdit = (id: number, field: 'name' | 'description', value: string) => {
        setCareerPaths((prev) =>
            prev.map((cp) => (cp.id === id ? { ...cp, [field]: value } : cp))
        );
    };

    if (isLoading) {
        return <PageLoading message={t.loading} />;
    }

    return (
        <>
            <DeleteConfirmModal
                isOpen={!!deleteModalPath}
                itemName={deleteModalPath?.name || ''}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteModalPath(null)}
                lang={activeLang}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold">{t.title}</h1>
                    <LanguageToggle activeLang={activeLang} onChange={setActiveLang} />
                </div>

                <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

                {careerPaths.length === 0 && !showNewForm ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-6">
                        <p className="text-muted-foreground text-center max-w-md px-4">
                            {t.noCareerPaths}
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowNewForm(true)}
                            className="w-20 h-20 rounded-full bg-primary text-primary-foreground text-4xl font-light hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center"
                        >
                            +
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {careerPaths.map((path) => (
                            <Card key={path.id} className="p-6 sm:p-8">
                                {editingId === path.id ? (
                                    <div className="space-y-6">
                                        <CareerPathFormFields
                                            lang={activeLang}
                                            name={path.name}
                                            description={path.description}
                                            onNameChange={(value) =>
                                                handleLocalEdit(path.id, 'name', value)
                                            }
                                            onDescriptionChange={(value) =>
                                                handleLocalEdit(path.id, 'description', value)
                                            }
                                        />
                                        <div className="flex flex-wrap gap-2 pt-4 border-t">
                                            <Button
                                                onClick={() => handleSaveEdit(path.id)}
                                                disabled={savingId === path.id}
                                            >
                                                {savingId === path.id ? tc.saving : tc.save}
                                            </Button>
                                            <Button variant="ghost" onClick={() => setEditingId(null)}>
                                                {tc.cancel}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold">
                                            {path.name || t.namePlaceholder}
                                        </h3>
                                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                            {path.description || t.descriptionPlaceholder}
                                        </p>
                                        <div className="flex flex-wrap gap-2 pt-4 border-t">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => navigate(`/career-paths/${path.id}`)}
                                            >
                                                {tc.open}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setEditingId(path.id)}
                                            >
                                                {tc.edit}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeleteModalPath(path)}
                                            >
                                                {tc.delete}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}

                        {showNewForm && (
                            <Card className="p-6 sm:p-8 border-2 border-dashed border-primary/50">
                                <div className="space-y-6">
                                    <CareerPathFormFields
                                        lang={activeLang}
                                        name={newName}
                                        description={newDescription}
                                        onNameChange={setNewName}
                                        onDescriptionChange={setNewDescription}
                                    />
                                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                                        <Button
                                            onClick={handleCreate}
                                            disabled={
                                                savingId === -1 ||
                                                !newName.trim() ||
                                                !newDescription.trim()
                                            }
                                        >
                                            {savingId === -1 ? tc.saving : tc.save}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setShowNewForm(false);
                                                setNewName('');
                                                setNewDescription('');
                                            }}
                                        >
                                            {tc.cancel}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {!showNewForm && (
                            <div className="flex justify-center pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowNewForm(true)}
                                    className="w-14 h-14 rounded-full bg-primary text-primary-foreground text-2xl font-light hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
