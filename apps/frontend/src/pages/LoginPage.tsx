import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { pickLang, auth as authLabels } from '@/lib/translations';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const t = pickLang(authLabels, 'EN');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
            <AuthForm
                mode="login"
                onSubmit={login}
                footer={
                    import.meta.env.VITE_ENABLE_REGISTRATION !== 'false' ? (
                        <>
                            {t.noAccount}{' '}
                            <Link to="/register" className="text-primary hover:underline font-medium">
                                {t.createOne}
                            </Link>
                        </>
                    ) : (
                        <span />
                    )
                }
            />
        </div>
    );
}
