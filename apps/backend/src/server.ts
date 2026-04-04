import 'dotenv/config';
import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { registerRoutes } from './routes/index';
import fastifyJwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { AppError } from '../utils/errors';

const JWT_SECRET_KEY = process.env['JWT_SECRET_KEY'];
const COOKIE_SECRET_KEY = process.env['COOKIE_SECRET_KEY']
const app = Fastify({ logger: true });

app.register(fastifyCors, {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});

app.register(fastifyJwt, { secret: JWT_SECRET_KEY });

app.register(cookie, {
    secret: COOKIE_SECRET_KEY,
    hook: 'onRequest'
});

app.decorate('auth', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.send(err)
    }
})

app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
            success: false,
            code: error.code,
            message: error.message
        })
    }

    console.error("DEBUG FASTIFY 500 ERROR:", error);
    return reply.status(500).send({
        success: false,
        code: 'SYS_000',
        message: 'Internal server error'
    })
})


const start = async () => {
    try {
        await registerRoutes(app);
        await app.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server running at http://localhost:3000');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}
start()