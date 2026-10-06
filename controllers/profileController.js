/**
 * Profile controller — update profile, BMI & TDEE calculations, workout tips
 */
const User = require('../models/User');

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

function calcBMI(weightKg, heightCm) {
  const h = heightCm / 100;
  const bmi = weightKg / (h * h);
  let category = 'Unknown';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  return { bmi: Math.round(bmi * 10) / 10, category };
}

/** Mifflin-St Jeor BMR */
function calcBMR(weightKg, heightCm, age, gender) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') return base + 5;
  if (gender === 'female') return base - 161;
  return base - 78; // midpoint for other/unspecified
}

function workoutSuggestions(bmiCategory, goal, activityLevel) {
  const tips = [];

  if (bmiCategory === 'Underweight' || goal === 'gain') {
    tips.push(
      { title: 'Strength Training', detail: '3–4x/week: compound lifts (squats, deadlifts, presses) with progressive overload.', duration: '45–60 min' },
      { title: 'Light Cardio', detail: 'Keep cardio moderate so it does not interfere with surplus calories.', duration: '20 min' },
      { title: 'Recovery Focus', detail: 'Prioritize sleep and protein (1.6–2.2g/kg) to support muscle gain.', duration: 'Daily' }
    );
  } else if (bmiCategory === 'Overweight' || bmiCategory === 'Obese' || goal === 'lose') {
    tips.push(
      { title: 'Brisk Walking / Zone 2', detail: 'Steady-state cardio to burn fat while staying recoverable.', duration: '30–45 min, 5x/week' },
      { title: 'Full-Body Strength', detail: 'Preserve muscle while in a calorie deficit — 2–3 full-body sessions.', duration: '40 min' },
      { title: 'HIIT Intervals', detail: 'Short intense bursts (e.g. 20s on / 40s off) 1–2x/week if joints feel good.', duration: '15–20 min' }
    );
  } else {
    tips.push(
      { title: 'Balanced Mix', detail: '2–3 strength sessions + 2 cardio sessions for health and recomposition.', duration: '40–50 min' },
      { title: 'Mobility & Yoga', detail: 'Improve flexibility and recovery — great complement to South Indian active lifestyle.', duration: '20 min' },
      { title: 'Active Recreation', detail: 'Sports, swimming, or cycling keep consistency high without burnout.', duration: 'Flexible' }
    );
  }

  if (activityLevel === 'sedentary') {
    tips.push({
      title: 'NEAT Boost',
      detail: 'Stand more, take walking breaks every hour, use stairs — small moves add up.',
      duration: 'Throughout day'
    });
  }

  return tips;
}

// GET /api/profile
async function getProfile(req, res) {
  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    profile: req.user.profile
  });
}

// PUT /api/profile
async function updateProfile(req, res) {
  try {
    const allowed = [
      'age',
      'gender',
      'heightCm',
      'weightKg',
      'activityLevel',
      'goal',
      'dietaryPrefs',
      'bio'
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[`profile.${key}`] = req.body[key];
    }

    // Optional username change
    if (req.body.username) {
      const taken = await User.findOne({
        username: req.body.username,
        _id: { $ne: req.user._id }
      });
      if (taken) return res.status(409).json({ message: 'Username taken' });
      updates.username = req.body.username;
    }

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true });
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      profile: user.profile
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// POST /api/profile/calculate — BMI, TDEE, macros, workouts
async function calculateMetrics(req, res) {
  try {
    const p = req.user.profile || {};
    const weightKg = Number(req.body.weightKg ?? p.weightKg);
    const heightCm = Number(req.body.heightCm ?? p.heightCm);
    const age = Number(req.body.age ?? p.age);
    const gender = req.body.gender || p.gender || 'other';
    const activityLevel = req.body.activityLevel || p.activityLevel || 'moderate';
    const goal = req.body.goal || p.goal || 'maintain';

    if (!weightKg || !heightCm || !age) {
      return res.status(400).json({
        message: 'weightKg, heightCm, and age are required (in body or saved profile)'
      });
    }

    const { bmi, category } = calcBMI(weightKg, heightCm);
    const bmr = Math.round(calcBMR(weightKg, heightCm, age, gender));
    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
    let tdee = Math.round(bmr * multiplier);

    // Adjust calories for goal
    let targetCalories = tdee;
    if (goal === 'lose') targetCalories = tdee - 400;
    if (goal === 'gain') targetCalories = tdee + 300;

    // Macro split (protein-forward)
    const proteinG = Math.round((weightKg * (goal === 'gain' ? 2.0 : 1.8)));
    const fatG = Math.round((targetCalories * 0.25) / 9);
    const carbsG = Math.round((targetCalories - proteinG * 4 - fatG * 9) / 4);

    const workouts = workoutSuggestions(category, goal, activityLevel);

    res.json({
      inputs: { weightKg, heightCm, age, gender, activityLevel, goal },
      bmi,
      bmiCategory: category,
      bmr,
      tdee,
      targetCalories,
      macros: { proteinG, carbsG, fatG },
      workouts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getProfile, updateProfile, calculateMetrics };
