"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { SellerSearchResponse } from "./search";

const identifierHints: Record<string, string> = {
  phone: "+370 6xx xxxxx",
  iban: "LTxx xxxx xxxx xxxx xxxx",
  company_code: "9 skaitmenų įmonės kodas",
  name: "Vardas, pavardė arba veiklos pavadinimas",
  website: "example.lt",
  facebook: "facebook.com/profilis",
};

export function SellerSearchForm() {
  const [type, setType] = useState("company_code");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<SellerSearchResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true); setError(""); setResponse(null);
    try {
      const result = await fetch("/api/sellers/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, value: query.trim() }) });
      const body = await result.json();
      if (!result.ok) throw new Error(body.error || "Paieška nepavyko");
      setResponse(body);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Paieška nepavyko");
    } finally { setLoading(false); }
  }

  return <div className="seller-search-shell"><form className="seller-search" onSubmit={submit}><div className="search-kind"><label htmlFor="seller-search-type">Ko ieškote?</label><select id="seller-search-type" value={type} onChange={(event) => setType(event.target.value)}><option value="company_code">Įmonės kodo</option><option value="phone">Telefono numerio</option><option value="iban">Banko sąskaitos</option><option value="name">Vardo ar pavadinimo</option><option value="website">Svetainės</option><option value="facebook">Facebook profilio</option></select></div><div className="search-value"><label htmlFor="seller-search-value">Paieškos reikšmė</label><input id="seller-search-value" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={identifierHints[type]} required autoComplete="off" /></div><button type="submit" disabled={loading}>{loading ? "Tikrinama…" : "Patikrinti"}</button></form><p className="search-privacy">Telefono ir banko sąskaitos paieška veikia tik pagal visą tikslią reikšmę. Jos viešai nerodomos.</p><div className="search-feedback" aria-live="polite">{error ? <p className="form-error">{error}</p> : null}{response ? <>{response.results.map((seller) => <article className="search-match" key={seller.slug}><p className="section-label">Rastas patvirtintas sutapimas</p><h2><Link href={`/pardavejai/${seller.slug}`}>{seller.displayName}</Link></h2><p>{seller.summary}</p></article>)}<p className="search-disclaimer">{response.disclaimer}</p></> : null}</div></div>;
}
