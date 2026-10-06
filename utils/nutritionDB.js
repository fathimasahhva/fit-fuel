/**
 * Built-in nutrition database (per 100g unless noted)
 * Used when USDA API key is unavailable, and for common Indian staples.
 * Values approximate USDA / IFCT references.
 */
const nutritionDB = [

  // Rice & Grains
  { name: 'Plain Cooked Rice', aliases: ['rice', 'steamed rice', 'white rice', 'boiled rice', 'basmati', 'chor'], calories: 205, protein: 4.3, carbs: 45, fat: 0.4, serving: '1 cup (~150g)' },
  { name: 'Brown Rice', aliases: ['cooked brown rice'], calories: 216, protein: 5, carbs: 45, fat: 1.8, serving: '1 cup (~195g)' },
  { name: 'Chapati', aliases: ['roti', 'phulka', 'chappathi', 'whole wheat roti'], calories: 120, protein: 3, carbs: 22, fat: 2.5, serving: '1 piece (~40g)' },
  { name: 'Idli', aliases: ['idly'], calories: 39, protein: 2, carbs: 8, fat: 0.1, serving: '1 piece (~40g)' },
  { name: 'Plain Dosa', aliases: ['dosa', 'plain dosa', 'sada dosa'], calories: 133, protein: 2.7, carbs: 17, fat: 6, serving: '1 piece (~80g)' },
  { name: 'Masala Dosa', aliases: ['masala dosai'], calories: 210, protein: 4, carbs: 28, fat: 9, serving: '1 piece (~120g)' },
  { name: 'Appam', aliases: ['palappam'], calories: 120, protein: 2, carbs: 22, fat: 2, serving: '1 piece (~60g)' },
  { name: 'Puttu', aliases: ['pittu', 'ariputtu'], calories: 240, protein: 4, carbs: 50, fat: 2, serving: '1 cylinder (~150g)' },
  { name: 'Poha', aliases: ['flattened rice', 'aval'], calories: 250, protein: 5, carbs: 40, fat: 8, serving: '1 cup (~150g)' },
  { name: 'Upma', aliases: ['rava upma', 'uppumavu'], calories: 220, protein: 5, carbs: 35, fat: 7, serving: '1 cup (~150g)' },
  { name: 'Oatmeal', aliases: ['oats', 'cooked oats'], calories: 166, protein: 6, carbs: 28, fat: 3.6, serving: '1 cup (~234g)' },
  { name: 'White Bread', aliases: ['bread'], calories: 75, protein: 2.6, carbs: 14, fat: 1, serving: '1 slice (~28g)' },
  { name: 'Whole Wheat Bread', aliases: ['brown bread'], calories: 69, protein: 3.6, carbs: 12, fat: 1, serving: '1 slice (~28g)' },
  { name: 'Pasta', aliases: ['cooked pasta', 'noodles'], calories: 221, protein: 8, carbs: 43, fat: 1.3, serving: '1 cup (~140g)' },

  // Proteins
  { name: 'Boiled Egg', aliases: ['egg', 'hard boiled egg', 'whole egg'], calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, serving: '1 large (~50g)' },
  { name: 'Fried Egg', aliases: ['omelette', 'omelet'], calories: 90, protein: 6.3, carbs: 0.4, fat: 7, serving: '1 large (~50g)' },
  { name: 'Grilled Chicken Breast', aliases: ['chicken', 'chicken breast', 'boiled chicken', 'cooked chicken'], calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
  { name: 'Plain Fish', aliases: ['fish', 'grilled fish', 'steamed fish', 'white fish'], calories: 140, protein: 24, carbs: 0, fat: 4, serving: '100g' },
  { name: 'Mackerel', aliases: ['ayala', 'bangda'], calories: 205, protein: 19, carbs: 0, fat: 14, serving: '100g' },
  { name: 'Sardine', aliases: ['mathi'], calories: 208, protein: 25, carbs: 0, fat: 11, serving: '100g' },
  { name: 'Prawns', aliases: ['shrimp', 'chemmeen'], calories: 99, protein: 24, carbs: 0.2, fat: 0.3, serving: '100g' },
  { name: 'Tofu', aliases: [], calories: 76, protein: 8, carbs: 1.9, fat: 4.8, serving: '100g' },
  { name: 'Paneer', aliases: ['cottage cheese', 'plain paneer'], calories: 265, protein: 18, carbs: 1.2, fat: 20, serving: '100g' },
  { name: 'Dal Tadka', aliases: ['dal', 'dal fry', 'tadka dal', 'lentil curry', 'toor dal', 'moong dal', 'masoor dal'], calories: 180, protein: 9, carbs: 22, fat: 6, serving: '1 cup (~200g)' },
  { name: 'Chickpeas', aliases: ['chana', 'garbanzo'], calories: 164, protein: 9, carbs: 27, fat: 2.6, serving: '100g cooked' },
  { name: 'Black Chickpeas', aliases: ['kadala', 'black chana'], calories: 180, protein: 10, carbs: 30, fat: 3, serving: '100g cooked' },

  // Dairy
  { name: 'Milk', aliases: ['whole milk', 'glass of milk'], calories: 149, protein: 7.7, carbs: 11.7, fat: 8, serving: '1 cup (~240ml)' },
  { name: 'Curd', aliases: ['yogurt', 'plain yogurt', 'dahi', 'thayir'], calories: 149, protein: 8.5, carbs: 11, fat: 8, serving: '1 cup (~245g)' },
  { name: 'Buttermilk', aliases: ['chaas', 'moru'], calories: 96, protein: 7.9, carbs: 11.5, fat: 2.2, serving: '1 cup (~240ml)' },
  { name: 'Ghee', aliases: [], calories: 126, protein: 0, carbs: 0, fat: 14, serving: '1 tbsp (~14g)' },
  { name: 'Butter', aliases: [], calories: 100, protein: 0.1, carbs: 0, fat: 11.5, serving: '1 tbsp (~14g)' },
  { name: 'Cheese', aliases: [], calories: 402, protein: 25, carbs: 1.3, fat: 33, serving: '100g' },

  // Vegetables
  { name: 'Onion', aliases: [], calories: 44, protein: 1.2, carbs: 10.3, fat: 0.1, serving: '1 medium (~110g)' },
  { name: 'Tomato', aliases: [], calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, serving: '1 medium (~120g)' },
  { name: 'Potato', aliases: ['boiled potato'], calories: 145, protein: 3, carbs: 34, fat: 0.2, serving: '1 medium (~170g)' },
  { name: 'Carrot', aliases: ['raw carrot'], calories: 25, protein: 0.6, carbs: 6, fat: 0.1, serving: '1 medium (~60g)' },
  { name: 'Spinach', aliases: ['palak', 'cheera'], calories: 41, protein: 5.3, carbs: 6.75, fat: 0.5, serving: '1 cup cooked (~180g)' },
  { name: 'Cabbage', aliases: ['cooked cabbage'], calories: 34, protein: 1.9, carbs: 8, fat: 0.2, serving: '1 cup (~150g)' },
  { name: 'Cauliflower', aliases: [], calories: 25, protein: 1.9, carbs: 5, fat: 0.3, serving: '100g' },
  { name: 'Okra', aliases: ['bhindi', 'vendakka'], calories: 33, protein: 1.9, carbs: 7, fat: 0.2, serving: '100g' },
  { name: 'Brinjal', aliases: ['eggplant', 'aubergine'], calories: 25, protein: 1, carbs: 6, fat: 0.2, serving: '100g' },
  { name: 'Bitter Gourd', aliases: ['karela', 'pavakka'], calories: 17, protein: 1, carbs: 3.7, fat: 0.2, serving: '100g' },
  { name: 'Drumstick', aliases: ['moringa'], calories: 37, protein: 2.1, carbs: 8.5, fat: 0.2, serving: '100g' },
  { name: 'Cucumber', aliases: [], calories: 16, protein: 0.7, carbs: 3.8, fat: 0.1, serving: '1 cup (~120g)' },
  { name: 'Green Beans', aliases: ['beans'], calories: 31, protein: 1.8, carbs: 7, fat: 0.1, serving: '100g' },
  { name: 'Mushroom', aliases: [], calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, serving: '100g' },
  { name: 'Coconut', aliases: ['grated coconut'], calories: 354, protein: 3.3, carbs: 15, fat: 33, serving: '100g' },

  // Fruits
  { name: 'Apple', aliases: [], calories: 95, protein: 0.5, carbs: 25, fat: 0.3, serving: '1 medium (~180g)' },
  { name: 'Banana', aliases: [], calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: '1 medium (~118g)' },
  { name: 'Orange', aliases: [], calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, serving: '1 medium (~130g)' },
  { name: 'Mango', aliases: [], calories: 99, protein: 1.4, carbs: 25, fat: 0.6, serving: '1 cup (~165g)' },
  { name: 'Papaya', aliases: [], calories: 62, protein: 0.7, carbs: 16, fat: 0.2, serving: '1 cup (~145g)' },
  { name: 'Guava', aliases: [], calories: 68, protein: 2.6, carbs: 14, fat: 1, serving: '1 medium (~100g)' },
  { name: 'Grapes', aliases: [], calories: 104, protein: 1.1, carbs: 27, fat: 0.2, serving: '1 cup (~150g)' },
  { name: 'Watermelon', aliases: ['tarbooz'], calories: 46, protein: 0.9, carbs: 11.5, fat: 0.2, serving: '1 cup (~150g)' },
  { name: 'Pineapple', aliases: [], calories: 82, protein: 0.9, carbs: 21.6, fat: 0.2, serving: '1 cup (~165g)' },
  { name: 'Pomegranate', aliases: ['anar'], calories: 144, protein: 3, carbs: 33, fat: 2, serving: '1 cup (~174g)' },
  { name: 'Strawberry', aliases: [], calories: 53, protein: 1.1, carbs: 12.7, fat: 0.5, serving: '1 cup (~166g)' },
  { name: 'Blueberry', aliases: [], calories: 84, protein: 1.1, carbs: 21.4, fat: 0.5, serving: '1 cup (~148g)' },
  { name: 'Kiwi', aliases: ['kiwifruit'], calories: 46, protein: 0.9, carbs: 11, fat: 0.4, serving: '1 medium (~75g)' },
  { name: 'Pear', aliases: [], calories: 101, protein: 0.6, carbs: 27, fat: 0.3, serving: '1 medium (~178g)' },
  { name: 'Peach', aliases: [], calories: 59, protein: 1.4, carbs: 14, fat: 0.4, serving: '1 medium (~150g)' },
  { name: 'Plum', aliases: [], calories: 30, protein: 0.5, carbs: 7.5, fat: 0.2, serving: '1 medium (~66g)' },
  { name: 'Muskmelon', aliases: ['cantaloupe', 'kharbuja'], calories: 54, protein: 1.3, carbs: 13, fat: 0.3, serving: '1 cup (~160g)' },
  { name: 'Jackfruit', aliases: ['chakka'], calories: 157, protein: 2.8, carbs: 38, fat: 1, serving: '1 cup (~165g)' },
  { name: 'Custard Apple', aliases: ['sitaphal'], calories: 120, protein: 2, carbs: 30, fat: 0.5, serving: '1 cup (~160g)' },
  { name: 'Lychee', aliases: ['litchi'], calories: 125, protein: 1.6, carbs: 31, fat: 0.8, serving: '1 cup (~190g)' },
  { name: 'Dragon Fruit', aliases: ['pitaya'], calories: 136, protein: 3, carbs: 30, fat: 0.6, serving: '1 cup (~227g)' },
  { name: 'Chikoo', aliases: ['sapota', 'sapodilla'], calories: 141, protein: 0.9, carbs: 34, fat: 1.9, serving: '1 medium (~170g)' },
  { name: 'Dates', aliases: ['date fruit'], calories: 67, protein: 0.5, carbs: 18, fat: 0.1, serving: '3 dates (~24g)' },
  { name: 'Fig', aliases: ['anjeer'], calories: 74, protein: 0.8, carbs: 19, fat: 0.3, serving: '2 medium (~100g)' },
  { name: 'Avocado', aliases: [], calories: 160, protein: 2, carbs: 8.5, fat: 14.7, serving: '100g' },

  // Kerala / South Indian Dishes
  { name: 'Sambar', aliases: ['sambhar', 'sambhaar'], calories: 120, protein: 6, carbs: 18, fat: 3, serving: '1 cup (~200ml)' },
  { name: 'Rasam', aliases: [], calories: 45, protein: 2, carbs: 7, fat: 1, serving: '1 bowl (~200ml)' },
  { name: 'Avial', aliases: ['aviyal'], calories: 160, protein: 4, carbs: 15, fat: 10, serving: '1 cup (~150g)' },
  { name: 'Thoran', aliases: ['cabbage thoran', 'vegetable thoran'], calories: 90, protein: 3, carbs: 10, fat: 5, serving: '1/2 cup (~100g)' },
  { name: 'Olan', aliases: [], calories: 110, protein: 2, carbs: 10, fat: 7, serving: '1 serving' },
  { name: 'Kootu Curry', aliases: ['kootu'], calories: 140, protein: 5, carbs: 18, fat: 6, serving: '1 serving' },
  { name: 'Fish Curry', aliases: ['meen curry', 'kerala fish curry'], calories: 220, protein: 20, carbs: 6, fat: 13, serving: '1 cup (~200g)' },
  { name: 'Chicken Curry', aliases: ['kozhi curry', 'nadan chicken curry'], calories: 280, protein: 22, carbs: 8, fat: 18, serving: '1 cup (~200g)' },
  { name: 'Meat Curry', aliases: ['beef curry', 'mutton curry', 'nadan meat curry'], calories: 320, protein: 24, carbs: 8, fat: 22, serving: '1 cup (~200g)' },
  { name: 'Kadala Curry', aliases: ['black chickpea curry', 'kerala kadala curry'], calories: 230, protein: 10, carbs: 32, fat: 7, serving: '1 cup (~200g)' },
  { name: 'Chicken Biryani', aliases: ['biriyani', 'biryani', 'chicken biriyani'], calories: 450, protein: 20, carbs: 55, fat: 15, serving: '1 plate (~250g)' },
  { name: 'Veg Biryani', aliases: ['vegetable biryani', 'veg biriyani'], calories: 380, protein: 8, carbs: 60, fat: 12, serving: '1 plate (~250g)' },
  { name: 'Beef Biryani', aliases: ['beef biriyani'], calories: 500, protein: 22, carbs: 55, fat: 20, serving: '1 plate (~250g)' },
  { name: 'Mutton Biryani', aliases: ['mutton biriyani', 'lamb biryani'], calories: 530, protein: 25, carbs: 54, fat: 24, serving: '1 plate (~250g)' },
  { name: 'Fish Biryani', aliases: ['meen biryani', 'fish biriyani', 'prawn biryani'], calories: 420, protein: 24, carbs: 52, fat: 14, serving: '1 plate (~250g)' },
  { name: 'Egg Biryani', aliases: ['mutta biryani', 'egg biriyani'], calories: 410, protein: 15, carbs: 56, fat: 14, serving: '1 plate (~250g)' },
  { name: 'Kerala Porotta', aliases: ['porotta', 'parotta', 'malabar porotta'], calories: 280, protein: 5, carbs: 35, fat: 13, serving: '1 piece (~80g)' },
  { name: 'Pathiri', aliases: ['rice pathiri', 'ari pathiri'], calories: 95, protein: 2, carbs: 18, fat: 2, serving: '1 piece (~35g)' },
  { name: 'Puri', aliases: ['poori'], calories: 105, protein: 2, carbs: 13, fat: 5, serving: '1 piece (~30g)' },
  { name: 'Pazhampori', aliases: ['banana fritters', 'ethakka appam'], calories: 180, protein: 2, carbs: 28, fat: 7, serving: '1 piece' },
  { name: 'Payasam', aliases: ['kheer'], calories: 200, protein: 5, carbs: 30, fat: 7, serving: '1 bowl' },

  // Fast Food & Snacks
  { name: 'Samosa', aliases: [], calories: 260, protein: 4, carbs: 24, fat: 17, serving: '1 piece (~60g)' },
  { name: 'French Fries', aliases: ['fries'], calories: 365, protein: 4, carbs: 48, fat: 17, serving: '1 medium (~117g)' },
  { name: 'Burger', aliases: ['cheeseburger'], calories: 350, protein: 15, carbs: 35, fat: 17, serving: '1 piece (~150g)' },
  { name: 'Pizza', aliases: ['pizza slice'], calories: 285, protein: 12, carbs: 36, fat: 10, serving: '1 slice (~107g)' },
  { name: 'Sandwich', aliases: ['veg sandwich'], calories: 280, protein: 8, carbs: 35, fat: 12, serving: '1 sandwich (~150g)' },
  { name: 'Biscuit', aliases: ['cookie', 'cookies'], calories: 140, protein: 2, carbs: 20, fat: 6, serving: '2 pieces (~30g)' },
  { name: 'Chocolate', aliases: ['chocolate bar', 'milk chocolate'], calories: 210, protein: 3, carbs: 24, fat: 12, serving: '1 bar (~40g)' },
  { name: 'Ice Cream', aliases: [], calories: 137, protein: 2.3, carbs: 16, fat: 7, serving: '1 scoop (~65g)' },

  // Drinks
  { name: 'Tea', aliases: ['chai', 'milk tea', 'tea with milk'], calories: 40, protein: 1.2, carbs: 5, fat: 1.5, serving: '1 cup (~200ml)' },
  { name: 'Black Coffee', aliases: ['coffee'], calories: 2, protein: 0.3, carbs: 0, fat: 0, serving: '1 cup (~240ml)' },
  { name: 'Coffee with Milk', aliases: ['milk coffee'], calories: 45, protein: 2, carbs: 5, fat: 2, serving: '1 cup (~200ml)' },
  { name: 'Orange Juice', aliases: ['fruit juice'], calories: 112, protein: 1.7, carbs: 26, fat: 0.5, serving: '1 cup (~248ml)' },
  { name: 'Cola', aliases: ['soft drink', 'soda', 'coke'], calories: 139, protein: 0, carbs: 35, fat: 0, serving: '1 can (~330ml)' },

  // Oils & Nuts
  { name: 'Coconut Oil', aliases: [], calories: 121, protein: 0, carbs: 0, fat: 14, serving: '1 tbsp (~14g)' },
  { name: 'Olive Oil', aliases: [], calories: 119, protein: 0, carbs: 0, fat: 14, serving: '1 tbsp (~14g)' },
  { name: 'Peanuts', aliases: ['groundnuts'], calories: 567, protein: 26, carbs: 16, fat: 49, serving: '100g' },
  { name: 'Almonds', aliases: [], calories: 579, protein: 21, carbs: 22, fat: 50, serving: '100g' },
  { name: 'Cashews', aliases: [], calories: 553, protein: 18, carbs: 30, fat: 44, serving: '100g' }

];

/**
 * Search local nutrition DB by name / alias (case-insensitive partial match)
 */
function searchLocal(query) {
  const q = query.toLowerCase().trim();
  return nutritionDB
    .filter(
      (f) =>
        f.name.includes(q) ||
        q.includes(f.name) ||
        f.aliases.some((a) => a.includes(q) || q.includes(a))
    )
    .map((f) => ({
      ...f,
      source: 'local'
    }));
}

/**
 * Scale macros by grams (relative to 100g base entries)
 */
function scaleNutrition(food, grams = 100) {
  const factor = grams / 100;
  return {
    foodName: food.name,
    servingSize: `${grams}g`,
    calories: Math.round(food.calories * factor * 10) / 10,
    carbs: Math.round(food.carbs * factor * 10) / 10,
    protein: Math.round(food.protein * factor * 10) / 10,
    fat: Math.round(food.fat * factor * 10) / 10,
    unit: food.unit,
    source: food.source || 'local'
  };
}

module.exports = { nutritionDB, searchLocal, scaleNutrition };
