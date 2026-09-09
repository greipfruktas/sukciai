# sukciai.lt

Šaltiniais pagrįstas Lietuvos viešųjų lėšų ir institucijų sprendimų agregatorius. Portalas neatlieka pirminių tyrimų: viešas teiginys privalo turėti atsekamą šaltinį ir pereiti deterministinę publikavimo politiką.

## Vietinis paleidimas

Reikia Node.js 24, npm ir PostgreSQL 16.

```bash
cp .env.example .env.local
npm ci
docker compose up -d db
npm run db:migrate
npm run dev
```

Patikros: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`, `npm run check:sources`. Istorinio importo validacija: `npm run import:history -- --from 2021-09-09 --source-ids stt,teismai`.

Kol neprijungtas patikrintas istorinis rinkinys, viešame makete sąmoningai rodomi tik aiškiai pažymėti demonstraciniai duomenys. Gamybinio paleidimo sąlygos aprašytos [release checklist](docs/release-checklist.md).
