import { NextResponse } from 'next/server';
import { db } from '@/db';
import { jobPostings } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

// Add a new job posting
export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, code, regime, department, vacancies, description, salary, status } = body;

        if (!title || !code || !regime || !department || !vacancies || !description) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
        }

        const [newJob] = await db.insert(jobPostings).values({
            title,
            code,
            regime,
            department,
            vacancies,
            description,
            salary,
            status: status || 'DRAFT',
            createdBy: (session.user as any).id,
        }).returning();

        return NextResponse.json(newJob);

    } catch (error: any) {
        console.error('Error creating job posting:', error);
        return NextResponse.json({ error: 'Error interno del servidor al crear la convocatoria' }, { status: 500 });
    }
}

// Get all job postings for the admin dashboard
export async function GET(request: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const jobs = await db.select().from(jobPostings).orderBy(desc(jobPostings.createdAt));
        return NextResponse.json(jobs);
    } catch (error: any) {
        console.error('Error fetching admin jobs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
