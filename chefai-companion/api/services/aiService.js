import dotenv from 'dotenv';

dotenv.config();

// Get API keys from environment variables
const geminiKey = process.env.GEMINI_API_KEY;
const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

/**
 * Generate 4-5 recipes based on provided ingredients
 * Uses Gemini API if available, otherwise falls back to OpenRouter
 * @param {Array<string>} ingredients - List of available ingredients
 * @returns {Promise<Array>} Array of recipe objects
 */
export async function generateRecipes(ingredients) {
    // Use Gemini if available, otherwise use OpenRouter
    if (geminiKey) {
        console.log('Using Gemini API...');
        return generateRecipesWithGemini(ingredients);
    } else if (openRouterKey) {
        console.log('Using OpenRouter API...');
        return generateRecipesWithOpenRouter(ingredients);
    } else {
        throw new Error('No API key found. Please add GEMINI_API_KEY or OPENROUTER_API_KEY to your environment variables.');
    }
}

/**
 * Generate recipes using Google Gemini API
 */
async function generateRecipesWithGemini(ingredients) {
    try {
        console.log('Gemini API Key loaded:', geminiKey ? `Yes (starts with: ${geminiKey.substring(0, 10)}...)` : 'No - MISSING!');

        const ingredientList = ingredients.join(', ');

        const prompt = `You are a professional chef assistant. Given these ingredients: ${ingredientList}

Generate exactly 4-5 different creative recipes that can be made using these ingredients. You can assume basic pantry staples like salt, pepper, oil, and water are available.

For each recipe, provide:
1. Recipe name
2. Brief description (1-2 sentences)
3. Complete ingredient list with quantities
4. Step-by-step cooking instructions (numbered)
5. Preparation time
6. Cooking time
7. Difficulty level (Easy/Medium/Hard)
8. Number of servings

Format your response as a JSON array of recipe objects with this exact structure:
[
  {
    "name": "Recipe Name",
    "description": "Brief description",
    "ingredients": [
      "1 cup ingredient1",
      "2 tbsp ingredient2"
    ],
    "instructions": [
      "Step 1 instruction",
      "Step 2 instruction"
    ],
    "prepTime": "15 minutes",
    "cookTime": "30 minutes",
    "difficulty": "Easy",
    "servings": 4
  }
]

Return ONLY the JSON array, no additional text. Do not include markdown formatting like \`\`\`json.`;

        console.log('Sending request to Gemini...');

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4096
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            let errorMessage = `Gemini API Error: ${response.status} - ${errorData}`;

            if (response.status === 400) {
                errorMessage += '\n\n💡 Check your API key format';
            } else if (response.status === 403) {
                errorMessage += '\n\n💡 API key may be invalid or project not enabled';
            } else if (response.status === 429) {
                errorMessage += '\n\n💡 Rate limit exceeded. Please try again later.';
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response format from Gemini');
        }

        const content = data.candidates[0].content.parts[0].text.trim();
        console.log('Received response from Gemini');

        // Parse the JSON response
        let recipes;
        try {
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            recipes = JSON.parse(cleanContent);
        } catch (parseError) {
            console.error('JSON Parse Error. Content received:', content);
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                recipes = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Failed to parse recipe JSON from Gemini response');
            }
        }

        if (!Array.isArray(recipes)) {
            throw new Error('Response is not an array of recipes');
        }

        return recipes.slice(0, 5);

    } catch (error) {
        console.error('Error generating recipes with Gemini:', error);
        throw new Error(`Failed to generate recipes: ${error.message}`);
    }
}

/**
 * Generate recipes using OpenRouter API (fallback)
 */
async function generateRecipesWithOpenRouter(ingredients) {
    try {
        console.log('OpenRouter API Key loaded:', openRouterKey ? `Yes (starts with: ${openRouterKey.substring(0, 15)}...)` : 'No - MISSING!');

        const ingredientList = ingredients.join(', ');

        const prompt = `You are a professional chef assistant. Given these ingredients: ${ingredientList}

Generate exactly 4-5 different creative recipes that can be made using these ingredients. You can assume basic pantry staples like salt, pepper, oil, and water are available.

For each recipe, provide:
1. Recipe name
2. Brief description (1-2 sentences)
3. Complete ingredient list with quantities
4. Step-by-step cooking instructions (numbered)
5. Preparation time
6. Cooking time
7. Difficulty level (Easy/Medium/Hard)
8. Number of servings

Format your response as a JSON array of recipe objects with this exact structure:
[
  {
    "name": "Recipe Name",
    "description": "Brief description",
    "ingredients": [
      "1 cup ingredient1",
      "2 tbsp ingredient2"
    ],
    "instructions": [
      "Step 1 instruction",
      "Step 2 instruction"
    ],
    "prepTime": "15 minutes",
    "cookTime": "30 minutes",
    "difficulty": "Easy",
    "servings": 4
  }
]

Return ONLY the JSON array, no additional text. Do not include markdown formatting like \`\`\`json.`;

        console.log('Sending request to OpenRouter...');

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterKey}`,
                "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
                "X-Title": "ChefAI Companion",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3.3-70b-instruct:free",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            let errorMessage = `OpenRouter API Error: ${response.status} - ${errorData}`;

            if (response.status === 401) {
                errorMessage += '\n\n💡 This usually means:';
                errorMessage += '\n   1. Your API key is invalid or expired';
                errorMessage += '\n   2. Please check your API key at https://openrouter.ai/keys';
            } else if (response.status === 429) {
                errorMessage += '\n\n💡 Rate limit exceeded. Please try again later.';
            } else if (response.status === 402) {
                errorMessage += '\n\n💡 Payment required. Please add credits to your OpenRouter account.';
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from OpenRouter');
        }

        const content = data.choices[0].message.content.trim();
        console.log('Received response from OpenRouter');

        let recipes;
        try {
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            recipes = JSON.parse(cleanContent);
        } catch (parseError) {
            console.error('JSON Parse Error. Content received:', content);
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                recipes = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Failed to parse recipe JSON from OpenRouter response');
            }
        }

        if (!Array.isArray(recipes)) {
            throw new Error('Response is not an array of recipes');
        }

        return recipes.slice(0, 5);

    } catch (error) {
        console.error('Error generating recipes with OpenRouter:', error);
        throw new Error(`Failed to generate recipes: ${error.message}`);
    }
}
