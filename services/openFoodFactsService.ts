import { FoodItem } from '../types';

// A type for the relevant parts of the Open Food Facts API response
interface OpenFoodFactsResponse {
  status: number;
  product?: {
    product_name?: string;
    product_name_en?: string;
    serving_size?: string;
    nutriments?: {
      'energy-kcal_serving'?: number;
      'energy-kcal'?: number; // Often per 100g
    };
  };
}

/**
 * Fetches product information from the Open Food Facts API using a barcode.
 * @param barcode The EAN/UPC barcode string.
 * @returns A promise that resolves to a FoodItem or null if not found.
 */
export async function getProductByBarcode(barcode: string): Promise<FoodItem | null> {
  const apiUrl = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data: OpenFoodFactsResponse = await response.json();

    if (data.status === 0 || !data.product) {
      console.log(`Product with barcode ${barcode} not found in Open Food Facts.`);
      return null;
    }

    const { product } = data;
    const calories = product.nutriments?.['energy-kcal_serving'] ?? product.nutriments?.['energy-kcal'] ?? null;

    if (!calories) {
        console.log(`Product ${barcode} found, but no calorie data available.`);
        return null;
    }

    const foodItem: FoodItem = {
      name: product.product_name_en || product.product_name || 'Scanned Item',
      serving_label: product.serving_size || '1 serving',
      calories_kcal: Math.round(calories),
      eat_minutes: 5, // A reasonable default, user can adjust
      servings: 1,
      base_calories_kcal: Math.round(calories),
      base_eat_minutes: 5,
    };

    return foodItem;

  } catch (error) {
    console.error(`Error fetching data for barcode ${barcode}:`, error);
    return null;
  }
}
