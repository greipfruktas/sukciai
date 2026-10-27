# Privatumo poveikio kontrolinis sąrašas

Vertinimo data: 2026-10-27. Būsena: demonstracinė aplinka; tikrų pranešimų priėmimas išjungtas.

## Duomenys ir tikslas

- [x] Aprašytas tikslas: perspėti vartotoją tik pagal administratoriaus patikrintus ginčus ir oficialius šaltinius.
- [x] Viešoji paieška pagal telefoną ir IBAN reikalauja tikslaus sutapimo; pilna reikšmė neviešinama.
- [x] Identifikatoriai normalizuojami ir indeksuojami HMAC, naudojant atskirą produkcinę paslaptį.
- [x] Kontaktai, neapdoroti dokumentai ir techniniai metaduomenys nėra viešo profilio dalis.
- [x] Nuotraukų EXIF šalinamas prieš saugojimą; failų tipas, dydis ir kiekis ribojami.
- [ ] Lietuvos teisininkas patvirtino teisinį pagrindą, informavimo tekstą, saugojimo terminus ir teisėtų interesų balansą.

## Prieigos ir saugojimas

- [x] Viešas API grąžina tik publikuotus įrašus ir maskuotas reikšmes.
- [x] Publikavimas audituojamas, reikalauja leidėjo rolės ir priežasties; optimistinis versijavimas neleidžia dviejų sprendimų konflikto.
- [x] Produkcinė konfigūracija reikalauja privačios objektų saugyklos ir neleidžia `OBJECT_STORAGE_PUBLIC=true`.
- [x] DB kopijos šifruojamos ir laikomos atskirai; aprašytas atkūrimo bandymas.
- [ ] Staging aplinkoje patikrintas OIDC/MFA, sesijų galiojimas, administratoriaus middleware ir vaidmenys.
- [ ] Patvirtinti automatiniai duomenų ištrynimo terminai: atmesti pranešimai, įrodymai, auditas ir publikuoti įrašai.

## Asmens teisės ir incidentai

- [x] Pardavėjui prieš publikavimą skiriamos 7 kalendorinės dienos atsakyti.
- [x] Atsakymas ir vėlesni būsenos pokyčiai rodomi tame pačiame profilyje.
- [x] Yra pataisymo kelias ir audito pėdsakas.
- [ ] Paskirti duomenų valdytojas, kontaktas ir incidentų atsakingas asmuo.
- [ ] Patvirtinta prieigos/ištrynimo prašymų tapatybės tikrinimo procedūra ir 72 val. pažeidimo vertinimo procesas.

Kol nepažymėti teisiniai, tapatybės ir staging punktai, realių asmenų duomenys nepriimami ir nepublikuojami.
