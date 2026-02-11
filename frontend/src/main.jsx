import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <App />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#111118',
                                color: '#f8fafc',
                                border: '1px solid #2a2a3a',
                                borderRadius: '12px',
                            },
                            success: {
                                iconTheme: { primary: '#22c55e', secondary: '#111118' },
                            },
                            error: {
                                iconTheme: { primary: '#ef4444', secondary: '#111118' },
                            },
                        }}
                    />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
