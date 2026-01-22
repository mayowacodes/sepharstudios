import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '$env/dynamic/private';

dotenv.config();
export const db = drizzle(env.DATABASE_URL!);
