"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean;
    user: { name: string; document: string } | null;
    login: (docNumber: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ name: string; document: string } | null>(null);
    const router = useRouter();

    // Check for existing session on mount (mock)
    useEffect(() => {
        const storedAuth = localStorage.getItem('hospital_auth');
        if (storedAuth) {
            const parsed = JSON.parse(storedAuth);
            setIsAuthenticated(true);
            setUser(parsed);
        }
    }, []);

    const login = (docNumber: string) => {
        const mockUser = { name: "Juan Pérez", document: docNumber };
        setIsAuthenticated(true);
        setUser(mockUser);
        localStorage.setItem('hospital_auth', JSON.stringify(mockUser));
        router.push('/portal/resultados'); // Default redirect
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('hospital_auth');
        router.push('/portal/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
