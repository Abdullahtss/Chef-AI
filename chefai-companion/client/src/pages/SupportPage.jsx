import { Link } from 'react-router-dom';
import { useState } from 'react';
import chefLogo from '../assets/chef-logo.png';
import './SupportPage.css';

function SupportPage() {
    const [copiedField, setCopiedField] = useState(null);

    const copyToClipboard = (text, fieldName) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    return (
        <div className="support-page">
            {/* Header */}
            <header className="support-header">
                <div className="container">
                    <nav className="support-nav">
                        <Link to="/" className="logo">
                            <img src={chefLogo} alt="Chef AI Logo" className="logo-icon" />
                            <span className="logo-text">ChefAI Companion</span>
                        </Link>
                        <div className="nav-links">
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/login" className="btn-nav">Login</Link>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="support-hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-icon">💝</div>
                        <h1>Support ChefAI Companion</h1>
                        <p className="hero-subtitle">
                            Your support helps us continue building amazing features and improving the platform. 
                            Every contribution makes a difference!
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="support-main">
                <div className="container">
                    {/* Why Support Section */}
                    <section className="why-support-section">
                        <h2>Why Support Us?</h2>
                        <div className="benefits-grid">
                            <div className="benefit-card">
                                <div className="benefit-icon">🚀</div>
                                <h3>Fuel Innovation</h3>
                                <p>Help us develop new AI features and improve recipe generation quality</p>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">⚡</div>
                                <h3>Better Performance</h3>
                                <p>Support faster servers and more reliable infrastructure</p>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">🎨</div>
                                <h3>Enhanced Experience</h3>
                                <p>Enable us to create better UI/UX and add more features</p>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">🌍</div>
                                <h3>Free Access</h3>
                                <p>Keep the platform free and accessible for everyone</p>
                            </div>
                        </div>
                    </section>

                    {/* Payment Methods Section */}
                    <section className="payment-section">
                        <h2>Bank Transfer Details</h2>
                        <p className="section-description">
                            You can support us by making a direct bank transfer. All contributions are greatly appreciated!
                        </p>
                        
                        <div className="bank-details-card">
                            <div className="bank-header">
                                <div className="bank-icon">🏦</div>
                                <h3>Meezan Bank</h3>
                            </div>
                            
                            <div className="bank-info">
                                <div className="info-row">
                                    <span className="info-label">Account Title:</span>
                                    <div className="info-value-group">
                                        <span className="info-value">Abdullah Bin Ahmed</span>
                                        <button 
                                            className="copy-btn"
                                            onClick={() => copyToClipboard('Abdullah Bin Ahmed', 'name')}
                                            title="Copy to clipboard"
                                        >
                                            {copiedField === 'name' ? '✓ Copied' : '📋 Copy'}
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="info-row">
                                    <span className="info-label">Account Number:</span>
                                    <div className="info-value-group">
                                        <span className="info-value highlight">03367402002</span>
                                        <button 
                                            className="copy-btn"
                                            onClick={() => copyToClipboard('03367402002', 'account')}
                                            title="Copy to clipboard"
                                        >
                                            {copiedField === 'account' ? '✓ Copied' : '📋 Copy'}
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="info-row">
                                    <span className="info-label">Bank Name:</span>
                                    <span className="info-value">jazzcash</span>
                                </div>
                            </div>

                            <div className="payment-note">
                                <div className="note-icon">💡</div>
                                <p>
                                    After making a transfer, please send us a confirmation email at{' '}
                                    <a href="mailto:support@chefai.com">support@chefai.com</a> with your transaction details. 
                                    We'll acknowledge your support!
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Thank You Section */}
                    <section className="thank-you-section">
                        <div className="thank-you-card">
                            <div className="thank-you-icon">🙏</div>
                            <h2>Thank You for Your Support!</h2>
                            <p>
                                Your generosity helps us maintain and improve ChefAI Companion. 
                                We're grateful for every contribution, no matter the size.
                            </p>
                            <div className="support-actions">
                                <Link to="/signup" className="btn-primary">
                                    Get Started Free
                                </Link>
                                <Link to="/" className="btn-secondary">
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="support-footer">
                <div className="container">
                    <p>&copy; 2025 ChefAI Companion. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default SupportPage;
