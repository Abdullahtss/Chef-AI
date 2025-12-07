import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { saveMealPlan } from '../services/userService';
import './MealPlannerPage.css';

const DIETARY_RESTRICTIONS = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Keto',
    'Paleo',
    'Low-Carb',
    'Low-Fat',
    'Halal',
    'Kosher'
];

const CUISINE_OPTIONS = [
    'Any',
    'Italian',
    'Mexican',
    'Asian',
    'Indian',
    'Mediterranean',
    'American',
    'French',
    'Thai',
    'Japanese',
    'Chinese',
    'Middle Eastern'
];

function MealPlannerPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        dietaryRestrictions: [],
        dailyCalorieGoal: 2000,
        numberOfDays: 7,
        mealsPerDay: 3,
        cuisinePreference: 'Any'
    });
    const [loading, setLoading] = useState(false);
    const [mealPlan, setMealPlan] = useState(null);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleCheckboxChange = (restriction) => {
        setFormData(prev => ({
            ...prev,
            dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
                ? prev.dietaryRestrictions.filter(r => r !== restriction)
                : [...prev.dietaryRestrictions, restriction]
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'dailyCalorieGoal' || name === 'numberOfDays' || name === 'mealsPerDay'
                ? parseInt(value) || 0
                : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMealPlan(null);

        try {
            const response = await api.post('/meal-planner/generate', formData);
            
            if (response.data.success) {
                setMealPlan(response.data.mealPlan);
            } else {
                setError('Failed to generate meal plan. Please try again.');
            }
        } catch (err) {
            console.error('Error generating meal plan:', err);
            setError(err.response?.data?.message || 'Failed to generate meal plan. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveMealPlan = async () => {
        if (!mealPlan) return;

        setSaving(true);
        setSaveSuccess(false);
        setError(null);

        try {
            const title = `Meal Plan - ${mealPlan.summary?.totalDays || 'N'} Days`;
            const response = await saveMealPlan(mealPlan, title);
            
            if (response.success) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                setError('Failed to save meal plan. Please try again.');
            }
        } catch (err) {
            console.error('Error saving meal plan:', err);
            setError(err.response?.data?.message || 'Failed to save meal plan. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="meal-planner-page">
            <header className="meal-planner-header">
                <div className="container">
                    <h1 className="page-title">
                        <span className="title-icon">📅</span>
                        Meal Planner
                    </h1>
                    <p className="page-subtitle">Create a personalized meal plan tailored to your preferences</p>
                </div>
            </header>

            <main className="meal-planner-main">
                <div className="container">
                    {!mealPlan ? (
                        <form onSubmit={handleSubmit} className="meal-planner-form">
                            {/* Dietary Restrictions */}
                            <div className="form-section">
                                <label className="form-label">Dietary Restrictions</label>
                                <div className="checkbox-group">
                                    {DIETARY_RESTRICTIONS.map(restriction => (
                                        <label key={restriction} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.dietaryRestrictions.includes(restriction)}
                                                onChange={() => handleCheckboxChange(restriction)}
                                                className="checkbox-input"
                                            />
                                            <span className="checkbox-text">{restriction}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Daily Calorie Goal */}
                            <div className="form-section">
                                <label htmlFor="dailyCalorieGoal" className="form-label">
                                    Daily Calorie Goal
                                </label>
                                <input
                                    type="number"
                                    id="dailyCalorieGoal"
                                    name="dailyCalorieGoal"
                                    value={formData.dailyCalorieGoal}
                                    onChange={handleInputChange}
                                    min="500"
                                    max="10000"
                                    step="100"
                                    required
                                    className="form-input"
                                />
                                <small className="form-hint">Enter your daily calorie target (500-10000)</small>
                            </div>

                            {/* Number of Days */}
                            <div className="form-section">
                                <label htmlFor="numberOfDays" className="form-label">
                                    Number of Days
                                </label>
                                <select
                                    id="numberOfDays"
                                    name="numberOfDays"
                                    value={formData.numberOfDays}
                                    onChange={handleInputChange}
                                    required
                                    className="form-select"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 30].map(days => (
                                        <option key={days} value={days}>
                                            {days} {days === 1 ? 'Day' : 'Days'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Meals Per Day */}
                            <div className="form-section">
                                <label htmlFor="mealsPerDay" className="form-label">
                                    Meals Per Day
                                </label>
                                <select
                                    id="mealsPerDay"
                                    name="mealsPerDay"
                                    value={formData.mealsPerDay}
                                    onChange={handleInputChange}
                                    required
                                    className="form-select"
                                >
                                    {[1, 2, 3, 4, 5, 6].map(meals => (
                                        <option key={meals} value={meals}>
                                            {meals} {meals === 1 ? 'Meal' : 'Meals'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Cuisine Preference */}
                            <div className="form-section">
                                <label htmlFor="cuisinePreference" className="form-label">
                                    Cuisine Preference
                                </label>
                                <select
                                    id="cuisinePreference"
                                    name="cuisinePreference"
                                    value={formData.cuisinePreference}
                                    onChange={handleInputChange}
                                    required
                                    className="form-select"
                                >
                                    {CUISINE_OPTIONS.map(cuisine => (
                                        <option key={cuisine} value={cuisine}>
                                            {cuisine}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="submit-button"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Generating Meal Plan...
                                    </>
                                ) : (
                                    <>
                                        <span>✨</span>
                                        Generate Meal Plan
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="meal-plan-results">
                            <div className="results-header">
                                <h2>Your Personalized Meal Plan</h2>
                                <div className="header-actions">
                                    <button
                                        onClick={handleSaveMealPlan}
                                        disabled={saving || saveSuccess}
                                        className="save-plan-button"
                                    >
                                        {saving ? (
                                            <>
                                                <span className="spinner-small"></span>
                                                Saving...
                                            </>
                                        ) : saveSuccess ? (
                                            <>
                                                <span>✓</span>
                                                Saved!
                                            </>
                                        ) : (
                                            <>
                                                <span>💾</span>
                                                Save Meal Plan
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setMealPlan(null);
                                            setError(null);
                                            setSaveSuccess(false);
                                        }}
                                        className="new-plan-button"
                                    >
                                        Create New Plan
                                    </button>
                                </div>
                            </div>

                            {saveSuccess && (
                                <div className="success-message">
                                    Meal plan saved successfully! You can view it in your saved meal plans.
                                </div>
                            )}

                            {mealPlan.summary && (
                                <div className="plan-summary">
                                    <h3>Plan Summary</h3>
                                    <div className="summary-grid">
                                        <div className="summary-item">
                                            <span className="summary-label">Duration:</span>
                                            <span className="summary-value">{mealPlan.summary.totalDays} Days</span>
                                        </div>
                                        <div className="summary-item">
                                            <span className="summary-label">Meals Per Day:</span>
                                            <span className="summary-value">{mealPlan.summary.mealsPerDay}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span className="summary-label">Daily Calories:</span>
                                            <span className="summary-value">{mealPlan.summary.dailyCalorieGoal}</span>
                                        </div>
                                        {mealPlan.summary.dietaryRestrictions.length > 0 && (
                                            <div className="summary-item">
                                                <span className="summary-label">Dietary Restrictions:</span>
                                                <span className="summary-value">
                                                    {mealPlan.summary.dietaryRestrictions.join(', ')}
                                                </span>
                                            </div>
                                        )}
                                        {mealPlan.summary.cuisinePreference && mealPlan.summary.cuisinePreference !== 'Any' && (
                                            <div className="summary-item">
                                                <span className="summary-label">Cuisine:</span>
                                                <span className="summary-value">{mealPlan.summary.cuisinePreference}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="meal-plan-days">
                                {mealPlan.mealPlan && mealPlan.mealPlan.map((day, dayIndex) => (
                                    <div key={dayIndex} className="day-card">
                                        <h3 className="day-title">{day.date || `Day ${day.day || dayIndex + 1}`}</h3>
                                        
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
                                                        <h4 className="meal-type">{meal.mealType || `Meal ${mealIndex + 1}`}</h4>
                                                        {meal.calories && (
                                                            <span className="meal-calories">{meal.calories} cal</span>
                                                        )}
                                                    </div>
                                                    
                                                    <h5 className="meal-name">{meal.name}</h5>
                                                    
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
            </main>
        </div>
    );
}

export default MealPlannerPage;

