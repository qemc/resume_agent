import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { experiences, certificates, projects, education, contact_data, skills, languages, interests } from "../db/schema";
import { AppError, ERRORS } from "../../utils/errors";


const idParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});

const langParamSchema = z.object({
    lang: z.enum(['EN', 'PL']),
});


// ── Experiences ──

const createExperienceSchema = z.object({
    resume_lang: z.enum(['EN', 'PL']),
    company: z.string(),
    position: z.string(),
    start_date: z.string(),
    end_date: z.string().optional().default(''),
    current: z.boolean().optional().default(false),
    description: z.string().optional().default(''),
});

const updateExperienceSchema = z.object({
    company: z.string(),
    position: z.string(),
    start_date: z.string(),
    end_date: z.string().optional(),
    current: z.boolean().optional(),
    description: z.string().optional(),
}).partial();


// ── Certificates ──

const createCertificateSchema = z.object({
    resume_lang: z.enum(['EN', 'PL']),
    certificate_name: z.string(),
    issuer: z.string(),
    issue_date: z.string().optional().default(''),
    expiry_date: z.string().optional().default(''),
    credential_id: z.string().optional().default(''),
    url: z.string().optional().default(''),
});

const updateCertificateSchema = z.object({
    certificate_name: z.string(),
    issuer: z.string(),
    issue_date: z.string(),
    expiry_date: z.string(),
    credential_id: z.string(),
    url: z.string(),
}).partial();


// ── Projects ──

const createProjectSchema = z.object({
    resume_lang: z.enum(['EN', 'PL']),
    project_name: z.string(),
    description: z.string().optional().default(''),
    url: z.string().optional().default(''),
});

const updateProjectSchema = z.object({
    project_name: z.string(),
    description: z.string(),
    url: z.string(),
}).partial();


// ── Education ──

const createEducationSchema = z.object({
    resume_lang: z.enum(['EN', 'PL']),
    university: z.string(),
    degree: z.string(),
    start_date: z.string(),
    end_date: z.string().optional().default(''),
    current: z.boolean().optional().default(false),
});

const updateEducationSchema = z.object({
    university: z.string(),
    degree: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    current: z.boolean(),
}).partial();


// ── Contact Data ──

const contactDataSchema = z.object({
    resume_lang: z.enum(['EN', 'PL']),
    email: z.string(),
    phone_number: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    linkedin: z.string().optional().default(''),
    github: z.string().optional().default(''),
    website: z.string().optional().default(''),
    location: z.string().optional().default(''),
});


// ── Skills ──

const createSkillSchema = z.object({
    resume_lang: z.enum(['EN', 'PL']),
    skill: z.string(),
    level: z.string().optional(),
    category: z.string().optional(),
});

const updateSkillSchema = z.object({
    skill: z.string().nullable().transform(v => v === null ? "" : v).optional(),
    level: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
}).partial();


// ── Languages ──

const createLanguageSchema = z.object({
    resume_lang: z.enum(['EN', 'PL']),
    name: z.string(),
    level: z.string(),
});

const updateLanguageSchema = z.object({
    name: z.string().nullable().transform(v => v === null ? "" : v).optional(),
    level: z.string().nullable().transform(v => v === null ? "" : v).optional(),
}).partial();


// ── Interests ──

const createInterestSchema = z.object({
    resume_lang: z.enum(['EN', 'PL']),
    interest: z.string(),
});

const updateInterestSchema = z.object({
    interest: z.string().nullable().transform(v => v === null ? "" : v).optional(),
}).partial();


export async function resumeRoutes(app: FastifyInstance) {


    // ══════════════════════════════════════════════════════════════════
    // EXPERIENCES
    // ══════════════════════════════════════════════════════════════════

    app.get('/experiences/:lang', { onRequest: [app.auth] }, async (req) => {
        const { lang } = langParamSchema.parse(req.params);
        return db.query.experiences.findMany({
            where: and(eq(experiences.user_id, req.user.id), eq(experiences.resume_lang, lang))
        });
    });

    app.post('/experiences', { onRequest: [app.auth] }, async (req, reply) => {
        const parse = createExperienceSchema.safeParse(req.body);
        if (!parse.success) return reply.status(400).send(parse.error);

        const [inserted] = await db.insert(experiences).values({
            user_id: req.user.id,
            ...parse.data
        }).returning();

        return reply.status(201).send(inserted);
    });

    app.patch('/experiences/:id', { onRequest: [app.auth] }, async (req) => {
        const { id } = idParamSchema.parse(req.params);

        const existing = await db.query.experiences.findFirst({
            where: and(eq(experiences.id, id), eq(experiences.user_id, req.user.id))
        });
        if (!existing) throw new AppError(ERRORS.NOT_FOUND);

        const body = req.body as Record<string, unknown>;
        const descriptionChanged = body._descriptionChanged !== false;
        delete body._descriptionChanged;

        const parse = updateExperienceSchema.safeParse(body);
        if (!parse.success) throw new AppError(ERRORS.INVALID_REQUEST);

        const setData = descriptionChanged
            ? { ...parse.data, updatedAt: new Date() }
            : parse.data;

        await db.update(experiences)
            .set(setData)
            .where(eq(experiences.id, id));

        return { id, ...existing, ...setData };
    });

    app.delete('/experiences/:id', { onRequest: [app.auth] }, async (req, reply) => {
        const { id } = idParamSchema.parse(req.params);
        await db.delete(experiences)
            .where(and(eq(experiences.id, id), eq(experiences.user_id, req.user.id)));
        return reply.status(204).send();
    });


    // ══════════════════════════════════════════════════════════════════
    // CERTIFICATES
    // ══════════════════════════════════════════════════════════════════

    app.get('/certificates/:lang', { onRequest: [app.auth] }, async (req) => {
        const { lang } = langParamSchema.parse(req.params);
        return db.query.certificates.findMany({
            where: and(eq(certificates.user_id, req.user.id), eq(certificates.resume_lang, lang))
        });
    });

    app.post('/certificates', { onRequest: [app.auth] }, async (req, reply) => {
        const parse = createCertificateSchema.safeParse(req.body);
        if (!parse.success) return reply.status(400).send(parse.error);

        const [inserted] = await db.insert(certificates).values({
            user_id: req.user.id,
            ...parse.data
        }).returning();

        return reply.status(201).send(inserted);
    });

    app.patch('/certificates/:id', { onRequest: [app.auth] }, async (req) => {
        const { id } = idParamSchema.parse(req.params);

        const existing = await db.query.certificates.findFirst({
            where: and(eq(certificates.id, id), eq(certificates.user_id, req.user.id))
        });
        if (!existing) throw new AppError(ERRORS.NOT_FOUND);

        const parse = updateCertificateSchema.safeParse(req.body);
        if (!parse.success) throw new AppError(ERRORS.INVALID_REQUEST);

        await db.update(certificates)
            .set(parse.data)
            .where(eq(certificates.id, id));

        return { id, ...existing, ...parse.data };
    });

    app.delete('/certificates/:id', { onRequest: [app.auth] }, async (req, reply) => {
        const { id } = idParamSchema.parse(req.params);
        await db.delete(certificates)
            .where(and(eq(certificates.id, id), eq(certificates.user_id, req.user.id)));
        return reply.status(204).send();
    });


    // ══════════════════════════════════════════════════════════════════
    // PROJECTS
    // ══════════════════════════════════════════════════════════════════

    app.get('/projects/:lang', { onRequest: [app.auth] }, async (req) => {
        const { lang } = langParamSchema.parse(req.params);
        return db.query.projects.findMany({
            where: and(eq(projects.user_id, req.user.id), eq(projects.resume_lang, lang))
        });
    });

    app.post('/projects', { onRequest: [app.auth] }, async (req, reply) => {
        const parse = createProjectSchema.safeParse(req.body);
        if (!parse.success) return reply.status(400).send(parse.error);

        const [inserted] = await db.insert(projects).values({
            user_id: req.user.id,
            ...parse.data
        }).returning();

        return reply.status(201).send(inserted);
    });

    app.patch('/projects/:id', { onRequest: [app.auth] }, async (req) => {
        const { id } = idParamSchema.parse(req.params);

        const existing = await db.query.projects.findFirst({
            where: and(eq(projects.id, id), eq(projects.user_id, req.user.id))
        });
        if (!existing) throw new AppError(ERRORS.NOT_FOUND);

        const parse = updateProjectSchema.safeParse(req.body);
        if (!parse.success) throw new AppError(ERRORS.INVALID_REQUEST);

        await db.update(projects)
            .set(parse.data)
            .where(eq(projects.id, id));

        return { id, ...existing, ...parse.data };
    });

    app.delete('/projects/:id', { onRequest: [app.auth] }, async (req, reply) => {
        const { id } = idParamSchema.parse(req.params);
        await db.delete(projects)
            .where(and(eq(projects.id, id), eq(projects.user_id, req.user.id)));
        return reply.status(204).send();
    });


    // ══════════════════════════════════════════════════════════════════
    // EDUCATION
    // ══════════════════════════════════════════════════════════════════

    app.get('/education/:lang', { onRequest: [app.auth] }, async (req) => {
        const { lang } = langParamSchema.parse(req.params);
        return db.query.education.findMany({
            where: and(eq(education.user_id, req.user.id), eq(education.resume_lang, lang))
        });
    });

    app.post('/education', { onRequest: [app.auth] }, async (req, reply) => {
        const parse = createEducationSchema.safeParse(req.body);
        if (!parse.success) return reply.status(400).send(parse.error);

        const [inserted] = await db.insert(education).values({
            user_id: req.user.id,
            ...parse.data
        }).returning();

        return reply.status(201).send(inserted);
    });

    app.patch('/education/:id', { onRequest: [app.auth] }, async (req) => {
        const { id } = idParamSchema.parse(req.params);

        const existing = await db.query.education.findFirst({
            where: and(eq(education.id, id), eq(education.user_id, req.user.id))
        });
        if (!existing) throw new AppError(ERRORS.NOT_FOUND);

        const parse = updateEducationSchema.safeParse(req.body);
        if (!parse.success) throw new AppError(ERRORS.INVALID_REQUEST);

        await db.update(education)
            .set(parse.data)
            .where(eq(education.id, id));

        return { id, ...existing, ...parse.data };
    });

    app.delete('/education/:id', { onRequest: [app.auth] }, async (req, reply) => {
        const { id } = idParamSchema.parse(req.params);
        await db.delete(education)
            .where(and(eq(education.id, id), eq(education.user_id, req.user.id)));
        return reply.status(204).send();
    });


    // ══════════════════════════════════════════════════════════════════
    // CONTACT DATA (one per user per language)
    // ══════════════════════════════════════════════════════════════════

    app.get('/contact/:lang', { onRequest: [app.auth] }, async (req) => {
        const { lang } = langParamSchema.parse(req.params);
        const contact = await db.query.contact_data.findFirst({
            where: and(eq(contact_data.user_id, req.user.id), eq(contact_data.resume_lang, lang))
        });
        if (!contact) throw new AppError(ERRORS.NOT_FOUND);
        return contact;
    });

    app.post('/contact', { onRequest: [app.auth] }, async (req, reply) => {
        const parse = contactDataSchema.safeParse(req.body);
        if (!parse.success) throw new AppError(ERRORS.INVALID_REQUEST);

        const existing = await db.query.contact_data.findFirst({
            where: and(eq(contact_data.user_id, req.user.id), eq(contact_data.resume_lang, parse.data.resume_lang))
        });
        if (existing) throw new AppError(ERRORS.ALREADY_EXISTS);

        const [inserted] = await db.insert(contact_data).values({
            user_id: req.user.id,
            ...parse.data
        }).returning();

        return reply.status(201).send(inserted);
    });

    app.patch('/contact/:lang', { onRequest: [app.auth] }, async (req) => {
        const { lang } = langParamSchema.parse(req.params);

        const existing = await db.query.contact_data.findFirst({
            where: and(eq(contact_data.user_id, req.user.id), eq(contact_data.resume_lang, lang))
        });
        if (!existing) throw new AppError(ERRORS.NOT_FOUND);

        const parse = contactDataSchema.omit({ resume_lang: true }).partial().safeParse(req.body);
        if (!parse.success) throw new AppError(ERRORS.INVALID_REQUEST);

        await db.update(contact_data)
            .set(parse.data)
            .where(eq(contact_data.id, existing.id));

        return { ...existing, ...parse.data };
    });


    // ══════════════════════════════════════════════════════════════════
    // SKILLS (bulk per language)
    // ══════════════════════════════════════════════════════════════════

    app.get('/skills/:lang', { onRequest: [app.auth] }, async (req) => {
        const { lang } = langParamSchema.parse(req.params);
        return db.query.skills.findMany({
            where: and(eq(skills.user_id, req.user.id), eq(skills.resume_lang, lang))
        });
    });

    app.post('/skills', { onRequest: [app.auth] }, async (req, reply) => {
        const parse = createSkillSchema.safeParse(req.body);
        if (!parse.success) return reply.status(400).send(parse.error);

        try {
            const [inserted] = await db.insert(skills).values({
                user_id: req.user.id,
                ...parse.data
            }).returning();

            return reply.status(201).send(inserted);
        } catch (e: any) {
            return reply.status(500).send({ err: e.message || e.toString() });
        }
    });

    app.patch('/skills/:id', { onRequest: [app.auth] }, async (req, reply) => {
        const { id } = idParamSchema.parse(req.params);

        const existing = await db.query.skills.findFirst({
            where: and(eq(skills.id, id), eq(skills.user_id, req.user.id))
        });
        if (!existing) throw new AppError(ERRORS.NOT_FOUND);

        const parse = updateSkillSchema.safeParse(req.body);
        if (!parse.success) throw new AppError(ERRORS.INVALID_REQUEST);

        await db.update(skills)
            .set(parse.data)
            .where(eq(skills.id, id));

        return { id, ...existing, ...parse.data };
    });



    app.delete('/skills/:id', { onRequest: [app.auth] }, async (req, reply) => {
        const { id } = idParamSchema.parse(req.params);
        await db.delete(skills)
            .where(and(eq(skills.id, id), eq(skills.user_id, req.user.id)));
        return reply.status(204).send();
    });


    // ══════════════════════════════════════════════════════════════════
    // LANGUAGES
    // ══════════════════════════════════════════════════════════════════

    app.get('/languages/:lang', { onRequest: [app.auth] }, async (req) => {
        const { lang } = langParamSchema.parse(req.params);
        return db.query.languages.findMany({
            where: and(eq(languages.user_id, req.user.id), eq(languages.resume_lang, lang))
        });
    });

    app.post('/languages', { onRequest: [app.auth] }, async (req, reply) => {
        const parse = createLanguageSchema.safeParse(req.body);
        if (!parse.success) return reply.status(400).send(parse.error);

        const [inserted] = await db.insert(languages).values({
            user_id: req.user.id,
            ...parse.data
        }).returning();

        return reply.status(201).send(inserted);
    });

    app.patch('/languages/:id', { onRequest: [app.auth] }, async (req, reply) => {
        const { id } = idParamSchema.parse(req.params);

        const existing = await db.query.languages.findFirst({
            where: and(eq(languages.id, id), eq(languages.user_id, req.user.id))
        });
        if (!existing) throw new AppError(ERRORS.NOT_FOUND);

        const parse = updateLanguageSchema.safeParse(req.body);
        if (!parse.success) throw new AppError(ERRORS.INVALID_REQUEST);

        await db.update(languages)
            .set(parse.data)
            .where(eq(languages.id, id));

        return { id, ...existing, ...parse.data };
    });

    app.delete('/languages/:id', { onRequest: [app.auth] }, async (req, reply) => {
        const { id } = idParamSchema.parse(req.params);
        await db.delete(languages)
            .where(and(eq(languages.id, id), eq(languages.user_id, req.user.id)));
        return reply.status(204).send();
    });


    // ══════════════════════════════════════════════════════════════════
    // INTERESTS
    // ══════════════════════════════════════════════════════════════════

    app.get('/interests/:lang', { onRequest: [app.auth] }, async (req) => {
        const { lang } = langParamSchema.parse(req.params);
        return db.query.interests.findMany({
            where: and(eq(interests.user_id, req.user.id), eq(interests.resume_lang, lang))
        });
    });

    app.post('/interests', { onRequest: [app.auth] }, async (req, reply) => {
        const parse = createInterestSchema.safeParse(req.body);
        if (!parse.success) return reply.status(400).send(parse.error);

        const [inserted] = await db.insert(interests).values({
            user_id: req.user.id,
            ...parse.data
        }).returning();

        return reply.status(201).send(inserted);
    });

    app.patch('/interests/:id', { onRequest: [app.auth] }, async (req, reply) => {
        const { id } = idParamSchema.parse(req.params);

        const existing = await db.query.interests.findFirst({
            where: and(eq(interests.id, id), eq(interests.user_id, req.user.id))
        });
        if (!existing) throw new AppError(ERRORS.NOT_FOUND);

        const parse = updateInterestSchema.safeParse(req.body);
        if (!parse.success) throw new AppError(ERRORS.INVALID_REQUEST);

        await db.update(interests)
            .set(parse.data)
            .where(eq(interests.id, id));

        return { id, ...existing, ...parse.data };
    });

    app.delete('/interests/:id', { onRequest: [app.auth] }, async (req, reply) => {
        const { id } = idParamSchema.parse(req.params);
        await db.delete(interests)
            .where(and(eq(interests.id, id), eq(interests.user_id, req.user.id)));
        return reply.status(204).send();
    });
}