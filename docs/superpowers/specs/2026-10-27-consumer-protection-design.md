# Sukčiai.lt vartotojų patikros ir pranešimų sistemos dizainas

Data: 2026-10-27

## Tikslas

Žmogus prieš pervesdamas avansą ar pirkdamas paslaugą galės patikrinti pardavėją pagal telefono numerį, banko sąskaitą, įmonės kodą, vardą, pavadinimą, svetainę arba „Facebook“ nuorodą. Nukentėjęs žmogus galės pateikti dokumentais pagrįstą pranešimą. Portalas nieko neviešins automatiškai: administratorius patikrins dokumentus, oficialius šaltinius ir pardavėjo atsakymą, tada priims audituojamą sprendimą.

Dabartinė viešųjų pinigų dalis lieka atskira skiltis. Pradinis puslapis ir pagrindinė navigacija pirmiausia aptarnaus vartotoją, kuris nori patikrinti pardavėją.

## Pasirinktas produkto modelis

Svarstyti trys keliai: visiškas dabartinio portalo pakeitimas, dvi atskiros skiltys viename portale ir antras atskiras projektas. Pasirinktos dvi skiltys viename portale. Jos naudos bendrą šaltinių, administravimo, pataisymų ir audito sistemą, tačiau vartotojų ginčai nesimaišys su viešųjų pinigų paieškos rezultatais.

## Paieška

Pradiniame puslapyje pateikiama viena paieškos forma. Ji priima:

- Lietuvos ar tarptautinį telefono numerį;
- IBAN banko sąskaitą;
- įmonės kodą;
- asmens vardą ir pavardę arba veiklos pavadinimą;
- svetainės adresą;
- „Facebook“ profilio, puslapio ar skelbimo nuorodą.

Sistema normalizuoja reikšmes, o jautrius identifikatorius saugo užšifruotus ir papildomai indeksuoja raktiniu HMAC maišos kodu. Vieša tiksli paieška gali rasti sutapimą pagal visą telefono numerį ar sąskaitą, tačiau atsakymas rodo tik užmaskuotą reikšmę. Dalinė telefono numerio ar sąskaitos paieška neveiks.

Jei duomenų nerasta, portalas aiškiai pasako, kad rezultato nebuvimas nepatvirtina pardavėjo patikimumo. Paieška nerodys nepublikuotų pranešimų skaičiaus ar jų egzistavimo.

## Pranešimo forma

Pranešėjas pateikia savo tikrą vardą, patvirtina el. paštą ir telefono numerį. Stipresnis tapatybės patvirtinimas pirmai versijai nepriklauso.

Forma renka pardavėjo telefoną, vardą ar pavadinimą, banko sąskaitą, įmonės kodą, svetainę, „Facebook“ nuorodą, situacijos aprašymą, mokėjimo sumą ir datą, pažadėtą terminą, faktinę darbų būseną ir oficialaus pranešimo numerį. Darbų būsenos: neatlikti, atlikti iš dalies, atlikti pavėluotai, atlikti su trūkumais.

Pranešėjas gali įkelti ekrano nuotraukas, sutartį, mokėjimo dokumentą ir kitus įrodymus. Sistema riboja tipą, dydį ir skaičių, tikrina kenkėjišką turinį, pašalina vaizdų metaduomenis ir dokumentus laiko privačioje objektų saugykloje. Viešinimui administratorius gali pasirinkti tik nuasmenintą ištrauką.

## Patikrinimas ir publikavimas

Administratorius mato visus pateiktus duomenis, originalius dokumentus, susietus pranešimus, oficialių šaltinių rezultatus ir pardavėjo poziciją. Administratorius gali atmesti pranešimą, paprašyti papildymo, palikti stebėjimui, pradėti atsakymo teisės procesą arba publikuoti.

Įprastai pardavėjas gauna septynias kalendorines dienas atsakyti. Administratorius gali paskelbti anksčiau tik dėl pasikartojančio ir dokumentais pagrįsto pavojaus; publikacijoje tada nurodoma, kad atsakymo dar laukiama.

Publikavimo lygiai:

1. Vienas dokumentais patikrintas pranešimas: „redakcijos patikrintas vartotojo ginčas“. Portalas neskelbia kaltės išvados.
2. Bent du nepriklausomi dokumentais patikrinti panašūs pranešimai: „pasikartojančių pranešimų perspėjimas“.
3. Viešas policijos, VVTAT, teismo ar kitos kompetentingos institucijos dokumentas: rodoma tiksli oficiali proceso būsena ir šaltinis.

Administratorius priima galutinį sprendimą visais trimis atvejais. Sistema užregistruoja naudotus šaltinius, priežastis, taisyklių versiją, administratorių ir laiką.

## Viešas profilis

Viešas pardavėjo profilis rodo naudojamus vardus ar veiklos pavadinimus, užmaskuotus identifikatorius, veiklos sritį, dabartinę būseną, patikrintų pranešimų chronologiją, apytiksles sumas, pardavėjo atsakymą ir oficialius šaltinius. Profilis nenaudoja „sukčius“ kaip automatinės etiketės.

Visas telefono numeris, banko sąskaita, pranešėjo tapatybė ir originalūs įrodymai prieinami tik įgaliotiems administratoriams. Pardavėjui šie duomenys neperduodami automatiškai.

## Duomenų modelis

Nauji pagrindiniai objektai:

- `SellerProfile`: fizinio ar juridinio pardavėjo viešas profilis ir dabartinė būsena.
- `SellerIdentifier`: normalizuotas identifikatoriaus tipas, užšifruota reikšmė, HMAC indeksas ir vieša užmaskuota forma.
- `ConsumerReport`: pranešėjas, sandorio aplinkybės, suma, darbų būsena ir administravimo būsena.
- `EvidenceFile`: privatus failas, tipas, kontrolinė suma, antivirusinio tikrinimo ir nuasmeninimo būsena.
- `ReporterVerification`: el. pašto ir telefono patvirtinimo datos.
- `SellerResponse`: kontaktavimo būdas, terminas, gautas atsakymas ir viešintina ištrauka.
- `ReportDecision`: administratoriaus veiksmas, priežastys, publikavimo lygis ir audito duomenys.

Esami `Source`, `Claim`, `TimelineEvent`, `PublicationDecision` ir `Correction` objektai lieka bendri abiem portalo skiltims.

## Saugumas ir privatumas

- Visi įkėlimai pagal nutylėjimą privatūs.
- Atsisiuntimo nuorodos trumpalaikės ir prieinamos pagal vaidmenį.
- Telefono numeris ir IBAN paieškai indeksuojami HMAC, o originalas šifruojamas atskiru raktu.
- Paieška ribojama pagal IP ir įrenginį; sistema registruoja piktnaudžiavimo signalus.
- Administravimo dalis privalo naudoti OIDC, MFA ir veiksmų auditą prieš realių pranešimų priėmimą.
- Saugojimo terminus, teisėtą pagrindą, atsakymo teisę ir pirmus realius atvejus prieš paleidimą peržiūri Lietuvos žiniasklaidos ir duomenų apsaugos teisės specialistas.

## Viešos sąsajos struktūra

Pagrindinio puslapio viršuje rodoma didelė pardavėjo patikros forma ir aiškus veiksmas „Pranešti atvejį“. Žemiau pateikiamas paieškos paaiškinimas, naujausi administratoriaus patvirtinti vartotojų perspėjimai, saugaus pirkimo atmintinė ir nuoroda į atskirą „Viešieji pinigai“ skiltį.

Pranešimo forma dalijama į penkis žingsnius: pranešėjo kontaktai, pardavėjo identifikatoriai, sandoris, darbų rezultatas, įrodymai ir patvirtinimas. Naršyklė išsaugo juodraštį tame pačiame įrenginyje, bet serveris pranešimą sukuria tik pateikus formą ir patvirtinus kontaktus.

Administratoriaus eilėje rodoma, kas jau patikrinta, kurie identifikatoriai sutampa, kokių dokumentų trūksta, kada baigiasi septynių dienų atsakymo terminas ir kokį publikavimo lygį leidžia taisyklės.

## Hostinger diegimas

Tikslinė aplinka: „Hostinger“ VPS, kuriame veikia Node.js aplikacija, PostgreSQL, atskiras eilės workeris ir atvirkštinis tarpinis serveris su TLS. Objektų failai saugomi S3 suderinamoje privačioje saugykloje; jie nelaikomi aplikacijos diske ar viešame kataloge.

Diegimas naudos Docker Compose, atskiras paslaptis, automatines PostgreSQL atsargines kopijas, sveikatos patikrą, migracijų žingsnį ir grąžinimo į ankstesnę versiją procedūrą. Domenas jungiamas tik po staging patikros ir teisinės peržiūros.

## Pirmos versijos ribos

Pirma versija nebandys automatiškai nustatyti kaltės, neskelbs nepatikrintų pranešimų, neleis viešai naršyti visų telefono numerių ar sąskaitų, neteiks anoniminio komentavimo ir automatiškai neskaitys privačių „Facebook“ duomenų. Oficialūs šaltiniai tikrinami tik teisėtais viešais kanalais.

## Priėmimo kriterijai

- Tikslus telefono, IBAN, įmonės kodo, svetainės ar „Facebook“ URL sutapimas randa paskelbtą profilį.
- Viešas rezultatas nerodo pilno telefono, IBAN, pranešėjo tapatybės ar privačių failų.
- Nepublikuotas pranešimas neatskleidžiamas per paiešką, skaitiklius ar API.
- Vienas patikrintas pranešimas negali gauti pasikartojančio perspėjimo lygio.
- Pardavėjo atsakymo terminas ir kontaktavimo istorija matomi administratoriui.
- Administratorius gali atmesti, paprašyti papildymo, palikti stebėjimui arba publikuoti, o sistema registruoja sprendimą.
- „Viešieji pinigai“ lieka atskira veikianti skiltis.
- Mobilus ir darbalaukio srautai praeina prieinamumo, saugumo ir naršyklės testus.
