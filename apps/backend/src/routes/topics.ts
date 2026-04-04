import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { careerPaths, topics } from "../db/schema";
import { AppError, ERRORS } from "../../utils/errors";
import type { CareerPath } from "../types/agent";
import { topicsAgent } from "../agentic/topics/topics";
import { generateSingleTopic } from "../agentic/topics/singleTopic";
import { trackGenerateAll, untrackGenerateAll, trackRegenerate, untrackRegenerate, getActiveGenerations } from "../generationTracker";



const loadAllTopicsParamSchema = z.object({
    careerPath: z.coerce.number().int().positive(),
    lang: z.enum(['EN', 'PL'])
});

const expTopicSchema = z.object({
    careerPath: z.coerce.number().int().positive(),
    lang: z.enum(['EN', 'PL']),
    experience: z.coerce.number().int().positive(),
})

const expSingleTopicSchema = z.object({
    id: z.coerce.number().int().positive(),
    topic: z.string(),
    userHint: z.string()
})

const topicSchema = z.object({
    topic: z.string(),
})

const updateTopicSchema = z.object({
    topic: z.string(),
    id: z.coerce.number().int().positive(),
})


export async function topicRoutes(app: FastifyInstance) {

    // get all topics related to single career path (on page load)
    app.get('/topics/:careerPath/:lang', { onRequest: [app.auth] }, async (req) => {

        const { careerPath, lang } = loadAllTopicsParamSchema.parse(req.params)

        const items = await db.query.topics.findMany({
            where: and(
                eq(topics.user_id, req.user.id),
                eq(topics.career_path_id, careerPath),
                eq(topics.resume_lang, lang)
            )
        })
        return items
    });

    // update single topic text
    app.patch('/topics/:careerPath/:lang/:experience/:id', { onRequest: [app.auth] }, async (req, reply) => {

        const parsedIncomingItem = updateTopicSchema.safeParse(req.body)
        if (!parsedIncomingItem.success) throw new AppError(ERRORS.INVALID_REQUEST);

        const { experience, careerPath, lang } = expTopicSchema.parse(req.params)

        const existingItem = await db.query.topics.findFirst({
            where: and(
                eq(topics.user_id, req.user.id),
                eq(topics.experience_id, experience),
                eq(topics.resume_lang, lang),
                eq(topics.career_path_id, careerPath),
                eq(topics.id, parsedIncomingItem.data.id)
            )
        })
        if (!existingItem) throw new AppError(ERRORS.NOT_FOUND);

        await db.update(topics)
            .set({ topic_text: parsedIncomingItem.data.topic })
            .where(
                and(
                    eq(topics.id, parsedIncomingItem.data.id),
                    eq(topics.user_id, req.user.id)
                )
            );

        return { ...existingItem, topic_text: parsedIncomingItem.data.topic };
    })


    // Generate all topics for an experience via AI agent
    app.post('/topics/generate_all/:careerPath/:lang/:experience', { onRequest: app.auth }, async (req, reply) => {

        const { lang, careerPath, experience } = expTopicSchema.parse(req.params)

        trackGenerateAll(req.user.id, experience);
        try {
            const newTopics = await topicsAgent.invoke({
                expId: experience,
                careerPathId: careerPath,
                resumeLang: lang
            })

            if (!newTopics) throw new AppError(ERRORS.AI_ERROR);

            // Map agent output (Topic[]) to flat DB rows
            const topicRows = newTopics.careerPathTopics.map((item) => ({
                user_id: req.user.id,
                resume_lang: lang,
                career_path_id: careerPath,
                experience_id: experience,
                topic_text: item.topic,
                topic_quotes: item.preTopic.refinedQuotes,
            }))

            // Remove existing topics for this experience before inserting new ones
            await db.delete(topics).where(
                and(
                    eq(topics.user_id, req.user.id),
                    eq(topics.career_path_id, careerPath),
                    eq(topics.experience_id, experience),
                    eq(topics.resume_lang, lang)
                )
            );

            const inserted = await db.insert(topics)
                .values(topicRows)
                .returning()

            return reply.status(201).send(inserted)
        } finally {
            untrackGenerateAll(req.user.id, experience);
        }
    })


    // Regenerate a single topic via AI agent
    app.post('/topics/generate_single/:careerPath/:lang/:experience', { onRequest: app.auth }, async (req, reply) => {

        const { lang, careerPath, experience } = expTopicSchema.parse(req.params)

        const parsedBody = expSingleTopicSchema.safeParse(req.body)
        if (!parsedBody.success) throw new AppError(ERRORS.INVALID_REQUEST);

        const topicData = await db.query.topics.findFirst({
            where: and(
                eq(topics.id, parsedBody.data.id),
                eq(topics.user_id, req.user.id)
            )
        })
        if (!topicData) throw new AppError(ERRORS.NOT_FOUND);

        const careerPathData = await db.query.careerPaths.findFirst({
            where: and(
                eq(careerPaths.id, careerPath),
                eq(careerPaths.user_id, req.user.id)
            )
        })
        if (!careerPathData) throw new AppError(ERRORS.NOT_FOUND);

        const careerPathAdjusted: CareerPath = {
            name: careerPathData.name,
            description: careerPathData.description
        }

        // Reconstruct the WriterRedefinedBulletPoint from flat columns
        const preTopic = {
            bulletPointProposal: topicData.topic_text,
            refinedQuotes: topicData.topic_quotes,
        }

        trackRegenerate(req.user.id, parsedBody.data.id);
        try {
            const newTopic = await generateSingleTopic(
                careerPathAdjusted,
                preTopic,
                lang,
                parsedBody.data.userHint,
                parsedBody.data.topic
            )

            if (!newTopic) throw new AppError(ERRORS.AI_ERROR);

            await db.update(topics)
                .set({
                    topic_text: newTopic.topic,
                    topic_quotes: newTopic.preTopic.refinedQuotes,
                })
                .where(eq(topics.id, topicData.id));

            return { ...topicData, topic_text: newTopic.topic, topic_quotes: newTopic.preTopic.refinedQuotes }
        } finally {
            untrackRegenerate(req.user.id, parsedBody.data.id);
        }
    })


    // create single topic
    app.post('/topics/:careerPath/:lang/:experience', { onRequest: [app.auth] }, async (req, reply) => {

        const { careerPath, lang, experience } = expTopicSchema.parse(req.params)

        const parsedTopic = topicSchema.safeParse(req.body)
        if (!parsedTopic.success) throw new AppError(ERRORS.INVALID_REQUEST);

        const [inserted] = await db.insert(topics).values({
            career_path_id: careerPath,
            user_id: req.user.id,
            experience_id: experience,
            resume_lang: lang,
            topic_text: parsedTopic.data.topic,
            topic_quotes: [],
        }).returning()

        return reply.status(201).send(inserted)
    })

    // delete single topic
    app.delete('/topics/:careerPath/:lang/:experience/:id', { onRequest: [app.auth] }, async (req, reply) => {

        const { careerPath, lang, experience } = expTopicSchema.parse(req.params)
        const { id } = z.object({ id: z.coerce.number().int().positive() }).parse(req.params)

        const deleted = await db.delete(topics)
            .where(
                and(
                    eq(topics.id, id),
                    eq(topics.user_id, req.user.id),
                    eq(topics.career_path_id, careerPath),
                    eq(topics.experience_id, experience),
                    eq(topics.resume_lang, lang)
                )
            )
            .returning()

        if (deleted.length === 0) throw new AppError(ERRORS.NOT_FOUND);

        return reply.status(204).send()
    })

    app.get('/topics/generation-status', { onRequest: [app.auth] }, async (req) => {
        return getActiveGenerations(req.user.id);
    })
}