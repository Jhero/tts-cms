import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface User {
    username: string;
    role?: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false
};

// Initialize from localStorage if available
const storedAuth = browser ? localStorage.getItem('auth') : null;
const initial = storedAuth ? JSON.parse(storedAuth) : initialState;

export const auth = writable<AuthState>(initial);

if (browser) {
    auth.subscribe((value) => {
        localStorage.setItem('auth', JSON.stringify(value));
    });
}

export function logout() {
    auth.set({ token: null, user: null, isAuthenticated: false });
}
