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

// Save a meal plan
export const saveMealPlan = async (mealPlan, title) => {
    const response = await api.post('/user/meal-plans/save', { mealPlan, title });
    return response.data;
};

// Get saved meal plans
export const getSavedMealPlans = async () => {
    const response = await api.get('/user/meal-plans/saved');
    return response.data;
};

// Delete saved meal plan
export const deleteSavedMealPlan = async (mealPlanId) => {
    const response = await api.delete(`/user/meal-plans/saved/${mealPlanId}`);
    return response.data;
};

// Get user profile
export const getUserProfile = async () => {
    const response = await api.get('/user/profile');
    return response.data;
};

// Update user profile
export const updateUserProfile = async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
    const response = await api.put('/user/change-password', {
        currentPassword,
        newPassword
    });
    return response.data;
};

export default {
    saveRecipe,
    favoriteRecipe,
    getSavedRecipes,
    getFavoriteRecipes,
    deleteSavedRecipe,
    deleteFavoriteRecipe,
    saveMealPlan,
    getSavedMealPlans,
    deleteSavedMealPlan,
    getUserProfile,
    updateUserProfile,
    changePassword
};
