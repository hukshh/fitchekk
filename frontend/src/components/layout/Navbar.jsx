import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import { HiOutlineMenu, HiOutlineX, HiOutlineShoppingCart } from 'react-icons/hi';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isLanding = location.pathname === '/';

    const navLinks = isAuthenticated
        ? [
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/workouts', label: 'Workouts' },
            { to: '/store', label: 'Store' },
            { to: '/profile', label: 'Profile' },
        ]
        : [
            { to: '/#features', label: 'Features', isAnchor: true },
            { to: '/#showcase', label: 'Programs', isAnchor: true },
            { to: '/#testimonials', label: 'Testimonials', isAnchor: true },
        ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isLanding ? 'bg-transparent' : 'glass-strong'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-white font-black text-sm">F</span>
                        </div>
                        <span className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                            FitFusion
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${location.pathname === link.to
                                        ? 'text-primary bg-primary/10'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <Link to="/store" className="relative p-2 text-text-secondary hover:text-primary transition-colors">
                                    <HiOutlineShoppingCart className="w-5 h-5" />
                                </Link>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                                        <span className="text-xs font-bold text-primary">{user?.xp || 0} XP</span>
                                        <span className="text-xs text-text-muted">|</span>
                                        <span className="text-xs font-medium text-warning">🔥 {user?.streak || 0}</span>
                                    </div>
                                    <button onClick={logout} className="btn-secondary !py-2 !px-4 !text-sm">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-secondary !py-2 !px-5 !text-sm">Log In</Link>
                                <Link to="/signup" className="btn-primary !py-2 !px-5 !text-sm">Sign Up</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-text-secondary hover:text-text-primary"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden glass-strong rounded-2xl mt-2 p-4 animate-slide-up">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileOpen(false)}
                                    className="px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <hr className="border-dark-border my-2" />
                            {isAuthenticated ? (
                                <button onClick={() => { logout(); setMobileOpen(false); }} className="btn-secondary w-full justify-center">
                                    Logout
                                </button>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full justify-center">Log In</Link>
                                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
