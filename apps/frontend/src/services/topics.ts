import { api } from './api';
import type { ResumeLang, TopicRow } from '@/types';


export const getTopics = async (
    careerPathId: number,
    lang: ResumeLang
): Promise<TopicRow[]> => {
    const response = await api.get<TopicRow[]>(`/topics/${careerPathId}/${lang}`);
    return response.data;
};

export const updateTopic = async (
    careerPathId: number,
    lang: ResumeLang,
    experienceId: number,
    topicId: number,
    topic: string
): Promise<TopicRow> => {
    const response = await api.patch<TopicRow>(
        `/topics/${careerPathId}/${lang}/${experienceId}/${topicId}`,
        { topic, id: topicId }
    );
    return response.data;
};

export const deleteTopic = async (
    careerPathId: number,
    lang: ResumeLang,
    experienceId: number,
    topicId: number
): Promise<void> => {
    await api.delete(`/topics/${careerPathId}/${lang}/${experienceId}/${topicId}`);
};

export const generateAllTopics = async (
    careerPathId: number,
    lang: ResumeLang,
    experienceId: number
): Promise<TopicRow[]> => {
    const response = await api.post<TopicRow[]>(
        `/topics/generate_all/${careerPathId}/${lang}/${experienceId}`
    );
    return response.data;
};

export const generateSingleTopic = async (
    careerPathId: number,
    lang: ResumeLang,
    experienceId: number,
    body: { id: number; topic: string; userHint: string }
): Promise<TopicRow> => {
    const response = await api.post<TopicRow>(
        `/topics/generate_single/${careerPathId}/${lang}/${experienceId}`,
        body
    );
    return response.data;
};

export const createTopic = async (
    careerPathId: number,
    lang: ResumeLang,
    experienceId: number,
    topicText: string
): Promise<TopicRow> => {
    const response = await api.post<TopicRow>(
        `/topics/${careerPathId}/${lang}/${experienceId}`,
        { topic: topicText }
    );
    return response.data;
};

export interface GenerationStatus {
    generatingAllExpIds: number[];
    regeneratingTopicIds: number[];
}

export const getGenerationStatus = async (): Promise<GenerationStatus> => {
    const response = await api.get<GenerationStatus>('/topics/generation-status');
    return response.data;
};
