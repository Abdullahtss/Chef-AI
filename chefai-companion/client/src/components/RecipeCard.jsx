import { useState } from 'react'
import { saveRecipe, favoriteRecipe } from '../services/userService'
import './RecipeCard.css'

function RecipeCard({ recipe, index, hideActions = false }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [isFavorited, setIsFavorited] = useState(false)
    const [notification, setNotification] = useState(null)

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded)
    }

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3000)
    }

    const handleSave = async () => {
        try {
            const response = await saveRecipe(recipe)
            if (response.success) {
                setIsSaved(true)
                showNotification('Recipe saved successfully! ✅')
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to save recipe'
            showNotification(message, 'error')
        }
    }

    const handleFavorite = async () => {
        try {
            const response = await favoriteRecipe(recipe)
            if (response.success) {
                setIsFavorited(response.favorited)
                showNotification(
                    response.favorited ? 'Added to favorites! ❤️' : 'Removed from favorites',
                    'success'
                )
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to favorite recipe'
            showNotification(message, 'error')
        }
    }

    return (
        <div className="recipe-card card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            {/* Notification Toast */}
            {notification && (
                <div className={`notification-toast ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            {/* Recipe Header */}
            <div className="recipe-header">
                <div className="recipe-number">#{index + 1}</div>
                <h3 className="recipe-name">{recipe.name}</h3>
                <p className="recipe-description">{recipe.description}</p>
            </div>

            {/* Action Buttons */}
            {!hideActions && (
                <div className="recipe-actions">
                    <button
                        className={`btn-action ${isSaved ? 'active' : ''}`}
                        onClick={handleSave}
                        disabled={isSaved}
                        title="Save Recipe"
                    >
                        <span>{isSaved ? '✓' : '📌'}</span>
                        {isSaved ? 'Saved' : 'Save'}
                    </button>
                    <button
                        className={`btn-action ${isFavorited ? 'active favorite' : ''}`}
                        onClick={handleFavorite}
                        title="Favorite Recipe"
                    >
                        <span>{isFavorited ? '❤️' : '🤍'}</span>
                        {isFavorited ? 'Favorited' : 'Favorite'}
                    </button>
                </div>
            )}

            {/* Recipe Meta Info */}
            <div className="recipe-meta">
                <div className="meta-item">
                    <span className="meta-icon">⏱️</span>
                    <div>
                        <div className="meta-label">Prep</div>
                        <div className="meta-value">{recipe.prepTime}</div>
                    </div>
                </div>
                <div className="meta-item">
                    <span className="meta-icon">🔥</span>
                    <div>
                        <div className="meta-label">Cook</div>
                        <div className="meta-value">{recipe.cookTime}</div>
                    </div>
                </div>
                <div className="meta-item">
                    <span className="meta-icon">👥</span>
                    <div>
                        <div className="meta-label">Servings</div>
                        <div className="meta-value">{recipe.servings}</div>
                    </div>
                </div>
                <div className="meta-item">
                    <span className="meta-icon">📊</span>
                    <div>
                        <div className="meta-label">Level</div>
                        <div className={`meta-value difficulty-${recipe.difficulty.toLowerCase()}`}>
                            {recipe.difficulty}
                        </div>
                    </div>
                </div>
            </div>

            {/* Ingredients Section */}
            <div className="recipe-section">
                <h4 className="section-title">🛒 Ingredients</h4>
                <ul className="ingredients-list">
                    {recipe.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="ingredient-item">
                            <span className="ingredient-bullet">•</span>
                            {ingredient}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Instructions Section */}
            <div className="recipe-section">
                <h4 className="section-title">👨‍🍳 Instructions</h4>
                <div className={`instructions-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
                    <ol className="instructions-list">
                        {recipe.instructions.map((instruction, idx) => (
                            <li key={idx} className="instruction-item">
                                <div className="instruction-number">{idx + 1}</div>
                                <div className="instruction-text">{instruction}</div>
                            </li>
                        ))}
                    </ol>
                </div>

                {recipe.instructions.length > 3 && (
                    <button
                        className="btn-expand"
                        onClick={toggleExpanded}
                    >
                        {isExpanded ? '▲ Show Less' : '▼ Show All Steps'}
                    </button>
                )}
            </div>
        </div>
    )
}

export default RecipeCard
