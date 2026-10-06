/**
 * FitPantry — Express server entry point
 * Connects MongoDB, mounts REST API routes, and serves the frontend.
 */
require('dotenv').config();

// Windows often fails mongodb+srv SRV lookups via local DNS — prefer public resolvers
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const pantryRoutes = require('./routes/pantry');
const foodRoutes = require('./routes/food');
const recipeRoutes = require('./routes/recipes');
const profileRoutes = require('./routes/profile');
const progressRoutes = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 5000;

// ——— Middleware ———
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static frontend (vanilla HTML + Tailwind CDN)
app.use(express.static(path.join(__dirname, 'public')));

// ——— API Routes ———
app.use('/api/auth', authRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'FitPantry',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// SPA-style fallback: serve index for unknown non-API paths
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ——— Global error handler ———
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

// ——— Auto-seed recipes if collection is empty ———
async function ensureRecipes() {
  const Recipe = require('./models/Recipe');
  const count = await Recipe.countDocuments();
  if (count > 0) return;

  console.log('… No recipes found — seeding South Indian / Kerala recipes');
  // Re-use seed data by spawning the seed script logic inline
  const { spawn } = require('child_process');
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['seed/seedRecipes.js'], {
      cwd: __dirname,
      stdio: 'inherit',
      env: process.env
    });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`seed exit ${code}`))));
  });
}

// ——— MongoDB + Start ———
async function start() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitpantry';

  try {
    // family: 4 prefers IPv4 — avoids some Windows SRV/DNS lookup failures with Atlas
    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 15000 });
    console.log('✓ MongoDB connected');
    try {
      await ensureRecipes();
    } catch (seedErr) {
      console.warn('⚠ Recipe seed skipped:', seedErr.message);
    }
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message);
    console.error('  Options:');
    console.error('  • Install MongoDB Community and start the service');
    console.error('  • Or start Docker Desktop, then: docker run -d -p 27017:27017 --name fitpantry-mongo mongo:7');
    console.error('  • Or set MONGODB_URI in .env to a MongoDB Atlas connection string');
    console.error('  • In Atlas → Network Access, allow your IP (or 0.0.0.0/0 for testing)');
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`✓ FitPantry running at http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`✗ Port ${PORT} is already in use.`);
      console.error(`  Free it, or set a different PORT in .env`);
      process.exit(1);
    }
    throw err;
  });
}

start();
