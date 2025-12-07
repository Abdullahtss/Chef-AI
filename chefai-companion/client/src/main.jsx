import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Apply dark mode on load if stored in localStorage or user preference
const applyDarkModeOnLoad = () => {
    // Check if user is logged in and has dark mode preference
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.darkMode !== undefined) {
                if (user.darkMode) {
                    document.documentElement.classList.add('dark-mode');
                } else {
                    document.documentElement.classList.remove('dark-mode');
                }
                return;
            }
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
    
    // Fallback to localStorage darkMode setting
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }
};

applyDarkModeOnLoad();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
