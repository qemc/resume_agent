import { Annotation } from "@langchain/langgraph";
import z from "zod";
import type { resumeLanguage } from "../../types/resume";
import type {
    AgentStatus,
    JobPosting
} from "../../types/agent";
import type {
    ResumeExp
} from "../../types/agent";
import { SkillsDb } from "../../db/schema";

// state
export const State = Annotation.Root({

    rawJobOfferText: Annotation<string>(),
    userId: Annotation<number>(),

    carrerPathId: Annotation<number>({
        reducer: (x, y) => y ?? x,
        default: () => null
    }),
    language: Annotation<resumeLanguage>({
        reducer: (x, y) => y ?? x,
        default: () => 'EN'
    }),
    skills: Annotation<SkillsDb[]>({
        reducer: (x, y) => y ?? x,
        default: () => []
    }),
    experiences: Annotation<ResumeExp[]>({
        reducer: (x, y) => y ?? x,
        default: () => []
    }),
    jobPostingDetails: Annotation<JobPosting>({
        reducer: (x, y) => y ?? x,
        default: () => null
    }),
    operationStatus: Annotation<AgentStatus>({
        reducer: (x, y) => y ?? x,
        default: () => 'init'
    }),
    error: Annotation<string | undefined>({
        reducer: (x, y) => y ?? x,
        default: () => undefined
    }),
})

// Select exp output format
export const selectExpPromptOutputEn = z.object({
    bulletPoints: z.array(z.string()).describe("An array of the exact bullet point strings provided, sorted from most relevant to least relevant based on the job posting.")
});
export const selectExpPromptOutputPl = z.object({
    bulletPoints: z.array(z.string()).describe("Tablica zawierająca dokładnie te same dostarczone punkty doświadczenia (ciągi znaków), posortowane od najbardziej do najmniej trafnych na podstawie ogłoszenia o pracę.")
});

// Select skills output format
export const selectSkillsPromptOutputEn = z.object({
    skills: z.array(z.string()).describe("An array of the exact skill strings provided, sorted from most relevant to least relevant based on the job posting.")
});
export const selectSkillsPromptOutputPl = z.object({
    skills: z.array(z.string()).describe("Tablica zawierająca dokładnie te same dostarczone umiejętności (ciągi znaków), posortowane od najbardziej do najmniej trafnych na podstawie ogłoszenia o pracę.")
});

// Detect language output format
export const detectLanguageOutput = z.object({
    language: z.enum(['EN', 'PL']).describe("The detected language of the job posting: 'PL' if the job posting is in Polish language and 'EN' if in English.")
});

// Define career path output format
export const defineCareerPathOutputEn = z.object({
    careerPathId: z.number().describe("The ID of the single best matching career path for the provided job posting."),
    reasoning: z.string().describe("Brief explanation of why this career path was chosen for the job posting.")
});
export const defineCareerPathOutputPl = z.object({
    careerPathId: z.number().describe("Identyfikator (ID) pojedynczej, najlepiej dopasowanej ścieżki kariery dla podanego ogłoszenia o pracę."),
    reasoning: z.string().describe("Krótkie wyjaśnienie w języku polskim, dlaczego ta ścieżka kariery została wybrana dla ogłoszenia o pracę.")
});