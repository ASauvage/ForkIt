import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '@config/env.js';
import * as schema from './schemas/index.js';

const pool = new Pool({
    connectionString: env.databaseUrl
});

export const db = drizzle(pool, { schema });
