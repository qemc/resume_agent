import { db } from "../db";
import { ai_enhanced_experience, careerPaths, experiences, skills, topics } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type {
    ExperienceDb,
    AiEnhancedExperienceDb,
    CareerPathsDb
} from '../db/schema';
import type {
    WriterRedefinedBulletPoint, 
    TopicExperienceResume,
    UserExperienceExtraction
} from "../types/agent";
import type { resumeLanguage } from "../types/resume";

export async function getCareerPath(careerPathId: number): Promise<CareerPathsDb | undefined> {
    const result = await db.query.careerPaths.findFirst({
        where: eq(careerPaths.id, careerPathId)
    });
    return result;
}

export async function getExperience(experienceId: number): Promise<ExperienceDb | undefined> {
    const result = await db.query.experiences.findFirst({
        where: eq(experiences.id, experienceId)
    });
    return result;
}

export async function getAiEnhancedExperience(experienceId: number): Promise<AiEnhancedExperienceDb | undefined> {
    const result = await db.query.ai_enhanced_experience.findFirst({
        where: eq(ai_enhanced_experience.experience_id, experienceId)
    });
    return result;
}

export async function upsertAiEnhancedExperience(
    AiEnhancedExperience: WriterRedefinedBulletPoint[], 
    userId: number, 
    expId: number, 
    resumeLang: resumeLanguage
) {
    await db.insert(ai_enhanced_experience).values({
        user_id: userId,
        experience_id: expId,
        resume_lang: resumeLang,
        experience: AiEnhancedExperience,
    }).onConflictDoUpdate({
        target: [ai_enhanced_experience.user_id, ai_enhanced_experience.experience_id],
        set: {
            experience: AiEnhancedExperience,
            updatedAt: new Date()
        }
    });

    return {
        status: 201
    };
}

export async function updateAiEnhanceLastUpdate(expId: number) {
    await db.update(ai_enhanced_experience)
        .set({ updatedAt: new Date() })
        .where(eq(ai_enhanced_experience.experience_id, expId));
}

export function defaultPrompt(systemPrompt: string, userPrompt: string) {
    return ChatPromptTemplate.fromMessages([
        ["system", systemPrompt],
        ["human", userPrompt]
    ]);
}

export async function getCareerPathTopics(careerPathId: number): Promise<TopicExperienceResume[]> {
    const result = await db.select().from(topics).where(eq(topics.career_path_id, careerPathId));
    return result.map((topic) => ({
        experience_id: topic.experience_id,
        topic_text: topic.topic_text
    }));
} 

export async function getResumeExp(expIds: number[]): Promise<UserExperienceExtraction[]> {
    if (!expIds || expIds.length === 0) {
        return [];
    }

    const results = await db.query.experiences.findMany({
        where: (items, { inArray }) => inArray(items.id, expIds),
    });

    return results.map((exp) => ({
        exp_id: exp.id,
        company_name: exp.company,
        start_date: exp.start_date, 
        end_date: exp.end_date,
        current: exp.current
    }));
}

export async function getUserSkills(userId: number, language: resumeLanguage) {
    const result = await db.query.skills.findMany({
        where: and(
            eq(skills.user_id, userId), 
            eq(skills.resume_lang, language)
        )
    });
    return result;
}

export async function getUserCareerPaths(userId: number, language: resumeLanguage): Promise<CareerPathsDb[]> {
    const result = await db.query.careerPaths.findMany({
        where: and(
            eq(careerPaths.user_id, userId),
            eq(careerPaths.resume_lang, language)
        )
    });
    return result;
}