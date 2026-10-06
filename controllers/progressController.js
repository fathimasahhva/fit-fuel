/**
 * Progress controller — weight history + weekly nutrition summaries
 */
const mongoose = require('mongoose');
const FoodLog = require('../models/FoodLog');
const User = require('../models/User');

// Simple embedded progress via a lightweight collection
const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    weightKg: { type: Number, required: true },
    note: { type: String, default: '' },
    recordedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Progress =
  mongoose.models.Progress || mongoose.model('Progress', progressSchema);

// POST /api/progress/weight
async function logWeight(req, res) {
  try {
    const { weightKg, note, recordedAt } = req.body;
    if (!weightKg) return res.status(400).json({ message: 'weightKg is required' });

    const entry = await Progress.create({
      userId: req.user._id,
      weightKg: Number(weightKg),
      note: note || '',
      recordedAt: recordedAt ? new Date(recordedAt) : new Date()
    });

    // Keep profile weight in sync with latest
    await User.findByIdAndUpdate(req.user._id, {
      $set: { 'profile.weightKg': Number(weightKg) }
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// GET /api/progress/weight
async function getWeightHistory(req, res) {
  try {
    const history = await Progress.find({ userId: req.user._id })
      .sort({ recordedAt: 1 })
      .limit(90);
    res.json({ count: history.length, history });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/progress/nutrition-summary?days=7
async function nutritionSummary(req, res) {
  try {
    const days = Math.min(Number(req.query.days) || 7, 30);
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    const logs = await FoodLog.find({
      userId: req.user._id,
      timestamp: { $gte: since }
    });

    // Group by date
    const byDay = {};
    for (const log of logs) {
      const key = log.timestamp.toISOString().slice(0, 10);
      if (!byDay[key]) {
        byDay[key] = { date: key, calories: 0, carbs: 0, protein: 0, fat: 0, entries: 0 };
      }
      byDay[key].calories += log.calories;
      byDay[key].carbs += log.carbs;
      byDay[key].protein += log.protein;
      byDay[key].fat += log.fat;
      byDay[key].entries += 1;
    }

    const daily = Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date));
    const avg = daily.length
      ? {
          calories: Math.round(daily.reduce((s, d) => s + d.calories, 0) / daily.length),
          carbs: Math.round(daily.reduce((s, d) => s + d.carbs, 0) / daily.length),
          protein: Math.round(daily.reduce((s, d) => s + d.protein, 0) / daily.length),
          fat: Math.round(daily.reduce((s, d) => s + d.fat, 0) / daily.length)
        }
      : { calories: 0, carbs: 0, protein: 0, fat: 0 };

    res.json({ days, daily, averages: avg, totalEntries: logs.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// DELETE /api/progress/weight/:id
async function deleteWeight(req, res) {
  try {
    const entry = await Progress.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { logWeight, getWeightHistory, nutritionSummary, deleteWeight };
