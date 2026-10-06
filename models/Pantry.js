/**
 * Pantry model — one document per user with an ingredients array
 */
const mongoose = require('mongoose');

const pantryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, lowercase: true },
    quantity: { type: String, default: '' },
    unit: { type: String, default: '' },
    category: {
      type: String,
      enum: [
        'vegetables',
        'fruits',
        'grains',
        'proteins',
        'dairy',
        'spices',
        'oils',
        'other'
      ],
      default: 'other'
    },
    addedAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const pantrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    ingredients: { type: [pantryItemSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pantry', pantrySchema);
