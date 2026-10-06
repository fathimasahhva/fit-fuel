/**
 * Auth controller — register, login, get current user
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Pantry = require('../models/Pantry');

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

// POST /api/auth/register
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const exists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });
    if (exists) {
      return res.status(409).json({ message: 'Username or email already in use' });
    }

    const user = await User.create({ username, email, password });

    // Create empty pantry for new user
    await Pantry.create({ userId: user._id, ingredients: [] });

    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/auth/me
async function me(req, res) {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      profile: req.user.profile
    }
  });
}

module.exports = { register, login, me };
