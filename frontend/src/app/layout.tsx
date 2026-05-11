import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AAUCAToolsCommunity | IA por Tranquilino Mba Ngogo",
  description: "Plataforma de IA desarrollada por Tranquilino Mba Ngogo el 11/05/2026 para estudiantes de la AAUCA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased bg-white text-black">
        {children}
      </body>
    </html>
  );
}
