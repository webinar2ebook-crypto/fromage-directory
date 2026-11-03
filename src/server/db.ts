import pg from 'pg';
import dotenv from 'dotenv';
import { CHEESES } from '../data/cheeses.ts';

dotenv.config();

const { Pool } = pg;

const DEFAULT_NEON_URL =
  'postgresql://neondb_owner:npg_KDMr43pGuwYX@ep-withered-water-bc7fqu0u-pooler.c-16.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const connectionString = process.env.DATABASE_URL || DEFAULT_NEON_URL;

export const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes('sslmode=require') || connectionString?.includes('neon.tech')
    ? { rejectUnauthorized: false }
    : undefined,
  max: 10,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

export interface CheeseDbRow {
  id: string;
  slug: string;
  name: string;
  moniker: string;
  country: string;
  region: string;
  flag: string;
  image: string;
  short_description: string;
  full_description: string;
  milk: string;
  texture: string;
  aging: string;
  flavor_notes: string[];
  pairings: string[];
  serving_tip: string;
  fun_fact: string;
  created_at?: string;
  updated_at?: string;
}

export function rowToCheese(row: CheeseDbRow) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    moniker: row.moniker || '',
    country: row.country,
    region: row.region,
    flag: row.flag,
    image: row.image,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    milk: row.milk,
    texture: row.texture,
    aging: row.aging,
    flavorNotes: Array.isArray(row.flavor_notes) ? row.flavor_notes : [],
    pairings: Array.isArray(row.pairings) ? row.pairings : [],
    servingTip: row.serving_tip,
    funFact: row.fun_fact,
  };
}

/**
 * Initializes the Neon PostgreSQL table and seeds the 3 famous cheeses if empty.
 */
export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    try {
      console.log('Connecting to Neon PostgreSQL database...');

      // 1. Create cheeses table
      await client.query(`
        CREATE TABLE IF NOT EXISTS cheeses (
          id VARCHAR(64) PRIMARY KEY,
          slug VARCHAR(64) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          moniker VARCHAR(255),
          country VARCHAR(128) NOT NULL,
          region VARCHAR(255) NOT NULL,
          flag VARCHAR(16) NOT NULL,
          image TEXT NOT NULL,
          short_description TEXT NOT NULL,
          full_description TEXT NOT NULL,
          milk VARCHAR(255) NOT NULL,
          texture VARCHAR(255) NOT NULL,
          aging VARCHAR(128) NOT NULL,
          flavor_notes TEXT[] NOT NULL DEFAULT '{}',
          pairings TEXT[] NOT NULL DEFAULT '{}',
          serving_tip TEXT NOT NULL,
          fun_fact TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      console.log('Table "cheeses" verified/created successfully in Neon.');

      // 2. Check if table has rows; seed if empty
      const countRes = await client.query('SELECT COUNT(*) as count FROM cheeses');
      const count = parseInt(countRes.rows[0].count, 10);

      if (count === 0) {
        console.log('Seeding initial 3 famous cheeses into Neon database...');
        for (const cheese of CHEESES) {
          await client.query(
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
        console.log('Initial cheeses seeded into Neon PostgreSQL successfully.');
      } else {
        console.log(`Neon database already contains ${count} cheese records.`);
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to or initializing Neon database:', error);
  }
}
