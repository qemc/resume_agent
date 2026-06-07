import {
    StateGraph,
    START,
    END
} from "@langchain/langgraph";
import { State } from "./state";
import {
    fill
} from "./nodes";


const workflow = new StateGraph(State)
    .addNode('fill', fill)
    .addEdge(START, 'fill')
    .addEdge('fill', END)

export const resumeAgent = workflow.compile()



