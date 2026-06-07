import 'dotenv/config';
import {
    getExperience,
    getCareerPath,
    getAiEnhancedExperience
} from './utils';
import { topicsAgent } from './topics/topics';
import { enhanceAgent } from './enhance/enhance';
import type { resumeLanguage } from '../types/resume';
import { generateSingleTopic } from './topics/singleTopic';
import { resumeAgent } from './resume/resume';
import type { WriterRedefinedBulletPoint } from '../types/agent';
import { closeDb } from '../db';



export async function invokeEnhanceAgent() {
    const result = await enhanceAgent.invoke({
        expId: 11
    })
    return result
}

function example_function() {
    console.log("hey, im example  ai agent")
}

async function main() {
    try {
        example_function()
        const result = await resumeAgent.invoke({ carrerPathId: 7, userId: 2, language: 'EN' })
        console.log(result)
    } finally {
        await closeDb()
    }
}

void main().catch((err) => {
    console.error(err)
    process.exitCode = 1
})
