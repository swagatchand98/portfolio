import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import ClientWrapper from "../components/ClientWrapper";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const openingSans = localFont({
  variable: "--font-opening-sans",
  src: '../../public/fonts/opening_hours_sans/OpeningHoursSans-Regular.woff2'
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swagat Chand - Portfolio",
  description: "Portfolio of Swagat Chand - Software Engineer, Web Developer, and Tech Enthusiast",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${geistMono.variable} ${openingSans.variable} antialiased font-sans`}
      >
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
