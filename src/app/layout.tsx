import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codex Config Editor",
  description: "Windows local editor for Codex config.toml",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
