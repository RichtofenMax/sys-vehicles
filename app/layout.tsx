import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SYS Vehicles | Premium Used Cars in Sheffield",
  description: "Browse our handpicked selection of quality used cars. Finance available. Part exchange welcome. Based in Sheffield — clean, well-maintained cars exactly as described.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "DM Sans, sans-serif" }}>{children}</body>
    </html>
  );
}
