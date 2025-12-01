import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import './LandingPage.css';

function LandingPage() {
    useEffect(() => {
        // Smooth scroll for anchor links
        const handleAnchorClick = (e) => {
            const target = e.target.closest('a');
            if (target) {
                const href = target.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const element = document.querySelector(href);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        };

        document.addEventListener('click', handleAnchorClick);
        return () => document.removeEventListener('click', handleAnchorClick);
    }, []);

    return (
        <div className="landing-page">
            {/* Header */}
            <header>
                <div className="container">
                    <nav>
                        <Link to="/" className="logo">Chef AI</Link>
                        <ul>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><Link to="/login" className="btn-nav">Login</Link></li>
                            <li><Link to="/signup" className="btn-nav">Sign Up</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Create Custom Recipes & Meal Plans with AI</h1>
                        <p>Your Personalized AI Kitchen Copilot - Instantly generate recipes and meal plans tailored to your tastes, goals, and lifestyle</p>
                        <div>
                            <Link to="/signup" className="btn-primary">Start Free Trial</Link>
                            <button className="btn-secondary">Watch Demo</button>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img 
                            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                            alt="Chef preparing delicious meal with AI assistance"
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <div className="container">
                    <div className="feature-item">
                        <div className="feature-content">
                            <h2>AI Recipe Generator</h2>
                            <p>Describe any idea or ingredient list and our AI instantly creates a unique recipe just for you.</p>
                            <ul className="feature-list">
                                <li>Turn leftovers into delicious meals</li>
                                <li>Request substitutions and dietary tweaks</li>
                                <li>Save and share your favorite creations</li>
                                <li>Never run out of inspiration</li>
                            </ul>
                        </div>
                        <div className="feature-image">
                            <img 
                                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                                alt="AI Recipe Generator - Creating unique recipes"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-content">
                            <h2>AI Meal Planner</h2>
                            <p>Achieve your goals with a meal plan built just for you. Whether it's weight loss, muscle gain, or eating on a budget.</p>
                            <ul className="feature-list">
                                <li>Full week of personalized meals</li>
                                <li>Generate recipes for any meal instantly</li>
                                <li>Easy customization and swaps</li>
                                <li>Stay on track and save time</li>
                            </ul>
                        </div>
                        <div className="feature-image">
                            <img 
                                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80" 
                                alt="AI Meal Planner - Weekly meal planning"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-content">
                            <h2>Personalized AI Profile</h2>
                            <p>Your AI truly knows you - your tastes, dietary needs, goals, and kitchen preferences.</p>
                            <ul className="feature-list">
                                <li>Reach your personal health goals</li>
                                <li>Get smarter AI suggestions</li>
                                <li>Save time with instant ideas</li>
                                <li>Reduce food waste</li>
                            </ul>
                        </div>
                        <div className="feature-image">
                            <img 
                                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                                alt="Personalized AI Profile - Customized meal recommendations"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="pricing" id="pricing">
                <div className="container">
                    <h2>Choose Your Plan</h2>
                    <p>Start free and upgrade anytime. Cancel anytime with no questions asked.</p>
                    
                    <div className="pricing-toggle">
                        <span>Monthly</span>
                        <div className="toggle-switch active"></div>
                        <span>Annual<br /><small style={{ color: '#667eea', fontWeight: '600' }}>Save 25%</small></span>
                    </div>

                    <div className="pricing-cards">
                        <div className="pricing-card">
                            <div className="plan-name">Basic</div>
                            <div className="plan-price">Free</div>
                            <ul className="plan-features">
                                <li>Limited usage credits</li>
                                <li>Save your recipes</li>
                                <li>Basic AI chat</li>
                                <li>Community support</li>
                            </ul>
                            <Link to="/signup" className="btn-primary">Get Started</Link>
                        </div>

                        <div className="pricing-card featured">
                            <div className="badge">MOST POPULAR</div>
                            <div className="plan-name">Premium</div>
                            <div className="plan-price">$9.99<small style={{ fontSize: '16px', color: '#999' }}>/mo</small></div>
                            <ul className="plan-features">
                                <li>25x more usage credits</li>
                                <li>Personalized AI model</li>
                                <li>Advanced meal planner</li>
                                <li>Ad-free experience</li>
                                <li>Priority support</li>
                            </ul>
                            <Link to="/signup" className="btn-primary">Start Trial</Link>
                        </div>

                        <div className="pricing-card">
                            <div className="plan-name">Pro</div>
                            <div className="plan-price">$19.99<small style={{ fontSize: '16px', color: '#999' }}>/mo</small></div>
                            <ul className="plan-features">
                                <li>Everything in Premium</li>
                                <li>Commercial rights</li>
                                <li>Higher usage limits</li>
                                <li>AI image generation</li>
                                <li>Privacy mode</li>
                            </ul>
                            <Link to="/signup" className="btn-primary">Start Trial</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <h2>Ready to Transform Your Cooking?</h2>
                    <p>Join thousands of home chefs already using AI to create amazing meals every day.</p>
                    <Link to="/signup" className="btn-primary" style={{ background: 'white', color: '#667eea' }}>Start Your Free Trial Today</Link>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <div className="container">
                    <p>&copy; 2024 Chef AI. All rights reserved. | Privacy Policy | Terms of Service</p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;

