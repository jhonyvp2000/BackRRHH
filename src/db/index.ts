import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

let globalDb: any = null;

// Ensure database is only connected when actually queried at runtime
function getDb() {
    if (globalDb) return globalDb;

    const connectionString = process.env.DATABASE_URL || "postgresql://jvp_user:V3l4p4r3d3s@178.156.220.22:6432/ogess";
    const client = postgres(connectionString, { prepare: false });
    globalDb = drizzle(client, { schema });
    return globalDb;
}

export const db = new Proxy({} as any, {
    get: (target, prop) => {
        const actualDb = getDb();
        return actualDb[prop];
    }
});
