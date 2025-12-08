import dotenv from 'dotenv';

dotenv.config();

/**
 * Generate 4-5 recipes based on provided ingredients using Groq API
 * @param {Array<string>} ingredients - List of available ingredients
 * @returns {Promise<Array>} Array of recipe objects
 */
export async function generateRecipes(ingredients) {
    // Get API key at runtime
    const groqKey = process.env.GROQ_API_KEY;

    console.log('=== Recipe Generation ===');
    console.log('GROQ_API_KEY available:', !!groqKey);
    console.log('Ingredients:', ingredients);

    if (!groqKey) {
        throw new Error('GROQ_API_KEY is not configured');
    }

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

Return ONLY the JSON array, no additional text. Do not include markdown formatting.`;

    console.log('Sending request to Groq API...');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 4096
        })
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error('Groq API Error:', response.status, errorData);
        throw new Error(`Groq API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('Received response from Groq API');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Groq');
    }

    const content = data.choices[0].message.content.trim();

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
            throw new Error('Failed to parse recipe JSON from Groq response');
        }
    }

    if (!Array.isArray(recipes)) {
        throw new Error('Response is not an array of recipes');
    }

    console.log(`Successfully generated ${recipes.length} recipes`);
    return recipes.slice(0, 5);
}
