/**
 * Recipe model — South Indian / Kerala / Indian dishes with ingredient matching
 */
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    ingredients: [
      {
        name: { type: String, required: true, lowercase: true, trim: true },
        amount: { type: String, default: '' },
        optional: { type: Boolean, default: false }
      }
    ],
    instructions: { type: [String], required: true },
    region: {
      type: String,
      enum: ['South Indian', 'Kerala', 'North Indian', 'Indian', 'Other'],
      default: 'South Indian'
    },
    category: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack', 'side', 'dessert', 'beverage'],
      default: 'lunch'
    },
    dietType: {
      type: String,
      enum: ['vegetarian', 'vegan', 'non-vegetarian', 'eggetarian'],
      default: 'vegetarian'
    },
    prepTimeMins: { type: Number, default: 20 },
    cookTimeMins: { type: Number, default: 30 },
    servings: { type: Number, default: 2 },
    caloriesPerServing: { type: Number, default: 0 },
    imageEmoji: { type: String, default: '🍛' },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

recipeSchema.index({ title: 'text', region: 1, category: 1 });

module.exports = mongoose.model('Recipe', recipeSchema);
