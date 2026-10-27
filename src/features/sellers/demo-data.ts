import type { PublicSellerRecord } from "./search";

export const demoSeller: PublicSellerRecord & {
  timeline: { date: string; title: string; description: string }[];
  sellerResponse: string;
  sources: { title: string; publisher: string; publishedAt: string; url: string }[];
} = {
  slug: "demonstracinis-pardavejas",
  displayName: "Demonstracinis pardavėjo profilis",
  status: "verified_dispute",
  summary: "Maketas rodo, kaip būtų pateikiamas vienas dokumentais patikrintas vartotojo ginčas, nenustatant pardavėjo kaltės.",
  publishedAt: new Date("2026-10-20T00:00:00Z"),
  identifiers: [{ type: "phone", maskedValue: "+370 6•• ••999" }, { type: "iban", maskedValue: "LT•• •••• •••• •••• 1000" }],
  timeline: [{ date: "2026-10-20", title: "Administratorius patvirtino publikaciją", description: "Patikrintas mokėjimo dokumentas, užsakymas ir susirašinėjimas." }],
  sellerResponse: "Demonstracinėje versijoje tikro pardavėjo pozicija nepateikiama.",
  sources: [{ title: "Demonstracinis vartotojo pateiktų dokumentų patikrinimo įrašas", publisher: "Sukčiai.lt testinė aplinka", publishedAt: "2026-10-20", url: "#saltinis-1" }],
};
