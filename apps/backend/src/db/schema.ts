import type {
    InferSelectModel
} from 'drizzle-orm';

import type {
    WriterRedefinedBulletPoint
} from '../types/agent';
import {
    pgTable,
    serial,
    uniqueIndex,
    timestamp,
    integer,
    text,
    jsonb,
    boolean
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


export const contact_data = pgTable('contact_data', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    resume_lang: text('resume_lang').notNull(),
    email: text('email').notNull(),
    phone_number: text('phone_number').notNull(),
    first_name: text('first_name').notNull(),
    last_name: text('last_name').notNull(),
    linkedin: text('linkedin').notNull(),
    github: text('github').notNull(),
    website: text('website').notNull(),
    location: text('location').notNull(),
})

export const skills = pgTable('skills', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    resume_lang: text('resume_lang').notNull(),
    skill: text('skill').notNull(),
    level: text('level'),
    category: text('category')
})

export const languages = pgTable('languages', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    resume_lang: text('resume_lang').notNull(),
    name: text('name').notNull(),
    level: text('level').notNull(),
})

export const interests = pgTable('interests', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    resume_lang: text('resume_lang').notNull(),
    interest: text('interest').notNull(),
})

export const experiences = pgTable('experiences', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    resume_lang: text('resume_lang').notNull(),
    company: text('company').notNull(),
    position: text('position').notNull(),
    start_date: text('start_date').notNull(),
    end_date: text('end_date').notNull(),
    current: boolean('current').notNull().default(false),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const certificates = pgTable('certificates', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    resume_lang: text('resume_lang').notNull(),
    certificate_name: text('certificate_name').notNull(),
    issuer: text('issuer').notNull(),
    issue_date: text('issue_date').notNull(),
    expiry_date: text('expiry_date').notNull(),
    credential_id: text('credential_id').notNull(),
    url: text('url').notNull(),
})

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    resume_lang: text('resume_lang').notNull(),
    project_name: text('project_name').notNull(),
    description: text('description').notNull(),
    url: text('url').notNull(),
})

export const education = pgTable('education', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    university: text('university').notNull(),
    degree: text('degree').notNull(),
    resume_lang: text('resume_lang').notNull(),
    start_date: text('start_date').notNull(),
    end_date: text('end_date').notNull(),
    current: boolean('current').notNull().default(false)
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

export const ai_enhanced_experience = pgTable('ai_enhanced_experience', {
    id: serial('id').primaryKey(),
    experience_id: integer('experience_id').references(() => experiences.id, { onDelete: 'cascade' })
        .notNull(),
    user_id: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    resume_lang: text('resume_lang').notNull(),
    experience: jsonb('experience')
        .$type<WriterRedefinedBulletPoint[]>()
        .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
    unq: uniqueIndex('one_enhance_per_exp').on(t.user_id, t.experience_id)
}))

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
    topic_text: text('topic_text').notNull(),
    topic_quotes: text('topic_quotes').array().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})
