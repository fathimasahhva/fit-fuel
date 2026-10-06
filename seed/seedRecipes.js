/**
 * Seed script — populates MongoDB with simple, quick everyday recipes
 * Run: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

const recipes = [
  {
    title: 'Scrambled Eggs on Toast',
    description: 'Fluffy, buttery scrambled eggs served over toasted bread.',
    region: 'Other',
    category: 'breakfast',
    dietType: 'vegetarian',
    prepTimeMins: 5,
    cookTimeMins: 5,
    servings: 1,
    caloriesPerServing: 280,
    imageEmoji: '🍳',
    tags: ['quick', 'breakfast', 'protein'],
    ingredients: [
      { name: 'eggs', amount: '2' },
      { name: 'butter', amount: '1 tbsp' },
      { name: 'milk', amount: '1 tbsp', optional: true },
      { name: 'bread', amount: '2 slices' },
      { name: 'salt', amount: 'to taste' },
      { name: 'black pepper', amount: 'pinch' }
    ],
    instructions: [
      'Whisk eggs, milk, salt, and pepper together in a bowl.',
      'Melt butter in a non-stick pan over medium-low heat.',
      'Pour in the egg mixture and gently stir continuously until soft curds form.',
      'Serve warm over buttered toast.'
    ]
  },
  {
    title: 'Classic Grilled Cheese Sandwich',
    description: 'Golden, crispy, buttery bread loaded with melted cheese.',
    region: 'Other',
    category: 'lunch',
    dietType: 'vegetarian',
    prepTimeMins: 5,
    cookTimeMins: 6,
    servings: 1,
    caloriesPerServing: 350,
    imageEmoji: '🥪',
    tags: ['quick', 'comfort', 'vegetarian'],
    ingredients: [
      { name: 'bread', amount: '2 slices' },
      { name: 'cheddar cheese', amount: '2 slices' },
      { name: 'butter', amount: '1.5 tbsp' }
    ],
    instructions: [
      'Butter the outside of each bread slice.',
      'Place cheese between the slices with the buttered sides facing outward.',
      'Cook in a skillet over medium heat for 3 minutes per side until golden brown and the cheese is melted.'
    ]
  },
  {
    title: 'Garlic Butter Pasta',
    description: 'Simple spaghetti tossed in rich garlic, butter, and parmesan.',
    region: 'Other',
    category: 'dinner',
    dietType: 'vegetarian',
    prepTimeMins: 5,
    cookTimeMins: 10,
    servings: 2,
    caloriesPerServing: 400,
    imageEmoji: '🍝',
    tags: ['pasta', 'quick', 'easy'],
    ingredients: [
      { name: 'spaghetti', amount: '200g' },
      { name: 'butter', amount: '3 tbsp' },
      { name: 'garlic', amount: '4 cloves minced' },
      { name: 'parmesan cheese', amount: '1/4 cup grated', optional: true },
      { name: 'salt', amount: 'to taste' },
      { name: 'black pepper', amount: '1/2 tsp' }
    ],
    instructions: [
      'Boil spaghetti in salted water according to package instructions; drain, reserving a little pasta water.',
      'Melt butter in a pan, sauté minced garlic for 1 minute until fragrant.',
      'Toss cooked pasta into the garlic butter, adding a splash of pasta water and parmesan cheese.',
      'Season with salt and pepper, then serve hot.'
    ]
  },
  {
    title: 'Quick Tomato Omelette',
    description: 'A savory, spiced flourless pancake made with eggs, tomato, and onion.',
    region: 'Other',
    category: 'breakfast',
    dietType: 'vegetarian',
    prepTimeMins: 5,
    cookTimeMins: 5,
    servings: 1,
    caloriesPerServing: 210,
    imageEmoji: '🍅',
    tags: ['breakfast', 'quick', 'egg'],
    ingredients: [
      { name: 'eggs', amount: '2' },
      { name: 'onion', amount: '1 small chopped' },
      { name: 'tomato', amount: '1 small chopped' },
      { name: 'green chilli', amount: '1 chopped', optional: true },
      { name: 'oil', amount: '1 tbsp' },
      { name: 'salt', amount: 'to taste' }
    ],
    instructions: [
      'Whisk eggs with salt, onion, tomato, and chilli in a bowl.',
      'Heat oil in a small frying pan over medium heat.',
      'Pour the mixture evenly into the pan and cook for 2–3 minutes until the bottom sets.',
      'Flip carefully and cook for another 2 minutes until golden.'
    ]
  },
  {
    title: 'Avocado Toast',
    description: 'Mashed creamy avocado seasoned with lemon, salt, and pepper on crunchy toast.',
    region: 'Other',
    category: 'breakfast',
    dietType: 'vegan',
    prepTimeMins: 5,
    cookTimeMins: 2,
    servings: 1,
    caloriesPerServing: 220,
    imageEmoji: '🥑',
    tags: ['healthy', 'quick', 'vegan'],
    ingredients: [
      { name: 'avocado', amount: '1 ripe' },
      { name: 'bread', amount: '2 slices' },
      { name: 'lemon juice', amount: '1 tsp' },
      { name: 'salt', amount: 'to taste' },
      { name: 'black pepper', amount: 'pinch' },
      { name: 'olive oil', amount: '1 tsp', optional: true }
    ],
    instructions: [
      'Toast the bread slices until golden and crisp.',
      'Mash the avocado in a bowl with lemon juice, salt, and pepper.',
      'Spread the mixture generously over the toast and drizzle with a little olive oil.'
    ]
  },
  {
    title: 'Quick Fried Rice',
    description: 'Fast and versatile rice stir-fried with mixed veggies and soy sauce.',
    region: 'Other',
    category: 'lunch',
    dietType: 'vegan',
    prepTimeMins: 10,
    cookTimeMins: 10,
    servings: 2,
    caloriesPerServing: 310,
    imageEmoji: '🍚',
    tags: ['rice', 'quick', 'stir-fry'],
    ingredients: [
      { name: 'cooked rice', amount: '2 cups chilled' },
      { name: 'mixed vegetables', amount: '1 cup frozen/chopped' },
      { name: 'soy sauce', amount: '1.5 tbsp' },
      { name: 'garlic', amount: '2 cloves minced' },
      { name: 'oil', amount: '2 tbsp' },
      { name: 'salt', amount: 'to taste' }
    ],
    instructions: [
      'Heat oil in a large pan or wok over high heat.',
      'Sauté minced garlic and mixed vegetables for 3–4 minutes until tender-crisp.',
      'Add the cooked rice and soy sauce, tossing continuously on high heat for 3–5 minutes.',
      'Season with salt to taste and serve hot.'
    ]
  },
  {
    title: 'Banana Oatmeal Smoothie',
    description: 'A filling, healthy blended breakfast drink made with oats, banana, and milk.',
    region: 'Other',
    category: 'breakfast',
    dietType: 'vegetarian',
    prepTimeMins: 5,
    cookTimeMins: 0,
    servings: 1,
    caloriesPerServing: 260,
    imageEmoji: '🥤',
    tags: ['smoothie', 'quick', 'healthy'],
    ingredients: [
      { name: 'banana', amount: '1 ripe' },
      { name: 'rolled oats', amount: '1/3 cup' },
      { name: 'milk', amount: '1 cup' },
      { name: 'honey', amount: '1 tsp', optional: true },
      { name: 'cinnamon powder', amount: 'pinch', optional: true }
    ],
    instructions: [
      'Add all ingredients into a blender.',
      'Blend on high speed until completely smooth and creamy.',
      'Pour into a glass and serve immediately.'
    ]
  },
  {
    title: 'Classic Quesadilla',
    description: 'Tortilla stuffed with melted cheese and quick beans.',
    region: 'Other',
    category: 'lunch',
    dietType: 'vegetarian',
    prepTimeMins: 5,
    cookTimeMins: 6,
    servings: 1,
    caloriesPerServing: 340,
    imageEmoji: '🧀',
    tags: ['quick', 'snack', 'cheese'],
    ingredients: [
      { name: 'tortilla', amount: '1 large' },
      { name: 'cheddar cheese', amount: '1/2 cup shredded' },
      { name: 'black beans', amount: '1/4 cup', optional: true },
      { name: 'butter', amount: '1 tsp' }
    ],
    instructions: [
      'Place tortilla in a skillet over medium heat.',
      'Sprinkle cheese and beans evenly over one half of the tortilla.',
      'Fold the empty half over the filling, cook for 3 minutes per side until the tortilla is crisp and cheese melts.'
    ]
  },
  {
    title: 'Honey Lemon Green Tea',
    description: 'Soothing hot beverage with a splash of lemon and honey.',
    region: 'Other',
    category: 'snack',
    dietType: 'vegan',
    prepTimeMins: 2,
    cookTimeMins: 3,
    servings: 1,
    caloriesPerServing: 30,
    imageEmoji: '🍵',
    tags: ['drink', 'quick', 'soothing'],
    ingredients: [
      { name: 'green tea bag', amount: '1' },
      { name: 'water', amount: '1 cup' },
      { name: 'honey', amount: '1 tsp' },
      { name: 'lemon juice', amount: '1 tsp' }
    ],
    instructions: [
      'Boil water and pour it over the green tea bag in a mug.',
      'Steep for 2–3 minutes, then remove the tea bag.',
      'Stir in honey and lemon juice before drinking.'
    ]
  },
  {
    title: 'Peanut Butter Banana Toast',
    description: 'Energy-boosting toast layered with creamy peanut butter and sliced bananas.',
    region: 'Other',
    category: 'snack',
    dietType: 'vegan',
    prepTimeMins: 3,
    cookTimeMins: 2,
    servings: 1,
    caloriesPerServing: 290,
    imageEmoji: '🍌',
    tags: ['snack', 'quick', 'energizing'],
    ingredients: [
      { name: 'bread', amount: '2 slices' },
      { name: 'peanut butter', amount: '2 tbsp' },
      { name: 'banana', amount: '1 sliced' },
      { name: 'honey', amount: 'drizzle', optional: true }
    ],
    instructions: [
      'Toast the bread slices until golden brown.',
      'Spread an even layer of peanut butter over each slice.',
      'Top with banana slices and a light drizzle of honey if desired.'
    ]
  }
,
{
  "title": "Easy Pancakes",
  "description": "Fluffy everyday pancakes made with basic ingredients.",
  "region": "Other",
  "category": "breakfast",
  "dietType": "eggetarian",
  "prepTimeMins": 5,
  "cookTimeMins": 10,
  "servings": 2,
  "caloriesPerServing": 280,
  "imageEmoji": "🥞",
  "tags": [
    "quick",
    "breakfast",
    "easy"
  ],
  "ingredients": [
    {
      "name": "flour",
      "amount": "1 cup"
    },
    {
      "name": "milk",
      "amount": "3/4 cup"
    },
    {
      "name": "eggs",
      "amount": "1"
    },
    {
      "name": "sugar",
      "amount": "1 tbsp"
    },
    {
      "name": "baking powder",
      "amount": "1 tsp"
    },
    {
      "name": "butter",
      "amount": "1 tbsp"
    },
    {
      "name": "salt",
      "amount": "pinch"
    }
  ],
  "instructions": [
    "Mix flour, sugar, baking powder, and salt.",
    "Whisk milk and egg, then stir into dry ingredients with melted butter.",
    "Cook small pancakes in a lightly buttered pan, flipping when bubbles form."
  ]
},
{
  "title": "Cheese Omelette",
  "description": "A quick folded omelette with melted cheese.",
  "region": "Other",
  "category": "breakfast",
  "dietType": "eggetarian",
  "prepTimeMins": 3,
  "cookTimeMins": 5,
  "servings": 1,
  "caloriesPerServing": 300,
  "imageEmoji": "🍳",
  "tags": [
    "quick",
    "breakfast",
    "protein"
  ],
  "ingredients": [
    {
      "name": "eggs",
      "amount": "2"
    },
    {
      "name": "cheddar cheese",
      "amount": "1/4 cup"
    },
    {
      "name": "butter",
      "amount": "1 tsp"
    },
    {
      "name": "salt",
      "amount": "to taste"
    },
    {
      "name": "black pepper",
      "amount": "pinch"
    }
  ],
  "instructions": [
    "Beat eggs with salt and pepper.",
    "Melt butter in a pan and pour in the eggs.",
    "When nearly set, add cheese, fold, and cook until melted."
  ]
},
{
  "title": "Flour Flatbread",
  "description": "Simple pan-cooked flatbread made with flour, water, and salt.",
  "region": "Other",
  "category": "lunch",
  "dietType": "vegan",
  "prepTimeMins": 10,
  "cookTimeMins": 10,
  "servings": 2,
  "caloriesPerServing": 220,
  "imageEmoji": "🫓",
  "tags": [
    "quick",
    "simple",
    "bread"
  ],
  "ingredients": [
    {
      "name": "flour",
      "amount": "1 cup"
    },
    {
      "name": "water",
      "amount": "1/2 cup"
    },
    {
      "name": "salt",
      "amount": "1/4 tsp"
    },
    {
      "name": "oil",
      "amount": "1 tsp",
      "optional": true
    }
  ],
  "instructions": [
    "Mix flour and salt, adding water gradually to form a soft dough.",
    "Rest 5 minutes, divide, and roll into thin rounds.",
    "Cook in a hot pan until browned on both sides."
  ]
},
{
  "title": "Tomato Cheese Toast",
  "description": "Crispy toast topped with tomato and melted cheese.",
  "region": "Other",
  "category": "snack",
  "dietType": "vegetarian",
  "prepTimeMins": 5,
  "cookTimeMins": 5,
  "servings": 1,
  "caloriesPerServing": 260,
  "imageEmoji": "🍞",
  "tags": [
    "quick",
    "snack",
    "easy"
  ],
  "ingredients": [
    {
      "name": "bread",
      "amount": "2 slices"
    },
    {
      "name": "tomato",
      "amount": "1 small"
    },
    {
      "name": "cheddar cheese",
      "amount": "2 slices"
    },
    {
      "name": "black pepper",
      "amount": "pinch"
    },
    {
      "name": "butter",
      "amount": "1 tsp",
      "optional": true
    }
  ],
  "instructions": [
    "Top bread with tomato and cheese and season with pepper.",
    "Toast in a covered pan or under a grill until crisp and melted."
  ]
},
{
  "title": "Simple Egg Fried Rice",
  "description": "A quick one-pan meal with leftover rice and eggs.",
  "region": "Other",
  "category": "lunch",
  "dietType": "eggetarian",
  "prepTimeMins": 5,
  "cookTimeMins": 8,
  "servings": 2,
  "caloriesPerServing": 340,
  "imageEmoji": "🍚",
  "tags": [
    "quick",
    "rice",
    "one-pan"
  ],
  "ingredients": [
    {
      "name": "cooked rice",
      "amount": "2 cups"
    },
    {
      "name": "eggs",
      "amount": "2"
    },
    {
      "name": "oil",
      "amount": "1 tbsp"
    },
    {
      "name": "soy sauce",
      "amount": "1 tbsp",
      "optional": true
    },
    {
      "name": "salt",
      "amount": "to taste"
    }
  ],
  "instructions": [
    "Heat oil and scramble eggs until just cooked; set aside.",
    "Stir-fry rice until hot and season with soy sauce and salt.",
    "Return eggs to the pan, mix, and serve."
  ]
},
{
  "title": "Banana Egg Pancakes",
  "description": "Quick pancakes made from ripe banana and eggs.",
  "region": "Other",
  "category": "breakfast",
  "dietType": "eggetarian",
  "prepTimeMins": 5,
  "cookTimeMins": 6,
  "servings": 1,
  "caloriesPerServing": 250,
  "imageEmoji": "🍌",
  "tags": [
    "quick",
    "breakfast",
    "gluten-free"
  ],
  "ingredients": [
    {
      "name": "banana",
      "amount": "1 ripe"
    },
    {
      "name": "eggs",
      "amount": "2"
    },
    {
      "name": "butter",
      "amount": "1 tsp"
    },
    {
      "name": "cinnamon powder",
      "amount": "pinch",
      "optional": true
    }
  ],
  "instructions": [
    "Mash banana and beat with eggs; add cinnamon if desired.",
    "Melt butter in a pan over low-medium heat.",
    "Cook small pancakes for 1–2 minutes per side until set."
  ]
},
{
  "title": "Quick Tomato Pasta",
  "description": "Easy pasta tossed with tomato, garlic, and oil.",
  "region": "Other",
  "category": "dinner",
  "dietType": "vegan",
  "prepTimeMins": 5,
  "cookTimeMins": 12,
  "servings": 2,
  "caloriesPerServing": 380,
  "imageEmoji": "🍝",
  "tags": [
    "quick",
    "pasta",
    "dinner"
  ],
  "ingredients": [
    {
      "name": "pasta",
      "amount": "200g"
    },
    {
      "name": "tomato",
      "amount": "2"
    },
    {
      "name": "garlic",
      "amount": "2 cloves",
      "optional": true
    },
    {
      "name": "olive oil",
      "amount": "1 tbsp"
    },
    {
      "name": "salt",
      "amount": "to taste"
    },
    {
      "name": "black pepper",
      "amount": "to taste"
    }
  ],
  "instructions": [
    "Boil pasta in salted water and drain.",
    "Heat oil, briefly cook garlic, then add tomatoes until soft.",
    "Stir in pasta, season with pepper, and serve."
  ]
},
{
  "title": "Buttered Garlic Noodles",
  "description": "Fast noodles tossed with garlic, butter, and seasoning.",
  "region": "Other",
  "category": "dinner",
  "dietType": "vegetarian",
  "prepTimeMins": 3,
  "cookTimeMins": 10,
  "servings": 2,
  "caloriesPerServing": 360,
  "imageEmoji": "🍜",
  "tags": [
    "quick",
    "noodles",
    "easy"
  ],
  "ingredients": [
    {
      "name": "noodles",
      "amount": "200g"
    },
    {
      "name": "butter",
      "amount": "2 tbsp"
    },
    {
      "name": "garlic",
      "amount": "2 cloves"
    },
    {
      "name": "salt",
      "amount": "to taste"
    },
    {
      "name": "black pepper",
      "amount": "to taste"
    }
  ],
  "instructions": [
    "Cook noodles according to package directions and drain.",
    "Melt butter in a pan and cook garlic briefly.",
    "Add noodles, salt, and pepper; toss until hot."
  ]
},
{
  "title": "Bean and Cheese Quesadilla",
  "description": "A crisp tortilla with beans and melted cheese.",
  "region": "Other",
  "category": "lunch",
  "dietType": "vegetarian",
  "prepTimeMins": 5,
  "cookTimeMins": 6,
  "servings": 1,
  "caloriesPerServing": 390,
  "imageEmoji": "🧀",
  "tags": [
    "quick",
    "lunch",
    "vegetarian"
  ],
  "ingredients": [
    {
      "name": "tortilla",
      "amount": "1 large"
    },
    {
      "name": "cheddar cheese",
      "amount": "1/3 cup"
    },
    {
      "name": "black beans",
      "amount": "1/3 cup",
      "optional": true
    },
    {
      "name": "oil",
      "amount": "1 tsp",
      "optional": true
    }
  ],
  "instructions": [
    "Add cheese and beans to one half of a tortilla.",
    "Fold and cook in a lightly oiled pan until crisp and the cheese melts."
  ]
}
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitpantry';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const operations = recipes.map((recipe) => ({
    updateOne: { filter: { title: recipe.title }, update: { $set: recipe }, upsert: true }
  }));
  const result = await Recipe.bulkWrite(operations, { ordered: false });
  console.log('Seeded/updated ' + (result.upsertedCount + result.modifiedCount) + ' everyday recipes; existing recipes were kept.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});