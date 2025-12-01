import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginUser } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await loginUser({
                email: formData.email,
                password: formData.password
            });

            if (response.success) {
                login(response.user);
                navigate('/home');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        // Placeholder for social login functionality
        console.log(`Login with ${provider}`);
    };

    return (
        <div className="login-page">
            <div className="container">
                {/* Left Side - Info */}
                <div className="login-info">
                    <div className="logo">🍳 Chef AI</div>
                    <h1>Create Your AI Kitchen Copilot</h1>
                    
                    <ul className="benefits">
                        <li>
                            <strong>15 Weekly Credits</strong>
                            Create a free account and receive 15 credits every week for generating recipes and meal plans
                        </li>
                        <li>
                            <strong>Recipe & Plan History</strong>
                            All your creations are saved. Access from any device, anytime
                        </li>
                        <li>
                            <strong>Bookmark & Favorites</strong>
                            Build your personal cookbook and organize all your favorites
                        </li>
                    </ul>
                </div>

                {/* Right Side - Form */}
                <div className="login-form-container">
                    <h2 className="form-title">Login or Register</h2>
                    <p className="form-subtitle">Start creating amazing recipes with AI</p>

                    {error && (
                        <div className="error-alert">
                            <span>⚠️</span>
                            {error}
                        </div>
                    )}

                    {/* Social Login */}
                    <div className="social-buttons">
                        <button 
                            type="button"
                            className="social-btn"
                            onClick={() => handleSocialLogin('Google')}
                        >
                            <span>🔵</span> Google
                        </button>
                        <button 
                            type="button"
                            className="social-btn"
                            onClick={() => handleSocialLogin('Apple')}
                        >
                            <span>🍎</span> Apple
                        </button>
                    </div>

                    <div className="divider">
                        <span>or continue with email</span>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="checkbox-group">
                            <label className="checkbox-wrapper">
                                <input 
                                    type="checkbox" 
                                    id="remember"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-login"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="signup-link">
                        Don't have an account? <Link to="/signup">Create one for free</Link>
                    </div>

                    <div className="terms">
                        By signing in, you agree to our{' '}
                        <Link to="/terms">terms of use</Link> and{' '}
                        <Link to="/privacy">privacy policy</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
