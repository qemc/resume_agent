import { Annotation } from "@langchain/langgraph";
import type {
    AgentStatus,
    WriterRedefinedBulletPoint,
    CareerPath,
    Topic
} from "../../types/agent";
import type { resumeLanguage } from "../../types/resume";

export const State = Annotation.Root({

    expId: Annotation<number>(),
    careerPathId: Annotation<number>(),


    redefinedBulletPoints: Annotation<WriterRedefinedBulletPoint[]>({
        reducer: (x, y) => y ?? x,
        default: () => []
    }),
    careerPath: Annotation<CareerPath>({
        reducer: (x, y) => y ?? x,
        default: () => ({ name: '', description: '' })
    }),
    careerPathTopics: Annotation<Topic[]>({
        reducer: (x, y) => y ?? x,
        default: () => []
    }),
    operationStatus: Annotation<AgentStatus>({
        reducer: (x, y) => y ?? x,
        default: () => 'init'
    }),
    resumeLang: Annotation<resumeLanguage>({
        reducer: (x, y) => y ?? x,
        default: () => 'EN'
    }),
    error: Annotation<undefined | string>({
        reducer: (x, y) => y ?? x,
        default: () => undefined
    })
})