# sukciai.lt produkto ir sistemos dizainas

Data: 2026-09-09  
Būsena: parengta užsakovo peržiūrai

## 1. Tikslas

`sukciai.lt` renka ir aiškiai pateikia patikrintą informaciją apie Lietuvos politikų, valstybės tarnautojų, savivaldybių ir kitų viešojo sektoriaus dalyvių galimus pažeidimus, viešųjų pirkimų problemas bei viešųjų lėšų naudojimą.

Portalas neatlieka pirminių žurnalistinių tyrimų. Jis surenka viešus šaltinius, sujungia pranešimus apie tą patį atvejį, parengia neutralią santrauką ir rodo skaitytojui faktų kilmę. Portalas neviešina informacijos, kuri nepasiekia šiame dokumente nustatyto patvirtinimo slenksčio.

Pirmos versijos turinys apima pastaruosius penkerius metus ir atskirą „Skaidrinam“ atvejų rinkinį.

## 2. Redakciniai principai

### 2.1. Faktų kilmė

Kiekvienas viešas faktinis teiginys turi nuorodą į konkretų šaltinį. Nuoroda apima šaltinio pavadinimą, publikavimo datą, autorių arba instituciją, dokumento numerį, kai jis yra, ir pirminį URL.

Portalas visose publikacijose pateikia šį paaiškinimą:

> Portalas neatlieka pirminio tyrimo. Ši santrauka parengta pagal žemiau nurodytus viešus šaltinius.

Paaiškinimas nepakeičia faktų tikrinimo, atsakymo teisės ar taisymo tvarkos.

### 2.2. Procesinis statusas

Sistema saugo ir rodo vieną iš kontroliuojamų būsenų:

- paskelbta institucijos informacija;
- pradėtas tyrimas;
- pareikšti įtarimai;
- pateikti kaltinimai;
- byla nagrinėjama;
- priimtas neįsiteisėjęs sprendimas;
- priimtas įsiteisėjęs sprendimas;
- tyrimas nutrauktas;
- asmuo išteisintas;
- institucijos išvada panaikinta arba pakeista.

Santrauka nevartoja žodžių „sukčius“, „pavogė“, „nusikaltėlis“ ar lygiaverčių teiginių apie konkretų žmogų, jei galutinis oficialus šaltinis to nenustato. Antraštė ir paieškos rezultatas rodo tą patį tikslumo lygį kaip visas tekstas.

### 2.3. Lygiavertis atnaujinimas

Sistema skiria tokį pat matomumą kaltinimą paneigiančiai informacijai, tyrimo nutraukimui, išteisinimui ir sprendimo panaikinimui. Ji išsaugo ankstesnes versijas ir rodo pakeitimų žurnalą.

## 3. Šaltinių politika

### 3.1. Šaltinių lygiai

**A lygis, pirminiai oficialūs šaltiniai:** Lietuvos teismai, prokuratūra, STT, FNTT, VTEK, VRK, Viešųjų pirkimų tarnyba, Valstybės kontrolė, savivaldybės, Teisės aktų registras ir kitos kompetentingos institucijos.

**B lygis, profesionali žiniasklaida:** redakcinę atsakomybę turintys Lietuvos leidiniai, kurių publikacijose galima nustatyti autorių, datą ir faktų kilmę. Sistema kiekvieną leidinį įtraukia į administratoriaus valdomą leidžiamų šaltinių sąrašą.

**C lygis, signaliniai šaltiniai:** socialinių tinklų įrašai, tinklaraščiai, politikų pareiškimai ir anoniminiai pranešimai. Sistema naudoja juos temoms aptikti. C lygio šaltinis negali pagrįsti viešos publikacijos.

### 3.2. Publikavimo slenkstis

Sistema gali publikuoti faktą, jei tenkina vieną iš sąlygų:

- A lygio šaltinis tiesiogiai patvirtina faktą savo kompetencijos ribose;
- du nepriklausomi B lygio šaltiniai patvirtina faktą ir bent vienas nurodo patikrinamą pirminę medžiagą.

Sistema taip pat turi nustatyti datą, susijusį asmenį ar instituciją, procesinę būseną ir kiekvieno santraukos teiginio šaltinį. Neišspręstas prieštaravimas tarp šaltinių sustabdo automatinį publikavimą.

### 3.3. Autorių teisės ir citavimas

Portalas nekopijuoja visų straipsnių. Jis kuria savą trumpą santrauką, naudoja tik faktui pagrįsti reikalingą citatos apimtį ir siunčia skaitytoją į pirminį šaltinį. Prieš paleidimą teisininkas turi patikrinti citavimo, duomenų saugojimo, asmens duomenų ir atsakomybės tvarką pagal Lietuvos bei Europos Sąjungos teisę.

## 4. Publikavimo eiga

1. Surinkimo moduliai gauna naują įrašą iš RSS, API, viešo puslapio ar dokumentų registro.
2. Sistema normalizuoja datą, autorių, instituciją, URL ir dokumento identifikatorių.
3. Dublikatų modulis lygina URL, teksto panašumą, asmenis, datas ir bylos numerius.
4. Susiejimo modulis priskiria įrašą esamam atvejui arba sukuria kandidatą naujam atvejui.
5. Faktų ištraukimo modulis suformuoja struktūrinius teiginius ir kiekvienam priskiria šaltinio ištrauką.
6. Taisyklių modulis patikrina šaltinių lygį, nepriklausomumą, prieštaravimus ir procesinę būseną.
7. Santraukos modulis kuria antraštę, santrauką ir chronologijos įvykius tik iš patvirtintų teiginių.
8. Sistema publikuoja užbaigtą oficialų faktą arba siunčia jautrų atvejį administratoriui.
9. Atnaujinimo modulis tikrina šaltinius ir keičia atvejį, kai institucija paskelbia naują proceso etapą.

Sistema saugo AI užklausos versiją, taisyklių versiją, naudotus šaltinius ir publikavimo sprendimo priežastį. Administratorius gali atsekti kiekvieną paskelbtą sakinį iki jo šaltinio.

## 5. Automatinis ir administratoriaus tvirtinamas turinys

### 5.1. Automatinis publikavimas

Sistema gali be žmogaus patvirtinimo paskelbti:

- įsiteisėjusį teismo sprendimą;
- galutinę kompetentingos institucijos išvadą;
- oficialų tyrimo nutraukimą ar išteisinimą;
- jau paskelbto atvejo techninį atnaujinimą, kuris nekeičia teiginio prasmės.

### 5.2. Vieno paspaudimo patvirtinimas

Administratorius turi patvirtinti:

- informaciją apie pradėtą arba nebaigtą tyrimą;
- įtarimus, kaltinimus ir neįsiteisėjusius sprendimus;
- atvejus, kuriuose šaltiniai skirtingai aprašo esminį faktą;
- sistemos pažymėtą jautrią asmens informaciją;
- esminį antraštės ar jau paskelbto atvejo prasmės pakeitimą.

Administratoriaus ekranas greta rodo siūlomą tekstą, kiekvieną šaltinį, tekstą pagrindžiančias ištraukas, procesinę būseną ir visas taisyklių perspėjimų priežastis. Administratorius gali patvirtinti arba atmesti kandidatą. Teksto redagavimas nepriklauso pirmos versijos apimčiai.

## 6. Viešos svetainės struktūra

### 6.1. Pagrindinis puslapis

Pagrindinis puslapis remiasi santūria Lietuvos naujienų portalo struktūra:

- centre lygiuotas ženklas, meniu ir paieška;
- horizontalus naujienų srautas;
- viena pagrindinė istorija ir skirtingo svorio šalutinės istorijos;
- naujausių patvirtintų atvejų sąrašas;
- skaitomiausių ar dažniausiai tikrintų atvejų blokas;
- „Skaidrinam“ ir savivaldybių teminės dalys;
- trumpas metodikos paaiškinimas.

Dizainas naudoja tiesias skiriamąsias linijas, baltą foną, redakcinę tipografiją ir aiškią antraščių hierarchiją. Jis vengia vienodo dydžio kortelių, gausių spalvotų žymų, didelių apvalinimų ir dekoratyvių šešėlių. LRT pateikia struktūrinį orientyrą, tačiau portalas nekopijuoja LRT logotipo, spalvų sistemos ar konkrečių komponentų.

### 6.2. Atvejo puslapis

Atvejo puslapis rodo:

- neutralią antraštę ir santrauką;
- dabartinę procesinę būseną bei jos datą;
- chronologiją;
- faktinius teiginius su išnašomis;
- susijusius asmenis, institucijas, savivaldybes ir sumas;
- minimo asmens ar institucijos poziciją, jei šaltinis ją pateikia;
- pirminių ir papildomų šaltinių sąrašą;
- pakeitimų istoriją;
- pataisymo ir atsakymo teisės nuorodą.

### 6.3. Kiti puslapiai

- Asmens puslapis su susijusiais atvejais ir kiekvieno atvejo būsena.
- Savivaldybės puslapis su atvejais, sumomis ir laiko juosta.
- „Skaidrinam“ indeksas su filtrais pagal savivaldybę, laikotarpį ir būseną.
- Atvejų registras su paieška bei filtrais.
- Metodikos, šaltinių politikos, pataisymų, atsakymo teisės, kontaktų ir privatumo puslapiai.

Asmens puslapis nėra bendras „kaltųjų sąrašas“. Jis rodo tik patvirtintus atvejus ir kiekvieno jų dabartinį statusą.

## 7. Duomenų modelis

Pagrindiniai objektai:

- `Source`: URL, leidėjas, autorius, data, šaltinio lygis, dokumento numeris, turinio kontrolinė suma ir prieinamumo būsena.
- `SourceSnapshot`: paėmimo laikas, tekstas, metaduomenys ir saugojimo teisė.
- `Case`: pavadinimas, santrauka, procesinė būsena, svarbios datos, viešumo būsena ir rizikos žymos.
- `Claim`: struktūrinis teiginys, jo šaltiniai, pagrindžiančios ištraukos ir patvirtinimo būsena.
- `TimelineEvent`: data, įvykio tipas, aprašymas ir šaltiniai.
- `Person`: vardas, viešas vaidmuo, susiję atvejai ir tapatybės skyrimo duomenys.
- `Institution`: pavadinimas, tipas ir susiję atvejai.
- `Municipality`: savivaldybės kodas, pavadinimas ir susiję atvejai.
- `PublicationDecision`: taisyklių versija, sprendimas, priežastys, administratorius ir laikas.
- `Correction`: pareiškėjas, ginčijamas teiginys, pateikta medžiaga, sprendimas ir viešas pakeitimas.

Sistema neskaičiuoja žmogaus „sukčiavimo balo“ ir nereitinguoja asmenų pagal tariamą kaltę.

## 8. Sistemos dalys

- **Šaltinių jungtys** gauna turinį iš leistinų domenų ir registrų.
- **Apdorojimo eilė** valdo pakartotinius bandymus, greičio ribojimą ir dokumentų analizę.
- **Atvejų variklis** pašalina dublikatus bei sieja publikacijas su asmenimis, institucijomis ir bylomis.
- **Patvirtinimo variklis** taiko šaltinių bei procesinių būsenų taisykles.
- **Santraukų paslauga** generuoja tekstą tik iš patvirtintų teiginių.
- **Turinio API** pateikia viešą ir administravimo turinį.
- **Vieša žiniatinklio programa** pateikia naujienas, atvejus, registrą ir paiešką.
- **Administravimo programa** valdo tvirtinimo eilę, šaltinių sąrašą ir pataisymus.
- **Stebėsenos modulis** praneša apie surinkimo klaidas, pasenusius atvejus ir neveikiančias nuorodas.

Pirmoji versija gali veikti vienoje valdomoje debesijos aplinkoje su reliacine duomenų baze, objektų saugykla ir užduočių eile. Modulių ribos leidžia vėliau atskirti didžiausią apkrovą gaunančias dalis.

## 9. Klaidų ir neapibrėžtumo valdymas

- Sistema neviešina kandidato, jei negali atsisiųsti pagrindinio šaltinio arba patikrinti jo tapatybės.
- Nepavykęs AI apdorojimas nepakeičia esamo viešo teksto.
- Prieštaringi šaltiniai sustabdo publikavimą ir siunčia kandidatą administratoriui.
- Dingusi nuoroda pažymi šaltinį kaip neprieinamą. Sistema išsaugo leistinus metaduomenis bei kontrolinę sumą ir ieško oficialaus pakaitinio URL.
- Neaiški žmogaus tapatybė sustabdo susiejimą, kad bendravardžiai nepatektų į tą patį profilį.
- Nauja proceso būsena negali tyliai perrašyti ankstesnės. Sistema sukuria chronologijos įvykį ir versiją.
- Kritinė surinkimo, publikavimo ar duomenų bazės klaida siunčia pranešimą administratoriui.

## 10. Paieška ir prieinamumas

Paieška randa atvejus pagal asmenį, instituciją, savivaldybę, bylos numerį ir temą. Rezultatas rodo procesinę būseną šalia antraštės, kad senas kaltinimas neužgožtų vėlesnio išteisinimo.

Svetainė atitinka WCAG 2.2 AA lygio reikalavimus. Klaviatūros naudotojai gali pasiekti meniu, filtrus, išnašas ir šaltinius. Spalva nėra vienintelis būsenos ženklas. Mobilioji versija išlaiko antraščių, datų ir šaltinių hierarchiją.

## 11. Saugumas ir privatumas

- Administravimo dalis naudoja kelių veiksnių autentifikavimą ir vaidmenimis pagrįstą prieigą.
- Sistema registruoja administratoriaus sprendimus ir konfigūracijos pakeitimus.
- Įvedamas turinys pereina HTML valymą ir failų tipo patikrą.
- Vieša API riboja užklausų dažnį.
- Atsarginės kopijos šifruojamos. Komanda periodiškai patikrina jų atkūrimą.
- Sistema renka tik darbui reikalingus asmens duomenis ir taiko nustatytus saugojimo terminus.

## 12. Testavimas ir priėmimo kriterijai

### 12.1. Automatiniai testai

- šaltinio lygio ir publikavimo slenksčio taisyklės;
- teisingi bei draudžiami procesinių būsenų perėjimai;
- publikacijos blokavimas, kai teiginys neturi šaltinio;
- dublikatų aptikimas ir atvejų susiejimas;
- bendravardžių atskyrimas;
- chronologijos rikiavimas ir laiko zonos;
- išteisinimo, nutraukimo bei sprendimo panaikinimo atnaujinimai;
- administratoriaus patvirtinimas ir audito žurnalas;
- šaltinio dingimo ir pakartotinio bandymo scenarijai;
- apsauga nuo žalingo HTML ir netinkamų failų.

### 12.2. Integraciniai testai

Komanda naudoja fiksuotas šaltinių kopijas, kad patikrintų visą kelią nuo surinkimo iki viešo atvejo. Testas patvirtina, kad viešo teksto teiginiai turi nuorodas, o jautrus atvejis nepasirodo be administratoriaus sprendimo.

### 12.3. Vizualiniai ir prieinamumo testai

Komanda tikrina pagrindinį, atvejo ir registro puslapius darbalaukio bei mobiliojo telefono pločiuose. Automatinė prieinamumo patikra papildoma klaviatūros ir ekrano skaitytuvo bandymu.

### 12.4. Paleidimo kriterijai

Pirmą versiją galima paleisti, kai:

- visi vieši teiginiai turi veikiančią šaltinio nuorodą;
- sistema blokuoja nepakankamai patvirtintą turinį;
- administratorius gali patvirtinti jautrų atvejį ir matyti sprendimo pagrindą;
- procesinės būsenos atnaujinimas sukuria matomą chronologijos įrašą;
- pataisymo forma ir atsakymo teisės procesas veikia;
- teisininkas peržiūri redakcinę politiką, privatumo dokumentus ir pirmą istorinių duomenų rinkinį;
- stebėsena aptinka surinkimo ir publikavimo gedimus.

## 13. Pirmos versijos ribos

Pirma versija neapima bendrų telefoninių, investicinių ar elektroninės prekybos sukčiavimo atvejų. Ji taip pat nekuria komentarų sistemos, mobiliųjų programėlių, personalizuoto naujienų srauto, asmenų reitingų ar automatinio turinio vertimo.

## 14. Pradinė šaltinių ir duomenų apimtis

Komanda pradeda nuo patvirtinto A lygio oficialių institucijų sąrašo ir nedidelio B lygio leidinių sąrašo. Pradinis importas apima nuo 2021-09-09 paskelbtus A lygio šaltinių įrašus, kurie susiję su šio dokumento pirmame skyriuje apibrėžta tema, ir atskirą „Skaidrinam“ rinkinį. Kiekvienas istorinis atvejis pereina tas pačias šaltinių bei procesinės būsenos taisykles kaip nauja publikacija.

Šaltinio techninis prieinamumas dar nereiškia teisės jį kopijuoti ar archyvuoti. Teisinė peržiūra nustato kiekvieno šaltinio gavimo būdą, saugomą turinio apimtį ir atvaizdavimo taisykles.
