import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/navbar/TopNav";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Match Me",
  description: "Dating Site for Geeks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        < TopNav />
        <main className="container mx-auto">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
