import NextAuth, { NextAuthOptions } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { employees } from "@/db/schema";
import { eq } from "drizzle-orm";

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
                    const dbUrl = process.env.DATABASE_URL || "postgresql://jvp_user:V3l4p4r3d3s@178.156.220.22:6432/ogess";
                    const { default: postgres } = await import("postgres");
                    const sql = postgres(dbUrl, { prepare: false });

                    const userResult = await sql`
                        SELECT * FROM employees 
                        WHERE dni = ${credentials.dni}
                        LIMIT 1
                    `;

                    await sql.end();

                    if (userResult.length === 0) {
                        return null;
                    }

                    const user = userResult[0];

                    const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password_hash);

                    if (!passwordsMatch) {
                        return null;
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        role: user.role,
                        dni: user.dni
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
                token.role = (user as any).role;
                token.dni = (user as any).dni;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id || token.sub;
                (session.user as any).role = token.role;
                (session.user as any).dni = token.dni;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || "1234567890abcdef1234567890abcdef", // Fallback for debugging
    session: {
        strategy: "jwt",
    }
};

const handler = NextAuth(authOptions);

export async function GET(req: NextRequest, ctx: any) {
    const protocol = req.headers.get("x-forwarded-proto") || req.nextUrl.protocol.replace(':', '') || "http";
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || req.nextUrl.host || "localhost:3000";

    if (!process.env.NEXTAUTH_URL) {
        process.env.NEXTAUTH_URL = `${protocol}://${host}`;
    }

    return handler(req, ctx);
}

export async function POST(req: NextRequest, ctx: any) {
    const protocol = req.headers.get("x-forwarded-proto") || req.nextUrl.protocol.replace(':', '') || "http";
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || req.nextUrl.host || "localhost:3000";

    if (!process.env.NEXTAUTH_URL) {
        process.env.NEXTAUTH_URL = `${protocol}://${host}`;
    }

    return handler(req, ctx);
}
