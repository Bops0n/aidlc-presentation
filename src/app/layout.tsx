import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Presentation Builder",
  description: "AI-Powered Web-First Presentation Builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
