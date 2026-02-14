import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is not set in environment variables');
}

export default defineConfig({
	schema: './src/lib/db/schema.ts',
	out: '../../drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: DATABASE_URL,
	},
});
