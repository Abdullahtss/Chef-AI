import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getSavedRecipes, getFavoriteRecipes, deleteSavedRecipe, deleteFavoriteRecipe } from '../services/userService';
import RecipeCard from '../components/RecipeCard';
import './Home.css';

function Home() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            const [savedRes, favoriteRes] = await Promise.all([
                getSavedRecipes(),
                getFavoriteRecipes()
            ]);

            if (savedRes.success) {
                setSavedRecipes(savedRes.recipes);
            }

            if (favoriteRes.success) {
                setFavoriteRecipes(favoriteRes.recipes);
            }
        } catch (err) {
            console.error('Error fetching recipes:', err);
            setError('Failed to load your recipes');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDelete = async (recipeId, type) => {
        try {
            if (type === 'saved') {
                await deleteSavedRecipe(recipeId);
                setSavedRecipes(savedRecipes.filter(r => r.recipeId !== recipeId));
            } else {
                await deleteFavoriteRecipe(recipeId);
                setFavoriteRecipes(favoriteRecipes.filter(r => r.recipeId !== recipeId));
            }
        } catch (err) {
            console.error('Error deleting recipe:', err);
        }
    };

    return (
        <div className="home-page">
            <header className="home-header">
                <div className="container">
                    <div className="header-top">
                        <div className="logo-section">
                            <h1 className="logo">
                                <span className="logo-icon">👨‍🍳</span>
                                ChefAI Companion
                            </h1>
                        </div>
                        <div className="user-actions">
                            <Link to="/recipes" className="btn btn-secondary">
                                Generate Recipes
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline">
                                Logout
                            </button>
                        </div>
                    </div>
                    <div className="welcome-section">
                        <h2>Welcome back, {user?.name}! 👋</h2>
                        <p>Here are your saved and favorite recipes</p>
                    </div>
                </div>
            </header>

            <main className="home-main">
                <div className="container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner-large"></div>
                            <p>Loading your recipes...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <span>⚠️</span>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <>
                            {/* Favorite Recipes Section */}
                            <section className="recipe-section">
                                <h3 className="section-title">
                                    <span>❤️ Favorite Recipes ({favoriteRecipes.length})</span>
                                </h3>
                                {favoriteRecipes.length > 0 ? (
                                    <div className="recipes-grid">
                                        {favoriteRecipes.map((recipe) => (
                                            <div key={recipe.recipeId} className="recipe-wrapper">
                                                <RecipeCard recipe={recipe} index={0} hideActions={true} />
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(recipe.recipeId, 'favorite')}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <p>No favorite recipes yet. Start by generating some recipes!</p>
                                        <Link to="/recipes" className="btn btn-primary">
                                            Generate Recipes
                                        </Link>
                                    </div>
                                )}
                            </section>

                            {/* Saved Recipes Section */}
                            <section className="recipe-section">
                                <h3 className="section-title">
                                    <span>📌 Saved Recipes ({savedRecipes.length})</span>
                                </h3>
                                {savedRecipes.length > 0 ? (
                                    <div className="recipes-grid">
                                        {savedRecipes.map((recipe) => (
                                            <div key={recipe.recipeId} className="recipe-wrapper">
                                                <RecipeCard recipe={recipe} index={0} hideActions={true} />
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(recipe.recipeId, 'saved')}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <p>No saved recipes yet. Start by generating some recipes!</p>
                                        <Link to="/recipes" className="btn btn-primary">
                                            Generate Recipes
                                        </Link>
                                    </div>
                                )}
                            </section>
                        </>
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

export default Home;
