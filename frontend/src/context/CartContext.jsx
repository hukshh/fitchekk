import { createContext, useReducer, useCallback } from 'react';

export const CartContext = createContext(null);

const initialState = {
    items: [],
    total: 0,
    count: 0,
    loading: false,
};

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return {
                ...state,
                items: action.payload.items,
                total: action.payload.total,
                count: action.payload.count || action.payload.items.length,
                loading: false,
            };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'CLEAR_CART':
            return { ...initialState };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const setCart = useCallback((cartData) => {
        dispatch({ type: 'SET_CART', payload: cartData });
    }, []);

    const setLoading = useCallback((loading) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    }, []);

    const clearCart = useCallback(() => {
        dispatch({ type: 'CLEAR_CART' });
    }, []);

    return (
        <CartContext.Provider value={{ ...state, setCart, setLoading, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
