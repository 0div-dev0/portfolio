import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import CursorOrb from "@/components/cursor-orb";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import ScrollAnimations from "@/components/scroll-animations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Portfolio 2026",
  description: "Design in black & white, colour returns on contact.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SmoothScrollProvider>
            <ScrollAnimations />
            {children}
            <CursorOrb size={30} blur="10px" transitionSpeed={0.08} />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
