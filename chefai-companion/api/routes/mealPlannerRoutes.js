import express from 'express';
import { generateMealPlanHandler } from '../controllers/mealPlannerController.js';

const router = express.Router();

// POST /api/meal-planner/generate - Generate meal plan
router.post('/generate', generateMealPlanHandler);

export default router;

