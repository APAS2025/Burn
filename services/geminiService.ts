

import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, Computation, FoodItem } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const computationSchema = {
  type: Type.OBJECT,
  properties: {
    meta: {
      type: Type.OBJECT,
      properties: {
        version: { type: Type.STRING },
        defaults: {
          type: Type.OBJECT,
          properties: {
            weight_kg: { type: Type.NUMBER },
            steps_per_mile: { type: Type.NUMBER },
            calories_per_pound: { type: Type.NUMBER },
          },
        },
        activity_profile: {
          type: Type.OBJECT,
          properties: {
            activity_key: { type: Type.STRING },
            met: { type: Type.NUMBER },
            speed_mph: { type: Type.NUMBER, nullable: true },
          },
        },
      },
    },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          serving_label: { type: Type.STRING },
          calories_kcal: { type: Type.NUMBER },
          eat_minutes: { type: Type.NUMBER },
          burn_minutes: { type: Type.NUMBER },
          burn_steps: { type: Type.NUMBER },
          minutes_to_eat_vs_burn_ratio: { type: Type.NUMBER },
          shock_factor: {
            type: Type.OBJECT,
            properties: {
              servings_multiplier: { type: Type.NUMBER },
              calories_kcal: { type: Type.NUMBER },
              burn_minutes: { type: Type.NUMBER },
              burn_steps: { type: Type.NUMBER },
            },
          },
          annualized: {
            type: Type.OBJECT,
            properties: {
              days_per_year: { type: Type.NUMBER },
              calories_kcal: { type: Type.NUMBER },
              pounds_equiv: { type: Type.NUMBER },
            },
          },
          education: {
            type: Type.OBJECT,
            properties: {
              satiety_flag: { type: Type.STRING },
              suggested_swap: { type: Type.STRING },
            },
          },
          contextual_anchors: {
            type: Type.OBJECT,
            properties: {
              time_equivalent: { type: Type.STRING },
              steps_equivalent_of_daily_goal: { type: Type.STRING },
            },
          },
          shareable_card_text: { type: Type.STRING },
        },
      },
    },
    totals: {
      type: Type.OBJECT,
      properties: {
        foods_count: { type: Type.NUMBER },
        calories_kcal: { type: Type.NUMBER },
        eat_minutes: { type: Type.NUMBER },
        burn_minutes: { type: Type.NUMBER },
        burn_steps: { type: Type.NUMBER },
        annualized: {
          type: Type.OBJECT,
          properties: {
            days_per_year: { type: Type.NUMBER },
            calories_kcal: { type: Type.NUMBER },
            pounds_equiv: { type: Type.NUMBER },
          },
        },
        shareable_card_text: { type: Type.STRING },
      },
    },
    report: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        summary: { type: Type.STRING },
        details_markdown: { type: Type.STRING },
        education_summary: { type: Type.STRING, nullable: true },
      },
    },
    options: {
      type: Type.OBJECT,
      properties: {
        include_personalization: { type: Type.BOOLEAN },
        include_shock_factor: { type: Type.BOOLEAN },
        include_education: { type: Type.BOOLEAN },
        include_visual_hints: { type: Type.BOOLEAN },
        servings_multiplier: { type: Type.NUMBER },
        days_per_year: { type: Type.NUMBER },
      },
    },
    warnings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      nullable: true
    }
  },
};


export async function getCalorieAnalysis(scenario: Scenario): Promise<Computation> {
  const model = 'gemini-2.5-flash';
  
  const systemInstruction = `You are an app back-end for the “Eat in Minutes, Burn in Hours” experience.
- The report title MUST be "Your Reality Check".
- The report summary should be direct and motivational, starting with "Enzark recommends: Here's the breakdown...".
- Accept a JSON \`Scenario\` describing foods, user data, and options.
- Validate inputs, fill sensible defaults, compute burn times and steps with science-based formulas (MET-based).
- The MET formula is: \`minutes = calories_kcal * 200 / (MET * 3.5 * weight_kg)\`.
- If weight is missing, use default 75 kg. If activity is missing, use 'walking_3_mph'.
- Calculate steps: if speed_mph is available, use it. Otherwise, use the fallback: \`100 kcal ≈ 2000 steps\`.
- Populate all fields in the provided JSON schema. Crucially, you must also return the original \`options\` object from the input \`Scenario\`.
- Include a “shareable_card_text” string for each food and the total. It should start with "My Enzark Reality Check:" and summarize the key findings. If the user's name is provided in \`scenario.user.name\`, you must include it in the text. Also mention the activity used for the calculation.
- Your entire response MUST be a single JSON object matching the schema.

**Markdown Report Generation:**
The \`report.details_markdown\` field is critical. It must be a comprehensive, human-readable report formatted with markdown.
The markdown report MUST include:
1.  The \`report.title\` as a main heading ('#').
2.  The \`report.summary\`.
3.  A section titled '## Detailed Food Breakdown'.
4.  Under this section, create a subsection for EACH food item (e.g., '### 1. Chocolate Chip Cookie').
5.  For each food item, you MUST present all the calculated data points in a clear, engaging way. Use bold text for labels and values. For example:
    - **Core Metrics**: [calories_kcal] kcal | **Eat Time**: [eat_minutes] min | **Burn Time**: [burn_minutes] min
    - **Shock Factor**: If you ate this **[shock_factor.servings_multiplier]** times, it would be **[shock_factor.calories_kcal]** calories and take **[shock_factor.burn_minutes]** minutes to burn.
    - **Annualized Impact**: Eating this **[annualized.days_per_year]** times a year could contribute to a weight gain of **[annualized.pounds_equiv]** pounds.
    - **Educational Insight**: This food has a **[education.satiety_flag]**. A healthier swap could be: **[education.suggested_swap]**.
    - **Contextual Anchors**: Burning this off is like **[contextual_anchors.time_equivalent]**. The steps required are **[contextual_anchors.steps_equivalent_of_daily_goal]** of a standard daily goal.
6.  If 'include_education' is true, conclude the markdown with a final section '## Key Takeaways' containing the \`report.education_summary\`.`;

  const prompt = `Based on the following scenario, please generate the full Computation object: ${JSON.stringify(scenario, null, 2)}`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: computationSchema
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as Computation;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
}

const foodItemsSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { 
        type: Type.STRING,
        description: "The identified name of the food item."
      },
      serving_label: {
        type: Type.STRING,
        description: "A reasonable serving label for this item, including an estimated quantity/weight. E.g., '1 cup (~200g)', '8 oz steak'."
      },
      calories_kcal: {
        type: Type.NUMBER,
        description: "The estimated number of calories in kcal for the identified serving."
      },
      eat_minutes: {
        type: Type.NUMBER,
        description: "A reasonable estimate of the number of minutes it would take to eat this item."
      }
    },
    required: ["name", "serving_label", "calories_kcal", "eat_minutes"]
  }
};

export async function getFoodAnalysisFromImage(base64Image: string, defaultEatMinutes: number): Promise<FoodItem[]> {
  const model = 'gemini-2.5-flash';
  
  const systemInstruction = `You are a food identification and nutritional estimation expert. Your task is to analyze images of food and return structured JSON data.

**Core Instructions:**
- Analyze the user-provided image to identify all distinct food items.
- For each item, you MUST provide a reasonable, real-world estimate for its quantity, weight, or volume. This is critical.
- Based on this quantity, provide estimates for its name, calorie count (in kcal), and the time it would take to eat it.
- Your response MUST be a JSON array of food items matching the provided schema. Do not return any other text or formatting.
- If multiple items are present, return an array of objects, one for each item.
- If no food is identifiable, return an empty array.
- If you are unsure about an item, make a best-guess estimate based on visual cues.
- Use the user-provided 'defaultEatMinutes' value for 'eat_minutes' only if you cannot determine a more accurate time.

**Few-Shot Examples (for quality and format guidance):**

*   **Example 1: Image of a single apple.**
    *   Expected JSON output:
        \`\`\`json
        [
          {
            "name": "Apple",
            "serving_label": "1 medium (~182g)",
            "calories_kcal": 95,
            "eat_minutes": 5
          }
        ]
        \`\`\`

*   **Example 2: Image of a burger and a side of fries.**
    *   Expected JSON output:
        \`\`\`json
        [
          {
            "name": "Cheeseburger",
            "serving_label": "1 burger (~250g)",
            "calories_kcal": 450,
            "eat_minutes": 8
          },
          {
            "name": "French Fries",
            "serving_label": "1 medium serving (~117g)",
            "calories_kcal": 320,
            "eat_minutes": 6
          }
        ]
        \`\`\`

*   **Example 3: Image of a can of soda.**
    *   Expected JSON output:
        \`\`\`json
        [
          {
            "name": "Cola Soda",
            "serving_label": "1 can (12 oz)",
            "calories_kcal": 140,
            "eat_minutes": 2
          }
        ]
        \`\`\`

*   **Example 4: Image of a complex dish like a bowl of ramen.**
    *   Expected JSON output (identify as a single dish with estimated size):
        \`\`\`json
        [
          {
            "name": "Ramen Noodle Soup",
            "serving_label": "1 large bowl (~500g)",
            "calories_kcal": 550,
            "eat_minutes": 15
          }
        ]
        \`\`\`
`;

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = {
    text: `Identify the food in this image. For each item, estimate the quantity/weight and include it in the serving_label. Use a default eating time of ${defaultEatMinutes} minutes if a more specific one isn't obvious.`
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: foodItemsSchema
      }
    });

    const jsonText = response.text.trim();
    const analyzedFoods: Pick<FoodItem, 'name' | 'serving_label' | 'calories_kcal' | 'eat_minutes'>[] = JSON.parse(jsonText);
    
    const fullFoodItems: FoodItem[] = analyzedFoods.map(food => ({
      ...food,
      servings: 1,
      base_calories_kcal: food.calories_kcal,
      base_eat_minutes: food.eat_minutes,
    }));
    
    return fullFoodItems;
  } catch (error) {
    console.error("Gemini image analysis failed:", error);
    throw new Error("Failed to analyze food from image.");
  }
}
