/**
 * API helper — JWT-aware fetch wrapper for FitPantry backend
 */
const API = {
  base: '/api',

  getToken() {
    return localStorage.getItem('fitpantry_token');
  },

  setAuth(token, user) {
    localStorage.setItem('fitpantry_token', token);
    localStorage.setItem('fitpantry_user', JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem('fitpantry_token');
    localStorage.removeItem('fitpantry_user');
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem('fitpantry_user') || 'null');
    } catch {
      return null;
    }
  },

  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = this.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${this.base}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = new Error(data.message || `Request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }
    return data;
  },

  // Auth
  register: (body) => API.request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => API.request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => API.request('/auth/me'),

  // Profile
  getProfile: () => API.request('/profile'),
  updateProfile: (body) => API.request('/profile', { method: 'PUT', body: JSON.stringify(body) }),
  calculate: (body) => API.request('/profile/calculate', { method: 'POST', body: JSON.stringify(body) }),

  // Pantry
  getPantry: () => API.request('/pantry'),
  addPantryItem: (body) => API.request('/pantry/items', { method: 'POST', body: JSON.stringify(body) }),
  removePantryItem: (id) => API.request(`/pantry/items/${id}`, { method: 'DELETE' }),
  clearPantry: () => API.request('/pantry', { method: 'DELETE' }),

  // Recipes
  listRecipes: (qs = '') => API.request(`/recipes${qs}`),
  getRecipe: (id) => API.request(`/recipes/${id}`),
  suggestRecipes: (qs = '') => API.request(`/recipes/suggest/from-pantry${qs}`),

  // Food
  searchFood: (q, grams) => API.request(`/food/search?q=${encodeURIComponent(q)}&grams=${grams || 100}`),
  addFoodLog: (body) => API.request('/food/log', { method: 'POST', body: JSON.stringify(body) }),
  getFoodLog: (date) => API.request(`/food/log?date=${date}`),
  deleteFoodLog: (id) => API.request(`/food/log/${id}`, { method: 'DELETE' }),

  // Progress
  logWeight: (body) => API.request('/progress/weight', { method: 'POST', body: JSON.stringify(body) }),
  getWeight: () => API.request('/progress/weight'),
  deleteWeight: (id) => API.request(`/progress/weight/${id}`, { method: 'DELETE' }),
  nutritionSummary: (days) => API.request(`/progress/nutrition-summary?days=${days}`)
};
