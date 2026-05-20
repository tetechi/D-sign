import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "デジタル印鑑メーカー | D-sign",
  description: "オリジナルの印鑑・ハンコをデザインしてPNGダウンロード",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
