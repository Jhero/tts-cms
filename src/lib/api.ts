import { get } from 'svelte/store';
import { auth } from './stores/auth';
import { API_BASE_URL } from './config';
import { goto } from '$app/navigation';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

async function request<T>(method: RequestMethod, endpoint: string, body?: any): Promise<T> {
    const $auth = get(auth);
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if ($auth.token) {
        headers['Authorization'] = `Bearer ${$auth.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        
        // If we are on login page, we probably just want the error message.
        // If we are elsewhere, we might want to redirect.
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            auth.set({ token: null, user: null, isAuthenticated: false });
            goto('/login');
        }
        
        throw new Error(errorData.message || errorData.error || 'Unauthorized');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'API request failed');
    }
    
    // Check if response has content
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export const api = {
    get: <T>(endpoint: string) => request<T>('GET', endpoint),
    post: <T>(endpoint: string, body: any) => request<T>('POST', endpoint, body),
    put: <T>(endpoint: string, body: any) => request<T>('PUT', endpoint, body),
    patch: <T>(endpoint: string, body: any) => request<T>('PATCH', endpoint, body),
    delete: <T>(endpoint: string) => request<T>('DELETE', endpoint),
};
