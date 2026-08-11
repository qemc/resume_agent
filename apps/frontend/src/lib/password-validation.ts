export const passwordRules = {
    minLength: 8,
    hasUppercase: /[A-Z]/,
    hasNumber: /\d/,
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/,
};

export function validatePassword(password: string): string[] {
    const errors: string[] = [];
    if (password.length < passwordRules.minLength) {
        errors.push(`At least ${passwordRules.minLength} characters`);
    }
    if (!passwordRules.hasUppercase.test(password)) {
        errors.push('At least 1 uppercase letter');
    }
    if (!passwordRules.hasNumber.test(password)) {
        errors.push('At least 1 number');
    }
    if (!passwordRules.hasSpecial.test(password)) {
        errors.push('At least 1 special character');
    }
    return errors;
}
