import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { HiLightningBolt, HiFire, HiCalendar, HiTrendingUp, HiClipboardList, HiClock } from 'react-icons/hi';
import { Skeleton } from '../components/ui/Loader';

const StatCard = ({ icon, label, value, color, subtext }) => (
    <div className="card">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-text-muted mb-1">{label}</p>
                <p className="text-3xl font-bold">{value}</p>
                {subtext && <p className="text-xs text-text-muted mt-1">{subtext}</p>}
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
                {icon}
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const { get } = useApi();
    const [recentWorkouts, setRecentWorkouts] = useState([]);
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [workoutsRes, attendanceRes] = await Promise.all([
                    get('/workouts?limit=5'),
                    get('/attendance/today'),
                ]);
                setRecentWorkouts(workoutsRes.workouts || []);
                setAttendance(attendanceRes);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [get]);

    // XP progress bar
    const xpLevel = Math.floor((user?.xp || 0) / 100);
    const xpProgress = (user?.xp || 0) % 100;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Welcome back, <span className="gradient-text">{user?.user_name?.split(' ')[0] || 'Athlete'}</span>
                </h1>
                <p className="text-text-muted mt-1">Here's your fitness overview for today</p>
            </div>

            {/* XP Bar */}
            <div className="card !p-5 mb-8">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <HiLightningBolt className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold">Level {xpLevel}</p>
                            <p className="text-xs text-text-muted">{user?.xp || 0} Total XP</p>
                        </div>
                    </div>
                    <span className="text-sm text-text-muted">{xpProgress}/100 XP to next level</span>
                </div>
                <div className="w-full h-3 bg-dark-surface rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${xpProgress}%` }}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon={<HiLightningBolt className="w-6 h-6 text-primary" />}
                    label="Total XP"
                    value={user?.xp || 0}
                    color="bg-primary/10"
                    subtext={`Level ${xpLevel}`}
                />
                <StatCard
                    icon={<HiFire className="w-6 h-6 text-orange-400" />}
                    label="Current Streak"
                    value={`${user?.streak || 0} days`}
                    color="bg-orange-400/10"
                    subtext="Keep it up!"
                />
                <StatCard
                    icon={<HiClipboardList className="w-6 h-6 text-secondary" />}
                    label="Workouts"
                    value={recentWorkouts.length > 0 ? `${recentWorkouts.length}+` : '0'}
                    color="bg-secondary/10"
                    subtext="Recent sessions"
                />
                <StatCard
                    icon={<HiClock className="w-6 h-6 text-accent" />}
                    label="Gym Status"
                    value={attendance?.checkedIn ? 'Active' : 'Idle'}
                    color="bg-accent/10"
                    subtext={attendance?.checkedIn ? 'Currently checked in' : 'Not at the gym'}
                />
            </div>

            {/* Recent Workouts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Recent Workouts</h2>
                        <Link to="/workouts" className="text-sm text-primary hover:underline">View All</Link>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="card"><Skeleton lines={2} /></div>
                            ))}
                        </div>
                    ) : recentWorkouts.length === 0 ? (
                        <div className="card text-center py-12">
                            <HiClipboardList className="w-12 h-12 text-text-muted mx-auto mb-4" />
                            <p className="text-text-secondary mb-2">No workouts yet</p>
                            <Link to="/workouts" className="btn-primary !py-2 !px-6 !text-sm">
                                Log Your First Workout
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentWorkouts.map((w) => (
                                <div key={w.id} className="card !p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                                            <HiClipboardList className="w-5 h-5 text-secondary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{w.title || 'Workout'}</p>
                                            <p className="text-xs text-text-muted">
                                                {new Date(w.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                {' · '}{w.sets?.length || 0} sets
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                                        +10 XP
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link to="/workouts" className="card !p-4 flex items-center gap-4 cursor-pointer group">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <HiTrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">New Workout</p>
                                <p className="text-xs text-text-muted">Start a training session</p>
                            </div>
                        </Link>
                        <Link to="/store" className="card !p-4 flex items-center gap-4 cursor-pointer group">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                <HiCalendar className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Visit Store</p>
                                <p className="text-xs text-text-muted">Browse fitness gear</p>
                            </div>
                        </Link>
                        <Link to="/profile" className="card !p-4 flex items-center gap-4 cursor-pointer group">
                            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                                <HiLightningBolt className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">View Profile</p>
                                <p className="text-xs text-text-muted">Stats & progress</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
