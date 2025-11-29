import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import PrivateRoute from './components/auth/PrivateRoute'
import RecipeGenerator from './components/RecipeGenerator'
import Home from './pages/Home'
import './App.css'

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected Routes */}
                    <Route path="/home" element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    } />

                    <Route path="/recipes" element={
                        <PrivateRoute>
                            <div className="app">
                                <header className="app-header">
                                    <div className="container">
                                        <div className="header-content">
                                            <h1 className="logo">
                                                <span className="logo-icon">👨‍🍳</span>
                                                ChefAI Companion
                                            </h1>
                                            <p className="tagline">Transform your ingredients into culinary masterpieces</p>
                                        </div>
                                    </div>
                                </header>

                                <main className="app-main">
                                    <div className="container">
                                        <RecipeGenerator />
                                    </div>
                                </main>

                                <footer className="app-footer">
                                    <div className="container">
                                        <p>&copy; 2025 ChefAI Companion. Powered by OpenAI.</p>
                                    </div>
                                </footer>
                            </div>
                        </PrivateRoute>
                    } />

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
