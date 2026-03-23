import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env file.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteOldBucket() {
    console.log("Emptying and deleting old bucket 'documents'...");

    // Empty the bucket entirely before deletion
    console.log("Emptying the bucket...");
    const { data: emptyData, error: emptyError } = await supabase.storage.emptyBucket('documents');

    if (emptyError) {
        console.warn("Could not empty bucket properly (or it was already empty):", emptyError.message);
    }

    const { data, error } = await supabase.storage.deleteBucket('documents');

    if (error) {
        console.error("❌ Error deleting bucket:", error.message);
    } else {
        console.log("✅ Successfully deleted old bucket 'documents':", data);
    }
}

deleteOldBucket();
