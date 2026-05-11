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
  title: "AAUCAToolsCommunity | Inteligencia Artificial para Estudiantes",
  description: "Plataforma integral de IA para estudiantes de la AAUCA. Convierte archivos, transcribe clases y chatea con tus libros.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased bg-[#030712] text-white">
        {children}
      </body>
    </html>
  );
}
