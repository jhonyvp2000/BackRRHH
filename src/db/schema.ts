import { pgTable, text, varchar, timestamp, uuid, boolean, primaryKey } from 'drizzle-orm/pg-core';

// --- RBAC CORE SCHEMAS ---------------------------------------------------- //

// 1. Users Table
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    dni: varchar("dni", { length: 8 }).unique().notNull(),
    passwordHash: varchar("password_hash").notNull(),
    name: varchar("name").notNull(),
    lastname: varchar("lastname").notNull(),
    email: varchar("email").unique().notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Systems Table (e.g. BackRRHH, Hospital Portal)
export const systems = pgTable("systems", {
    id: varchar("id", { length: 50 }).primaryKey(), // 'backrrhh', 'hospital', 'fevrex'
    name: varchar("name").notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true),
});

// 3. Permissions Table (Universal Catalog of actions)
export const permissions = pgTable("permissions", {
    id: uuid("id").defaultRandom().primaryKey(),
    systemId: varchar("system_id", { length: 50 }).references(() => systems.id, { onDelete: 'cascade' }).notNull(),
    resource: varchar("resource").notNull(), // 'convocatorias', 'puestos_trabajo.salario'
    action: varchar("action").notNull(),     // 'create', 'read', 'update', 'delete'
    description: text("description"),
});

// 4. Roles Table (Logical Groupers of Permissions)
export const roles = pgTable("roles", {
    id: uuid("id").defaultRandom().primaryKey(),
    systemId: varchar("system_id", { length: 50 }).references(() => systems.id, { onDelete: 'cascade' }).notNull(),
    name: varchar("name").notNull(), // 'Especialista RRHH', 'Editor'
    description: text("description"),
});

// 5. Role Permissions (Matrix mapping Roles <-> Permissions)
export const rolePermissions = pgTable("role_permissions", {
    roleId: uuid("role_id").references(() => roles.id, { onDelete: 'cascade' }).notNull(),
    permissionId: uuid("permission_id").references(() => permissions.id, { onDelete: 'cascade' }).notNull(),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
    };
});

// 6. User System Roles (Final Assignment to Users)
export const userSystemRoles = pgTable("user_system_roles", {
    userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    systemId: varchar("system_id", { length: 50 }).references(() => systems.id, { onDelete: 'cascade' }).notNull(),
    roleId: uuid("role_id").references(() => roles.id, { onDelete: 'cascade' }).notNull(),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.userId, table.systemId, table.roleId] }),
    };
});

// --- BACK RRHH SCHEMAS ---------------------------------------------------- //

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
    createdBy: uuid('created_by').references(() => users.id).notNull(),
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
