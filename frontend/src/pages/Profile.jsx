import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Skeleton } from '../components/ui/Loader';
import toast from 'react-hot-toast';
import { HiUser, HiLightningBolt, HiFire, HiCalendar, HiClipboardList, HiShoppingBag } from 'react-icons/hi';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { get, put } = useApi();
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ user_name: '', user_email: '' });
    const [saving, setSaving] = useState(false);

    const fetchProfile = useCallback(async () => {
        try {
            const [profileRes, ordersRes] = await Promise.all([
                get('/users/profile'),
                get('/orders'),
            ]);
            setProfile(profileRes.user);
            setOrders(ordersRes.orders || []);
            setForm({ user_name: profileRes.user.user_name, user_email: profileRes.user.user_email });
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [get]);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await put('/users/profile', form);
            updateUser(res.user);
            setProfile({ ...profile, ...res.user });
            setEditing(false);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    const statusColors = {
        pending: 'bg-yellow-400/10 text-yellow-400',
        processing: 'bg-blue-400/10 text-blue-400',
        shipped: 'bg-cyan-400/10 text-cyan-400',
        delivered: 'bg-green-400/10 text-green-400',
        cancelled: 'bg-red-400/10 text-red-400',
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="card"><Skeleton lines={5} /></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Profile Header */}
            <div className="card !p-8 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-black">
                        {profile?.user_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{profile?.user_name}</h1>
                        <p className="text-text-muted">{profile?.user_email}</p>
                        <p className="text-xs text-text-muted mt-1">
                            Member since {new Date(profile?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <Button variant="secondary" className="!py-2 !px-5 !text-sm" onClick={() => setEditing(!editing)}>
                        {editing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </div>

                {editing && (
                    <form onSubmit={handleSave} className="mt-6 pt-6 border-t border-dark-border space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Name" value={form.user_name} onChange={(e) => setForm({ ...form, user_name: e.target.value })} />
                            <Input label="Email" type="email" value={form.user_email} onChange={(e) => setForm({ ...form, user_email: e.target.value })} />
                        </div>
                        <Button type="submit" loading={saving} className="!py-2.5">
                            Save Changes
                        </Button>
                    </form>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="card text-center">
                    <HiLightningBolt className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{profile?.xp || 0}</p>
                    <p className="text-xs text-text-muted">Total XP</p>
                </div>
                <div className="card text-center">
                    <HiFire className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{profile?.streak || 0}</p>
                    <p className="text-xs text-text-muted">Day Streak</p>
                </div>
                <div className="card text-center">
                    <HiClipboardList className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{profile?._count?.workouts || 0}</p>
                    <p className="text-xs text-text-muted">Workouts</p>
                </div>
                <div className="card text-center">
                    <HiShoppingBag className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold">{profile?._count?.orders || 0}</p>
                    <p className="text-xs text-text-muted">Orders</p>
                </div>
            </div>

            {/* Order History */}
            <div>
                <h2 className="text-xl font-bold mb-4">Order History</h2>
                {orders.length === 0 ? (
                    <div className="card text-center py-10">
                        <HiShoppingBag className="w-12 h-12 text-text-muted mx-auto mb-3" />
                        <p className="text-text-muted">No orders yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <div key={order.id} className="card !p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-sm">Order #{order.id}</p>
                                        <p className="text-xs text-text-muted">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || ''}`}>
                                            {order.status}
                                        </span>
                                        <span className="font-bold">${order.totalAmount?.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {order.items?.map((item) => (
                                        <span key={item.id} className="text-xs bg-dark-surface px-3 py-1.5 rounded-lg text-text-secondary">
                                            {item.product?.name} ×{item.quantity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
