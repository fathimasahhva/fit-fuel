/**
 * User model — auth credentials + fitness profile details
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 40
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false
    },
    profile: {
      age: { type: Number, min: 10, max: 120 },
      gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
      heightCm: { type: Number, min: 50, max: 300 },
      weightKg: { type: Number, min: 20, max: 500 },
      activityLevel: {
        type: String,
        enum: ['sedentary', 'light', 'moderate', 'active', 'very_active', ''],
        default: ''
      },
      goal: {
        type: String,
        enum: ['lose', 'maintain', 'gain', ''],
        default: ''
      },
      dietaryPrefs: { type: [String], default: [] }, // e.g. vegetarian, vegan
      bio: { type: String, maxlength: 300, default: '' }
    }
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
