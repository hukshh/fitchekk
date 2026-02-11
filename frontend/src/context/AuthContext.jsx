import { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext(null);

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
            };
        case 'LOGOUT':
            return { ...initialState, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'UPDATE_USER':
            return { ...state, user: { ...state.user, ...action.payload } };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('fitfusion_token');
        const userStr = localStorage.getItem('fitfusion_user');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                dispatch({ type: 'LOGIN', payload: { user, token } });
            } catch {
                localStorage.removeItem('fitfusion_token');
                localStorage.removeItem('fitfusion_user');
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        } else {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const login = (user, token) => {
        localStorage.setItem('fitfusion_token', token);
        localStorage.setItem('fitfusion_user', JSON.stringify(user));
        dispatch({ type: 'LOGIN', payload: { user, token } });
    };

    const logout = () => {
        localStorage.removeItem('fitfusion_token');
        localStorage.removeItem('fitfusion_user');
        dispatch({ type: 'LOGOUT' });
    };

    const updateUser = (userData) => {
        const updatedUser = { ...state.user, ...userData };
        localStorage.setItem('fitfusion_user', JSON.stringify(updatedUser));
        dispatch({ type: 'UPDATE_USER', payload: userData });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
