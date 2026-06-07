import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
    login as apiLogin,
    register as apiRegister,
    logout as apiLogout,
    refreshSession,
    fetchUserProfile,
    type AuthUser,
} from '@/services/auth';
import { clearAccessToken } from '@/services/auth-token';

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await refreshSession();
                const profile = await fetchUserProfile();
                setUser(profile);
            } catch {
                clearAccessToken();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const profile = await apiLogin({ email, password });
        setUser(profile);
    };

    const register = async (email: string, password: string) => {
        const profile = await apiRegister({ email, password });
        setUser(profile);
    };

    const logout = async () => {
        try {
            await apiLogout();
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
