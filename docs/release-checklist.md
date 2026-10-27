# Paleidimo kontrolinis sąrašas

Patikros data: 2026-10-27. Vartotojų apsaugos release patikrų bazinis commit: `e1fc477`.

- [x] Deterministinė A/B/C šaltinių ir publikavimo politika turi automatinius testus.
- [x] Teiginiai, santraukos ir chronologija išlaiko ryšį su šaltiniu.
- [x] Jautrus turinys turi leidėjo tvirtinimo bei audito kelią.
- [x] Viešas maketas, registras, atvejis, pataisymai ir administravimo eilė sukompiliuojami.
- [x] Darbalaukio ir mobilūs Playwright testai bei automatinė axe patikra įtraukti į CI.
- [x] Tikslios pardavėjo paieškos, no-result perspėjimo, lokalaus juodraščio, demonstracinio pateikimo, moderavimo, atsakymo ir maskuoto profilio srautas turi release testus.
- [x] Produkciniai konteineriai, TLS proxy, migracijos procesas, workeris, privati objektų saugykla ir šifruotos kopijos aprašyti bei konfigūracijos testuojamos.
- [x] Privatumo poveikio kontrolinis sąrašas įvardija likusius teisinius ir staging blokerius.
- [ ] PostgreSQL gamybos migracija ir reali readiness užklausa patikrinta staging aplinkoje.
- [ ] Pasirinktas OIDC tiekėjas, realiai įjungtas MFA ir `/admin/*` middleware.
- [ ] AI tiekėjo adapteris sukonfigūruotas, įvertintas fiksuotomis šaltinių kopijomis.
- [ ] Objektų saugykla, eilės workeris, alertai ir atsarginių kopijų atkūrimas patikrinti staging aplinkoje.
- [ ] Lietuvos žiniasklaidos teisės specialistas patvirtino politiką ir pirmą realų importą.
- [ ] Domenas, TLS, privatumo rekvizitai, redakcijos kontaktas ir duomenų valdytojas patvirtinti.

Kol visi nepažymėti punktai neužbaigti, leidžiama tik demonstracinė, realių asmenų neįvardijanti aplinka.
