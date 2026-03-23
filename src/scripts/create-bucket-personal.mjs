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

async function createConvocatoriasPersonalBucket() {
    console.log("Creating public bucket 'convocatoriaspersonal'...");

    const { data, error } = await supabase.storage.createBucket('convocatoriaspersonal', {
        public: true,
        allowedMimeTypes: ['application/pdf'],
        fileSizeLimit: 10485760, // 10MB
    });

    if (error) {
        if (error.message.includes('already exists')) {
            console.log("✅ The bucket 'convocatoriaspersonal' already exists.");

            console.log("Making sure it is public...");
            const { error: updateError } = await supabase.storage.updateBucket('convocatoriaspersonal', { public: true });
            if (updateError) console.error("Could not verify public status:", updateError);
            else console.log("✅ Verified as public.");

        } else {
            console.error("❌ Error creating bucket:", error);
        }
    } else {
        console.log("✅ Successfully created public bucket:", data);
    }
}

createConvocatoriasPersonalBucket();
