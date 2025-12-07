import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, changePassword } from '../services/userService';
import './ProfilePage.css';

function ProfilePage() {
    const { user, updateUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    // Profile form state
    const [profileData, setProfileData] = useState({
        name: '',
        avatar: '',
        darkMode: false
    });
    
    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await getUserProfile();
            if (response.success) {
                setProfileData({
                    name: response.user.name || '',
                    avatar: response.user.avatar || '',
                    darkMode: response.user.darkMode || false
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.8) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with compression
                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedBase64);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        try {
            // Compress and convert to base64
            const compressedBase64 = await compressImage(file);
            setProfileData(prev => ({
                ...prev,
                avatar: compressedBase64
            }));
        } catch (error) {
            console.error('Error processing image:', error);
            setError('Failed to process image. Please try again.');
        }
    };

    const handleRemoveAvatar = () => {
        setProfileData(prev => ({
            ...prev,
            avatar: null
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await updateUserProfile(profileData);
            if (response.success) {
                setSuccess('Profile updated successfully!');
                // Update context with new user data
                updateUser(response.user);
                // Update dark mode in localStorage and apply to document
                localStorage.setItem('darkMode', profileData.darkMode);
                applyDarkMode(profileData.darkMode);
            } else {
                setError('Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setSaving(true);

        try {
            const response = await changePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            );
            if (response.success) {
                setSuccess('Password changed successfully!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setShowPasswordForm(false);
            } else {
                setError('Failed to change password');
            }
        } catch (err) {
            console.error('Error changing password:', err);
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    const applyDarkMode = (isDark) => {
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Apply dark mode on mount and when it changes
    useEffect(() => {
        if (profileData.darkMode !== undefined) {
            applyDarkMode(profileData.darkMode);
        }
    }, [profileData.darkMode]);

    if (loading) {
        return (
            <div className="profile-page">
                <div className="loading-state">
                    <div className="spinner-large"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <header className="profile-header">
                <div className="container">
                    <div className="header-top">
                        <div className="logo-section">
                            <Link to="/home" className="logo-link">
                                <h1 className="logo">
                                    <span className="logo-icon">👨‍🍳</span>
                                    ChefAI Companion
                                </h1>
                            </Link>
                        </div>
                        <div className="user-actions">
                            <Link to="/home" className="btn btn-secondary">
                                Back to Home
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline">
                                Logout
                            </button>
                        </div>
                    </div>
                    <div className="welcome-section">
                        <h2>User Profile</h2>
                        <p>Manage your account settings and preferences</p>
                    </div>
                </div>
            </header>

            <main className="profile-main">
                <div className="container">
                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="alert alert-success">
                            {success}
                        </div>
                    )}

                    <div className="profile-content">
                        {/* Profile Information Section */}
                        <div className="profile-section">
                            <h3 className="section-title">Profile Information</h3>
                            <form onSubmit={handleProfileSubmit} className="profile-form">
                                {/* Avatar Upload */}
                                <div className="form-group">
                                    <label className="form-label">Profile Picture</label>
                                    <div className="avatar-upload-container">
                                        <div className="avatar-preview">
                                            {profileData.avatar ? (
                                                <img 
                                                    src={profileData.avatar} 
                                                    alt="Profile" 
                                                    className="avatar-image"
                                                />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    <span className="avatar-icon">👤</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="avatar-actions">
                                            <label className="avatar-upload-btn">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarUpload}
                                                    className="avatar-input"
                                                />
                                                <span>{profileData.avatar ? 'Change Avatar' : 'Upload Avatar'}</span>
                                            </label>
                                            {profileData.avatar && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveAvatar}
                                                    className="avatar-remove-btn"
                                                >
                                                    Remove Avatar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Username */}
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                {/* Email (read-only) */}
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="form-input form-input-disabled"
                                    />
                                    <small className="form-hint">Email cannot be changed</small>
                                </div>

                                {/* Dark Mode Toggle */}
                                <div className="form-group">
                                    <label className="form-label">Appearance</label>
                                    <div className="toggle-container">
                                        <label className="toggle-label">
                                            <input
                                                type="checkbox"
                                                name="darkMode"
                                                checked={profileData.darkMode}
                                                onChange={handleInputChange}
                                                className="toggle-input"
                                            />
                                            <span className="toggle-slider"></span>
                                            <span className="toggle-text">
                                                {profileData.darkMode ? 'Dark Mode' : 'Light Mode'}
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="btn btn-primary btn-save"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>

                        {/* Change Password Section */}
                        <div className="profile-section">
                            <h3 className="section-title">Change Password</h3>
                            {!showPasswordForm ? (
                                <button
                                    onClick={() => setShowPasswordForm(true)}
                                    className="btn btn-secondary"
                                >
                                    Change Password
                                </button>
                            ) : (
                                <form onSubmit={handlePasswordSubmit} className="profile-form">
                                    <div className="form-group">
                                        <label htmlFor="currentPassword" className="form-label">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            id="currentPassword"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            className="form-input"
                                            placeholder="Enter current password"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="newPassword" className="form-label">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength={6}
                                            className="form-input"
                                            placeholder="Enter new password (min 6 characters)"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength={6}
                                            className="form-input"
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="btn btn-primary"
                                        >
                                            {saving ? 'Changing...' : 'Change Password'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPasswordForm(false);
                                                setPasswordData({
                                                    currentPassword: '',
                                                    newPassword: '',
                                                    confirmPassword: ''
                                                });
                                                setError(null);
                                            }}
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="app-footer">
                <div className="container">
                    <p>&copy; 2025 ChefAI Companion. Powered by OpenAI.</p>
                </div>
            </footer>
        </div>
    );
}

export default ProfilePage;

