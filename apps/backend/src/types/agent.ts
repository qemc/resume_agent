import {
    bulletPointTopicProposal,
    writerRedefinedBulletPoints
} from "../agentic/enhance/state";
import z from "zod";
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