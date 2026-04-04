export const ERRORS = {

    INVALID_REQUEST: {
        code: 'REQ_001',
        message: 'Invalid data payload',
        status: 400
    },
    INVALID_LOGIN: {
        code: 'AUTH_001',
        message: 'Invalid email or password',
        status: 401
    },
    UNAUTHORIZED: {
        code: 'AUTH_002',
        message: 'You must be logged in to access this',
        status: 401
    },
    AI_ERROR: {
        code: 'AI_001',
        message: 'An AI agent error',
        status: 466
    },

    USER_NOT_FOUND: {
        code: 'USER_001',
        message: 'User not found',
        status: 404
    },

    USER_ALREADY_EXISTS: {
        code: 'USER_002',
        message: 'User already exists',
        status: 406
    },

    RESUME_NOT_FOUND: {
        code: 'RES_001',
        message: 'Resume not found',
        status: 404
    },

    NOT_FOUND: {
        code: 'RES_002',
        message: 'Resource not found',
        status: 404
    },

    INTERNAL_ERROR: {
        code: 'SYS_001',
        message: 'Something went wrong',
        status: 500
    },

    REGISTRATION_DISABLED: {
        code: 'AUTH_003',
        message: 'Registration is currently disabled',
        status: 403
    },
    ALREADY_EXISTS: {
        code: 'EXIST_001',
        message: 'Item already exisits',
        status: 467
    },
    // internal routes errors
    INT_KEY_MISSCONFIG: {
        code: 'INT_KEY_001',
        message: 'Api key is misconfigured on server side',
        status: 500
    },
    INT_KEY_MISSING: {
        code: 'INT_KEY_002',
        message: 'Your provided api key is missing or invalid',
        status: 401
    }


} as const;

export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;

    constructor(errorType: typeof ERRORS[keyof typeof ERRORS], details?: string) {
        const finallMessage = details ? `${errorType.message}: ${details}` : errorType.message;

        super(finallMessage)

        this.code = errorType.code;
        this.statusCode = errorType.status;
        Error.captureStackTrace(this, this.constructor)
    }
}