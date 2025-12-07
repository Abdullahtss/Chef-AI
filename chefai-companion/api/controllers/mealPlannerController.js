import { generateMealPlan } from '../services/mealPlannerService.js';

/**
 * Generate meal plan based on user preferences
 * POST /api/meal-planner/generate
 * Body: {
 *   dietaryRestrictions: ["Vegetarian", "Gluten-Free"],
 *   dailyCalorieGoal: 2000,
 *   numberOfDays: 7,
 *   mealsPerDay: 3,
 *   cuisinePreference: "Italian"
 * }
 */
export async function generateMealPlanHandler(req, res) {
    try {
        const {
            dietaryRestrictions = [],
            dailyCalorieGoal,
            numberOfDays,
            mealsPerDay,
            cuisinePreference = 'Any'
        } = req.body;

        // Validation
        if (!dailyCalorieGoal || typeof dailyCalorieGoal !== 'number' || dailyCalorieGoal < 500 || dailyCalorieGoal > 10000) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Daily calorie goal must be a number between 500 and 10000'
            });
        }

        if (!numberOfDays || typeof numberOfDays !== 'number' || numberOfDays < 1 || numberOfDays > 30) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Number of days must be between 1 and 30'
            });
        }

        if (!mealsPerDay || typeof mealsPerDay !== 'number' || mealsPerDay < 1 || mealsPerDay > 6) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Meals per day must be between 1 and 6'
            });
        }

        if (!Array.isArray(dietaryRestrictions)) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Dietary restrictions must be an array'
            });
        }

        console.log(`Generating meal plan: ${numberOfDays} days, ${mealsPerDay} meals/day, ${dailyCalorieGoal} calories/day`);

        // Generate meal plan using Groq API
        const mealPlan = await generateMealPlan({
            dietaryRestrictions,
            dailyCalorieGoal,
            numberOfDays,
            mealsPerDay,
            cuisinePreference
        });

        res.json({
            success: true,
            mealPlan: mealPlan
        });

    } catch (error) {
        console.error('Error in generateMealPlanHandler:', error);
        res.status(500).json({
            error: 'Failed to generate meal plan',
            message: error.message
        });
    }
}

