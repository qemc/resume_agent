import type {
    CareerPath,
    WriterRedefinedBulletPoint,
    Topic,
} from "../../types/agent";
import z from "zod";
import { oai4omini, oai5_1, oai5nano } from "../models";
import {
    singleTopicPromptEn,
    singleTopicPromptPl,
    single_topic_reason_en,
    single_topic_reason_pl,
    bullet_point_en,
    bullet_point_pl
} from "./prompts";
import type { resumeLanguage } from "../../types/resume";



export async function generateSingleTopic(careerPath: CareerPath, redefinedBulletPoint: WriterRedefinedBulletPoint, lang: resumeLanguage, userComment: string = '', previousItem: string = '') {

    let outputDsc_strategy_and_reasoning = single_topic_reason_en
    let outputDsc_final_bullet_point = bullet_point_en
    let singleTopicPrompt = singleTopicPromptEn

    let userCommentAdjusted = userComment
    let previousItemAdjusted = previousItem

    if (userComment.length > 0) {
        userCommentAdjusted = `User hint:\n${userComment}`
    }
    if (previousItem.length > 0) {
        previousItemAdjusted = `Previous item:\n${previousItem}`
    }
    if (lang !== 'EN') {
        outputDsc_strategy_and_reasoning = single_topic_reason_pl
        outputDsc_final_bullet_point = bullet_point_pl
        singleTopicPrompt = singleTopicPromptPl

        if (userComment.length > 0) {
            userCommentAdjusted = `Wskazówka uzytkownika:\n${userComment}`
        }
        if (previousItem.length > 0) {
            previousItemAdjusted = `Wcześniej wygenerowany temat:\n${previousItem}`
        }
    }

    const singleTopicStructuredOutput = z.object({

        strategy_and_reasoning: z.string().describe(outputDsc_strategy_and_reasoning),
        final_bullet_point: z.string().describe(outputDsc_final_bullet_point)
    })

    const topicModel = oai5_1.withStructuredOutput(singleTopicStructuredOutput)



    const chain = singleTopicPrompt.pipe(topicModel)
    const result = await chain.invoke({
        topicName: redefinedBulletPoint.bulletPointProposal,
        topicDescription: redefinedBulletPoint.refinedQuotes.join('\n'),
        careerPathName: careerPath.name,
        careerPathDescription: careerPath.description,
        userHint: userCommentAdjusted,
        previousItem: previousItemAdjusted
    })

    const finalTopic: Topic = {
        topic: result.final_bullet_point,
        preTopic: redefinedBulletPoint
    }

    return finalTopic
}