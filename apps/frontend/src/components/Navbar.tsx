import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useMatch } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { getCareerPath } from '@/services/careerPaths';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [breadcrumbName, setBreadcrumbName] = useState<string | null>(null);

    // Detect if we're on a career path detail page
    const detailMatch = useMatch('/career-paths/:id');
    const isDetailPage = !!detailMatch;

    useEffect(() => {
        if (detailMatch?.params.id) {
            getCareerPath(Number(detailMatch.params.id))
                .then(cp => setBreadcrumbName(cp.name))
                .catch(() => setBreadcrumbName(null));
        } else {
            setBreadcrumbName(null);
        }
    }, [detailMatch?.params.id]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/my-resume', label: 'My Resume Data' },
        { path: '/career-paths', label: 'Career Paths' },
    ];

    return (
        <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo / Brand */}
                    <div className="flex items-center gap-4 lg:gap-8">
                        <Link to="/" className="text-xl font-bold text-primary shrink-0">
                            ResumeAgent
                        </Link>

                        {/* Desktop Navigation Tabs */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${location.pathname === item.path || (item.path === '/career-paths' && isDetailPage)
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            {isDetailPage && breadcrumbName && (
                                <>
                                    <span className="text-muted-foreground text-sm">/</span>
                                    <span className="px-3 py-2 text-sm font-medium text-foreground truncate max-w-[200px]">
                                        {breadcrumbName}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* User Section */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {user && (
                            <span className="text-sm text-muted-foreground hidden lg:block truncate max-w-[200px]">
                                {user.email}
                            </span>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="hidden sm:flex text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            Logout
                        </Button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {mobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-border py-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path || (item.path === '/career-paths' && isDetailPage)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        {user && (
                            <div className="px-4 py-2 text-sm text-muted-foreground truncate">
                                {user.email}
                            </div>
                        )}
                        <button
                            onClick={() => {
                                setMobileMenuOpen(false);
                                handleLogout();
                            }}
                            className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
