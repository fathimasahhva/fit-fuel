/**
 * Food / nutrition controller — USDA + local DB lookup, food log CRUD
 */
const FoodLog = require('../models/FoodLog');
const { searchLocal, scaleNutrition } = require('../utils/nutritionDB');

/**
 * Fetch from USDA FoodData Central if API key is configured
 */
async function searchUSDA(query) {
  const key = process.env.USDA_API_KEY;
  if (!key) return [];

  try {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${key}&query=${encodeURIComponent(query)}&pageSize=8`;
    const response = await fetch(url);
    if (!response.ok) return [];

    const data = await response.json();
    return (data.foods || []).map((f) => {
      const nutrients = f.foodNutrients || [];
      const get = (id) => {
        const n = nutrients.find((x) => x.nutrientId === id || x.nutrientNumber === String(id));
        return n ? n.value || 0 : 0;
      };
      // USDA nutrient IDs: 1008 kcal, 1005 carbs, 1003 protein, 1004 fat
      const byName = (names) => {
        const n = nutrients.find((x) =>
          names.some((name) => (x.nutrientName || '').toLowerCase().includes(name))
        );
        return n ? n.value || 0 : 0;
      };

      return {
        name: f.description,
        calories: get(1008) || byName(['energy']),
        carbs: get(1005) || byName(['carbohydrate']),
        protein: get(1003) || byName(['protein']),
        fat: get(1004) || byName(['total lipid', 'fat']),
        unit: '100g',
        fdcId: f.fdcId,
        source: 'usda'
      };
    });
  } catch {
    return [];
  }
}

// GET /api/food/search?q=rice&grams=100
async function searchFood(req, res) {
  try {
    const q = (req.query.q || '').trim();
    const grams = Number(req.query.grams) || 100;
    if (!q) return res.status(400).json({ message: 'Query parameter q is required' });

    const local = searchLocal(q);
    const usda = await searchUSDA(q);

    // Prefer local Indian staples first, then USDA
    const combined = [...local, ...usda];
    const results = combined.map((f) => scaleNutrition(f, grams));

    res.json({ query: q, grams, count: results.length, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// POST /api/food/log
async function addFoodLog(req, res) {
  try {
    const { foodName, servingSize, calories, carbs, protein, fat, mealType, timestamp } = req.body;
    if (!foodName || calories === undefined) {
      return res.status(400).json({ message: 'foodName and calories are required' });
    }

    const entry = await FoodLog.create({
      userId: req.user._id,
      foodName,
      servingSize: servingSize || '1 serving',
      calories: Number(calories),
      carbs: Number(carbs) || 0,
      protein: Number(protein) || 0,
      fat: Number(fat) || 0,
      mealType: mealType || 'other',
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// GET /api/food/log?date=YYYY-MM-DD
async function getFoodLog(req, res) {
  try {
    const filter = { userId: req.user._id };

    if (req.query.date) {
      const start = new Date(req.query.date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      filter.timestamp = { $gte: start, $lt: end };
    } else if (req.query.from && req.query.to) {
      filter.timestamp = {
        $gte: new Date(req.query.from),
        $lte: new Date(req.query.to)
      };
    }

    const logs = await FoodLog.find(filter).sort({ timestamp: -1 }).limit(200);

    const totals = logs.reduce(
      (acc, l) => {
        acc.calories += l.calories;
        acc.carbs += l.carbs;
        acc.protein += l.protein;
        acc.fat += l.fat;
        return acc;
      },
      { calories: 0, carbs: 0, protein: 0, fat: 0 }
    );

    res.json({ logs, totals, count: logs.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// DELETE /api/food/log/:id
async function deleteFoodLog(req, res) {
  try {
    const entry = await FoodLog.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!entry) return res.status(404).json({ message: 'Log entry not found' });
    res.json({ message: 'Deleted', id: entry._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { searchFood, addFoodLog, getFoodLog, deleteFoodLog };
