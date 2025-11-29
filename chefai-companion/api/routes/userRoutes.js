import express from 'express';
import {
    saveRecipe,
    favoriteRecipe,
    getSavedRecipes,
    getFavoriteRecipes,
    deleteSavedRecipe,
    deleteFavoriteRecipe
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

export default router;
