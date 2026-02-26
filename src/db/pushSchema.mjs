import postgres from 'postgres';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load connection string (bypass dotnev parsing issues)
const connectionString = process.env.DATABASE_URL;

const sql = postgres(connectionString);

async function run() {
    try {
        await sql`SET search_path TO public`;
        console.log("Creating job_postings...");
        await sql`
            CREATE TABLE IF NOT EXISTS "job_postings" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                "title" text NOT NULL,
                "code" text NOT NULL,
                "regime" text NOT NULL,
                "vacancies" text NOT NULL,
                "description" text NOT NULL,
                "salary" text,
                "status" text DEFAULT 'DRAFT' NOT NULL,
                "publication_date" timestamp DEFAULT now() NOT NULL,
                "end_date" timestamp,
                "created_by" uuid NOT NULL REFERENCES "employees"("id"),
                "created_at" timestamp DEFAULT now() NOT NULL,
                "updated_at" timestamp DEFAULT now() NOT NULL
            );
        `;

        console.log("Creating job_documents...");
        await sql`
            CREATE TABLE IF NOT EXISTS "job_documents" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                "job_posting_id" uuid NOT NULL REFERENCES "job_postings"("id"),
                "title" text NOT NULL,
                "document_url" text NOT NULL,
                "document_type" text NOT NULL,
                "uploaded_at" timestamp DEFAULT now() NOT NULL
            );
        `;

        console.log("Success!");
    } catch (err) {
        console.error("Failed:", err);
    } finally {
        await sql.end();
    }
}

run();
