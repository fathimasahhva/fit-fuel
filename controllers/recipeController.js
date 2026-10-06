/**
 * Recipe controller — list, detail, and smart pantry-based suggestions
 */
const Recipe = require('../models/Recipe');
const Pantry = require('../models/Pantry');

// GET /api/recipes?region=Kerala&category=breakfast&q=dosa
async function listRecipes(req, res) {
  try {
    const filter = {};
    if (req.query.region) filter.region = req.query.region;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.dietType) filter.dietType = req.query.dietType;
    if (req.query.q) filter.title = { $regex: req.query.q, $options: 'i' };

    const recipes = await Recipe.find(filter).sort({ title: 1 }).limit(100);
    res.json({ count: recipes.length, recipes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/recipes/:id
async function getRecipe(req, res) {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * Smart suggester: score recipes by % of required ingredients present in pantry.
 * Synonym map helps match "coconut" with "grated coconut", etc.
 */
const SYNONYMS = {
  coconut: ['grated coconut', 'coconut milk', 'copra'], rice: ['cooked rice', 'basmati', 'raw rice', 'sona masoori'],
  dal: ['toor dal', 'moong dal', 'masoor dal', 'lentils', 'thuvaram paruppu'], chilli: ['chili', 'green chilli', 'red chilli', 'dried red chilli'],
  curry: ['curry leaves', 'karuveppilai'], mustard: ['mustard seeds', 'kadugu'], cumin: ['jeera', 'cumin seeds'],
  turmeric: ['haldi', 'manjal'], asafoetida: ['hing', 'kayam'], jaggery: ['sharkara', 'gur'], tamarind: ['puli', 'imli'],
  shallot: ['small onion', 'pearl onion', 'kunjulli'], yogurt: ['curd', 'dahi', 'thayir'], fish: ['mackerel', 'sardine', 'mathi', 'ayala'],
  egg: ['eggs'], flour: ['all-purpose flour', 'plain flour', 'maida'], bread: ['toast', 'bread slices'], cheese: ['cheddar', 'cheddar cheese']
};

function normalizeIngredient(value) {
  let current = value;
  for (let depth = 0; depth < 6 && current && typeof current === 'object'; depth += 1) {
    current = current.name ?? current.ingredient ?? current.value ?? current.label ?? current.item;
  }
  if (typeof current !== 'string' && typeof current !== 'number') return '';
  return String(current).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');
}

// Convert pantry/recipe ingredient values in string or nested-object form
// into a normalized ingredient name.
function normalizeIngredient(value) {
  let current = value;

  // Follow common nested ingredient shapes without looping indefinitely.
  for (let depth = 0; depth < 5 && current && typeof current === 'object'; depth += 1) {
    current =
      current.name ??
      current.ingredient ??
      current.value ??
      current.label;
  }

  if (typeof current !== 'string' && typeof current !== 'number') return '';

  return String(current)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function ingredientMatches(needed, haveSet) {
  const normalizedNeeded = normalizeIngredient(needed);
  if (!normalizedNeeded) return false;

  if (haveSet.has(normalizedNeeded)) return true;

  // Match useful multi-word variants, while avoiding empty-string matches.
  for (const have of haveSet) {
    if (
      have &&
      (have.includes(normalizedNeeded) || normalizedNeeded.includes(have))
    ) {
      return true;
    }
  }

  for (const [key, synonyms] of Object.entries(SYNONYMS)) {
    const related = [key, ...synonyms].map(normalizeIngredient);
    const neededMatchesGroup = related.some(
      (term) =>
        term &&
        (normalizedNeeded.includes(term) || term.includes(normalizedNeeded))
    );

    if (!neededMatchesGroup) continue;

    for (const have of haveSet) {
      if (
        related.some(
          (term) => term && (have.includes(term) || term.includes(have))
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

// GET /api/recipes/suggest/from-pantry?minMatch=15&region=Kerala
async function suggestFromPantry(req, res) {
  try {
    const pantry = await Pantry.findOne({ userId: req.user._id });

    const have = (pantry?.ingredients || [])
      .map((item) => normalizeIngredient(item?.name ?? item))
      .filter(Boolean);

    const haveSet = new Set(have);

    if (haveSet.size === 0) {
      return res.json({
        message: 'Your pantry is empty — add ingredients to get suggestions',
        suggestions: []
      });
    }

    const filter = {};
    if (req.query.region) filter.region = req.query.region;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.dietType) filter.dietType = req.query.dietType;

    const recipes = await Recipe.find(filter);

    // Lower default allows recipes to appear when the pantry is small.
    // An explicit minMatch=0 is honored; invalid values use the default.
    const requestedMinMatch = Number(req.query.minMatch);
    const minMatch = Number.isFinite(requestedMinMatch)
      ? Math.min(100, Math.max(0, requestedMinMatch))
      : 15;

    const suggestions = recipes
      .map((recipe) => {
        const ingredients = recipe.ingredients || [];
        const required = ingredients.filter((item) => !item.optional);
        const optional = ingredients.filter((item) => item.optional);

        const matchedRequired = required.filter((item) =>
          ingredientMatches(item.name, haveSet)
        );
        const matchedOptional = optional.filter((item) =>
          ingredientMatches(item.name, haveSet)
        );

        const missing = required
          .filter((item) => !ingredientMatches(item.name, haveSet))
          .map((item) => normalizeIngredient(item.name))
          .filter(Boolean);

        const matchPercent = required.length
          ? Math.round((matchedRequired.length / required.length) * 100)
          : 100;

        return {
          recipe,
          matchPercent,
          matchedCount: matchedRequired.length + matchedOptional.length,
          requiredCount: required.length,
          missing,
          canCook: matchPercent >= 80
        };
      })
      .filter((suggestion) => suggestion.matchPercent >= minMatch)
      .sort(
        (a, b) =>
          b.matchPercent - a.matchPercent ||
          (a.recipe.prepTimeMins ?? Infinity) -
            (b.recipe.prepTimeMins ?? Infinity)
      );

    return res.json({
      pantryItems: [...haveSet],
      count: suggestions.length,
      suggestions
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
module.exports = { listRecipes, getRecipe, suggestFromPantry };
