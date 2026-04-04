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
import type { WriterRedefinedBulletPoint } from '../types/agent';



export async function invokeEnhanceAgent() {
    const result = await enhanceAgent.invoke({
        expId: 11
    })
    return result
}