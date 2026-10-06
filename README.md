# FitPantry

Full-stack fitness, meal planner, and recipe recommendation app focused on **South Indian & Kerala** cuisine.

## Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT auth
- **Frontend:** Vanilla HTML, Tailwind CSS (CDN), JavaScript (`fetch`)

## Features

- User registration / login with JWT
- Profile (age, height, weight, activity, goals)
- Pantry management
- Smart recipe suggestions from pantry ingredients
- Food search (built-in Indian staples + optional USDA FoodData Central)
- Food log with daily calorie/macro totals
- BMI / TDEE calculator with workout suggestions
- Weight & nutrition progress tracking

## Setup

### 1. Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 2. Install

```bash
npm install
```

### 3. Configure

Copy `.env.example` to `.env` (already present) and set:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing tokens |
| `USDA_API_KEY` | Optional — [get a free key](https://fdc.nal.usda.gov/api-key-signup) |

### 4. Seed recipes

```bash
npm run seed
```

### 5. Run

```bash
npm start
# or with auto-reload:
npm run dev
```

Open [http://localhost:5000](http://localhost:5000).

## API overview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Current user |
| GET/PUT | `/api/profile` | Yes | Profile |
| POST | `/api/profile/calculate` | Yes | BMI / TDEE |
| GET/POST/DELETE | `/api/pantry`… | Yes | Pantry CRUD |
| GET | `/api/recipes` | No | List recipes |
| GET | `/api/recipes/suggest/from-pantry` | Yes | Smart suggestions |
| GET | `/api/food/search` | Yes | Nutrition lookup |
| GET/POST/DELETE | `/api/food/log`… | Yes | Food log |
| GET/POST | `/api/progress/…` | Yes | Weight & summaries |

## Project structure

```
├── server.js
├── models/          # User, Pantry, FoodLog, Recipe
├── controllers/
├── routes/
├── middleware/
├── utils/nutritionDB.js
├── seed/seedRecipes.js
└── public/          # Frontend
```

## License

MIT
