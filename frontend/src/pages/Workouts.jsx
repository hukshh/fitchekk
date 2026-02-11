import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Skeleton } from '../components/ui/Loader';
import toast from 'react-hot-toast';
import { HiPlus, HiX, HiClipboardList } from 'react-icons/hi';

const Workouts = () => {
    const { get, post } = useApi();
    const [workouts, setWorkouts] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSetModal, setShowSetModal] = useState(null); // workoutId
    const [newWorkout, setNewWorkout] = useState({ title: '' });
    const [newSet, setNewSet] = useState({ exerciseId: '', reps: '', weight: '', rpe: '' });
    const [creating, setCreating] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [wRes, eRes] = await Promise.all([
                get('/workouts'),
                get('/exercises'),
            ]);
            setWorkouts(wRes.workouts || []);
            setExercises(eRes.exercises || []);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [get]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleCreateWorkout = async (e) => {
        e.preventDefault();
        if (!newWorkout.title.trim()) { toast.error('Enter a workout title'); return; }
        setCreating(true);
        try {
            const res = await post('/workouts', { title: newWorkout.title });
            toast.success(`Workout created! +${res.xpEarned} XP 🔥`);
            setShowCreateModal(false);
            setNewWorkout({ title: '' });
            fetchData();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setCreating(false);
        }
    };

    const handleAddSet = async (e) => {
        e.preventDefault();
        if (!newSet.exerciseId || !newSet.reps) { toast.error('Exercise and reps are required'); return; }
        setCreating(true);
        try {
            await post(`/workouts/${showSetModal}/sets`, {
                exerciseId: parseInt(newSet.exerciseId),
                reps: parseInt(newSet.reps),
                weight: newSet.weight ? parseFloat(newSet.weight) : null,
                rpe: newSet.rpe ? parseFloat(newSet.rpe) : null,
            });
            toast.success('Set added!');
            setShowSetModal(null);
            setNewSet({ exerciseId: '', reps: '', weight: '', rpe: '' });
            fetchData();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Workouts</h1>
                    <p className="text-text-muted mt-1">Track your training sessions</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                    <HiPlus className="w-5 h-5" /> New Workout
                </Button>
            </div>

            {/* Workout List */}
            {loading ? (
                <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="card"><Skeleton lines={3} /></div>)}</div>
            ) : workouts.length === 0 ? (
                <div className="card text-center py-16">
                    <HiClipboardList className="w-16 h-16 text-text-muted mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No workouts yet</h3>
                    <p className="text-text-muted mb-6">Create your first workout to start earning XP!</p>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <HiPlus className="w-5 h-5" /> Create Workout
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {workouts.map((w) => (
                        <div key={w.id} className="card">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{w.title || 'Untitled Workout'}</h3>
                                    <p className="text-sm text-text-muted">
                                        {new Date(w.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <Button variant="secondary" className="!py-2 !px-4 !text-sm" onClick={() => setShowSetModal(w.id)}>
                                    <HiPlus className="w-4 h-4" /> Add Set
                                </Button>
                            </div>

                            {w.sets && w.sets.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-dark-border">
                                                <th className="text-left py-2 text-text-muted font-medium">Exercise</th>
                                                <th className="text-center py-2 text-text-muted font-medium">Reps</th>
                                                <th className="text-center py-2 text-text-muted font-medium">Weight</th>
                                                <th className="text-center py-2 text-text-muted font-medium">RPE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {w.sets.map((s) => (
                                                <tr key={s.id} className="border-b border-dark-border/50">
                                                    <td className="py-2.5 font-medium">{s.exercise?.name || 'Unknown'}</td>
                                                    <td className="py-2.5 text-center">{s.reps}</td>
                                                    <td className="py-2.5 text-center">{s.weight ? `${s.weight} lbs` : '—'}</td>
                                                    <td className="py-2.5 text-center">{s.rpe || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-text-muted italic">No sets logged yet</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Create Workout Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setShowCreateModal(false)}>
                    <div className="glass-strong rounded-3xl p-6 sm:p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">New Workout</h2>
                            <button onClick={() => setShowCreateModal(false)} className="p-1 text-text-muted hover:text-text-primary"><HiX className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleCreateWorkout} className="space-y-4">
                            <Input
                                label="Workout Title"
                                placeholder="e.g. Chest Day, Leg Day"
                                value={newWorkout.title}
                                onChange={(e) => setNewWorkout({ title: e.target.value })}
                            />
                            <Button type="submit" loading={creating} className="w-full justify-center">
                                Create & Earn +10 XP
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Set Modal */}
            {showSetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setShowSetModal(null)}>
                    <div className="glass-strong rounded-3xl p-6 sm:p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Add Set</h2>
                            <button onClick={() => setShowSetModal(null)} className="p-1 text-text-muted hover:text-text-primary"><HiX className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleAddSet} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1.5">Exercise</label>
                                <select
                                    className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-text-primary focus:outline-none focus:border-primary transition-all"
                                    value={newSet.exerciseId}
                                    onChange={(e) => setNewSet({ ...newSet, exerciseId: e.target.value })}
                                >
                                    <option value="">Select exercise...</option>
                                    {exercises.map((ex) => (
                                        <option key={ex.id} value={ex.id}>{ex.name} {ex.muscleGroup ? `(${ex.muscleGroup})` : ''}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <Input label="Reps" type="number" placeholder="10" value={newSet.reps} onChange={(e) => setNewSet({ ...newSet, reps: e.target.value })} />
                                <Input label="Weight" type="number" placeholder="135" value={newSet.weight} onChange={(e) => setNewSet({ ...newSet, weight: e.target.value })} />
                                <Input label="RPE" type="number" placeholder="8" value={newSet.rpe} onChange={(e) => setNewSet({ ...newSet, rpe: e.target.value })} />
                            </div>
                            <Button type="submit" loading={creating} className="w-full justify-center">
                                Add Set
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workouts;
