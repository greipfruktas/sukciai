import type { Metadata } from "next";
import Link from "next/link";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Sukčiai.lt | Patikrinkite prieš mokėdami",
  description: "Patikrintų vartotojų ginčų ir oficialių šaltinių informacijos portalas.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (process.env.PORTAL_MODE !== "demo") {
    return <html lang="lt"><body>{children}</body></html>;
  }
  return (
    <html lang="lt">
      <body>
        <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
        <header className="site-header">
          <div className="utility-bar">
            <span>Vartotojų saugumo portalas</span>
            <span>Patikrinta informacija · šaltiniai · atsakymo teisė</span>
          </div>
          <div className="masthead">
            <Link className="wordmark" href="/" aria-label="Sukčiai.lt pradžia">SUKČIAI<span>.LT</span></Link>
            <p>Patikrinkite prieš mokėdami.</p>
          </div>
          <nav className="main-nav" aria-label="Pagrindinė navigacija">
            <Link href="/">Tikrinti pardavėją</Link><Link href="/pranesti">Pranešti atvejį</Link><Link href="/pardavejai/demonstracinis-pardavejas">Patikrintas pavyzdys</Link><Link href="/viesieji-pinigai">Viešieji pinigai</Link><Link href="/metodika">Metodika</Link>
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
