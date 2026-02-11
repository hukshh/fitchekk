import { useCallback } from 'react';
import { useAuth } from './useAuth';

const API_BASE = '/api';

export const useApi = () => {
    const { token, logout } = useAuth();

    const request = useCallback(async (endpoint, options = {}) => {
        const url = `${API_BASE}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (response.status === 401) {
                logout();
                throw new Error('Session expired. Please login again.');
            }

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            return data;
        } catch (error) {
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                throw new Error('Unable to connect to server. Please try again.');
            }
            throw error;
        }
    }, [token, logout]);

    const get = useCallback((endpoint) => request(endpoint), [request]);

    const post = useCallback((endpoint, body) =>
        request(endpoint, { method: 'POST', body: JSON.stringify(body) }), [request]);

    const put = useCallback((endpoint, body) =>
        request(endpoint, { method: 'PUT', body: JSON.stringify(body) }), [request]);

    const del = useCallback((endpoint) =>
        request(endpoint, { method: 'DELETE' }), [request]);

    return { get, post, put, del, request };
};
