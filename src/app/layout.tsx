import type { Metadata } from "next";
import { Geist_Mono, Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { IdleSessionGuard } from "@/components/idle-session";
import { PwaRegister } from "@/components/pwa-register";
import { TransactionToaster } from "@/components/transaction-toaster";
import { Toaster } from "@/components/ui/sonner";
import { BANK_NAME } from "@/lib/constants";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://firstcreditunion.com"),
  title: {
    default: BANK_NAME,
    template: `%s · ${BANK_NAME}`,
  },
  description:
    "E-Banking and operations console for First Credit Union.",
  applicationName: BANK_NAME,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "FCU",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "theme-color": "#0B2340",
  },
  icons: {
    icon: [
      { url: "/icon.svg?v=srudc2", type: "image/svg+xml" },
      { url: "/brand-mark.png?v=srudc2", type: "image/png", sizes: "64x64" },
      { url: "/favicon.ico?v=srudc2", sizes: "any" },
    ],
    shortcut: "/brand-mark.png?v=srudc2",
    apple: [
      { url: "/apple-touch-icon.png?v=srudc2", sizes: "180x180" },
      { url: "/email-mark.png?v=srudc2" },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster theme="light" />
        <TransactionToaster />
        <IdleSessionGuard />
        <PwaRegister />
      </body>
    </html>
  );
}
