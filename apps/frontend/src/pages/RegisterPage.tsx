import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { pickLang, auth as authLabels } from '@/lib/translations';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register, isAuthenticated } = useAuth();
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
                mode="register"
                onSubmit={register}
                footer={
                    <>
                        {t.hasAccount}{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            {t.signInLink}
                        </Link>
                    </>
                }
            />
        </div>
    );
}
