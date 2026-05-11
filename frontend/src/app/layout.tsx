import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AAUCAToolsCommunity | IA por Tranquilino Mba Ncogo",
  description: "Plataforma de IA desarrollada por Tranquilino Mba Ncogo el 11/05/2026 para estudiantes de la AAUCA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${outfit.className} antialiased bg-white text-black`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
