import { NextResponse } from 'next/server';
import { db } from '@/db';
import { jobDocuments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://dummy.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy';
    return createClient(supabaseUrl, supabaseKey);
};


export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = getSupabase();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const resolvedParams = await params;
        const jobId = resolvedParams.id;

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const documentType = formData.get('documentType') as string;

        if (!file || !title || !documentType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${jobId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Convert Web File to ArrayBuffer for Supabase Node compat
        const fileBuffer = await file.arrayBuffer();

        // Upload to Supabase Storage (bucket named 'documents')
        const { data, error } = await supabase.storage
            .from('documents')
            .upload(fileName, fileBuffer, { contentType: file.type });

        if (error) throw new Error(`Supabase upload error: ${error.message}`);

        // Get public URL
        const { data: publicData } = supabase.storage.from('documents').getPublicUrl(fileName);

        // Save to Database
        const [newDoc] = await db.insert(jobDocuments).values({
            jobPostingId: jobId,
            title,
            documentType,
            documentUrl: publicData.publicUrl,
            isPublic: true
        }).returning();

        return NextResponse.json(newDoc);

    } catch (error: any) {
        console.error('Error uploading document:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { docId, isPublic, title, documentType } = await request.json();

        const updates: any = {};
        if (isPublic !== undefined) updates.isPublic = isPublic;
        if (title !== undefined) updates.title = title;
        if (documentType !== undefined) updates.documentType = documentType;

        const [updatedDoc] = await db.update(jobDocuments)
            .set(updates)
            .where(eq(jobDocuments.id, docId))
            .returning();

        return NextResponse.json(updatedDoc);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const docId = searchParams.get('docId');

        if (!docId) return NextResponse.json({ error: 'Missing docId' }, { status: 400 });

        // Retrieve document to find the supabase path
        const docs = await db.select({ url: jobDocuments.documentUrl }).from(jobDocuments).where(eq(jobDocuments.id, docId));

        if (docs.length > 0) {
            // Delete from Postgres first
            await db.delete(jobDocuments).where(eq(jobDocuments.id, docId));

            // Note: Since public urls from supabase do not give exact path names easily without regex,
            // we will skip supabase real deletion for this emergency patch, or handle it via a storage trigger.
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
