import { useState, type FormEvent, type ReactNode } from 'react';
import { Card, Input, Button } from '@/components/ui';
import { passwordRules, validatePassword } from '@/lib/password-validation';
import { getApiErrorMessage } from '@/lib/api-error';
import { pickLang, auth as authLabels } from '@/lib/translations';

type AuthMode = 'login' | 'register';

interface AuthFormProps {
    mode: AuthMode;
    onSubmit: (email: string, password: string) => Promise<void>;
    footer: ReactNode;
}

export function AuthForm({ mode, onSubmit, footer }: AuthFormProps) {
    const t = pickLang(authLabels, 'EN');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isRegister = mode === 'register';
    const passwordErrors = validatePassword(password);
    const passwordsMatch = password === confirmPassword;
    const isPasswordValid = passwordErrors.length === 0;
    const canSubmit =
        email &&
        password &&
        (!isRegister || (confirmPassword && isPasswordValid && passwordsMatch));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (isRegister) {
            if (!passwordsMatch) {
                setError(t.passwordsNoMatch);
                return;
            }
            if (!isPasswordValid) {
                setError(t.passwordRequirements);
                return;
            }
        }

        setIsLoading(true);
        try {
            await onSubmit(email, password);
        } catch (err: unknown) {
            const fallback = isRegister ? t.registerFailed : t.loginFailed;
            setError(getApiErrorMessage(err, fallback));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground">
                    {isRegister ? t.registerTitle : t.loginTitle}
                </h1>
                <p className="text-muted-foreground mt-2">
                    {isRegister ? t.registerSubtitle : t.loginSubtitle}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label={t.email}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                />

                <div>
                    <Input
                        label={t.password}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                        error={
                            isRegister && password && !isPasswordValid
                                ? t.passwordRequirements
                                : undefined
                        }
                    />
                    {isRegister && password && (
                        <ul className="mt-2 space-y-1 text-xs">
                            <li
                                className={
                                    password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'
                                }
                            >
                                ✓ {t.passwordReqLength}
                            </li>
                            <li
                                className={
                                    passwordRules.hasUppercase.test(password)
                                        ? 'text-green-600'
                                        : 'text-muted-foreground'
                                }
                            >
                                ✓ {t.passwordReqUpper}
                            </li>
                            <li
                                className={
                                    passwordRules.hasNumber.test(password)
                                        ? 'text-green-600'
                                        : 'text-muted-foreground'
                                }
                            >
                                ✓ {t.passwordReqNumber}
                            </li>
                            <li
                                className={
                                    passwordRules.hasSpecial.test(password)
                                        ? 'text-green-600'
                                        : 'text-muted-foreground'
                                }
                            >
                                ✓ {t.passwordReqSpecial}
                            </li>
                        </ul>
                    )}
                </div>

                {isRegister && (
                    <Input
                        label={t.confirmPassword}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete="new-password"
                        error={
                            confirmPassword && !passwordsMatch ? t.passwordsNoMatch : undefined
                        }
                    />
                )}

                {error && (
                    <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                    disabled={!canSubmit}
                >
                    {isRegister ? t.createAccount : t.signIn}
                </Button>
            </form>

            <p className="text-center text-muted-foreground text-sm mt-6">{footer}</p>
        </Card>
    );
}
