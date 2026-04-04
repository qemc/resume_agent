import { Annotation } from "@langchain/langgraph";
import z from "zod";
import type { resumeLanguage } from "../../types/resume";
import type { AgentStatus } from "../../types/agent";
import type {
    WriterRedefinedBulletPoint,
    BulletPointTopicProposal
} from "../../types/agent";

// state
export const State = Annotation.Root({
    userSummary: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => ''
    }),
    bulletPointProposals: Annotation<BulletPointTopicProposal[]>({
        reducer: (x, y) => y ?? x,
        default: () => []
    }),
    redefinedBulletPoints: Annotation<WriterRedefinedBulletPoint[]>({
        reducer: (x, y) => y ?? x,
        default: () => []
    }),
    expId: Annotation<number>(),
    userId: Annotation<number>({
        reducer: (x, y) => y ?? x,
        default: () => 1
    }),
    resumeLang: Annotation<resumeLanguage>({
        reducer: (x, y) => y ?? x,
        default: () => 'EN'
    }),
    operationStatus: Annotation<AgentStatus>({
        reducer: (x, y) => y ?? x,
        default: () => 'init'
    }),
    error: Annotation<undefined | string>({
        reducer: (x, y) => y ?? x,
        default: () => undefined
    })
})

// ZOD objects

// ARCHITECT
export const bulletPointTopicProposal = z.object({
    redefinedQuote: z.string().describe('The single sentence or two that describes the workstream'),
    rawQuotes: z.array(z.string()).describe('Raw quotes that proves the workstream existance.')
})

export const architectOutput = z.object({
    workstreams: z.array(bulletPointTopicProposal).describe("An array of all bullet points proposals found in the user experience")
})

//WRITER
export const writerRedefinedBulletPoints = z.object({
    bulletPointProposal: z.string().describe('A final proposal of the bullet point'),
    refinedQuotes: z.array(z.string()).describe('An array of refined quotes that were used to create bullet point')
})
