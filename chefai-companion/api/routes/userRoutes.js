import express from 'express';
import {
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
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.post('/recipes/save', auth, saveRecipe);
router.post('/recipes/favorite', auth, favoriteRecipe);
router.get('/recipes/saved', auth, getSavedRecipes);
router.get('/recipes/favorites', auth, getFavoriteRecipes);
router.delete('/recipes/saved/:recipeId', auth, deleteSavedRecipe);
router.delete('/recipes/favorites/:recipeId', auth, deleteFavoriteRecipe);

// Meal Plan routes
router.post('/meal-plans/save', auth, saveMealPlan);
router.get('/meal-plans/saved', auth, getSavedMealPlans);
router.delete('/meal-plans/saved/:mealPlanId', auth, deleteSavedMealPlan);

// Profile routes
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);
router.put('/change-password', auth, changePassword);

export default router;
