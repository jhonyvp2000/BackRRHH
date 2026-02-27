import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL || "", { prepare: false });

async function testConnection() {
    try {
        console.log("Connecting using prepare:false...");
        const users = await sql`SELECT id, dni, name FROM employees LIMIT 1`;
        console.log("Success! Users found:", users);
    } catch (e) {
        console.error("Connection failed:", e);
    } finally {
        await sql.end();
    }
}

testConnection();
