import type { Metadata } from "next";
import Link from "next/link";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Sukčiai.lt | Viešųjų pinigų stebėsena",
  description: "Šaltiniais pagrįsta Lietuvos viešųjų pinigų ir piktnaudžiavimo stebėsena.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="lt">
      <body>
        <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
        <header className="site-header">
          <div className="utility-bar">
            <span>Trečiadienis, rugsėjo 9 d.</span>
            <span>Šaltiniais pagrįsta viešųjų lėšų stebėsena</span>
          </div>
          <div className="masthead">
            <Link className="wordmark" href="/" aria-label="Sukčiai.lt pradžia">SUKČIAI<span>.LT</span></Link>
            <p>Faktai. Būsena. Šaltiniai.</p>
          </div>
          <nav className="main-nav" aria-label="Pagrindinė navigacija">
            <Link href="/">Naujausia</Link><Link href="/skaidrinam">Skaidrinam</Link><Link href="/paieska">Atvejų registras</Link><Link href="/savivaldybes/demonstracine">Savivaldybės</Link><Link href="/metodika">Metodika</Link><Link className="nav-search" href="/paieska">Paieška <span aria-hidden="true">⌕</span></Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <div><Link className="wordmark wordmark--footer" href="/">SUKČIAI<span>.LT</span></Link><p>Portalas agreguoja viešai paskelbtą informaciją ir neatlieka pirminių tyrimų.</p></div>
          <nav aria-label="Apatinė navigacija"><a href="/metodika">Metodika</a><a href="/pataisymai">Pataisymai ir atsakymo teisė</a><a href="/kontaktai">Kontaktai</a><a href="/privatumas">Privatumas</a></nav>
        </footer>
      </body>
    </html>
  );
}
