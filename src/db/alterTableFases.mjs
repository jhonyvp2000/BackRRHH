import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const sql = postgres(process.env.DATABASE_URL || 'postgresql://jvp_user:V3l4p4r3d3s@178.156.220.22:6432/control');

async function run() {
    try {
        await sql`ALTER TABLE job_postings ADD COLUMN department text;`;
        console.log('Column "department" added successfully.');
    } catch (e) {
        if (e.code === '42701') {
            console.log('Column already exists, proceeding.');
        } else {
            console.error(e);
        }
    } finally {
        sql.end();
    }
}
run();
