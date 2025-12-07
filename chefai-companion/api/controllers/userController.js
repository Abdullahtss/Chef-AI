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

// @desc    Save a meal plan
// @route   POST /api/user/meal-plans/save
// @access  Private
export const saveMealPlan = async (req, res) => {
    try {
        const { mealPlan, title } = req.body;
        const userId = req.userId;

        if (!mealPlan) {
            return res.status(400).json({
                success: false,
                message: 'Meal plan data is required'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate unique meal plan ID
        const mealPlanId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create title if not provided
        const planTitle = title || `Meal Plan - ${mealPlan.summary?.totalDays || 'N'} Days`;

        // Add meal plan to saved meal plans
        user.savedMealPlans.push({
            mealPlanId,
            title: planTitle,
            summary: mealPlan.summary || {},
            mealPlan: mealPlan,
            savedAt: new Date()
        });

        await user.save();

        res.json({
            success: true,
            message: 'Meal plan saved successfully',
            mealPlan: user.savedMealPlans[user.savedMealPlans.length - 1]
        });
    } catch (error) {
        console.error('Save meal plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving meal plan',
            error: error.message
        });
    }
};

// @desc    Get saved meal plans
// @route   GET /api/user/meal-plans/saved
// @access  Private
export const getSavedMealPlans = async (req, res) => {
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
            mealPlans: user.savedMealPlans
        });
    } catch (error) {
        console.error('Get saved meal plans error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching saved meal plans',
            error: error.message
        });
    }
};

// @desc    Delete a saved meal plan
// @route   DELETE /api/user/meal-plans/saved/:mealPlanId
// @access  Private
export const deleteSavedMealPlan = async (req, res) => {
    try {
        const { mealPlanId } = req.params;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.savedMealPlans = user.savedMealPlans.filter(mp => mp.mealPlanId !== mealPlanId);
        await user.save();

        res.json({
            success: true,
            message: 'Meal plan deleted successfully'
        });
    } catch (error) {
        console.error('Delete saved meal plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting meal plan',
            error: error.message
        });
    }
};

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                darkMode: user.darkMode || false,
                authProvider: user.authProvider
            }
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const { name, avatar, darkMode } = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields if provided
        if (name !== undefined) {
            user.name = name.trim();
        }
        if (avatar !== undefined) {
            // Allow null or empty string to remove avatar
            user.avatar = avatar || null;
        }
        if (darkMode !== undefined) {
            user.darkMode = darkMode;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                darkMode: user.darkMode,
                authProvider: user.authProvider
            }
        });
    } catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// @desc    Change user password
// @route   PUT /api/user/change-password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.userId).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user has a password (not Google OAuth user)
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: 'Password change not available for Google OAuth users'
            });
        }

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both current and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
};