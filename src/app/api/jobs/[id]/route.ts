import { NextResponse } from 'next/server';
import { db } from '@/db';
import { jobPostings, jobDocuments } from '@/db/schema';
import { eq, desc, and, or } from 'drizzle-orm';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id: jobId } = await context.params;

        // Fetch job ensuring it's publicly visible
        const job = await db.query.jobPostings.findFirst({
            where: and(
                eq(jobPostings.id, jobId),
                or(
                    eq(jobPostings.status, 'PUBLISHED'),
                    eq(jobPostings.status, 'IN_EVALUATION')
                )
            )
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found or not visible' }, { status: 404 });
        }

        // Fetch attached documents (Only public ones)
        const documents = await db.select().from(jobDocuments)
            .where(
                and(
                    eq(jobDocuments.jobPostingId, jobId),
                    eq(jobDocuments.isPublic, true)
                )
            )
            .orderBy(desc(jobDocuments.uploadedAt));

        return NextResponse.json({ ...job, documents });

    } catch (error: any) {
        console.error('Error fetching public job details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
