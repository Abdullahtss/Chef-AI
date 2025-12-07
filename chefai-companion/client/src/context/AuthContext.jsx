import { createContext, useState, useEffect, useRef } from 'react';
import { getCurrentUser, initializeAuth, logout as authLogout } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const userRef = useRef(null);

    // Apply dark mode based on user preference
    const applyDarkMode = (isDark) => {
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    };

    // Function to sync user state from localStorage
    const syncUserFromStorage = () => {
        const currentUser = getCurrentUser();
        const token = localStorage.getItem('token');
        // If token or user is missing, clear user state
        if (!token || !currentUser) {
            setUser(null);
            userRef.current = null;
            // Remove dark mode on logout
            applyDarkMode(false);
        } else {
            setUser(currentUser);
            userRef.current = currentUser;
            // Apply dark mode from user preference
            if (currentUser?.darkMode !== undefined) {
                applyDarkMode(currentUser.darkMode);
            }
        }
    };

    useEffect(() => {
        // Initialize auth on mount
        initializeAuth();
        syncUserFromStorage();
        
        // Apply dark mode from user preference or localStorage
        const currentUser = getCurrentUser();
        if (currentUser?.darkMode !== undefined) {
            applyDarkMode(currentUser.darkMode);
        } else {
            const storedDarkMode = localStorage.getItem('darkMode') === 'true';
            applyDarkMode(storedDarkMode);
        }
        
        setLoading(false);

        // Listen for storage changes (e.g., when token is removed on 401 from other tabs)
        const handleStorageChange = (e) => {
            if (e.key === 'user' || e.key === 'token') {
                syncUserFromStorage();
                const updatedUser = getCurrentUser();
                if (updatedUser?.darkMode !== undefined) {
                    applyDarkMode(updatedUser.darkMode);
                }
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
            } else if (currentUser?.darkMode !== undefined && currentUser.darkMode !== (userRef.current?.darkMode || false)) {
                applyDarkMode(currentUser.darkMode);
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
        // Apply dark mode on login
        if (userData?.darkMode !== undefined) {
            applyDarkMode(userData.darkMode);
        }
    };

    const logout = () => {
        authLogout();
        setUser(null);
        userRef.current = null;
        // Remove dark mode on logout
        applyDarkMode(false);
    };

    const updateUser = (userData) => {
        setUser(userData);
        userRef.current = userData;
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        // Apply dark mode if changed
        if (userData?.darkMode !== undefined) {
            applyDarkMode(userData.darkMode);
        }
    };

    const value = {
        user,
        login,
        logout,
        updateUser,
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
