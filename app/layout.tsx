// ★ Tailwind を読み込むグローバル CSS
import "./globals.css";

export const metadata = {
  title: "サブスク TV ガイド PoC",
  description: "Find movies across your subscriptions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white text-black">
        {children}
      </body>
    </html>
  );
}