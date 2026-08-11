import { describe, expect, it } from 'vitest';
import { validatePassword } from './password-validation';

describe('validatePassword', () => {
    it('accepts a strong password', () => {
        expect(validatePassword('Secure1!pass')).toEqual([]);
    });

    it('reports missing rules', () => {
        expect(validatePassword('short')).toHaveLength(4);
    });
});
