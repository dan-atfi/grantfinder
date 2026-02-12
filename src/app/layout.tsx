import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrantFinder - Find UK Business Grants",
  description:
    "Search and discover UK government grants matched to your business. Powered by Companies House, UKRI, and Data.gov.uk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
