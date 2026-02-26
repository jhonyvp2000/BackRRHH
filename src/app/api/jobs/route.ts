import { NextResponse } from 'next/server';
import { db } from '@/db';
import { jobPostings } from '@/db/schema';
import { desc, or, eq } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        // Only fetch jobs that are PUBLISHED or IN_EVALUATION
        const jobs = await db.select({
            id: jobPostings.id,
            title: jobPostings.title,
            code: jobPostings.code,
            regime: jobPostings.regime,
            department: jobPostings.department,
            vacancies: jobPostings.vacancies,
            status: jobPostings.status,
            endDate: jobPostings.endDate,
        })
            .from(jobPostings)
            .where(
                or(
                    eq(jobPostings.status, 'PUBLISHED'),
                    eq(jobPostings.status, 'IN_EVALUATION')
                )
            )
            .orderBy(desc(jobPostings.createdAt));

        return NextResponse.json(jobs);
    } catch (error: any) {
        console.error('Error fetching public jobs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
