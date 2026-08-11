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
import { jobOffer1 } from './exampleJobOffers';


export async function invokeEnhanceAgent() {
    const result = await enhanceAgent.invoke({
        expId: 11
    })
    return result
}


async function main() {
    try {

        const result = await resumeAgent.invoke({
            userId: 2,
            rawJobOfferText: jobOffer1,
            carrerPathId: 7
        })

        console.log(result)
    } finally {
        await closeDb()
    }
}

void main().catch((err) => {
    console.error(err)
    process.exitCode = 1
})


/**
 * RESUME AGENT IMPLEMENTATION STATUS & ROADMAP
 * --------------------------------------------------------------------------------
 * Current Status: In-Progress (Phase 1-2 partially implemented, graph partially wired)
 * 
 * 🟢 Implemented Nodes:
 *   - careerPathRouter: Conditional edge router for carrerPathId presence.
 *   - alignCareerPathLang: Fetches resume_lang from DB for given career path.
 *   - detectLang: AI node detecting 'PL' or 'EN' from raw job offer text.
 *   - defineCareerPath: AI node matching job posting to best user career path.
 *   - fillNode: DB node fetching user topics, experiences, and skills.
 *   - selectSkills: AI node ranking skills by job offer relevance.
 * 
 * 🟡 Stub / In-Progress Nodes:
 *   - selectExp: Logic stubbed in nodes.ts, needs full implementation.
 * 
 * 🔴 Planned Nodes & Tasks Remaining:
 *   - extractJobOffer: AI node parsing job posting into structured fields.
 *   - orderExperiences: AI node ranking experience blocks.
 *   - qualityCheck: Final text & grammar polishing pass.
 *   - Graph Wiring: Wire remaining nodes in resume.ts (currently stops at END early).
 *   - DB Schema & API: Implement resume persistence table and API endpoints.
 *   - Export / UI: Build PDF rendering (react-pdf) layout.
 * 
 * --------------------------------------------------------------------------------
 * Documentation & Specifications:
 *   For comprehensive architecture, node lifecycle diagrams, and product specs, see:
 *   - requ/resume_agent_flow.md   -> Flowchart & complete node specifications
 *   - requ/job-applications.md    -> Feature scope, endpoints & schema specs
 *   - requ/agent-error-handling.md -> Node error boundary and fallback design
 */






