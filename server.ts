import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pool, initializeDatabase, rowToCheese, CheeseDbRow } from './src/server/db.ts';
import { CHEESES } from './src/data/cheeses.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// API Endpoints

// 1. Health check & DB status
app.get('/api/health', async (_req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW() as current_time, COUNT(*) as count FROM cheeses');
    res.json({
      status: 'healthy',
      database: 'connected',
      provider: 'Neon PostgreSQL',
      cheeseCount: parseInt(dbRes.rows[0].count, 10),
      timestamp: dbRes.rows[0].current_time,
    });
  } catch (err: any) {
    console.error('Database health check failed:', err);
    res.status(500).json({
      status: 'degraded',
      database: 'disconnected',
      error: err.message || 'Database connection error',
    });
  }
});

// 2. Get all cheeses
app.get('/api/cheeses', async (_req, res) => {
  try {
    const result = await pool.query<CheeseDbRow>(
      'SELECT * FROM cheeses ORDER BY created_at ASC'
    );
    if (result.rows.length === 0) {
      return res.json(CHEESES);
    }
    const cheeses = result.rows.map(rowToCheese);
    res.json(cheeses);
  } catch (err: any) {
    console.error('Error fetching cheeses from Neon DB:', err);
    // Graceful fallback to initial structured cheeses if DB temporarily unreachable
    res.json(CHEESES);
  }
});

// 3. Get single cheese by slug or ID
app.get('/api/cheeses/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query<CheeseDbRow>(
      'SELECT * FROM cheeses WHERE slug = $1 OR id = $1 LIMIT 1',
      [slug]
    );
    if (result.rows.length > 0) {
      return res.json(rowToCheese(result.rows[0]));
    }
    const fallback = CHEESES.find((c) => c.slug === slug || c.id === slug);
    if (fallback) {
      return res.json(fallback);
    }
    res.status(404).json({ error: 'Cheese not found' });
  } catch (err: any) {
    console.error(`Error fetching cheese ${slug}:`, err);
    const fallback = CHEESES.find((c) => c.slug === slug || c.id === slug);
    if (fallback) {
      return res.json(fallback);
    }
    res.status(500).json({ error: 'Failed to retrieve cheese' });
  }
});

// 4. Create / add a new cheese record to Neon
app.post('/api/cheeses', async (req, res) => {
  try {
    const {
      name,
      country,
      region,
      flag,
      shortDescription,
      fullDescription,
      milk,
      texture,
      aging,
      flavorNotes,
      pairings,
      servingTip,
      funFact,
      moniker,
      image,
    } = req.body;

    if (!name || !country || !shortDescription) {
      return res.status(400).json({
        error: 'Missing required fields: name, country, and shortDescription are mandatory.',
      });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const id = slug || `cheese-${Date.now()}`;

    // Select default flag based on country if not provided
    let assignedFlag = flag;
    if (!assignedFlag) {
      const lowerCountry = country.toLowerCase();
      if (lowerCountry.includes('ital')) assignedFlag = '🇮🇹';
      else if (lowerCountry.includes('franc')) assignedFlag = '🇫🇷';
      else if (lowerCountry.includes('nether') || lowerCountry.includes('holland') || lowerCountry.includes('dutch')) assignedFlag = '🇳🇱';
      else if (lowerCountry.includes('spain')) assignedFlag = '🇪🇸';
      else if (lowerCountry.includes('switzerland') || lowerCountry.includes('swiss')) assignedFlag = '🇨🇭';
      else if (lowerCountry.includes('uk') || lowerCountry.includes('england') || lowerCountry.includes('britain')) assignedFlag = '🇬🇧';
      else if (lowerCountry.includes('united states') || lowerCountry.includes('usa')) assignedFlag = '🇺🇸';
      else assignedFlag = '🧀';
    }

    const defaultImage = image || '/src/assets/images/cheese_hero_spread_1793673378350.jpg';

    const insertResult = await pool.query<CheeseDbRow>(
      `INSERT INTO cheeses (
        id, slug, name, moniker, country, region, flag, image,
        short_description, full_description, milk, texture, aging,
        flavor_notes, pairings, serving_tip, fun_fact
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13,
        $14, $15, $16, $17
      ) RETURNING *`,
      [
        id,
        slug,
        name,
        moniker || `Artisanal ${country} Specialty`,
        country,
        region || country,
        assignedFlag,
        defaultImage,
        shortDescription,
        fullDescription || shortDescription,
        milk || "Traditional Cow's Milk",
        texture || 'Firm, artisanal paste',
        aging || 'Matured naturally',
        flavorNotes || ['Rich', 'Artisanal', 'Savory'],
        pairings || ['Crusty artisan bread', 'Regional wine'],
        servingTip || 'Serve at room temperature for maximum flavor bouquet.',
        funFact || 'Handcrafted following regional dairy heritage.',
      ]
    );

    res.status(201).json(rowToCheese(insertResult.rows[0]));
  } catch (err: any) {
    console.error('Error inserting new cheese into Neon:', err);
    res.status(500).json({ error: err.message || 'Failed to save cheese to database' });
  }
});

// 5. Reset to original 3 cheeses
app.post('/api/cheeses/reset', async (_req, res) => {
  try {
    await pool.query('DELETE FROM cheeses');
    for (const cheese of CHEESES) {
      await pool.query(
        `INSERT INTO cheeses (
          id, slug, name, moniker, country, region, flag, image,
          short_description, full_description, milk, texture, aging,
          flavor_notes, pairings, serving_tip, fun_fact
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13,
          $14, $15, $16, $17
        ) ON CONFLICT (id) DO NOTHING`,
        [
          cheese.id,
          cheese.slug,
          cheese.name,
          cheese.moniker,
          cheese.country,
          cheese.region,
          cheese.flag,
          cheese.image,
          cheese.shortDescription,
          cheese.fullDescription,
          cheese.milk,
          cheese.texture,
          cheese.aging,
          cheese.flavorNotes,
          cheese.pairings,
          cheese.servingTip,
          cheese.funFact,
        ]
      );
    }
    const result = await pool.query<CheeseDbRow>('SELECT * FROM cheeses ORDER BY created_at ASC');
    res.json({ message: 'Reset successfully', cheeses: result.rows.map(rowToCheese) });
  } catch (err: any) {
    console.error('Error resetting cheeses in Neon:', err);
    res.status(500).json({ error: err.message || 'Failed to reset cheeses' });
  }
});

async function startServer() {
  // Initialize database schema and initial data
  await initializeDatabase();

  // In development, hook Vite middleware; in production, serve built dist/
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`The Fromage Directory server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
});
