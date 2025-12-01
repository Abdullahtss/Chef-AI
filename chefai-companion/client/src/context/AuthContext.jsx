import { createContext, useState, useEffect, useRef } from 'react';
import { getCurrentUser, initializeAuth, logout as authLogout } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const userRef = useRef(null);

    // Function to sync user state from localStorage
    const syncUserFromStorage = () => {
        const currentUser = getCurrentUser();
        const token = localStorage.getItem('token');
        // If token or user is missing, clear user state
        if (!token || !currentUser) {
            setUser(null);
            userRef.current = null;
        } else {
            setUser(currentUser);
            userRef.current = currentUser;
        }
    };

    useEffect(() => {
        // Initialize auth on mount
        initializeAuth();
        syncUserFromStorage();
        setLoading(false);

        // Listen for storage changes (e.g., when token is removed on 401 from other tabs)
        const handleStorageChange = (e) => {
            if (e.key === 'user' || e.key === 'token') {
                syncUserFromStorage();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Check localStorage periodically to catch changes from same tab
        // (storage event only fires for other tabs)
        const interval = setInterval(() => {
            const currentUser = getCurrentUser();
            const token = localStorage.getItem('token');
            // If we had a user but now token/user is missing, sync
            if (userRef.current && (!currentUser || !token)) {
                syncUserFromStorage();
            }
        }, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const login = (userData) => {
        setUser(userData);
        userRef.current = userData;
    };

    const logout = () => {
        authLogout();
        setUser(null);
        userRef.current = null;
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
