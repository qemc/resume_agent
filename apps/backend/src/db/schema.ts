import {
    type Contact,
    type Skill,
    type Language,
    type Interest,
    type ExperienceInput,
    type CertificateInput,
    type ProjectInput
} from "../types/resume";

import type {
    InferSelectModel
} from 'drizzle-orm';

import type {
    Topic,
    WriterRedefinedTopic
} from '../types/agent';
import {
    pgTable,
    serial,
    uniqueIndex,
    timestamp,
    integer,
    text,
    jsonb
} from 'drizzle-orm/pg-core';



export type ExperienceDb = InferSelectModel<typeof experiences>;
export type AiEnhancedExperienceDb = InferSelectModel<typeof ai_enhanced_experience>;
export type CareerPathsDb = InferSelectModel<typeof careerPaths>;
export type TopicDb = InferSelectModel<typeof topics>;
export type TopicDbInsert = Omit<TopicDb, 'id' | 'createdAt'>



export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const resumes = pgTable('resumes', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    resume_lang: text('resume_lang').notNull(),
    contact: jsonb('contact')
        .$type<Contact>()
        .notNull(),
    skills: jsonb('skills')
        .$type<Skill[]>()
        .notNull(),
    languages: jsonb('languages')
        .$type<Language[]>()
        .notNull(),
    interests: jsonb('interests')
        .$type<Interest[]>()
        .notNull(),
    summary: text('summary')
})

export const experiences = pgTable('experiences', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    resume_lang: text('resume_lang').notNull(),
    experience: jsonb('experience')
        .$type<ExperienceInput>()
        .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})


export const ai_enhanced_experience = pgTable('ai_enhanced_experience', {
    id: serial('id').primaryKey(),
    experience_id: integer('experience_id').references(() => experiences.id, { onDelete: 'cascade' })
        .notNull(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    resume_lang: text('resume_lang').notNull(),
    experience: jsonb('experience')
        .$type<WriterRedefinedTopic[]>()
        .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
    unq: uniqueIndex('one_enhance_per_exp').on(t.user_id, t.experience_id)
}))
// it is about maintaining one ehnance per experience


export const certificates = pgTable('certificates', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    resume_lang: text('resume_lang').notNull(),
    certificate: jsonb('certificate')
        .$type<CertificateInput>()
        .notNull()
})

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    resume_lang: text('resume_lang').notNull(),
    project: jsonb('project')
        .$type<ProjectInput>()
        .notNull()
})

export const careerPaths = pgTable('career_paths', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    resume_lang: text('resume_lang').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const topics = pgTable('topics', {
    id: serial('id').primaryKey(),
    career_path_id: integer('career_path_id')
        .references(() => careerPaths.id, { onDelete: 'cascade' })
        .notNull(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    experience_id: integer('experience_id')
        .references(() => experiences.id, { onDelete: 'cascade' })
        .notNull(),
    resume_lang: text('resume_lang').notNull(),
    topic_text: jsonb('topic')
        .$type<Topic>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

