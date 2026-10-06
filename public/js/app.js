/**
 * FitPantry frontend app — routing, views, and UI bindings
 */
(function () {
  let currentUser = null;

  // ——— Toast ———
  function toast(msg, isError = false) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.toggle('error', isError);
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3200);
  }

  // ——— Avatar ———
  function updateAvatar(username) {
    const letter = (username || 'U').charAt(0).toUpperCase();
    document.getElementById('avatar-btn').textContent = letter;
  }

  // ——— Navigation / views ———
  function showView(name) {
    document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
    const view = document.getElementById(`view-${name}`);
    if (view) view.classList.add('active');

    document.querySelectorAll('.nav-link').forEach((a) => {
      a.classList.toggle('active', a.dataset.nav === name);
    });

    document.getElementById('mobile-menu')?.classList.remove('open');
    document.getElementById('mobile-menu')?.classList.add('hidden');

    // Lazy-load view data
    if (name === 'pantry') loadPantry();
    if (name === 'recipes') browseRecipes();
    if (name === 'foodlog') {
      const d = document.getElementById('foodlog-date');
      if (!d.value) d.valueAsDate = new Date();
      loadFoodLog();
    }
    if (name === 'profile') fillProfileForm();
    if (name === 'calculator') prefillCalc();
    if (name === 'progress') loadProgress();
    if (name === 'home' && currentUser) {
      document.getElementById('home-username').textContent = currentUser.username;
    }
  }

  function setAuthedUI(user) {
    currentUser = user;
    API.setAuth(API.getToken(), user);
    updateAvatar(user.username);
    document.getElementById('main-nav').classList.remove('hidden');
    document.getElementById('view-auth').classList.remove('active');
    showView('home');
  }

  function logout() {
    API.clearAuth();
    currentUser = null;
    document.getElementById('main-nav').classList.add('hidden');
    document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
    document.getElementById('view-auth').classList.add('active');
    toast('Logged out');
  }

  // ——— Auth tabs ———
  const AUTH_TAB_ACTIVE = 'flex-1 py-2.5 rounded-full font-semibold bg-olive-deep text-white transition';
  const AUTH_TAB_INACTIVE = 'flex-1 py-2.5 rounded-full font-semibold text-olive-deep transition';

  document.getElementById('tab-login').addEventListener('click', () => {
    document.getElementById('form-login').classList.remove('hidden');
    document.getElementById('form-register').classList.add('hidden');
    document.getElementById('tab-login').className = AUTH_TAB_ACTIVE;
    document.getElementById('tab-register').className = AUTH_TAB_INACTIVE;
    document.getElementById('auth-eyebrow').textContent = 'Welcome back';
    document.getElementById('auth-heading').textContent = 'Good to see you.';
    document.getElementById('auth-subtext').textContent = 'Pick up where your last good choice left off.';
  });
  document.getElementById('tab-register').addEventListener('click', () => {
    document.getElementById('form-register').classList.remove('hidden');
    document.getElementById('form-login').classList.add('hidden');
    document.getElementById('tab-register').className = AUTH_TAB_ACTIVE;
    document.getElementById('tab-login').className = AUTH_TAB_INACTIVE;
    document.getElementById('auth-eyebrow').textContent = 'Get started';
    document.getElementById('auth-heading').textContent = "Let's build your plate.";
    document.getElementById('auth-subtext').textContent = 'Set up your kitchen in under a minute.';
  });

  // Password show/hide toggles (login + register fields)
  document.querySelectorAll('.pw-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? '👁️' : '🙈';
    });
  });

  document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const data = await API.login({ email: fd.get('email'), password: fd.get('password') });
      API.setAuth(data.token, data.user);
      setAuthedUI(data.user);
      toast(`Welcome back, ${data.user.username}!`);
    } catch (err) {
      toast(err.message, true);
    }
  });

  document.getElementById('form-register').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const data = await API.register({
        username: fd.get('username'),
        email: fd.get('email'),
        password: fd.get('password')
      });
      API.setAuth(data.token, data.user);
      setAuthedUI(data.user);
      toast('Account created — let’s go!');
    } catch (err) {
      toast(err.message, true);
    }
  });

  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('logout-btn-mobile').addEventListener('click', logout);

  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    const m = document.getElementById('mobile-menu');
    m.classList.toggle('hidden');
    m.classList.toggle('open');
  });

  // Nav clicks
  document.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (!API.getToken() && el.dataset.nav !== undefined) return;
      showView(el.dataset.nav);
    });
  });

  // ——— Profile ———
  function fillProfileForm() {
    const form = document.getElementById('form-profile');
    if (!currentUser) return;
    form.username.value = currentUser.username || '';
    form.email.value = currentUser.email || '';
    const p = currentUser.profile || {};
    form.age.value = p.age || '';
    form.gender.value = p.gender || '';
    form.heightCm.value = p.heightCm || '';
    form.weightKg.value = p.weightKg || '';
    form.activityLevel.value = p.activityLevel || '';
    form.goal.value = p.goal || '';
    form.bio.value = p.bio || '';
  }

  document.getElementById('form-profile').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = {
      username: fd.get('username'),
      age: fd.get('age') ? Number(fd.get('age')) : undefined,
      gender: fd.get('gender'),
      heightCm: fd.get('heightCm') ? Number(fd.get('heightCm')) : undefined,
      weightKg: fd.get('weightKg') ? Number(fd.get('weightKg')) : undefined,
      activityLevel: fd.get('activityLevel'),
      goal: fd.get('goal'),
      bio: fd.get('bio')
    };
    try {
      const user = await API.updateProfile(body);
      currentUser = { ...currentUser, ...user, profile: user.profile };
      API.setAuth(API.getToken(), currentUser);
      updateAvatar(user.username);
      toast('Profile saved');
    } catch (err) {
      toast(err.message, true);
    }
  });

  // ——— Pantry ———
  async function loadPantry() {
    try {
      const pantry = await API.getPantry();
      const list = document.getElementById('pantry-list');
      const empty = document.getElementById('pantry-empty');
      list.innerHTML = '';
      if (!pantry.ingredients?.length) {
        empty.classList.remove('hidden');
        return;
      }
      empty.classList.add('hidden');
      pantry.ingredients.forEach((item) => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.innerHTML = `<span class="capitalize">${item.name}</span>${
          item.quantity ? ` · ${item.quantity}` : ''
        } <span class="opacity-60 text-xs">${item.category}</span>
          <button type="button" aria-label="Remove" data-id="${item._id}">×</button>`;
        chip.querySelector('button').addEventListener('click', async () => {
          try {
            await API.removePantryItem(item._id);
            toast('Removed');
            loadPantry();
          } catch (err) {
            toast(err.message, true);
          }
        });
        list.appendChild(chip);
      });
    } catch (err) {
      toast(err.message, true);
    }
  }

  document.getElementById('form-pantry').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await API.addPantryItem({
        name: fd.get('name'),
        quantity: fd.get('quantity'),
        category: fd.get('category')
      });
      e.target.reset();
      toast('Added to pantry');
      loadPantry();
    } catch (err) {
      toast(err.message, true);
    }
  });

  document.getElementById('clear-pantry-btn').addEventListener('click', async () => {
    if (!confirm('Clear entire pantry?')) return;
    try {
      await API.clearPantry();
      toast('Pantry cleared');
      loadPantry();
    } catch (err) {
      toast(err.message, true);
    }
  });

  // ——— Recipes ———
  function matchClass(pct) {
    if (pct >= 80) return 'match-high';
    if (pct >= 50) return 'match-mid';
    return 'match-low';
  }

  function renderRecipeCard(recipe, meta = null) {
    const div = document.createElement('article');
    div.className = 'panel hover:border-olive/30 transition cursor-pointer';
    const matchHtml = meta
      ? `<p class="text-sm font-bold ${matchClass(meta.matchPercent)}">${meta.matchPercent}% match${
          meta.canCook ? ' · Ready to cook' : ''
        }</p>
         ${
           meta.missing?.length
             ? `<p class="text-xs mt-1" style="color:var(--muted)">Missing: ${meta.missing.slice(0, 5).join(', ')}</p>`
             : ''
         }`
      : `<p class="text-xs mt-1" style="color:var(--muted)">${recipe.region} · ${recipe.category}</p>`;

    div.innerHTML = `
      <div class="flex gap-3">
        <span class="text-4xl">${recipe.imageEmoji || '🍛'}</span>
        <div class="flex-1 min-w-0">
          <h3 class="font-display font-bold text-lg text-olive-deep truncate">${recipe.title}</h3>
          <p class="text-sm line-clamp-2" style="color:var(--muted)">${recipe.description || ''}</p>
          ${matchHtml}
          <p class="text-xs mt-2 text-olive-soft">${recipe.prepTimeMins + recipe.cookTimeMins} min · ${recipe.dietType} · ~${recipe.caloriesPerServing} kcal</p>
        </div>
      </div>`;
    div.addEventListener('click', () => openRecipeModal(recipe._id || recipe));
    return div;
  }

  async function openRecipeModal(idOrRecipe) {
    const modal = document.getElementById('recipe-modal');
    const body = document.getElementById('recipe-modal-body');
    let recipe = idOrRecipe;
    if (typeof idOrRecipe === 'string' || idOrRecipe._id) {
      const id = typeof idOrRecipe === 'string' ? idOrRecipe : idOrRecipe._id;
      try {
        recipe = await API.getRecipe(id);
      } catch (err) {
        toast(err.message, true);
        return;
      }
    }
    body.innerHTML = `
      <div class="text-4xl mb-2">${recipe.imageEmoji || '🍛'}</div>
      <h3 class="font-display text-2xl font-bold text-olive-deep">${recipe.title}</h3>
      <p class="text-sm mb-3" style="color:var(--muted)">${recipe.region} · ${recipe.category} · ${recipe.dietType}</p>
      <p class="mb-4">${recipe.description || ''}</p>
      <h4 class="font-semibold mb-2">Ingredients</h4>
      <ul class="list-disc pl-5 mb-4 text-sm space-y-1">
        ${recipe.ingredients
          .map(
            (i) =>
              `<li><span class="capitalize">${i.name}</span>${i.amount ? ` — ${i.amount}` : ''}${
                i.optional ? ' <em>(optional)</em>' : ''
              }</li>`
          )
          .join('')}
      </ul>
      <h4 class="font-semibold mb-2">Instructions</h4>
      <ol class="list-decimal pl-5 text-sm space-y-2">
        ${recipe.instructions.map((s) => `<li>${s}</li>`).join('')}
      </ol>`;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  document.getElementById('close-modal').addEventListener('click', () => {
    const modal = document.getElementById('recipe-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });
  document.getElementById('recipe-modal').addEventListener('click', (e) => {
    if (e.target.id === 'recipe-modal') {
      e.target.classList.add('hidden');
      e.target.classList.remove('flex');
    }
  });

  async function browseRecipes() {
    const region = document.getElementById('recipe-region').value;
    const qs = region ? `?region=${encodeURIComponent(region)}` : '';
    try {
      const data = await API.listRecipes(qs);
      const box = document.getElementById('recipe-results');
      box.innerHTML = '';
      if (!data.recipes?.length) {
        box.innerHTML = '<p style="color:var(--muted)">No recipes yet. Run <code>npm run seed</code> on the server.</p>';
        return;
      }
      data.recipes.forEach((r) => box.appendChild(renderRecipeCard(r)));
    } catch (err) {
      toast(err.message, true);
    }
  }

  async function suggestRecipes() {
    const region = document.getElementById('recipe-region').value;
    const min = document.getElementById('recipe-minmatch').value;
    let qs = `?minMatch=${min}`;
    if (region) qs += `&region=${encodeURIComponent(region)}`;
    try {
      const data = await API.suggestRecipes(qs);
      const box = document.getElementById('recipe-results');
      box.innerHTML = '';
      if (!data.suggestions?.length) {
        box.innerHTML = `<p style="color:var(--muted)">${
          data.message || 'No matches — add more pantry items or lower the match threshold.'
        }</p>`;
        return;
      }
      data.suggestions.forEach((s) =>
        box.appendChild(
          renderRecipeCard(s.recipe, {
            matchPercent: s.matchPercent,
            missing: s.missing,
            canCook: s.canCook
          })
        )
      );
      toast(`${data.count} recipe suggestion(s)`);
    } catch (err) {
      toast(err.message, true);
    }
  }

  document.getElementById('btn-browse').addEventListener('click', browseRecipes);
  document.getElementById('btn-suggest').addEventListener('click', suggestRecipes);

  // ——— Food log ———
  document.getElementById('btn-food-search').addEventListener('click', async () => {
    const q = document.getElementById('food-search-q').value.trim();
    const grams = document.getElementById('food-search-g').value || 100;
    if (!q) return toast('Enter a food name', true);
    try {
      const data = await API.searchFood(q, grams);
      const box = document.getElementById('food-search-results');
      box.innerHTML = '';
      if (!data.results?.length) {
        box.innerHTML = '<p class="text-sm" style="color:var(--muted)">No results found.</p>';
        return;
      }
      data.results.forEach((f) => {
        const row = document.createElement('div');
        row.className = 'flex items-center justify-between gap-2 py-2 border-b border-olive/10 text-sm';
        row.innerHTML = `
          <div>
            <p class="font-semibold capitalize">${f.foodName}</p>
            <p style="color:var(--muted)">${f.servingSize} · ${f.calories} kcal · C${f.carbs} P${f.protein} F${f.fat} · <span class="text-xs">${f.source}</span></p>
          </div>
          <button type="button" class="btn-ghost text-xs py-1 px-2">Log</button>`;
        row.querySelector('button').addEventListener('click', async () => {
          try {
            await API.addFoodLog({
              foodName: f.foodName,
              servingSize: f.servingSize,
              calories: f.calories,
              carbs: f.carbs,
              protein: f.protein,
              fat: f.fat,
              mealType: 'other'
            });
            toast('Logged!');
            loadFoodLog();
          } catch (err) {
            toast(err.message, true);
          }
        });
        box.appendChild(row);
      });
    } catch (err) {
      toast(err.message, true);
    }
  });

  document.getElementById('form-foodlog').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await API.addFoodLog({
        foodName: fd.get('foodName'),
        servingSize: fd.get('servingSize') || '1 serving',
        mealType: fd.get('mealType'),
        calories: Number(fd.get('calories')),
        carbs: Number(fd.get('carbs')) || 0,
        protein: Number(fd.get('protein')) || 0,
        fat: Number(fd.get('fat')) || 0
      });
      e.target.reset();
      toast('Food logged');
      loadFoodLog();
    } catch (err) {
      toast(err.message, true);
    }
  });

  async function loadFoodLog() {
    const date = document.getElementById('foodlog-date').value || new Date().toISOString().slice(0, 10);
    try {
      const data = await API.getFoodLog(date);
      const totals = document.getElementById('foodlog-totals');
      const t = data.totals;
      totals.innerHTML = `
        <div class="bg-olive-sage/40 rounded-lg p-3"><p class="text-xs" style="color:var(--muted)">Calories</p><p class="font-display text-xl font-bold">${Math.round(t.calories)}</p></div>
        <div class="bg-olive-sage/40 rounded-lg p-3"><p class="text-xs" style="color:var(--muted)">Carbs</p><p class="font-display text-xl font-bold">${Math.round(t.carbs)}g</p></div>
        <div class="bg-olive-sage/40 rounded-lg p-3"><p class="text-xs" style="color:var(--muted)">Protein</p><p class="font-display text-xl font-bold">${Math.round(t.protein)}g</p></div>
        <div class="bg-olive-sage/40 rounded-lg p-3"><p class="text-xs" style="color:var(--muted)">Fat</p><p class="font-display text-xl font-bold">${Math.round(t.fat)}g</p></div>`;

      const list = document.getElementById('foodlog-list');
      list.innerHTML = '';
      if (!data.logs?.length) {
        list.innerHTML = '<p class="text-sm" style="color:var(--muted)">No entries for this day.</p>';
        return;
      }
      data.logs.forEach((log) => {
        const row = document.createElement('div');
        row.className = 'flex justify-between items-center gap-2 py-2 border-b border-olive/10 text-sm';
        row.innerHTML = `
          <div>
            <p class="font-semibold">${log.foodName} <span class="font-normal opacity-60">· ${log.mealType}</span></p>
            <p style="color:var(--muted)">${log.servingSize} · ${log.calories} kcal</p>
          </div>
          <button type="button" class="text-terracotta font-bold" data-id="${log._id}">×</button>`;
        row.querySelector('button').addEventListener('click', async () => {
          await API.deleteFoodLog(log._id);
          loadFoodLog();
        });
        list.appendChild(row);
      });
    } catch (err) {
      toast(err.message, true);
    }
  }

  document.getElementById('foodlog-date').addEventListener('change', loadFoodLog);

  // ——— Calculator ———
  function prefillCalc() {
    const p = currentUser?.profile || {};
    const form = document.getElementById('form-calc');
    if (p.weightKg) form.weightKg.value = p.weightKg;
    if (p.heightCm) form.heightCm.value = p.heightCm;
    if (p.age) form.age.value = p.age;
    if (p.gender) form.gender.value = p.gender;
    if (p.activityLevel) form.activityLevel.value = p.activityLevel;
    if (p.goal) form.goal.value = p.goal;
  }

  document.getElementById('form-calc').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const data = await API.calculate({
        weightKg: Number(fd.get('weightKg')),
        heightCm: Number(fd.get('heightCm')),
        age: Number(fd.get('age')),
        gender: fd.get('gender'),
        activityLevel: fd.get('activityLevel'),
        goal: fd.get('goal')
      });
      document.getElementById('calc-results').classList.remove('hidden');
      document.getElementById('calc-bmi').textContent = data.bmi;
      document.getElementById('calc-bmi-cat').textContent = data.bmiCategory;
      document.getElementById('calc-tdee').textContent = data.tdee;
      document.getElementById('calc-target').textContent = data.targetCalories;
      document.getElementById('calc-p').textContent = data.macros.proteinG;
      document.getElementById('calc-c').textContent = data.macros.carbsG;
      document.getElementById('calc-f').textContent = data.macros.fatG;

      const totalMacroCal =
        data.macros.proteinG * 4 + data.macros.carbsG * 4 + data.macros.fatG * 9;
      document.getElementById('bar-p').style.width =
        `${Math.round((data.macros.proteinG * 4) / totalMacroCal * 100)}%`;
      document.getElementById('bar-c').style.width =
        `${Math.round((data.macros.carbsG * 4) / totalMacroCal * 100)}%`;
      document.getElementById('bar-f').style.width =
        `${Math.round((data.macros.fatG * 9) / totalMacroCal * 100)}%`;

      const wbox = document.getElementById('calc-workouts');
      wbox.innerHTML = data.workouts
        .map(
          (w) => `
        <div class="border-l-4 border-ember pl-3 py-1">
          <p class="font-semibold text-olive-deep">${w.title} <span class="text-xs font-normal" style="color:var(--muted)">${w.duration}</span></p>
          <p class="text-sm" style="color:var(--muted)">${w.detail}</p>
        </div>`
        )
        .join('');
    } catch (err) {
      toast(err.message, true);
    }
  });

  // ——— Progress ———
  async function loadProgress() {
    try {
      const [weights, summary] = await Promise.all([
        API.getWeight(),
        API.nutritionSummary(document.getElementById('summary-days').value)
      ]);

      const chart = document.getElementById('weight-chart');
      chart.innerHTML = '';
      const hist = weights.history || [];
      if (hist.length) {
        const vals = hist.map((h) => h.weightKg);
        const min = Math.min(...vals) - 1;
        const max = Math.max(...vals) + 1;
        hist.slice(-14).forEach((h) => {
          const bar = document.createElement('div');
          bar.className = 'bar';
          const pct = ((h.weightKg - min) / (max - min)) * 100;
          bar.style.height = `${Math.max(8, pct)}%`;
          bar.title = `${h.weightKg} kg · ${new Date(h.recordedAt).toLocaleDateString()}`;
          chart.appendChild(bar);
        });
      } else {
        chart.innerHTML = '<p class="text-sm self-center" style="color:var(--muted)">No weight data yet</p>';
      }

      const wlist = document.getElementById('weight-list');
      wlist.innerHTML = hist
        .slice()
        .reverse()
        .slice(0, 10)
        .map(
          (h) =>
            `<div class="flex justify-between"><span>${new Date(h.recordedAt).toLocaleDateString()} — <strong>${h.weightKg} kg</strong> ${h.note || ''}</span></div>`
        )
        .join('');

      const avg = summary.averages;
      document.getElementById('summary-averages').innerHTML = `
        <div class="bg-olive-sage/40 rounded-lg p-3 text-center"><p class="text-xs" style="color:var(--muted)">Avg kcal</p><p class="font-bold text-lg">${avg.calories}</p></div>
        <div class="bg-olive-sage/40 rounded-lg p-3 text-center"><p class="text-xs" style="color:var(--muted)">Avg protein</p><p class="font-bold text-lg">${avg.protein}g</p></div>
        <div class="bg-olive-sage/40 rounded-lg p-3 text-center"><p class="text-xs" style="color:var(--muted)">Avg carbs</p><p class="font-bold text-lg">${avg.carbs}g</p></div>
        <div class="bg-olive-sage/40 rounded-lg p-3 text-center"><p class="text-xs" style="color:var(--muted)">Avg fat</p><p class="font-bold text-lg">${avg.fat}g</p></div>`;

      document.getElementById('summary-daily').innerHTML =
        (summary.daily || [])
          .map(
            (d) =>
              `<div class="flex justify-between border-b border-olive/10 py-1"><span>${d.date}</span><span>${Math.round(d.calories)} kcal · P${Math.round(d.protein)}g</span></div>`
          )
          .join('') || '<p style="color:var(--muted)">No nutrition logs in this period.</p>';
    } catch (err) {
      toast(err.message, true);
    }
  }

  document.getElementById('form-weight').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await API.logWeight({
        weightKg: Number(fd.get('weightKg')),
        note: fd.get('note')
      });
      e.target.reset();
      toast('Weight logged');
      loadProgress();
    } catch (err) {
      toast(err.message, true);
    }
  });

  document.getElementById('summary-days').addEventListener('change', loadProgress);

  // ——— Boot ———
  async function init() {
    const token = API.getToken();
    if (!token) return;

    try {
      const { user } = await API.me();
      setAuthedUI(user);
    } catch {
      API.clearAuth();
    }
  }

  init();
})();
