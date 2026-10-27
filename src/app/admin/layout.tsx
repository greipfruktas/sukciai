import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell"><nav className="admin-nav" aria-label="Administravimo navigacija"><Link href="/admin/pranesimai">Vartotojų pranešimai</Link><Link href="/admin/review">Viešųjų pinigų juodraščiai</Link><span>Demonstracinė prieiga</span></nav>{children}</div>;
}
