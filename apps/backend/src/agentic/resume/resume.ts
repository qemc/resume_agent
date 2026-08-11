import { StateGraph, START, END } from "@langchain/langgraph";
import { State } from "./state";
import { 
    fillNode, 
    detectLang,
    careerPathRouter, 
    alignCareerPathLang
} from "./nodes";

const workflow = new StateGraph(State)
    .addNode('detectLang', detectLang)
    .addNode('alignCareerPathLang', alignCareerPathLang)
    .addConditionalEdges(
        START,
        careerPathRouter,
        {
            true: 'alignCareerPathLang',
            false: 'detectLang'
        }
    )
    .addEdge('detectLang', END)

export const resumeAgent = workflow.compile();
