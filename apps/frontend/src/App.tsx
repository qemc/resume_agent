import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { TopicsGenerationProvider } from '@/contexts/TopicsGenerationContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { MyResumePage } from '@/pages/MyResumePage';
import { CareerPathsPage } from '@/pages/CareerPathsPage';
import { CareerPathDetailPage } from '@/pages/CareerPathDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <TopicsGenerationProvider>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        {import.meta.env.VITE_ENABLE_REGISTRATION !== 'false' && (
                            <Route path="/register" element={<RegisterPage />} />
                        )}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<AppLayout />}>
                                <Route path="/my-resume" element={<MyResumePage />} />
                                <Route path="/career-paths" element={<CareerPathsPage />} />
                                <Route path="/career-paths/:id" element={<CareerPathDetailPage />} />
                            </Route>
                        </Route>
                        <Route path="/" element={<Navigate to="/my-resume" replace />} />
                    </Routes>
                </TopicsGenerationProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
