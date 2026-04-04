import { State } from "./state";
import { oai4omini, oai5_1, oai5mini, oai5nano } from "../models";
import {
    architectOutput,
    writerRedefinedBulletPoints
} from "./state";
import {
    architectPromptEn,
    architectPromptPl,
    processSingleWorkstreamPromptEn,
    processSingleWorkstreamPromptPl
} from "./prompts";
import {
    upsertAiEnhancedExperience,
    getExperience
} from "../utils";
import type { resumeLanguage } from "../../types/resume";

const model_so_architect = oai5mini.withStructuredOutput(architectOutput)
const model_so_writer = oai5_1.withStructuredOutput(writerRedefinedBulletPoints)

export async function fill(state: typeof State.State) {

    const expId = state.expId
    const rawExperience = await getExperience(expId)
    return {
        userSummary: rawExperience.description,
        userId: rawExperience.user_id,
        resumeLang: rawExperience.resume_lang as resumeLanguage,
    }
}

export async function architect(state: typeof State.State) {

    let architectPrompt = architectPromptEn
    if (state.resumeLang !== 'EN') architectPrompt = architectPromptPl

    const userSum = state.userSummary
    const resultChain = architectPrompt.pipe(model_so_architect)

    const result = await resultChain.invoke({
        raw_text: userSum
    })

    return {
        bulletPointProposals: result.workstreams
    }
}

export async function writer(state: typeof State.State) {

    let processSingleWorkstreamPrompt = processSingleWorkstreamPromptEn
    if (state.resumeLang !== 'EN') processSingleWorkstreamPrompt = processSingleWorkstreamPromptPl

    const proposals = state.bulletPointProposals
    const resultsToBe = proposals.map(async (proposal) => {

        const chain = processSingleWorkstreamPrompt.pipe(model_so_writer)
        const topic = proposal.redefinedQuote
        const rawQuotes = proposal.rawQuotes.map((quote) => {
            return `-${quote}`
        }).join('\n')

        return chain.invoke({
            topic: topic,
            rawQuotes: rawQuotes
        })
    })

    const results = await Promise.all(resultsToBe)
    return {
        redefinedBulletPoints: results
    }
}

export async function saver(state: typeof State.State) {

    try {
        const result = await upsertAiEnhancedExperience(
            state.redefinedBulletPoints,
            state.userId,
            state.expId,
            state.resumeLang,
        )
        return {
            operationStatus: 'success'
        }
    } catch (error) {
        return {
            operationStatus: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}
