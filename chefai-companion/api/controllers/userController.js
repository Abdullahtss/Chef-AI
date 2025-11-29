import User from '../models/User.js';

// @desc    Save a recipe to user's saved recipes
// @route   POST /api/user/recipes/save
// @access  Private
export const saveRecipe = async (req, res) => {
    try {
        const { recipe } = req.body;
        const userId = req.userId;

        if (!recipe) {
            return res.status(400).json({
                success: false,
                message: 'Recipe data is required'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate unique recipe ID
        const recipeId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Check if recipe already saved
        const alreadySaved = user.savedRecipes.some(r => r.name === recipe.name);
        if (alreadySaved) {
            return res.status(400).json({
                success: false,
                message: 'Recipe already saved'
            });
        }

        // Add recipe to saved recipes
        user.savedRecipes.push({
            recipeId,
            ...recipe,
            savedAt: new Date()
        });

        await user.save();

        res.json({
            success: true,
            message: 'Recipe saved successfully',
            recipe: user.savedRecipes[user.savedRecipes.length - 1]
        });
    } catch (error) {
        console.error('Save recipe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving recipe',
            error: error.message
        });
    }
};

// @desc    Add recipe to favorites
// @route   POST /api/user/recipes/favorite
// @access  Private
export const favoriteRecipe = async (req, res) => {
    try {
        const { recipe } = req.body;
        const userId = req.userId;

        if (!recipe) {
            return res.status(400).json({
                success: false,
                message: 'Recipe data is required'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate unique recipe ID
        const recipeId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Check if recipe already in favorites
        const alreadyFavorited = user.favoriteRecipes.some(r => r.name === recipe.name);

        if (alreadyFavorited) {
            // Remove from favorites (toggle)
            user.favoriteRecipes = user.favoriteRecipes.filter(r => r.name !== recipe.name);
            await user.save();

            return res.json({
                success: true,
                message: 'Recipe removed from favorites',
                favorited: false
            });
        }

        // Add to favorites
        user.favoriteRecipes.push({
            recipeId,
            ...recipe,
            favoritedAt: new Date()
        });

        await user.save();

        res.json({
            success: true,
            message: 'Recipe added to favorites',
            favorited: true,
            recipe: user.favoriteRecipes[user.favoriteRecipes.length - 1]
        });
    } catch (error) {
        console.error('Favorite recipe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error favoriting recipe',
            error: error.message
        });
    }
};

// @desc    Get saved recipes
// @route   GET /api/user/recipes/saved
// @access  Private
export const getSavedRecipes = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            recipes: user.savedRecipes
        });
    } catch (error) {
        console.error('Get saved recipes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching saved recipes',
            error: error.message
        });
    }
};

// @desc    Get favorite recipes
// @route   GET /api/user/recipes/favorites
// @access  Private
export const getFavoriteRecipes = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            recipes: user.favoriteRecipes
        });
    } catch (error) {
        console.error('Get favorite recipes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching favorite recipes',
            error: error.message
        });
    }
};

// @desc    Delete a saved recipe
// @route   DELETE /api/user/recipes/saved/:recipeId
// @access  Private
export const deleteSavedRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.savedRecipes = user.savedRecipes.filter(r => r.recipeId !== recipeId);
        await user.save();

        res.json({
            success: true,
            message: 'Recipe deleted successfully'
        });
    } catch (error) {
        console.error('Delete saved recipe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting recipe',
            error: error.message
        });
    }
};

// @desc    Delete a favorite recipe
// @route   DELETE /api/user/recipes/favorites/:recipeId
// @access  Private
export const deleteFavoriteRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.favoriteRecipes = user.favoriteRecipes.filter(r => r.recipeId !== recipeId);
        await user.save();

        res.json({
            success: true,
            message: 'Recipe removed from favorites'
        });
    } catch (error) {
        console.error('Delete favorite recipe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing recipe from favorites',
            error: error.message
        });
    }
};
