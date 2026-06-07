import { Annotation } from "@langchain/langgraph";
import z from "zod";
import type { resumeLanguage } from "../../types/resume";
import type { AgentStatus } from "../../types/agent";
import type {
    ResumeExp
} from "../../types/agent";
import { SkillsDb } from "../../db/schema";

// state
export const State = Annotation.Root({
    carrerPathId: Annotation<number>(), // In the invokation, get the ID of the career path
    userId: Annotation<number>(),
    language: Annotation<resumeLanguage>(),
    skills: Annotation<SkillsDb[]>({
        reducer: (x,y) => y ?? x, 
        default: () => []
    }),
    experiences: Annotation<ResumeExp[]>({
        reducer: (x,y) => y ?? x, 
        default: () => []
    }),
})

// ZOD objects


export const selectExpPromptOutputEn = z.object({
    bulletPoints: z.array(z.string()).describe("An array of the exact bullet point strings provided, sorted from most relevant to least relevant based on the job posting.")
});

export const selectSkillsPromptOutputEn = z.object({
    skills: z.array(z.string()).describe("An array of the exact skill strings provided, sorted from most relevant to least relevant based on the job posting.")
});

export const selectExpPromptOutputPl = z.object({
    bulletPoints: z.array(z.string()).describe("Tablica zawierająca dokładnie te same dostarczone punkty doświadczenia (ciągi znaków), posortowane od najbardziej do najmniej trafnych na podstawie ogłoszenia o pracę.")
});

export const selectSkillsPromptOutputPl = z.object({
    skills: z.array(z.string()).describe("Tablica zawierająca dokładnie te same dostarczone umiejętności (ciągi znaków), posortowane od najbardziej do najmniej trafnych na podstawie ogłoszenia o pracę.")
});