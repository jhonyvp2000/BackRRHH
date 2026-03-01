import NextAuth, { NextAuthOptions } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/db/index";
import { users, userSystemRoles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { rolePermissions, permissions as permissionsTable } from "@/db/schema";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                dni: { label: "DNI", type: "text" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.dni || !credentials?.password) {
                    return null;
                }

                try {
                    // Check user exists
                    const userResult = await db.select().from(users).where(eq(users.dni, credentials.dni));

                    if (userResult.length === 0) {
                        return null;
                    }

                    const user = userResult[0];

                    if (!user.isActive) {
                        return null;
                    }

                    // Check Password
                    const passwordsMatch = await bcrypt.compare(credentials.password, user.passwordHash);

                    if (!passwordsMatch) {
                        return null;
                    }

                    // Validate BackRRHH module access
                    const assignedRoles = await db.select()
                        .from(userSystemRoles)
                        .where(eq(userSystemRoles.userId, user.id));

                    // Check if they have access to backrrhh
                    const backrrhhRole = assignedRoles.find((r: any) => r.systemId === "backrrhh");
                    if (!backrrhhRole) {
                        return null; // Deny access if they aren't assigned to this module
                    }

                    // Fetch atomic permissions for this role
                    const permissionRows = await db.select({
                        resource: permissionsTable.resource,
                        action: permissionsTable.action
                    })
                        .from(rolePermissions)
                        .innerJoin(permissionsTable, eq(rolePermissions.permissionId, permissionsTable.id))
                        .where(eq(rolePermissions.roleId, backrrhhRole.roleId));

                    const atomicPermissions = permissionRows.map((p: any) => `${p.action}:${p.resource}`);

                    return {
                        id: user.id,
                        name: user.name,
                        lastname: user.lastname,
                        dni: user.dni,
                        roleId: backrrhhRole.roleId,
                        permissions: atomicPermissions
                    };

                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.dni = (user as any).dni;
                token.name = (user as any).name;
                token.lastname = (user as any).lastname;
                token.backrrhhRoleId = (user as any).roleId;
                token.permissions = (user as any).permissions || [];
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id || token.sub;
                (session.user as any).dni = token.dni;
                (session.user as any).name = token.name;
                (session.user as any).lastname = token.lastname;
                (session.user as any).backrrhhRoleId = token.backrrhhRoleId;
                (session.user as any).permissions = token.permissions || [];
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || "1234567890abcdef1234567890abcdef",
    session: {
        strategy: "jwt",
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
