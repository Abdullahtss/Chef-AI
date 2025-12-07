import dotenv from 'dotenv';

dotenv.config();

// Groq API key - must be set in environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
    console.warn('Warning: GROQ_API_KEY is not set in environment variables');
}

/**
 * Generate a meal plan using Groq API
 * @param {Object} preferences - Meal planning preferences
 * @param {Array<string>} preferences.dietaryRestrictions - List of dietary restrictions
 * @param {number} preferences.dailyCalorieGoal - Daily calorie goal
 * @param {number} preferences.numberOfDays - Number of days for the meal plan
 * @param {number} preferences.mealsPerDay - Number of meals per day
 * @param {string} preferences.cuisinePreference - Preferred cuisine type
 * @returns {Promise<Object>} Meal plan object
 */
export async function generateMealPlan(preferences) {
    try {
        const {
            dietaryRestrictions = [],
            dailyCalorieGoal,
            numberOfDays,
            mealsPerDay,
            cuisinePreference
        } = preferences;

        if (!dailyCalorieGoal || !numberOfDays || !mealsPerDay) {
            throw new Error('Missing required meal plan parameters');
        }

        const restrictionsText = dietaryRestrictions.length > 0
            ? `Dietary Restrictions: ${dietaryRestrictions.join(', ')}. `
            : 'No specific dietary restrictions. ';

        const cuisineText = cuisinePreference && cuisinePreference !== 'Any'
            ? `Cuisine Preference: ${cuisinePreference}. `
            : 'Any cuisine type is acceptable. ';

        const prompt = `You are a professional nutritionist and meal planning expert. Create a detailed ${numberOfDays}-day meal plan with ${mealsPerDay} meals per day.

Requirements:
- Daily Calorie Goal: ${dailyCalorieGoal} calories per day
- ${restrictionsText}
- ${cuisineText}
- Each day should have exactly ${mealsPerDay} meals
- Meals should be balanced and nutritious
- Include variety across the ${numberOfDays} days

For each meal, provide:
1. Meal name
2. Description (1-2 sentences)
3. Ingredients list with quantities
4. Preparation instructions (step-by-step)
5. Calories per serving
6. Macros breakdown (protein, carbs, fats in grams)
7. Prep time
8. Cook time (if applicable)

Format your response as a JSON object with this exact structure:
{
  "summary": {
    "totalDays": ${numberOfDays},
    "mealsPerDay": ${mealsPerDay},
    "dailyCalorieGoal": ${dailyCalorieGoal},
    "dietaryRestrictions": ${JSON.stringify(dietaryRestrictions)},
    "cuisinePreference": "${cuisinePreference || 'Any'}"
  },
  "mealPlan": [
    {
      "day": 1,
      "date": "Day 1",
      "meals": [
        {
          "mealType": "Breakfast",
          "name": "Meal Name",
          "description": "Brief description",
          "ingredients": [
            "1 cup ingredient1",
            "2 tbsp ingredient2"
          ],
          "instructions": [
            "Step 1 instruction",
            "Step 2 instruction"
          ],
          "calories": 500,
          "macros": {
            "protein": 30,
            "carbs": 50,
            "fats": 20
          },
          "prepTime": "10 minutes",
          "cookTime": "20 minutes"
        }
      ],
      "dailyTotal": {
        "calories": ${dailyCalorieGoal},
        "protein": 0,
        "carbs": 0,
        "fats": 0
      }
    }
  ]
}

Return ONLY the JSON object, no additional text. Do not include markdown formatting like \`\`\`json.`;

        console.log('Sending request to Groq API...');

        // Using llama-3.3-70b-versatile (replacement for decommissioned llama-3.1-70b-versatile)
        // Alternative models: 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma-7b-it'
        const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 8000
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            let errorMessage = `Groq API Error: ${response.status} - ${errorData}`;
            
            if (response.status === 401) {
                errorMessage += '\n\n💡 This usually means your API key is invalid or expired.';
            } else if (response.status === 429) {
                errorMessage += '\n\n💡 Rate limit exceeded. Please try again later.';
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from Groq API');
        }

        const content = data.choices[0].message.content.trim();
        console.log('Received response from Groq API');

        // Parse the JSON response
        let mealPlan;
        try {
            // Clean up markdown code blocks if present
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            mealPlan = JSON.parse(cleanContent);
        } catch (parseError) {
            console.error('JSON Parse Error. Content received:', content);
            // Try to extract JSON object
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                mealPlan = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Failed to parse meal plan JSON from Groq response');
            }
        }

        // Validate meal plan structure
        if (!mealPlan.mealPlan || !Array.isArray(mealPlan.mealPlan)) {
            throw new Error('Invalid meal plan structure received');
        }

        return mealPlan;

    } catch (error) {
        console.error('Error generating meal plan:', error);
        throw new Error(`Failed to generate meal plan: ${error.message}`);
    }
}

