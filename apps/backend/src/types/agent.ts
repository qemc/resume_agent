import {
    bulletPointTopicProposal,
    writerRedefinedBulletPoints
} from "../agentic/enhance/state";
import z, { tuple } from "zod";
import type { CareerPathsDb } from "../db/schema";

// COMMON
export type AgentStatus = 'success' | 'failed' | 'init';

// ENHANCE
export type BulletPointTopicProposal = z.infer<typeof bulletPointTopicProposal>
export type WriterRedefinedBulletPoint = z.infer<typeof writerRedefinedBulletPoints>

// TOPICS
export type CareerPath = {
    name: string,
    description: string
}
export type Topic = {
    topic: string,
    preTopic: WriterRedefinedBulletPoint
}


// type for easier data extraction 
export type TopicExperienceResume = {
    experience_id: number,
    topic_text: string, 
}

// type for easier data extraction 
export type UserExperienceExtraction = {
    exp_id: number,
    company_name: string, 
    start_date: string, 
    end_date: string | null, 
    current: boolean, 
}

// type to store experience data per resume
export type ResumeExp = UserExperienceExtraction & {
    topics: string[]
}