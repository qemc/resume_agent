import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import type { CareerPath, ResumeLang, ExperienceRow, TopicRow } from '@/types';
import { getCareerPath, updateCareerPath, deleteCareerPath } from '@/services/careerPaths';
import { getExperiences } from '@/services/resume';
import { getTopics } from '@/services/topics';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { CareerPathFormFields } from '@/components/career-paths/CareerPathFormFields';
import { ExperienceTopicsSection } from '@/components/ExperienceTopicsSection';
import { ErrorBanner } from '@/components/ErrorBanner';
import { useTopicsGeneration } from '@/contexts/TopicsGenerationContext';
import { pickLang, careerPathDetail as labels, common as commonLabels } from '@/lib/translations';
import { getApiErrorMessage } from '@/lib/api-error';

export function CareerPathDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [careerPath, setCareerPath] = useState<CareerPath | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Experience & Topics state
    const [experiences, setExperiences] = useState<ExperienceRow[]>([]);
    const [topicsByExperience, setTopicsByExperience] = useState<Record<number, TopicRow[]>>({});
    const [isLoadingExperiences, setIsLoadingExperiences] = useState(false);

    // Derive language from the career path record
    const lang: ResumeLang = careerPath?.resume_lang ?? 'EN';
    const t = pickLang(labels, lang);
    const tc = pickLang(commonLabels, lang);

    // Load career path on mount
    useEffect(() => {
        const loadCareerPath = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await getCareerPath(Number(id));
                setCareerPath(data);
            } catch {
                setNotFound(true);
            } finally {
                setIsLoading(false);
            }
        };
        loadCareerPath();
    }, [id]);

    const { onGenerationSettled, fetchStatus } = useTopicsGeneration();

    // Re-fetch just topics (used after generation completes)
    const refetchTopics = useCallback(async () => {
        if (!careerPath) return;
        try {
            const allTopics = await getTopics(careerPath.id, careerPath.resume_lang);
            const grouped: Record<number, TopicRow[]> = {};
            for (const topic of allTopics) {
                if (!grouped[topic.experience_id]) grouped[topic.experience_id] = [];
                grouped[topic.experience_id].push(topic);
            }
            setTopicsByExperience(grouped);
        } catch {
            // Topics may not exist yet
        }
    }, [careerPath?.id, careerPath?.resume_lang]);

    // Load experiences + topics once career path is available
    useEffect(() => {
        if (!careerPath) return;
        const loadExperiencesAndTopics = async () => {
            setIsLoadingExperiences(true);
            try {
                const exps = await getExperiences(careerPath.resume_lang);
                setExperiences(exps);
                await refetchTopics();
                // Check backend for any in-flight generations (survives refresh)
                fetchStatus();
            } catch (error) {
                console.error('Failed to load experiences:', error);
            } finally {
                setIsLoadingExperiences(false);
            }
        };
        loadExperiencesAndTopics();
    }, [careerPath?.id, careerPath?.resume_lang, refetchTopics, fetchStatus]);

    // Re-fetch topics whenever a generation completes (even if we navigated away & back)
    useEffect(() => {
        return onGenerationSettled(() => {
            refetchTopics();
        });
    }, [onGenerationSettled, refetchTopics]);

    // Handle topics changed from child component
    const handleTopicsChanged = (experienceId: number, newTopics: TopicRow[]) => {
        setTopicsByExperience(prev => ({
            ...prev,
            [experienceId]: newTopics,
        }));
    };

    // Enter edit mode
    const handleStartEdit = () => {
        if (!careerPath) return;
        setEditName(careerPath.name);
        setEditDescription(careerPath.description);
        setIsEditing(true);
    };

    // Save edits
    const handleSave = async () => {
        if (!careerPath) return;
        setIsSaving(true);
        try {
            const updated = await updateCareerPath(careerPath.id, {
                name: editName,
                description: editDescription,
            });
            setCareerPath(updated);
            setIsEditing(false);
        } catch (error) {
            setErrorMessage(getApiErrorMessage(error, 'Failed to update career path.'));
        } finally {
            setIsSaving(false);
        }
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditName('');
        setEditDescription('');
    };

    // Delete
    const handleConfirmDelete = async () => {
        if (!careerPath) return;
        try {
            await deleteCareerPath(careerPath.id);
            navigate('/career-paths');
        } catch (error) {
            setErrorMessage(getApiErrorMessage(error, 'Failed to delete career path.'));
        } finally {
            setShowDeleteModal(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-lg text-muted-foreground">{t.loading}</p>
                </div>
            </div>
        );
    }

    // Not found state
    if (notFound || !careerPath) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-3xl">🔍</span>
                    </div>
                    <p className="text-lg text-muted-foreground">{t.notFound}</p>
                    <Link
                        to="/career-paths"
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                        {t.backToList}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                itemName={careerPath.name}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteModal(false)}
                lang={lang}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

                <Link
                    to="/career-paths"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    {t.backLink}
                </Link>

                {/* Career Path Card */}
                <Card className="p-6 sm:p-8">
                    {isEditing ? (
                        /* Edit Mode */
                        <div className="space-y-6">
                            <CareerPathFormFields
                                lang={lang}
                                name={editName}
                                description={editDescription}
                                onNameChange={setEditName}
                                onDescriptionChange={setEditDescription}
                            />
                            <div className="flex flex-wrap gap-2 pt-4 border-t">
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving || !editName.trim() || !editDescription.trim()}
                                >
                                    {isSaving ? tc.saving : tc.save}
                                </Button>
                                <Button variant="ghost" onClick={handleCancelEdit}>
                                    {tc.cancel}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* View Mode */
                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold">
                                {careerPath.name}
                            </h1>
                            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                {careerPath.description}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-4 border-t">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleStartEdit}
                                >
                                    {tc.edit}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    {tc.delete}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Experience Topics Sections */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">{t.experiencesTitle}</h2>

                    {isLoadingExperiences && (
                        <div className="flex items-center gap-3 py-8 justify-center">
                            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            <span className="text-sm text-muted-foreground">{t.experiencesLoading}</span>
                        </div>
                    )}

                    {!isLoadingExperiences && experiences.length === 0 && (
                        <p className="text-sm text-muted-foreground py-4">{t.noExperiences}</p>
                    )}

                    {!isLoadingExperiences && experiences.map((exp) => (
                        <ExperienceTopicsSection
                            key={exp.id}
                            experience={exp}
                            topics={topicsByExperience[exp.id] || []}
                            careerPathId={careerPath.id}
                            lang={lang}
                            onTopicsChanged={handleTopicsChanged}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
