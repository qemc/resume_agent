import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ResumeLang, TopicRow } from '@/types';
import {
    generateAllTopics as apiGenerateAll,
    generateSingleTopic as apiGenerateSingle,
    getGenerationStatus,
} from '@/services/topics';

// ─── Types ──────────────────────────────────────────────────────────────────

interface TopicsGenerationContextValue {
    /** Set of topic IDs currently being regenerated */
    regeneratingTopicIds: Set<number>;
    /** Set of experience IDs currently running "Generate All" */
    generatingAllExperienceIds: Set<number>;

    /**
     * Start regenerating a single topic. The API call runs in context,
     * so it survives route changes. Returns immediately.
     */
    startRegenerate: (
        topicId: number,
        params: {
            careerPathId: number;
            lang: ResumeLang;
            experienceId: number;
            body: { id: number; topic: string; userHint: string };
        },
        onComplete?: (result: TopicRow) => void,
    ) => void;

    /**
     * Start generating all topics for an experience. The API call runs
     * in context, so it survives route changes. Returns immediately.
     */
    startGenerateAll: (
        experienceId: number,
        params: {
            careerPathId: number;
            lang: ResumeLang;
        },
        onComplete?: (result: TopicRow[]) => void,
    ) => void;

    /**
     * Register a callback that fires when ANY generation completes
     * (for components that remount and want to refresh data).
     */
    onGenerationSettled: (cb: () => void) => () => void;

    /**
     * Fetch current generation status from the backend and restore
     * spinner state. Called on page load to survive refresh.
     */
    fetchStatus: () => void;
}

const TopicsGenerationContext = createContext<TopicsGenerationContextValue | null>(null);

const POLL_INTERVAL_MS = 3000;

// ─── Provider ───────────────────────────────────────────────────────────────

export function TopicsGenerationProvider({ children }: { children: ReactNode }) {
    const [regeneratingTopicIds, setRegeneratingTopicIds] = useState<Set<number>>(new Set());
    const [generatingAllExperienceIds, setGeneratingAllExperienceIds] = useState<Set<number>>(new Set());

    // Settled listeners — components subscribe to know when to re-fetch
    const settledListenersRef = useRef<Set<() => void>>(new Set());
    // Track if a poll is already running
    const pollingRef = useRef(false);
    const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const notifySettled = useCallback(() => {
        settledListenersRef.current.forEach(cb => cb());
    }, []);

    const onGenerationSettled = useCallback((cb: () => void) => {
        settledListenersRef.current.add(cb);
        return () => { settledListenersRef.current.delete(cb); };
    }, []);

    // ── Polling Logic ──

    const stopPolling = useCallback(() => {
        if (pollTimerRef.current) {
            clearTimeout(pollTimerRef.current);
            pollTimerRef.current = null;
        }
        pollingRef.current = false;
    }, []);

    const pollStatus = useCallback(async () => {
        try {
            const status = await getGenerationStatus();
            const serverExpIds = new Set(status.generatingAllExpIds);
            const serverTopicIds = new Set(status.regeneratingTopicIds);

            setGeneratingAllExperienceIds(serverExpIds);
            setRegeneratingTopicIds(serverTopicIds);

            // If server reports nothing active, stop polling and notify
            if (serverExpIds.size === 0 && serverTopicIds.size === 0) {
                stopPolling();
                notifySettled();
                return;
            }

            // Keep polling
            pollTimerRef.current = setTimeout(pollStatus, POLL_INTERVAL_MS);
        } catch (error) {
            console.error('Failed to poll generation status:', error);
            stopPolling();
        }
    }, [notifySettled, stopPolling]);

    const startPolling = useCallback(() => {
        if (pollingRef.current) return; // already polling
        pollingRef.current = true;
        pollStatus();
    }, [pollStatus]);

    // Clean up on unmount
    useEffect(() => {
        return () => stopPolling();
    }, [stopPolling]);

    // ── Fetch Status (called on page load) ──

    const fetchStatus = useCallback(async () => {
        try {
            const status = await getGenerationStatus();
            const serverExpIds = new Set(status.generatingAllExpIds);
            const serverTopicIds = new Set(status.regeneratingTopicIds);

            // Merge with any locally-tracked IDs (from this session)
            setGeneratingAllExperienceIds(prev => {
                const merged = new Set(prev);
                serverExpIds.forEach(id => merged.add(id));
                return merged;
            });
            setRegeneratingTopicIds(prev => {
                const merged = new Set(prev);
                serverTopicIds.forEach(id => merged.add(id));
                return merged;
            });

            // If there are active generations on the server, start polling
            if (serverExpIds.size > 0 || serverTopicIds.size > 0) {
                startPolling();
            }
        } catch (error) {
            console.error('Failed to fetch generation status:', error);
        }
    }, [startPolling]);

    // ── Regenerate Single Topic ──

    const startRegenerate = useCallback((
        topicId: number,
        params: {
            careerPathId: number;
            lang: ResumeLang;
            experienceId: number;
            body: { id: number; topic: string; userHint: string };
        },
        onComplete?: (result: TopicRow) => void,
    ) => {
        setRegeneratingTopicIds(prev => new Set(prev).add(topicId));

        startPolling();

        apiGenerateSingle(params.careerPathId, params.lang, params.experienceId, params.body)
            .then(result => {
                onComplete?.(result);
                notifySettled();
            })
            .catch(error => {
                console.error('Failed to regenerate topic:', error);
                notifySettled();
            })
            .finally(() => {
                setRegeneratingTopicIds(prev => {
                    const next = new Set(prev);
                    next.delete(topicId);
                    return next;
                });
            });
    }, [notifySettled, startPolling]);

    // ── Generate All Topics for Experience ──

    const startGenerateAll = useCallback((
        experienceId: number,
        params: {
            careerPathId: number;
            lang: ResumeLang;
        },
        onComplete?: (result: TopicRow[]) => void,
    ) => {
        setGeneratingAllExperienceIds(prev => new Set(prev).add(experienceId));

        startPolling();

        apiGenerateAll(params.careerPathId, params.lang, experienceId)
            .then(result => {
                onComplete?.(result);
                notifySettled();
            })
            .catch(error => {
                console.error('Failed to generate all topics:', error);
                notifySettled();
            })
            .finally(() => {
                setGeneratingAllExperienceIds(prev => {
                    const next = new Set(prev);
                    next.delete(experienceId);
                    return next;
                });
            });
    }, [notifySettled, startPolling]);

    const value: TopicsGenerationContextValue = {
        regeneratingTopicIds,
        generatingAllExperienceIds,
        startRegenerate,
        startGenerateAll,
        onGenerationSettled,
        fetchStatus,
    };

    return (
        <TopicsGenerationContext.Provider value={value}>
            {children}
        </TopicsGenerationContext.Provider>
    );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useTopicsGeneration() {
    const ctx = useContext(TopicsGenerationContext);
    if (!ctx) throw new Error('useTopicsGeneration must be used within TopicsGenerationProvider');
    return ctx;
}
