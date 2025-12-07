import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getSavedMealPlans, deleteSavedMealPlan } from '../services/userService';
import './SavedMealPlansPage.css';

function SavedMealPlansPage() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [savedMealPlans, setSavedMealPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedPlan, setExpandedPlan] = useState(null);

    useEffect(() => {
        fetchMealPlans();
    }, []);

    const fetchMealPlans = async () => {
        try {
            setLoading(true);
            const response = await getSavedMealPlans();

            if (response.success) {
                setSavedMealPlans(response.mealPlans || []);
            } else {
                setError('Failed to load saved meal plans');
            }
        } catch (err) {
            console.error('Error fetching saved meal plans:', err);
            setError('Failed to load your saved meal plans');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDelete = async (mealPlanId) => {
        if (!window.confirm('Are you sure you want to delete this meal plan?')) {
            return;
        }

        try {
            await deleteSavedMealPlan(mealPlanId);
            setSavedMealPlans(savedMealPlans.filter(mp => mp.mealPlanId !== mealPlanId));
            if (expandedPlan === mealPlanId) {
                setExpandedPlan(null);
            }
        } catch (err) {
            console.error('Error deleting meal plan:', err);
            setError('Failed to delete meal plan');
        }
    };

    const toggleExpand = (mealPlanId) => {
        setExpandedPlan(expandedPlan === mealPlanId ? null : mealPlanId);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <div className="saved-meal-plans-page">
            <header className="saved-meal-plans-header">
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
                            <Link to="/meal-planner" className="btn btn-secondary">
                                Create Meal Plan
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline">
                                Logout
                            </button>
                        </div>
                    </div>
                    <div className="welcome-section">
                        <h2>📅 Saved Meal Plans</h2>
                        <p>Your collection of saved meal plans</p>
                    </div>
                </div>
            </header>

            <main className="saved-meal-plans-main">
                <div className="container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner-large"></div>
                            <p>Loading your saved meal plans...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <span>⚠️</span>
                            <p>{error}</p>
                        </div>
                    ) : savedMealPlans.length > 0 ? (
                        <div className="meal-plans-list">
                            {savedMealPlans.map((savedPlan) => (
                                <div key={savedPlan.mealPlanId} className="saved-plan-card">
                                    <div className="plan-card-header">
                                        <div className="plan-card-info">
                                            <h3 className="plan-title">{savedPlan.title}</h3>
                                            <p className="plan-date">Saved on {formatDate(savedPlan.savedAt)}</p>
                                            {savedPlan.summary && (
                                                <div className="plan-quick-info">
                                                    <span className="info-badge">
                                                        {savedPlan.summary.totalDays} Days
                                                    </span>
                                                    <span className="info-badge">
                                                        {savedPlan.summary.mealsPerDay} Meals/Day
                                                    </span>
                                                    <span className="info-badge">
                                                        {savedPlan.summary.dailyCalorieGoal} Cal/Day
                                                    </span>
                                                    {savedPlan.summary.cuisinePreference && 
                                                     savedPlan.summary.cuisinePreference !== 'Any' && (
                                                        <span className="info-badge cuisine">
                                                            {savedPlan.summary.cuisinePreference}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="plan-card-actions">
                                            <button
                                                onClick={() => toggleExpand(savedPlan.mealPlanId)}
                                                className="btn-expand"
                                            >
                                                {expandedPlan === savedPlan.mealPlanId ? 'Collapse' : 'View Details'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(savedPlan.mealPlanId)}
                                                className="btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {expandedPlan === savedPlan.mealPlanId && savedPlan.mealPlan && (
                                        <div className="plan-details">
                                            {savedPlan.mealPlan.summary && (
                                                <div className="plan-summary">
                                                    <h4>Plan Summary</h4>
                                                    <div className="summary-grid">
                                                        <div className="summary-item">
                                                            <span className="summary-label">Duration:</span>
                                                            <span className="summary-value">
                                                                {savedPlan.mealPlan.summary.totalDays} Days
                                                            </span>
                                                        </div>
                                                        <div className="summary-item">
                                                            <span className="summary-label">Meals Per Day:</span>
                                                            <span className="summary-value">
                                                                {savedPlan.mealPlan.summary.mealsPerDay}
                                                            </span>
                                                        </div>
                                                        <div className="summary-item">
                                                            <span className="summary-label">Daily Calories:</span>
                                                            <span className="summary-value">
                                                                {savedPlan.mealPlan.summary.dailyCalorieGoal}
                                                            </span>
                                                        </div>
                                                        {savedPlan.mealPlan.summary.dietaryRestrictions &&
                                                         savedPlan.mealPlan.summary.dietaryRestrictions.length > 0 && (
                                                            <div className="summary-item">
                                                                <span className="summary-label">Dietary Restrictions:</span>
                                                                <span className="summary-value">
                                                                    {savedPlan.mealPlan.summary.dietaryRestrictions.join(', ')}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {savedPlan.mealPlan.summary.cuisinePreference &&
                                                         savedPlan.mealPlan.summary.cuisinePreference !== 'Any' && (
                                                            <div className="summary-item">
                                                                <span className="summary-label">Cuisine:</span>
                                                                <span className="summary-value">
                                                                    {savedPlan.mealPlan.summary.cuisinePreference}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="meal-plan-days">
                                                {savedPlan.mealPlan.mealPlan && savedPlan.mealPlan.mealPlan.map((day, dayIndex) => (
                                                    <div key={dayIndex} className="day-card">
                                                        <h4 className="day-title">
                                                            {day.date || `Day ${day.day || dayIndex + 1}`}
                                                        </h4>
                                                        
                                                        {day.dailyTotal && (
                                                            <div className="day-totals">
                                                                <span className="total-item">
                                                                    <strong>{day.dailyTotal.calories || 0}</strong> Calories
                                                                </span>
                                                                {day.dailyTotal.protein && (
                                                                    <span className="total-item">
                                                                        <strong>{day.dailyTotal.protein}g</strong> Protein
                                                                    </span>
                                                                )}
                                                                {day.dailyTotal.carbs && (
                                                                    <span className="total-item">
                                                                        <strong>{day.dailyTotal.carbs}g</strong> Carbs
                                                                    </span>
                                                                )}
                                                                {day.dailyTotal.fats && (
                                                                    <span className="total-item">
                                                                        <strong>{day.dailyTotal.fats}g</strong> Fats
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="meals-container">
                                                            {day.meals && day.meals.map((meal, mealIndex) => (
                                                                <div key={mealIndex} className="meal-card">
                                                                    <div className="meal-header">
                                                                        <h5 className="meal-type">
                                                                            {meal.mealType || `Meal ${mealIndex + 1}`}
                                                                        </h5>
                                                                        {meal.calories && (
                                                                            <span className="meal-calories">
                                                                                {meal.calories} cal
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    
                                                                    <h6 className="meal-name">{meal.name}</h6>
                                                                    
                                                                    {meal.description && (
                                                                        <p className="meal-description">{meal.description}</p>
                                                                    )}

                                                                    {meal.macros && (
                                                                        <div className="meal-macros">
                                                                            <span className="macro-item">P: {meal.macros.protein}g</span>
                                                                            <span className="macro-item">C: {meal.macros.carbs}g</span>
                                                                            <span className="macro-item">F: {meal.macros.fats}g</span>
                                                                        </div>
                                                                    )}

                                                                    {meal.ingredients && meal.ingredients.length > 0 && (
                                                                        <div className="meal-section">
                                                                            <h6 className="section-title">Ingredients:</h6>
                                                                            <ul className="ingredients-list">
                                                                                {meal.ingredients.map((ingredient, idx) => (
                                                                                    <li key={idx}>{ingredient}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}

                                                                    {meal.instructions && meal.instructions.length > 0 && (
                                                                        <div className="meal-section">
                                                                            <h6 className="section-title">Instructions:</h6>
                                                                            <ol className="instructions-list">
                                                                                {meal.instructions.map((instruction, idx) => (
                                                                                    <li key={idx}>{instruction}</li>
                                                                                ))}
                                                                            </ol>
                                                                        </div>
                                                                    )}

                                                                    {(meal.prepTime || meal.cookTime) && (
                                                                        <div className="meal-times">
                                                                            {meal.prepTime && (
                                                                                <span className="time-item">⏱️ Prep: {meal.prepTime}</span>
                                                                            )}
                                                                            {meal.cookTime && (
                                                                                <span className="time-item">🔥 Cook: {meal.cookTime}</span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
                            <p>No saved meal plans yet. Create your first meal plan!</p>
                            <Link to="/meal-planner" className="btn btn-primary">
                                Create Meal Plan
                            </Link>
                        </div>
                    )}
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

export default SavedMealPlansPage;

