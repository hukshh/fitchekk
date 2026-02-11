import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Loader from './components/ui/Loader';

// Lazy-loaded pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Workouts = lazy(() => import('./pages/Workouts'));
const Store = lazy(() => import('./pages/Store'));
const Profile = lazy(() => import('./pages/Profile'));

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-dark">
        <Loader size="lg" />
    </div>
);

function App() {
    const location = useLocation();
    const isLanding = location.pathname === '/';

    return (
        <div className="min-h-screen bg-dark flex flex-col">
            <Navbar />
            <main className={`flex-1 ${isLanding ? '' : 'pt-20'}`}>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
                        <Route path="/store" element={<ProtectedRoute><Store /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    </Routes>
                </Suspense>
            </main>
            {!isLanding && <Footer />}
        </div>
    );
}

export default App;
