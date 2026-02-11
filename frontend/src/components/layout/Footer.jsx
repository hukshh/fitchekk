import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="border-t border-dark-border bg-dark-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <span className="text-white font-black text-sm">F</span>
                            </div>
                            <span className="text-xl font-bold">FitFusion</span>
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed">
                            Your all-in-one fitness tracking platform. Train harder, track smarter, achieve more.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-text-primary mb-4">Platform</h4>
                        <ul className="space-y-2">
                            <li><Link to="/dashboard" className="text-sm text-text-muted hover:text-primary transition-colors">Dashboard</Link></li>
                            <li><Link to="/workouts" className="text-sm text-text-muted hover:text-primary transition-colors">Workouts</Link></li>
                            <li><Link to="/store" className="text-sm text-text-muted hover:text-primary transition-colors">Store</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-text-primary mb-4">Account</h4>
                        <ul className="space-y-2">
                            <li><Link to="/profile" className="text-sm text-text-muted hover:text-primary transition-colors">Profile</Link></li>
                            <li><Link to="/login" className="text-sm text-text-muted hover:text-primary transition-colors">Log In</Link></li>
                            <li><Link to="/signup" className="text-sm text-text-muted hover:text-primary transition-colors">Sign Up</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-text-primary mb-4">Connect</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">Twitter</a></li>
                            <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">Instagram</a></li>
                            <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">GitHub</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-dark-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-text-muted">© 2026 FitFusion. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-xs text-text-muted hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="text-xs text-text-muted hover:text-primary transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
