import { Link } from 'react-router-dom';
import { HiArrowRight, HiPlay, HiStar, HiLightningBolt, HiChartBar, HiUserGroup, HiShoppingBag, HiCheck } from 'react-icons/hi';
import Footer from '../components/layout/Footer';

/* ============================
   HERO SECTION — FitFlow Style
   ============================ */
const Hero = () => (
    <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Background gradient — pink to blue to purple */}
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-purple-600/20 to-cyan-500/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
            {/* Decorative blobs */}
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-40 left-10 w-72 h-72 bg-secondary/15 rounded-full blur-3xl" />
            <div className="absolute top-40 left-1/3 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                {/* Left content */}
                <div className="animate-slide-up">
                    {/* Giant headline */}
                    <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.9] tracking-tight mb-8">
                        <span className="block text-white">Stronger.</span>
                        <span className="block text-white">Healthier.</span>
                        <span className="block gradient-text-warm">You.</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-text-secondary max-w-lg mb-8 leading-relaxed">
                        Transform your body and mindset with expert tracking tools.
                        Personalized workouts, real results, and full support — wherever you are.
                    </p>

                    <Link
                        to="/signup"
                        className="btn-primary !text-lg !py-4 !px-8 group"
                    >
                        Start Your Journey
                        <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Trust badge */}
                    <div className="mt-8 flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">Excellent 4.9 out of 5</span>
                        <HiStar className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-text-muted">Trustpilot</span>
                    </div>
                </div>

                {/* Right content — Video card + Testimonial */}
                <div className="flex flex-col gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    {/* Video preview card */}
                    <div className="glass rounded-2xl overflow-hidden">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-text-secondary">Stronger Every Day: E02-S11</span>
                                <HiArrowRight className="w-4 h-4 text-text-muted" />
                            </div>
                            <div className="relative rounded-xl overflow-hidden h-48 bg-gradient-to-br from-pink-300/20 via-pink-200/10 to-purple-300/10">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all hover:scale-110">
                                        <HiPlay className="w-6 h-6 text-white ml-1" />
                                    </div>
                                </div>
                                {/* Gradient overlay for visual appeal */}
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-transparent" />
                            </div>
                        </div>
                    </div>

                    {/* Testimonial card */}
                    <div className="glass rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                                SM
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-text-primary">Samantha M.</p>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <HiStar key={i} className="w-3.5 h-3.5 text-yellow-400" />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            "FitFusion completely changed my fitness journey! The personalized coaching, support, and
                            easy-to-follow programs helped me achieve real results. Highly recommend!"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

/* ============================
   FEATURES SECTION
   ============================ */
const features = [
    {
        icon: <HiLightningBolt className="w-6 h-6" />,
        title: 'XP & Gamification',
        description: 'Earn XP for every workout, build streaks, and level up your fitness journey with our gamified tracking system.',
    },
    {
        icon: <HiChartBar className="w-6 h-6" />,
        title: 'Progress Analytics',
        description: 'Track your body metrics, workout volume, and strength gains with beautiful charts and detailed insights.',
    },
    {
        icon: <HiUserGroup className="w-6 h-6" />,
        title: 'Gym Attendance',
        description: 'Check in and out of the gym, track session duration, and build a consistent training habit over time.',
    },
    {
        icon: <HiShoppingBag className="w-6 h-6" />,
        title: 'Fitness Store',
        description: 'Shop premium supplements, equipment, and apparel — all from within the app, with seamless checkout.',
    },
];

const Features = () => (
    <section id="features" className="py-24 relative">
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="text-primary font-semibold text-sm uppercase tracking-widest">Why FitFusion</span>
                <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">
                    Everything You Need to <span className="gradient-text">Transform</span>
                </h2>
                <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                    A complete fitness ecosystem — from workout tracking and attendance to gamified goals and a built-in store.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, idx) => (
                    <div
                        key={idx}
                        className="card group text-center"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            {feature.icon}
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-sm text-text-muted leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

/* ============================
   SHOWCASE / HOW IT WORKS
   ============================ */
const steps = [
    { step: '01', title: 'Create Your Account', desc: 'Sign up in seconds with email or Google. Get instant access to your personalized dashboard.' },
    { step: '02', title: 'Log Your Workouts', desc: 'Create workouts, add exercises and sets. Track reps, weight, and RPE for every session.' },
    { step: '03', title: 'Earn XP & Build Streaks', desc: 'Every workout earns you XP. Stay consistent day after day to build an unstoppable streak.' },
    { step: '04', title: 'Track & Transform', desc: 'Monitor your progress with body metrics, workout analytics, and attendance history.' },
];

const Showcase = () => (
    <section id="showcase" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="text-primary font-semibold text-sm uppercase tracking-widest">How It Works</span>
                <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">
                    Your Fitness Journey in <span className="gradient-text">4 Steps</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((item, idx) => (
                    <div key={idx} className="relative group">
                        <div className="card text-center h-full">
                            <span className="text-5xl font-black text-dark-border group-hover:text-primary/20 transition-colors duration-300">
                                {item.step}
                            </span>
                            <h3 className="font-semibold text-lg mt-4 mb-2">{item.title}</h3>
                            <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-dark-border">
                                <HiArrowRight className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </section>
);

/* ============================
   ACCESS PANELS / CTA
   ============================ */
const AccessPanels = () => (
    <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Free tier */}
                <div className="card !p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <span className="text-xs uppercase tracking-widest text-text-muted font-semibold">Free Forever</span>
                    <h3 className="text-3xl font-bold mt-2 mb-4">Start Training Today</h3>
                    <ul className="space-y-3 mb-8">
                        {['Unlimited workout logging', 'XP & Streak system', 'Exercise library', 'Basic progress tracking', 'Gym check-in/out'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-text-secondary text-sm">
                                <HiCheck className="w-5 h-5 text-success flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Link to="/signup" className="btn-primary w-full justify-center">
                        Get Started Free
                        <HiArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Pro tier */}
                <div className="card !p-8 relative overflow-hidden border-primary/30">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs uppercase tracking-widest text-primary font-semibold">Pro</span>
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded-full">Popular</span>
                    </div>
                    <h3 className="text-3xl font-bold mt-2 mb-4">Unlock Full Power</h3>
                    <ul className="space-y-3 mb-8">
                        {['Everything in Free', 'Advanced analytics & charts', 'Fitness store access', 'Priority support', 'Body composition tracking', 'Workout templates'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-text-secondary text-sm">
                                <HiCheck className="w-5 h-5 text-primary flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Link to="/signup" className="btn-primary w-full justify-center animate-pulse-glow">
                        Start Pro Trial
                        <HiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    </section>
);

/* ============================
   TESTIMONIALS
   ============================ */
const testimonials = [
    {
        name: 'Alex Rivera',
        initials: 'AR',
        role: 'Fitness Enthusiast',
        text: "The XP system keeps me motivated every single day. I've built a 45-day streak and my consistency has never been better!",
        rating: 5,
    },
    {
        name: 'Maya Johnson',
        initials: 'MJ',
        role: 'CrossFit Athlete',
        text: "Finally an app that tracks everything — workouts, attendance, progress, and even has a store. It's like having a personal trainer in my pocket.",
        rating: 5,
    },
    {
        name: 'James Chen',
        initials: 'JC',
        role: 'Gym Owner',
        text: "I recommended FitFusion to all my gym members. The attendance tracking and gamification features keep them coming back consistently.",
        rating: 5,
    },
];

const Testimonials = () => (
    <section id="testimonials" className="py-24 relative">
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="text-primary font-semibold text-sm uppercase tracking-widest">Testimonials</span>
                <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">
                    Loved by <span className="gradient-text">Thousands</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((t, idx) => (
                    <div key={idx} className="card">
                        <div className="flex gap-0.5 mb-4">
                            {[...Array(t.rating)].map((_, i) => (
                                <HiStar key={i} className="w-4 h-4 text-yellow-400" />
                            ))}
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed mb-6">"{t.text}"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                                {t.initials}
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{t.name}</p>
                                <p className="text-xs text-text-muted">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

/* ============================
   LANDING PAGE
   ============================ */
const Landing = () => {
    return (
        <div>
            <Hero />
            <Features />
            <Showcase />
            <AccessPanels />
            <Testimonials />
            <Footer />
        </div>
    );
};

export default Landing;
