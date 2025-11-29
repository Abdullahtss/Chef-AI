import api from './api';

// API_URL is now handled by the api instance baseURL
// We just need to append the specific endpoint path

// Save a recipe
export const saveRecipe = async (recipe) => {
    const response = await api.post('/user/recipes/save', { recipe });
    return response.data;
};

// Toggle favorite recipe
export const favoriteRecipe = async (recipe) => {
    const response = await api.post('/user/recipes/favorite', { recipe });
    return response.data;
};

// Get saved recipes
export const getSavedRecipes = async () => {
    const response = await api.get('/user/recipes/saved');
    return response.data;
};

// Get favorite recipes
export const getFavoriteRecipes = async () => {
    const response = await api.get('/user/recipes/favorites');
    return response.data;
};

// Delete saved recipe
export const deleteSavedRecipe = async (recipeId) => {
    const response = await api.delete(`/user/recipes/saved/${recipeId}`);
    return response.data;
};

// Delete favorite recipe
export const deleteFavoriteRecipe = async (recipeId) => {
    const response = await api.delete(`/user/recipes/favorites/${recipeId}`);
    return response.data;
};

export default {
    saveRecipe,
    favoriteRecipe,
    getSavedRecipes,
    getFavoriteRecipes,
    deleteSavedRecipe,
    deleteFavoriteRecipe
};
