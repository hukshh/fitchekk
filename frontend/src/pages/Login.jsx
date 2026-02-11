import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const Login = () => {
    const [form, setForm] = useState({ user_email: '', user_password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const errs = {};
        if (!form.user_email) errs.user_email = 'Email is required';
        if (!form.user_password) errs.user_password = 'Password is required';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);

        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Login failed');

            login(data.user, data.token);
            toast.success('Welcome back! 💪');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-dark">
            {/* Background accents */}
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

            <div className="relative w-full max-w-md">
                <div className="glass-strong rounded-3xl p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <span className="text-white font-black text-lg">F</span>
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold">Welcome Back</h1>
                        <p className="text-text-muted mt-2">Log in to continue your journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email or Username"
                            type="text"
                            placeholder="john@fitfusion.com"
                            value={form.user_email}
                            onChange={(e) => setForm({ ...form, user_email: e.target.value })}
                            error={errors.user_email}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={form.user_password}
                            onChange={(e) => setForm({ ...form, user_password: e.target.value })}
                            error={errors.user_password}
                        />
                        <Button type="submit" loading={loading} className="w-full justify-center !py-3.5">
                            Log In
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-border" /></div>
                        <div className="relative flex justify-center"><span className="bg-dark-card px-4 text-sm text-text-muted">or</span></div>
                    </div>

                    <button
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                        onClick={() => toast('Google OAuth requires GOOGLE_CLIENT_ID in .env', { icon: 'ℹ️' })}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="text-center text-sm text-text-muted mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
