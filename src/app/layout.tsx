import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Sukčiai.lt | Viešųjų pinigų stebėsena",
  description: "Šaltiniais pagrįsta Lietuvos viešųjų pinigų ir piktnaudžiavimo stebėsena.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="lt">
      <body>{children}</body>
    </html>
  );
}
