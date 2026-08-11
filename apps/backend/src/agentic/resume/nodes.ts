import {
    State
} from "./state";

import {
    oai5_1,
    oai5nano
} from "../models";

import {
    selectExpPromptOutputEn,
    selectSkillsPromptOutputEn,
    selectExpPromptOutputPl,
    selectSkillsPromptOutputPl,
    detectLanguageOutput,
    defineCareerPathOutputEn,
    defineCareerPathOutputPl
} from "./state";

import {
    selectSkillsPromptEn,
    selectSkillsPromptPl,
    detectLangPrompt,
    defineCareerPathPromptEn,
    defineCareerPathPromptPl
} from "./prompts";

import {
    getCareerPathTopics,
    getResumeExp,
    getUserSkills,
    getCareerPath,
    getUserCareerPaths
} from "../utils";

import type {
    ResumeExp
} from "../../types/agent"

import {
    SkillsDb
} from "../../db/schema";

import {
    isAgentFailed,
    nodeError
} from "../nodeGuard";

// select  experience models
const selectExpModelEn = oai5_1.withStructuredOutput(selectExpPromptOutputEn)
const selectExpModelPl = oai5_1.withStructuredOutput(selectExpPromptOutputPl)

// select skills models
const selectSkillsModelEn = oai5_1.withStructuredOutput(selectSkillsPromptOutputEn)
const selectSkillsModelPl = oai5_1.withStructuredOutput(selectSkillsPromptOutputPl)

// detect language model
const detectLangModel = oai5nano.withStructuredOutput(detectLanguageOutput)

// define career path models
const defineCareerPathModelEn = oai5_1.withStructuredOutput(defineCareerPathOutputEn)
const defineCareerPathModelPl = oai5_1.withStructuredOutput(defineCareerPathOutputPl)


export async function careerPathRouter(state: typeof State.State) {

    if (state.carrerPathId === null) {
        return 'false'
    }
    return 'true'
}

export async function defineCareerPath(state: typeof State.State) {
    if (isAgentFailed(state)) return {};

    try {
        const availablePaths = await getUserCareerPaths(state.userId, state.language);
        if (!availablePaths || availablePaths.length === 0) {
            return nodeError(new Error(`No career paths found for user ${state.userId} in language ${state.language}`));
        }

        const chain = state.language === 'PL'
            ? defineCareerPathPromptPl.pipe(defineCareerPathModelPl)
            : defineCareerPathPromptEn.pipe(defineCareerPathModelEn);

        const careerPathsListText = availablePaths.map((cp) => {
            return `[ID: ${cp.id}] Name: ${cp.name}\nDescription: ${cp.description}`;
        }).join('\n\n');

        const result = await chain.invoke({
            job_posting_text: state.rawJobOfferText,
            career_paths_list: careerPathsListText
        });

        return {
            carrerPathId: result.careerPathId
        };
    } catch (error) {
        return nodeError(error);
    }
}


export async function alignCareerPathLang(state: typeof State.State) {
    if (isAgentFailed(state)) return {};
    try {
        const careerPath = await getCareerPath(state.carrerPathId);
        if (!careerPath) {
            return nodeError(new Error(`Career path ${state.carrerPathId} not found`));
        }
        return {
            language: careerPath.resume_lang
        }
    } catch (error) {
        return nodeError(error);
    }
}

export async function detectLang(state: typeof State.State) {
    if (isAgentFailed(state)) return {};

    try {
        const detectLangChain = detectLangPrompt.pipe(detectLangModel);
        const rawJobText = state.rawJobOfferText;

        const result = await detectLangChain.invoke({
            raw_job_text: rawJobText
        });

        return {
            language: result.language
        };
    } catch (error) {
        return nodeError(error);
    }
}




export async function fillNode(state: typeof State.State) {
    if (isAgentFailed(state)) return {};

    try {
        const careerPathId = state.carrerPathId;

        const rawCareerPathTopics = await getCareerPathTopics(careerPathId);

        const rawExperienceIds = [...new Set(rawCareerPathTopics.map((topic) => topic.experience_id))];
        const rawExperiences = await getResumeExp(rawExperienceIds);

        const expTopic = new Map<number, string[]>();

        for (let i = 0; i < rawCareerPathTopics.length; i++) {
            if (expTopic.has(rawCareerPathTopics[i].experience_id)) {
                const currentTopics = expTopic.get(rawCareerPathTopics[i].experience_id)!;
                currentTopics.push(rawCareerPathTopics[i].topic_text);
                expTopic.set(rawCareerPathTopics[i].experience_id, currentTopics);
            } else {
                expTopic.set(rawCareerPathTopics[i].experience_id, [rawCareerPathTopics[i].topic_text]);
            }
        }

        const resumeExp: ResumeExp[] = rawExperiences.map((exp) => {
            return {
                ...exp,
                topics: expTopic.get(exp.exp_id) ?? []
            };
        });

        const resumeSkills: SkillsDb[] = await getUserSkills(state.userId, state.language);

        return {
            skills: resumeSkills,
            experiences: resumeExp
        };
    } catch (error) {
        return nodeError(error);
    }
}

export async function selectSkills(state: typeof State.State) {
    if (isAgentFailed(state)) return {};

    try {
        const chain = state.language === "PL"
            ? selectSkillsPromptPl.pipe(selectSkillsModelPl)
            : selectSkillsPromptEn.pipe(selectSkillsModelEn);

        const skillStrings = state.skills.map((s) => s.skill);

        const result = await chain.invoke({
            job_posting_text: state.rawJobOfferText,
            skills_list: skillStrings.join('\n')
        });

        return {
            skills: result.skills
        };
    } catch (error) {
        return nodeError(error);
    }
}


export async function selectExp(state: typeof State.State) {

}


// To do:

// Implement select skills / exp nodes. 
// Perform migrations to add new resume table. 
// Implement endpoints to retrieve all data needed for resume (used to create final resume)


// Create resume with react-pdf, figure out how to handle A4 size sheet