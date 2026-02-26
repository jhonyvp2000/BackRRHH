import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware() {
        // Automatically redirects if not authed, logic handled by callbacks.authorized
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
        pages: {
            signIn: '/login'
        },
        secret: process.env.NEXTAUTH_SECRET || "V3l4p4r3d3s2026BackRRHH!@#"
    }
);

export const config = {
    matcher: ['/seleccion/convocatorias/:path*', '/mi-portal/:path*'],
};
