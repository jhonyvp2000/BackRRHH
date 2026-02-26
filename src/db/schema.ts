import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const employees = pgTable('employees', {
    id: uuid('id').defaultRandom().primaryKey(),
    dni: text('dni').unique().notNull(), // Used as login username
    passwordHash: text('password_hash').notNull(),
    name: text('name').notNull(),
    role: text('role').default('user').notNull(), // 'user', 'admin', 'doctor', etc.
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const jobPostings = pgTable('job_postings', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    code: text('code').notNull(),
    regime: text('regime').notNull(),
    vacancies: text('vacancies').notNull(), // text in case they say "multiple" or "2"
    department: text('department'), // Area or internal unit 
    description: text('description').notNull(),
    salary: text('salary'), // opcional text based salary structure
    status: text('status').default('DRAFT').notNull(), // DRAFT, PUBLISHED, IN_EVALUATION, CLOSED, CANCELLED
    publicationDate: timestamp('publication_date').defaultNow().notNull(),
    endDate: timestamp('end_date'), // Optional open-ended recruitment
    currentStage: text('current_stage').default('PREPARATORIA').notNull(), // PREPARATORIA, CONVOCATORIA, EVALUACION_CURRICULAR, ENTREVISTAS, CONCLUIDO
    createdBy: uuid('created_by').references(() => employees.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const jobDocuments = pgTable('job_documents', {
    id: uuid('id').defaultRandom().primaryKey(),
    jobPostingId: uuid('job_posting_id').references(() => jobPostings.id).notNull(),
    title: text('title').notNull(),
    documentUrl: text('document_url').notNull(),
    documentType: text('document_type').notNull(), // BASES, RESULTS_PRE, COMMUNIQUE, RESULTS_FINAL, OTHER
    isPublic: boolean('is_public').default(true).notNull(), // Visibility toggle for public frontend
    uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});
