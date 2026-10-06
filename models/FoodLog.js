/**
 * FoodLog model — daily nutrition entries per user
 */
const mongoose = require('mongoose');

const foodLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    foodName: { type: String, required: true, trim: true },
    servingSize: { type: String, default: '1 serving' },
    calories: { type: Number, required: true, min: 0 },
    carbs: { type: Number, default: 0, min: 0 },
    protein: { type: Number, default: 0, min: 0 },
    fat: { type: Number, default: 0, min: 0 },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack', 'other'],
      default: 'other'
    },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

foodLogSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('FoodLog', foodLogSchema);
