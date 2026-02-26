import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { MegaMenu } from "@/components/layout/MegaMenu";

const inter = Inter({ subsets: ["latin"] });
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Back RRHH | Institucional",
  description: "Sistema HRMS Back RRHH para entidad Pública",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 antialiased`}>
        <MegaMenu />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
