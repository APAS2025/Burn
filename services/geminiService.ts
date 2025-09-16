

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
- Accept a JSON \`Scenario\` describing 3+ foods, user weight (optional), preferred activity (optional), and app options (e.g., multi-serving, annualized impact).
- Validate inputs, fill sensible defaults, compute burn times and steps with science-based formulas (MET-based).
- The MET formula is: \`minutes = calories_kcal * 200 / (MET * 3.5 * weight_kg)\`.
- If weight is missing, use default 75 kg. If activity is missing, use 'walking_3_mph'.
- Calculate steps: if speed_mph is available, \`miles = burn_minutes * speed_mph / 60\`, then \`steps = miles * steps_per_mile\`. Otherwise, use the fallback: \`100 kcal ≈ 2000 steps\`.
- Populate all fields in the provided JSON schema, including shock factors, annualized impact, educational content, and a detailed markdown report.
- If the 'include_education' option is true, also generate an 'education_summary' in the 'report' object. This should be a short, encouraging paragraph summarizing the key educational takeaways from the food items.
- Crucially, you must also return the original \`options\` object from the input \`Scenario\` within the \`Computation\` object.
- Return a strictly valid JSON \`Computation\` result and a human-readable report.
- Never hallucinate facts; when data is missing, apply the provided defaults.
- Include a “shareable_card_text” string for each food and the combined total. For all "shareable_card_text" fields, the text should start with "My Enzark Reality Check:".
- Your entire response MUST be a single JSON object matching the schema.`;

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
        description: "A reasonable serving label for this item, e.g., '1 cup', '1 medium apple'."
      },
      calories_kcal: {
        type: Type.NUMBER,
        description: "The estimated number of calories in kcal for the serving."
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
  
  const systemInstruction = `You are a food identification and calorie estimation expert.
- Analyze the user-provided image of food.
- Identify all distinct food items visible.
- For each item, provide a reasonable estimate for its name, serving size, calorie count (in kcal), and the time it would take to eat it in minutes.
- If multiple items are present, return an array of objects.
- If no food is identifiable, return an empty array.
- Your response MUST be a JSON array of food items matching the provided schema. Do not return any other text or formatting.
- If you are unsure about an item, make a best-guess estimate.
- Use the defaultEatMinutes value for eat_minutes if you cannot determine a more accurate time.`;

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = {
    text: `Identify the food in this image. Use a default eating time of ${defaultEatMinutes} minutes if a more specific one isn't obvious.`
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
    const result = JSON.parse(jsonText);
    return result as FoodItem[];
  } catch (error) {
    console.error("Gemini image analysis failed:", error);
    throw new Error("Failed to analyze food from image.");
  }
}