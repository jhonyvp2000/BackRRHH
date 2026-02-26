import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure it loads .env.local perfectly or explicitly connect
dotenv.config({ path: join(__dirname, '../../.env.local') });

async function addCol() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        console.error('DATABASE_URL not found in environment');
        process.exit(1);
    }

    const sql = postgres(connectionString);

    try {
        console.log("Adding is_public column to job_documents...");
        await sql`ALTER TABLE job_documents ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;`;
        console.log("Successfully added is_public column.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await sql.end();
    }
}

addCol();
