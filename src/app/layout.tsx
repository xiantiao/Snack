import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "贪吃蛇游戏",
  description: "一个有趣的贪吃蛇游戏，带有 AI 助手功能",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="font-sans antialiased">
        <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </body>
    </html>
  );
}
