import { NextResponse } from 'next/server';
import { db } from '@/db';
import { jobPostings, jobDocuments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET a specific job posting and its documents
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resolvedParams = await params;
        const jobId = resolvedParams.id;

        const jobs = await db.select().from(jobPostings).where(eq(jobPostings.id, jobId));

        if (jobs.length === 0) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        const job = jobs[0];

        // Fetch related documents
        const docs = await db.select().from(jobDocuments).where(eq(jobDocuments.jobPostingId, jobId));

        return NextResponse.json({ ...job, documents: docs });

    } catch (error: any) {
        console.error('Error fetching job details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// UPDATE a job posting
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resolvedParams = await params;
        const jobId = resolvedParams.id;
        const body = await request.json();

        const [updatedJob] = await db.update(jobPostings)
            .set({ ...body, updatedAt: new Date() })
            .where(eq(jobPostings.id, jobId))
            .returning();

        if (!updatedJob) {
            return NextResponse.json({ error: 'Job not found or update failed' }, { status: 404 });
        }

        return NextResponse.json(updatedJob);

    } catch (error: any) {
        console.error('Error updating job posting:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE a job posting
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resolvedParams = await params;
        const jobId = resolvedParams.id;

        // First delete all related documents
        await db.delete(jobDocuments).where(eq(jobDocuments.jobPostingId, jobId));

        // Then delete the job posting
        const [deletedJob] = await db.delete(jobPostings).where(eq(jobPostings.id, jobId)).returning();

        if (!deletedJob) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Job deleted successfully' });

    } catch (error: any) {
        console.error('Error deleting job:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
