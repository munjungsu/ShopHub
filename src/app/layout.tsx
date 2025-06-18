import type { Metadata } from "next";
import "./globals.scss";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "ShopHub - 최고의 제품을 합리적인 가격으로",
  description: "다양한 카테고리의 프리미엄 제품들을 만나보세요. 품질과 가격 모두 만족하는 쇼핑 경험을 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
