import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import type { ResumeLang, TopicRow, ExperienceRow } from '@/types';
import { updateTopic, deleteTopic, createTopic } from '@/services/topics';
import { useTopicsGeneration } from '@/contexts/TopicsGenerationContext';
import { TopicRegenerateDialog } from '@/components/topics/TopicRegenerateDialog';
import { TopicDeleteDialog } from '@/components/topics/TopicDeleteDialog';
import { pickLang, topics as topicLabels, common as commonLabels } from '@/lib/translations';
import { ErrorBanner } from '@/components/ErrorBanner';

interface ExperienceTopicsSectionProps {
    experience: ExperienceRow;
    topics: TopicRow[];
    careerPathId: number;
    lang: ResumeLang;
    onTopicsChanged: (experienceId: number, newTopics: TopicRow[]) => void;
}

export function ExperienceTopicsSection({
    experience,
    topics: propTopics,
    careerPathId,
    lang,
    onTopicsChanged,
}: ExperienceTopicsSectionProps) {
    const t = pickLang(topicLabels, lang);
    const tc = pickLang(commonLabels, lang);


    // Global generation context (persists across route changes)
    const {
        regeneratingTopicIds,
        generatingAllExperienceIds,
        lastError,
        clearError,
        startRegenerate,
        startGenerateAll,
    } = useTopicsGeneration();

    // Use ref to hold the latest topicsList so async callbacks always read current state
    const topicsRef = useRef<TopicRow[]>(propTopics);

    const [topicsList, setTopicsList] = useState<TopicRow[]>(propTopics);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTopicText, setNewTopicText] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    // Regenerate dialog state
    const [regenerateTargetTopic, setRegenerateTargetTopic] = useState<TopicRow | null>(null);
    const [regenerateHint, setRegenerateHint] = useState('');

    // Derived state from global context
    const isGeneratingAll = generatingAllExperienceIds.has(experience.id);
    const isRegenerating = (id: number) => regeneratingTopicIds.has(id);

    // Keep local state in sync with parent props
    useEffect(() => {
        topicsRef.current = propTopics;
        setTopicsList(propTopics);
    }, [propTopics]);

    // Helper: update both state and ref, notify parent
    const updateTopics = (newTopics: TopicRow[]) => {
        topicsRef.current = newTopics;
        setTopicsList(newTopics);
        onTopicsChanged(experience.id, newTopics);
    };

    // ── Generate All (delegated to context) ──
    const handleGenerateAll = () => {
        startGenerateAll(
            experience.id,
            { careerPathId, lang },
            (generated) => {
                // This callback fires even if user navigated away and back —
                // the parent will re-fetch via onGenerationSettled anyway,
                // but if we're still mounted, update immediately.
                updateTopics(generated);
            }
        );
    };

    // ── Regenerate Single (delegated to context) ──
    const openRegenerateDialog = (topic: TopicRow) => {
        setRegenerateTargetTopic(topic);
        setRegenerateHint('');
    };

    const handleRegenerate = () => {
        if (!regenerateTargetTopic) return;
        const topic = regenerateTargetTopic;
        const hint = regenerateHint;

        // Close dialog immediately
        setRegenerateTargetTopic(null);
        setRegenerateHint('');

        startRegenerate(
            topic.id,
            {
                careerPathId,
                lang,
                experienceId: experience.id,
                body: { id: topic.id, topic: topic.topic_text, userHint: hint },
            },
            (regenerated) => {
                // If still mounted, update immediately
                const currentTopics = topicsRef.current;
                updateTopics(currentTopics.map(t => t.id === topic.id ? regenerated : t));
            }
        );
    };

    // ── Edit ──
    const handleStartEdit = (topic: TopicRow) => {
        setEditingId(topic.id);
        setEditText(topic.topic_text);
    };

    const handleSaveEdit = async () => {
        if (editingId === null) return;
        setIsSaving(true);
        try {
            const updated = await updateTopic(
                careerPathId,
                lang,
                experience.id,
                editingId,
                editText
            );
            const currentTopics = topicsRef.current;
            updateTopics(currentTopics.map(t => t.id === editingId ? updated : t));
            setEditingId(null);
            setEditText('');
        } catch (error) {
            console.error('Failed to update topic:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    // ── Delete ──
    const handleConfirmDelete = async () => {
        if (deleteConfirmId === null) return;
        try {
            await deleteTopic(careerPathId, lang, experience.id, deleteConfirmId);
            const currentTopics = topicsRef.current;
            updateTopics(currentTopics.filter(t => t.id !== deleteConfirmId));
        } catch (error) {
            console.error('Failed to delete topic:', error);
        } finally {
            setDeleteConfirmId(null);
        }
    };

    // ── Manual Add ──
    const handleAddTopic = async () => {
        if (!newTopicText.trim()) return;
        setIsAdding(true);
        try {
            const created = await createTopic(careerPathId, lang, experience.id, newTopicText);
            const currentTopics = topicsRef.current;
            updateTopics([...currentTopics, created]);
            setNewTopicText('');
            setShowAddForm(false);
        } catch (error) {
            console.error('Failed to create topic:', error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Card className="p-5 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                    {experience.company} — {experience.position}
                </h3>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleGenerateAll}
                        disabled={isGeneratingAll}
                        className="text-xs"
                    >
                        {isGeneratingAll ? t.generating : t.generateAll}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="text-xs"
                    >
                        ＋ {t.addManually}
                    </Button>
                </div>
            </div>

            {/* Error banner for generation failures */}
            <ErrorBanner message={lastError} onDismiss={clearError} />

            {/* Loading state during Generate All */}
            {isGeneratingAll && (
                <div className="flex items-center gap-3 py-8 justify-center">
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <span className="text-sm text-muted-foreground">{t.generating}</span>
                </div>
            )}

            {/* Topic list */}
            {!isGeneratingAll && topicsList.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">{t.emptyState}</p>
                    <p className="text-xs mt-1">{t.emptyHint}</p>
                </div>
            )}

            {!isGeneratingAll && topicsList.length > 0 && (
                <ul className="space-y-2">
                    {topicsList.map((topic) => (
                        <li
                            key={topic.id}
                            className="group relative flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/40 transition-colors"
                        >
                            {editingId === topic.id ? (
                                /* Edit mode */
                                <div className="flex-1 space-y-2">
                                    <Textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        placeholder={t.topicPlaceholder}
                                        rows={3}
                                        className="text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={handleSaveEdit}
                                            disabled={isSaving || !editText.trim()}
                                        >
                                            {tc.save}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={handleCancelEdit}
                                        >
                                            {tc.cancel}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                /* View mode */
                                <>
                                    <span className="text-muted-foreground mt-0.5 select-none">•</span>
                                    <span className="flex-1 text-sm leading-relaxed">
                                        {isRegenerating(topic.id) ? (
                                            <span className="flex items-center gap-2 text-muted-foreground">
                                                <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin inline-block" />
                                                {t.regenerating}
                                            </span>
                                        ) : (
                                            topic.topic_text
                                        )}
                                    </span>
                                    {!isRegenerating(topic.id) && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 px-2 text-xs"
                                                onClick={() => handleStartEdit(topic)}
                                            >
                                                {tc.edit}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 w-7 p-0 text-xs"
                                                title="Regenerate with AI"
                                                onClick={() => openRegenerateDialog(topic)}
                                            >
                                                {t.regenerate}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                                                onClick={() => setDeleteConfirmId(topic.id)}
                                            >
                                                {tc.delete}
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {/* Manual add form */}
            {showAddForm && (
                <div className="mt-4 pt-4 border-t space-y-3">
                    <Input
                        value={newTopicText}
                        onChange={(e) => setNewTopicText(e.target.value)}
                        placeholder={t.newTopicPlaceholder}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddTopic();
                            }
                        }}
                    />
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={handleAddTopic}
                            disabled={isAdding || !newTopicText.trim()}
                        >
                            {isAdding ? '...' : tc.save}
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setShowAddForm(false);
                                setNewTopicText('');
                            }}
                        >
                            {tc.cancel}
                        </Button>
                    </div>
                </div>
            )}

            {regenerateTargetTopic !== null && (
                <TopicRegenerateDialog
                    topic={regenerateTargetTopic}
                    lang={lang}
                    hint={regenerateHint}
                    onHintChange={setRegenerateHint}
                    onCancel={() => setRegenerateTargetTopic(null)}
                    onSubmit={handleRegenerate}
                />
            )}

            {deleteConfirmId !== null && (
                <TopicDeleteDialog
                    lang={lang}
                    onCancel={() => setDeleteConfirmId(null)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </Card>
    );
}
