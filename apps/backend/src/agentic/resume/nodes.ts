import { State } from "./state";
import { oai5_1, oai5mini } from "../models";
import {
    selectExpPromptOutputEn,
    selectSkillsPromptOutputEn, 
    selectExpPromptOutputPl,
    selectSkillsPromptOutputPl
} from "./state";
import {
    selectExpPromptEn,
    selectSkillsPromptEn,
    selectExpPromptPl,
    selectSkillsPromptPl
} from "./prompts";
import {
    getCareerPathTopics,
    getResumeExp,
    getUserSkillas
} from "../utils";
import type { resumeLanguage } from "../../types/resume";
import type { ResumeExp } from "../../types/agent"
import { experiences, skills, SkillsDb } from "../../db/schema";

const selectExpModelEn = oai5_1.withStructuredOutput(selectExpPromptOutputEn)
const selectExpModelPl = oai5_1.withStructuredOutput(selectExpPromptOutputPl)

const selectSkillsModelEn = oai5_1.withStructuredOutput(selectSkillsPromptOutputEn)
const selectSkillsModelPl = oai5_1.withStructuredOutput(selectSkillsPromptOutputPl)


export async function fillNode(state: typeof State.State) {

    const careerPathId = state.carrerPathId

    const rawCareerPathTopics = await getCareerPathTopics(careerPathId)

    const rawExperienceIds = [...new Set(rawCareerPathTopics.map((topic) => topic.experience_id ))]
    const rawExperiences = await getResumeExp(rawExperienceIds)

    const expTopic = new Map<number, string[]>()

    for(let i = 0; i<rawCareerPathTopics.length; i++){

        if(expTopic.has(rawCareerPathTopics[i].experience_id)){
            const currentTopics = expTopic.get(rawCareerPathTopics[i].experience_id)
            currentTopics.push(rawCareerPathTopics[i].topic_text)
            expTopic.set(rawCareerPathTopics[i].experience_id, currentTopics)
        }else{
            expTopic.set(rawCareerPathTopics[i].experience_id, [rawCareerPathTopics[i].topic_text])
        }
    }

    const resumeExp: ResumeExp[] = rawExperiences.map((exp) => {
        return{
            ...exp,
            topics: expTopic.get(exp.exp_id)
        }
    })

    const resumeSkills: SkillsDb[] = await getUserSkillas(state.userId, state.language)

    console.log(resumeExp)
    console.log('==========')
    console.log(resumeSkills)

    return {
        skills: resumeSkills,
        experiences: resumeExp
    }
}

export async function selectSkills(state: typeof State.State){

}

export async function selectExp(state: typeof State.State){
    
}


// To do:

// Implement select skills / exp nodes. 
// Perform migrations to add new resume table. 
// Implement endpoints to retrieve all data needed for resume (used to create final resume)


// Create resume with react-pdf, figure out how to handle A4 size sheet