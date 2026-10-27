# Diegimas į Hostinger VPS

Šis projektas skirtas ne bendro naudojimo PHP hostingui, o Hostinger VPS su Docker Compose. Viešai atveriami tik 80 ir 443 prievadai; PostgreSQL, workeris ir privati MinIO įrodymų saugykla lieka vidiniame Docker tinkle.

## Pirmas paleidimas

1. Sukurkite VPS su bent 4 GB RAM, įdiekite Docker Engine ir Compose papildinį, DNS `A/AAAA` įrašus nukreipkite į VPS.
2. Klonuokite repozitoriją į atskirą sistemos naudotojo katalogą. Nukopijuokite `.env.example` į `.env.production`, sugeneruokite unikalias paslaptis ir apribokite failą `chmod 600`.
3. OIDC tiekėjo pusėje įjunkite MFA ir pridėkite tikslų produkcinį callback adresą. `IDENTIFIER_HASH_SECRET` ir saugyklos raktų po paleidimo nekeiskite be migracijos plano.
4. Paleiskite `docker compose -f docker-compose.production.yml config`, tada `docker compose -f docker-compose.production.yml up -d --build`.
5. Patikrinkite migracijos proceso išėjimo kodą, `/api/health`, workerio žurnalą ir tai, kad MinIO prievadas nėra pasiekiamas iš interneto.

## Atsarginės kopijos ir atkūrimo bandymas

Laikykite `age` gavėjo viešą raktą `BACKUP_AGE_RECIPIENT`, o privatų raktą — už VPS ribų. Kasnakt paleiskite tam skirtą atvaizdą: `docker compose -f docker-compose.production.yml --profile backup run --rm backup`. Jame yra ir `pg_dump`, ir `age`, o `/backups` prijungtas kaip atskiras tomas. Užšifruotas kopijas reguliariai perkelkite į kitą regioną ar tiekėją.

Kas ketvirtį atlikite atkūrimo bandymą izoliuotoje staging DB: iššifruokite kopiją, paleiskite `pg_restore --clean --if-exists`, vykdykite `npm run db:check` ir smoke testus. Produkcinės DB neatkurkite tiesiogiai, kol staging patikra nebaigta.

## Atnaujinimas ir grąžinimas

Prieš diegimą pažymėkite veikiančio commit SHA ir sukurkite kopiją. Atnaujinimui naudokite konkretų Git tag, perkurkite atvaizdus ir stebėkite sveikatos patikrą. Rollback metu grįžkite į ankstesnį tag ir perkurkite tik web/worker atvaizdus. DB migracijų neatšaukinėkite automatiškai; jei schema nesuderinama, stabdykite publikavimą ir vykdykite dokumentuotą atkūrimą į atskirą DB.

## Prieš priimant tikrus pranešimus

Reikalinga: veikiantis OIDC/MFA, el. pašto ir telefono patvirtinimo tiekėjai, privatus failų bucket, atkūrimo bandymas, stebėsena bei Lietuvos teisininko patvirtinta privatumo ir publikavimo politika. Iki tol forma lieka demonstracinė ir duomenų į serverį nesiunčia.
