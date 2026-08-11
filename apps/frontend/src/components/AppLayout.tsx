import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            <Navbar />
            <main className="py-8">
                <Outlet />
            </main>
        </div>
    );
}
