# Eksploatavimo vadovas

## Aplinka ir paslaugos

Programa naudoja Next.js, PostgreSQL ir pg-boss eilę. Privalomi gamybiniai kintamieji: `DATABASE_URL`, `OIDC_ISSUER`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`, `AI_API_KEY`; papildomi: `ALERT_WEBHOOK_URL`, `OBJECT_STORAGE_URL`, `SOURCE_CHECK_LIVE`. Paslaptys laikomos diegimo platformos saugykloje, ne Git.

Administravimo OIDC klientui įjungiamas MFA, trumpa sesija ir tikslūs `viewer`, `publisher`, `admin` vaidmenys. Prieš gamybą dabartinį claims adapterį būtina sujungti su pasirinktu OIDC tiekėju ir apsaugoti `/admin/*` middleware sluoksnyje.

## Diegimas

1. Sukurti atsarginę DB kopiją ir patikrinti atkūrimo tašką.
2. Paleisti `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
3. Paleisti migracijas atskiru vienkartiniu procesu: `npm run db:migrate`.
4. Diegti web procesą ir atskirą eilės workerį; tikrinti `/api/health`.
5. Paleisti `npm run check:sources -- --live` ir smoke testus.

`/api/health` laukas `database: not_configured` yra priimtinas tik vietiniame makete. Gamybos readiness tikrinimas privalo reikalauti `configured` ir atskiros realios DB užklausos.

## Šaltiniai ir incidentai

Leidžiamų domenų pakeitimas atliekamas per peržiūrimą PR. Dingęs šaltinis žymimas neprieinamu, bet jo atvejis ir metaduomenys netrinami. Kritiniai signalai: eilės klaida, publikavimo transakcijos klaida, neveikiantis pirminis šaltinis ir pasenęs atvejis. Jie siunčiami į `ALERT_WEBHOOK_URL`.

Incidento metu stabdomas automatinis publikavimas, išsaugomi žurnalai ir taisyklių/AI versijos, įvertinamas viešo turinio poveikis. Atkūrimas: grąžinti ankstesnį aplikacijos leidimą, atkurti DB tik į atskirą aplinką, patikrinti integralumą, tada suplanuoti kontroliuojamą perjungimą. Atsarginės kopijos šifruojamos; atkūrimo bandymas atliekamas kas ketvirtį.

Pataisymo prašymas registruojamas, patikrinami pateikti šaltiniai, o sprendimas ir viešas pakeitimas įrašomi audito žurnale. Teisiškai ar reputaciškai jautrus incidentas nedelsiant perduodamas atsakingam redaktoriui ir teisininkui.
