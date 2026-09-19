import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EV ATLAS — メーカー別 EV 普及台数',
  description: '世界のEVメーカー別普及台数と市場シェアを可視化するインフォグラフィック。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
