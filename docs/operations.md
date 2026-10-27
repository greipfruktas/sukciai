# Eksploatavimo vadovas

## Aplinka ir paslaugos

Programa naudoja Next.js, PostgreSQL, pg-boss eilę ir privačią S3 suderinamą objektų saugyklą. Privalomi gamybiniai kintamieji aprašyti `.env.example`; produkcijoje juos tikrina `validateProductionEnvironment`. Paslaptys laikomos tik VPS apsaugotame `.env.production` faile arba paslapčių saugykloje, ne Git.

Administravimo OIDC klientui įjungiamas MFA, trumpa sesija ir tikslūs `viewer`, `publisher`, `admin` vaidmenys. Prieš gamybą dabartinį claims adapterį būtina sujungti su pasirinktu OIDC tiekėju ir apsaugoti `/admin/*` middleware sluoksnyje.

## Diegimas

1. Sukurti atsarginę DB kopiją ir patikrinti atkūrimo tašką.
2. Paleisti `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
3. Paleisti migracijas atskiru vienkartiniu procesu: `npm run db:migrate`.
4. Diegti web procesą ir atskirą eilės workerį; tikrinti `/api/health`, workerio `ready` žurnalą ir privatų objektų bucket.
5. Paleisti `npm run check:sources -- --live` ir smoke testus.

`/api/health` laukas `database: not_configured` yra priimtinas tik vietiniame makete. Gamybos readiness tikrinimas privalo reikalauti `configured` ir atskiros realios DB užklausos. Konkretūs Hostinger žingsniai ir rollback tvarka pateikti `docs/hostinger-deployment.md`.

## Šaltiniai ir incidentai

Leidžiamų domenų pakeitimas atliekamas per peržiūrimą PR. Dingęs šaltinis žymimas neprieinamu, bet jo atvejis ir metaduomenys netrinami. Kritiniai signalai: eilės klaida, publikavimo transakcijos klaida, neveikiantis pirminis šaltinis ir pasenęs atvejis. Jie siunčiami į `ALERT_WEBHOOK_URL`.

Incidento metu stabdomas automatinis publikavimas, išsaugomi žurnalai ir taisyklių/AI versijos, įvertinamas viešo turinio poveikis. Atkūrimas: grąžinti ankstesnį aplikacijos leidimą, atkurti DB tik į atskirą aplinką, patikrinti integralumą, tada suplanuoti kontroliuojamą perjungimą. Atsarginės kopijos šifruojamos; atkūrimo bandymas atliekamas kas ketvirtį.

Pataisymo prašymas registruojamas, patikrinami pateikti šaltiniai, o sprendimas ir viešas pakeitimas įrašomi audito žurnale. Teisiškai ar reputaciškai jautrus incidentas nedelsiant perduodamas atsakingam redaktoriui ir teisininkui.
