/** Strip server metadata before PATCH payloads. */
export function stripRowForPatch<T extends { id: number }>(row: T) {
    const { id: _id, user_id: _userId, resume_lang: _lang, createdAt: _c, updatedAt: _u, ...data } =
        row as T & {
            user_id?: number;
            resume_lang?: string;
            createdAt?: string;
            updatedAt?: string;
        };
    return data;
}
