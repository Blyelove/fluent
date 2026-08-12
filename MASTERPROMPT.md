# Masterprompt — Fluent naar het hoogste niveau

Deze prompt draait automatisch **elke 15 minuten** en verbetert zichzelf elke ronde.
Hij dekt alles wat in de bouwchat is afgesproken, zodat er niets uit kan vallen.

```
Werk zelfstandig aan Fluent in C:\Users\Blye\Desktop\aurea — de taal-leer-app die op ELK gebied beter moet zijn dan Duolingo en dan 99% van alle apps. Dit project staat volledig LOS van Blyelove: raak die map, die repo of die deploy nooit aan.

═══════════════════════════════════════════════════════════════
DEEL 1 — DE COMPLETE EISENLIJST
Alles hieronder is door de gebruiker zelf gevraagd. Elke ronde controleer je
minstens één blok en je maakt het beter. Niets hiervan mag ooit verdwijnen.
═══════════════════════════════════════════════════════════════

A. HET PRODUCT
   - Een Duolingo-concurrent in elite-kwaliteit: mooier, slimmer, leuker, en op elk gebied beter.
   - Zes cursussen: Spaans, Frans, Duits, Italiaans, Portugees, Engels — allemaal even volledig, geen halve talen.
   - Mensen moeten er SNEL van leren én er in blijven. Belonend en voldoening gevend, nooit een verplichting.
   - Je mag overal beginnen: geen gedwongen route vanaf les 1 als je een ander onderwerp wilt.

B. VERSLAVENDHEID — dit is de kern, hier mag je nooit tevreden over zijn
   - Een uitgebreid XP-systeem met veel verschillende manieren om XP te verdienen.
   - Je niveau én je totale XP altijd zichtbaar.
   - Hoog komen moet ECHT moeilijk zijn: de weg naar het hoogste niveau is een lange berg, geen wandeling.
   - Daadwerkelijke doelen die mensen zichzelf stellen en dan eerder gaan halen.
   - Landen/gebieden veroveren als je vordert — maar pas na serieus werk, nooit na één oefening.
   - Na een niveau-sprong zie je je personage automatisch in beweging (rennen/juichen).
   - Dagelijkse en wekelijkse haakjes: missies, kisten, dubbel-XP-momenten, verrassingen.
   - Een echt eindspel: iets om naartoe te werken op dag 30, dag 90, dag 365.

C. HET PERSONAGE — hierin wil de gebruiker de GROOTSTE, UNIEKSTE en BESTE zijn
   - Geen mascotte-dier. Een man of vrouw, die per niveau zichtbaar méér van die cultuur wordt
     (steeds Spaanser bij Spaans, Franser bij Frans, enzovoort).
   - Je kiest zelf je beginpersonage — man én vrouw, veel keuze, meteen bij het aanmaken.
   - Per zoveel XP wordt je personage aantrekkelijker: nieuwe kleding, accessoires, uitstraling.
   - Meer karakters, meer keuzes, "veel vetter" — dit is een verzamelspel, geen plaatje.
   - Doel: geen enkele taal-app ter wereld heeft een rijker, herkenbaarder personagesysteem dan Fluent.
     Meet je hieraan af. Als een andere app hierin beter is, is dat de belangrijkste taak van die ronde.

D. UITSPRAAK
   - Elke taal klinkt als een moedertaalspreker met het juiste accent.
   - NOOIT een Nederlandse stem die een vreemde taal uitspreekt ("het is ola, niet HolA").
   - Alle vreemde zinnen zijn vooraf ingesproken (public/audio/manifest.json).
     Nieuwe tekst = altijd `npx tsx scripts/generate-audio.ts` draaien, anders is de functie stil en dus dood.

E. SPEL EN BEDIENING
   - Alles moet minigame-achtiger: meer spellen, meer variatie, meer keuze.
   - Makkelijker bedienbaar: met één duim, op een telefoon, zonder zoeken.
   - Duels en uitdagingen tegen vrienden.

F. ZELF TOETSEN
   - Je stelt zelf in waarover je een toets wilt; de app genereert hem.
   - Slaag je, dan krijg je punten. De app onthoudt je toetsresultaten.

G. ACCOUNT EN WEB
   - Installeerbaar en web-compatible (PWA), werkt offline.
   - Aanmaken met ALLEEN e-mailadres + wachtwoord. Geen naam. Geen bevestigingsmail. Direct door.
   - "Ingelogd blijven" kun je aanvinken en dan blijf je ingelogd — nooit meer dat inlogscherm.
   - Je voortgang wordt onthouden.
   - Later: een welkomstmail naar dat adres (wacht op de serverlaag).

H. PUBLICATIE
   - De app heet Fluent, overal, ook op de live link.
   - Er is één permanente publieke link waar iedereen op kan (niet alleen deze pc):
     https://blyelove.github.io/fluent/
   - Elke wijziging komt daar automatisch op te staan.

I. AFWERKING
   - Alles wat de gebruiker ziet is foutloos, natuurlijk Nederlands.
   - Nooit een loze belofte in de tekst: staat er dat je iets verdient, dan krijg je het ook echt.
   - Visueel nooit saai, plat of leeg. Als het saai oogt, is dat een bug.

═══════════════════════════════════════════════════════════════
DEEL 2 — WAT JE ELKE RONDE DOET, IN DEZE VOLGORDE
═══════════════════════════════════════════════════════════════

1. KIJKEN MET JE EIGEN OGEN — OP MOBIEL. Zorg dat de dev-server draait (npm run dev, poort 5199), zet het venster op 375×812 en open de app. Bijna iedereen gebruikt dit op een telefoon; een oordeel op een breed scherm is waardeloos. Klik als een échte gebruiker door minstens drie schermen en maak screenshots. Beoordeel keihard eerlijk: wat is saai, lelijk, traag, verwarrend, leeg of niet verslavend genoeg? Noteer elke bug, elke lege staat en elk moment waarop iemand zou afhaken.
   MEET OOK, NIET ALLEEN KIJKEN: hoeveel scrollen kost de belangrijkste actie? Hoeveel tikken om te beginnen met leren, een spel te starten, je ranglijst te zien? Meet dat hard in de pagina (getBoundingClientRect + innerHeight). Alles boven één tik of één scherm is een kandidaat.
   KIJK OOK OP EEN BREED SCHERM, één screenshot. Daar vallen andere dingen op: systeem-schuifbalken, stroken die om ruimte vragen, lege vlakken.

2. KIEZEN. Pak de ÉÉN verbetering met de grootste impact op verslavendheid, plezier, duidelijkheid of leerresultaat. Liever één ding helemaal af dan drie half.
   HEEFT DE GEBRUIKER IETS GEZEGD? Dat gaat altijd voor. Een klacht van hem ("te weinig personages", "die scrollbalk is lelijk") is geen suggestie maar de opdracht van die ronde, en je lost hem niet minimaal op maar ruim: bij "te weinig" verdrievoudig je, niet plus twee.
   VERANDER JE EEN GEDEELDE DATASTROOM? Bewijs dan dat het afhankelijke gedrag gelijk blijft. Bij de duels moesten beide spelers na een wijziging aan de vragenpoel nog steeds exact dezelfde vragen krijgen — dezelfde seed twee keer spelen en vergelijken kost twee minuten en voorkomt een onzichtbare breuk.
   CONTROLEER OOK OF EEN BESTAANDE BELOFTE OVERAL WAARGEMAAKT WORDT. Staat er "precies de vragen waar jij op struikelde", dan moeten álle plekken waar je kunt struikelen daaraan bijdragen. Loop elke ronde één belofte na en zoek de plekken die hem stilzwijgend niet nakomen.
   EEN GEVONDEN BUG GAAT ALTIJD VOOR een nieuwe functie. Speel daarom elke ronde één bestaande functie hélemaal uit van begin tot eind — inclusief de vervolgstappen die je zelf nooit neemt (je eigen deel-link openen, iets twee keer doen, terugkomen op een half afgemaakt scherm). Daar zitten de fouten die echte gebruikers wél tegenkomen.

3. BOUWEN. Volledig af: geen TODO's, geen placeholders, geen loze beloftes. Nederlandse teksten, natuurlijk geschreven.
   GEBRUIK NOOIT `sed` OM CODE TE BEWERKEN. Een patroon met pipes, haakjes of quotes verminkt stilletjes een regel — dat kostte ooit een kapotte type-definitie. Gebruik Edit met exacte tekst; `sed` alleen voor doodsimpele vervangingen in documentatie.
   LEES ELKE ZICHTBARE ZIN NA op enkelvoud/meervoud en natuurlijk Nederlands ("1 dag reeks", niet "1 dagen reeks").
   DEFINIEER NOOIT EEN REACT-COMPONENT BINNEN EEN RENDER. Dat wordt bij elke render als nieuw type gezien en volledig opnieuw opgebouwd — dodelijk tijdens animaties of tellers. Gebruik een gewone functie die JSX teruggeeft, of zet het component buiten de render.
   HAAL IETS UIT DE PAGINA PAS OP HET MOMENT VAN DE HANDELING. Een `ref`, een gemeten afmeting of een stuk DOM is tijdens het renderen nog leeg. Geef een fúnctie door die het object maakt bij de klik (`kaart={() => ({...})}`), nooit een kant-en-klaar object.
   BOUW JE IETS DAT AFHANGT VAN EEN TELLER? Controleer expliciet wat er gebeurt als die teller nul wordt. Een missie "werk 3 fouten weg" mag niet omklappen zodra je lijst leeg is — dan zie je je zojuist verdiende beloning verdwijnen.
   WEEG ALTIJD DE KEERZIJDE. Haal je iets naar boven, dan zakt er iets anders weg. Vraag je af wat je zojuist begraven hebt en compenseer dat met een compacte samenvatting of snelkoppeling. Verplaatsen zonder compensatie is een ruil, geen verbetering.
   EEN SCHUIFBALK IS BIJNA ALTIJD EEN ONTWERPFOUT. Past iets niet, laat het dan afbreken in een raster, of klap het in met een "toon alles"-knop. Moet je toch schuiven met de duim, gebruik dan .no-scrollbar. Een grijze systeembalk hoort nergens in dit ontwerp.

4. CONTROLEREN — vijf keer nakijken. (a) npx tsc --noEmit geeft 0 fouten; (b) npm run build slaagt; (c) open de app opnieuw en test je wijziging zelf klikkend, met screenshot als bewijs — en controleer dat de knop écht doet wat hij belooft; (d) test de randgevallen door de opgeslagen staat tijdelijk te manipuleren via localStorage 'aurea-v1': nieuwe gebruiker zonder data, alles voltooid, lege lijsten, dag- of weekovergang — zet je testdata daarna terug; (e) lees je eigen diff terug en zoek actief naar bugs die je zelf introduceerde, vooral state die overschreven wordt, timers die niet opgeruimd worden en zustand-selectors die elke render een nieuw object teruggeven.
   KIJK NIET ALLEEN OF HET ER STAAT, MAAR OF HET DE RUIMTE VULT. "Zichtbaar" is niet "goed". Zoom in op het eindresultaat en vergelijk het met wat je bedoelde.
   LET OP bij de console: fouten van tijdens het bewerken blijven in de geschiedenis staan en zijn misleidend. Als tsc, de build én de echte render kloppen, is de app in orde.
   LET OOK OP bij screenshots en bij het uitlezen van tekst: een meting vlak na een klik, scroll of herlading kan een half gerenderd beeld tonen. VASTE REGEL: wacht ruim een seconde en meet opnieuw voordat je concludeert dat iets stuk is.

5. PUBLICEREN. Heb je een agent-team ingezet? Controleer ná afloop met `git status` of er nog wijzigingen binnenkwamen — controleurs leveren hun correcties vaak later aan. Zijn er nieuwe of gewijzigde zinnen, draai dan opnieuw `npx tsx scripts/generate-audio.ts` (idempotent) en bouw opnieuw, anders staat er content live zonder geluid. Daarna: git add -A, commit met een duidelijke Nederlandse beschrijving, git push. Dat publiceert automatisch naar https://blyelove.github.io/fluent/ — controleer daarna via de GitHub Actions API dat de bouw is geslaagd en dat de live site HTTP 200 geeft. `gh` staat niet in het PATH van de Bash-shell; gebruik PowerShell met Invoke-RestMethod op api.github.com.

6. RAPPORTEREN in het Nederlands: wat zag je, wat verbeterde je, en wat is de volgende grootste kans. Kort en zonder opsmuk.

7. JEZELF VERBETEREN. Werk als laatste stap dit bestand bij: voeg toe wat je miste, schrap wat niet werkte, scherp aan wat vaag bleek, streep af wat af is en zet er nieuwe ideeën bij die je tijdens het testen bedacht. Zet onderaan een korte logregel met de datum en wat je verbeterde. Commit het mee. De volgende ronde leest de nieuwe versie — zo wordt de opdracht elke keer scherper.

8. DE LUS LOOPT DOOR VIA CRON, elke 15 minuten. Je hoeft zelf niets opnieuw in te plannen. Een ronde vuurt alleen als de vorige klaar is, dus een zware ronde vertraagt hooguit de volgende — hij slaat niets over.
   PAS JE RONDE AAN OP HET VENSTER. Vijftien minuten is kort. Kies dus iets dat je in die tijd hélemaal af krijgt: één bewezen bug, één klein scherm, één regel content. Kom je er toch niet uit, maak het dan de volgende ronde eerst áf voordat je iets nieuws begint — half werk in de repo is erger dan een gemiste ronde.

═══════════════════════════════════════════════════════════════
DEEL 3 — KERNREGELS DIE NOOIT VERANDEREN
═══════════════════════════════════════════════════════════════
- NOOIT STRAFFEN. Geen hartjes, geen energie, geen limieten, geen schuldgevoel. Motiveren doe je met beloningen, competitie, voortgang en trots. Dit is hét verschil met Duolingo.
- Design: neon arcade. Indigo #0E0B1F, paars/roze verloop (#A855F7 → #EC4899), amber XP (#FFC53D), cyaan selectie (#22D3EE), chunky 3D-drukknoppen die echt indrukken, Baloo 2 voor koppen, veel animatie en confetti op de piekmomenten. Alles minstens 44px en met één duim te bedienen.
- Uitspraak: elke taal klinkt als een moedertaalspreker. Nooit een Nederlandse stem op een vreemde taal.
- Alles wat de gebruiker ziet is volledig vertaald en foutloos Nederlands.
- Het personagesysteem moet het rijkste van alle taal-apps zijn. Dat is een doel, geen bijzaak.

═══════════════════════════════════════════════════════════════
DEEL 4 — DE BOUWLIJST
Uit een audit van zeven agents over de hele app (ronde 15), elk met een
tegentoets op hun bevindingen. Dit zijn geen ideeën maar aangetoonde
tekortkomingen. Pak van boven naar beneden. Streep af wat af is en zet erbij
wat je onderweg zelf vindt.
═══════════════════════════════════════════════════════════════

▓▓ BLOK A — BEWEZEN BUGS. Deze gaan vóór alles. Elk hiervan breekt een belofte
   die de app zelf op het scherm doet.
1.  Twee accounts op één telefoon delen één voortgang: account B erft alles van A. Voortgang moet per account gescheiden worden. Dit kan vandaag, zonder server.
2.  Alle 71 Duitse invuloefeningen hebben het juiste antwoord op knop 1. Schud de antwoordopties bij het renderen en bouw een controle die scheve content tegenhoudt.
3.  De weekmissie "Speel 1 duel" is voor een solospeler onmogelijk, dus de weekkist zit permanent op slot. Geef een alternatieve route, net als bij de dagmissie.
4.  De klasse `.unit-card` bestaat niet in de CSS: vier hoofdkaarten hebben nul padding en plakken aan elkaar. Definiëren, en daarna de `order`-lapmiddelen opruimen.
5.  Herhalen, fouten wegwerken en toetsen tellen niet mee voor je reeks, je missies en je divisie — terwijl de app het tegendeel belooft. Eén gedeelde activiteitsregistratie waar álles doorheen gaat.
6.  "Dubbele XP" verdubbelt alleen arcade en duels, geen lessen. Precies omgekeerd aan de bedoeling.
7.  De competitieweek rolt niet door bij het openen van de app: maandagochtend zie je nog vorige week, en de weekkist van vorige week kan die van deze week opbranden.
8.  Promotie en degradatie negeren de ranglijst die je de hele week te zien krijgt.
9.  De herhaalsessie gooit de goedgekeurde alternatieve antwoorden weg en rekent accenten hard fout.
10. Eén keer goed haalt een fout permanent uit je foutenlijst, terwijl de antwoordpositie vast staat — je onthoudt de plek, niet het woord. Laat een fout pas verdwijnen na twee keer goed op verschillende momenten.
11. Nieuwe woorden staan direct na de les al op "herhaling klaar". Laat ze pas de volgende dag opduiken.
12. Alles wat je goed doet buiten de herhaalsessie raakt de FSRS-kaart niet. Voed het geheugenmodel vanuit elke oefening.
13. De onderbalk blijft actief tijdens een minigame: één randveeg en je run is weg. Verbergen tijdens spel en duel.
14. Het toetsenbord bedekt de knop Controleren bij typoefeningen, en Enter doet niets.
15. Van tab wisselen behoudt de scrollpositie, dus je landt midden in het volgende scherm. De missie-chip katapulteert je 5.615px omlaag zonder terugweg.
16. Acht veelgebruikte raakvlakken zijn kleiner dan 44px, tegen de eigen regel in.
17. Reeks-bescherming vangt maar één gemiste dag op, hoeveel bescherming je ook hebt.
18. Op "Vrouw" tikken wist je haarstijl en forceert oorbellen.
19. Je personage is na registratie nooit meer te wijzigen, en het dagdoel evenmin — terwijl de onboarding belooft van wel.
20. De persist-store heeft geen `version` en geen `migrate`: de eerste datawijziging kost iedereen zijn voortgang.
21. Spelfout in zichtbare tekst: "volledig spaans".

▓▓ BLOK B — HET PERSONAGE. Hier wil de gebruiker de beste ter wereld in zijn.
   De audit is hier het hardst: per taal bestaan er maar twee unieke visuele
   objecten (één hoed, één handitem), de "Flamenco-outfit" is in werkelijkheid
   één gekleurde balk van 10px, en vanaf niveau 11 zien álle zes talen er
   identiek uit. "Man én vrouw" is in de code vier streepjes wimper.
- Tien extra kledingstukken per taal in plaats van één hoed en één item, en niveau 11-20 ook per taal maken.
- Een echte kledingkast waarin je zelf items aan- en uitzet.
- Man en vrouw echt verschillend tekenen; baard, hoofddoek, meer brilmodellen, kapsellengte en lichaamstype toevoegen.
- Zeldzame items koppelen aan de 50 badge-tiers die er al liggen — nu geeft geen enkele prestatie een item.
- Niveau per taal in plaats van globaal, zodat je bij je tweede taal niet gratis de complete cultuur-outfit krijgt.
- Onthullings-animatie bij niveau-omhoog in plaats van het item stilletjes tonen.
- Je tegenstander in een duel en je divisiegenoten een echt personage geven.
- De personage-maker herbouwen voor één duim; hij is nu niet met één hand te bedienen.
- De culturele items nalopen: het zijn toeristenclichés en deels het verkeerde land.

▓▓ BLOK C — VERSLAVENDHEID
   Kern van het probleem: de contentberg is na ~21 dagen op terwijl de
   niveauberg 428 dagen duurt, arcade betaalt 7 tot 12 keer beter per minuut
   dan een les (het systeem beloont dus níet leren), en boven niveau 20
   verandert er niets meer.
- De XP-economie omdraaien zodat leren de snelste route is.
- Een kistensysteem met echte willekeur — nu is er één kistsoort met een vast bedrag.
- Een seizoenspas van twaalf weken met tiers: de haak voor dag 30 tot 90.
- Prestige na niveau 20 (Fluent-sterren) als eindspel.
- Doelen met inzet, een vroeg-bonus en een echte afloop.
- Landen echt uitspeelbaar maken met een veroveringstoets — nu liggen 6 van de 14 landen achter content die niet bestaat.
- Aangekondigde dubbel-XP-uren, een maandmissie op basis van de al opgeslagen actieve dagen, en een instelbaar dagdoel.

▓▓ BLOK D — SPEL
- Napraat: de uitspraak-arcade. De app laat je nu nooit iets zeggen.
- Toren van Woorden: zinnen bouwen met verdiepingen en power-ups.
- Spookrace: een duel waarin je je vriend live ziet racen. Een duel is nu letterlijk een les met een scorebord — geen klok, geen spanning.
- Spelmodificatoren: drie kaarten kiezen vóór elk potje.
- Duelklok en snelheidspunten; revanche-knop; een bot-uitdager voor wie niemand heeft.
- Spelen houdt je reeks in leven. Duelvragen afstemmen op wat de uitdager al gedaan heeft.
- Twee van de drie minigames zijn volledig stil terwijl er 1931 moedertaal-fragmenten klaarstaan.

▓▓ BLOK E — LEREN
- Dictee-oefening (hoor de zin, typ hem) en een spreekoefening met de Web Speech API, zonder straf.
- Accent- en typefouttolerantie met een vriendelijke correctie in plaats van hard fout.
- Uitleg ook bij goede antwoorden, ook in de herhaalsessie, en nooit de verkeerde regel.
- Een vierde woordenschatles per unit, zodat het A2-label klopt: er zijn nu 104 woorden per taal terwijl het scherm "tot en met A2 uitgespeeld" claimt.
- Toetsen beperken tot bestudeerde stof, plus een instaptoets voor wie al iets kan.
- Herhaling uitbreiden van losse woorden naar zinnen, in beide richtingen.

▓▓ BLOK F — GELUID
- Meer dan de helft van alle oefeningen is muisstil; het generatie-script verzamelt drie van de zeven oefeningtypes niet. Uitbreiden en in één run de ontbrekende fragmenten bijgenereren.
- Het juiste antwoord wordt getoond maar nooit voorgelezen. Bij een fout automatisch laten klinken.
- Langzaam afspelen bestaat nergens: een tweede, langzame opname per zin met lange-druk.
- Eén herbruikbare luisterknop in alle zeven oefeningtypes, minstens 44px.
- Een bouwcontrole die faalt als een zichtbare doeltaalzin geen audio heeft.
- De terugval kiest op taalprefix en pakt dus pt-BR voor een pt-PT-cursus; en de geluid-uit-schakelaar zet de stem niet uit.

▓▓ BLOK G — TECHNIEK
- Herstelcode plus exporteren/importeren: een back-up die vandaag al werkt, zonder sleutels. Er is nu geen enkele.
- Eerste verf onder een seconde: 963 KB JS en 433 KB CSS, met tot die tijd een leeg zwart scherm. Inline splash, cursussen splitsen, de 142 vlag-SVG's uitdunnen naar de ~62 die je gebruikt.
- Offline echt af: de 24 MB moedertaal-audio staat niet in de precache, dus een luisteroefening wordt offline onbeantwoordbaar. Audiopakket per cursus downloaden met zichtbare voortgang.
- Niets nodigt uit tot installeren, terwijl installeerbaar juist de eis is.
- Updates zonder onderbreking: `skipWaiting` kan nu een les breken tijdens een deploy.
- Linkvoorvertoning voor gedeelde duel-links en deelplaatjes.

▓▓ GEBLOKKEERD tot de gebruiker een Supabase-project en sleutels aanlevert:
   echte accounts op een server, "wachtwoord vergeten", vriendenlijsten,
   ranglijst tussen vrienden, synchronisatie tussen apparaten, het
   welkomstmailtje en meldingen die je reeks redden. Ik mag zelf geen account
   voor hem aanmaken. Vraag er niet elke ronde naar; noem het hooguit één keer
   in het rapport als het echt relevant is. Wat je wél mag doen: het schema,
   de beveiligingsregels en de synchronisatiecode klaarzetten zodat het
   aanzetten straks één handeling is.

✅ AL AF (niet opnieuw bouwen): vrienden-duels via deel-link · deelbare resultaatplaatjes, ook met je eigen personage erop · Nederlandstalige grammaticagidsen per unit · "Waarom?"-uitleg bij een fout antwoord · jouw-fouten-oefening gevoed door lessen, toetsen én duels · comeback-beloning na afwezigheid · "nog één les"-haakje · dagmissies met bonuskist · weekmissies · divisies · drie minigames · zelf samengestelde toetsen · 24 kant-en-klare personages plus een vrije personage-maker · PWA · automatische publicatie.

Werk door tot de ronde af is. Vraag niets, wacht nergens op, en stop pas als de verbetering live staat en bewezen werkt.
```

## Hoe de lus draait (zelfverbeterend)

De lus krijgt bewust een korte startopdracht die naar dit bestand verwijst. Omdat elke ronde dit bestand ook verbétert, wordt de opdracht zelf steeds beter — zonder dat je de lus opnieuw hoeft in te stellen:

```
/loop Lees C:\Users\Blye\Desktop\aurea\MASTERPROMPT.md volledig en voer de instructies in het codeblok daarin uit, inclusief de laatste stap waarin je dit bestand zelf verbetert en meecommit.
```

Het interval is **elke 15 minuten**, als cron-taak op `7,22,37,52 * * * *` — dus op :07, :22, :37 en :52. Bewust niet op :00 en :30, want daar landt de halve wereld tegelijk op de API. Een ronde vuurt alleen als de vorige klaar is, dus een zware ronde vertraagt de volgende maar slaat hem niet over.

Stoppen kan met `/loop stop` of door de cron-taak te verwijderen.

---

## Logboek

- **12-08-2026** — Eerste versie. Dekt: verslavendheid, sociaal, personage, leren, techniek, de nooit-straffen-regel, het neon-arcade-design en de vijfvoudige controle. Zelfverbeterstap toegevoegd.
- **12-08-2026, ronde 15b** — De bouwlijst vervangen door een **audit van zeven agents over de hele app** (verslaving, personage, leren, spellen, mobiel, geluid, techniek), elk met een tegentoets die elke bewering met hoge impact probeerde te weerleggen. Wat overbleef staat nu als Deel 4 in de opdracht — geen ideeënlijst meer maar **21 aangetoonde bugs** plus zes blokken werk, met bewijs uit de code. De hardste vondsten: twee accounts op één telefoon delen één voortgang; alle 71 Duitse invuloefeningen hebben het juiste antwoord op knop 1; de weekmissie "speel 1 duel" maakt de weekkist voor een solospeler permanent onbereikbaar; de klasse `.unit-card` bestaat niet waardoor vier hoofdkaarten nul padding hebben; herhalen en toetsen tellen niet mee voor reeks en divisie terwijl de app het tegendeel belooft; arcade betaalt 7 tot 12 keer beter per minuut dan een les, dus het systeem beloont níet leren; en de contentberg is na ~21 dagen op terwijl de niveauberg 428 dagen duurt. Ook de cadans aangepast: **elke 15 minuten** in plaats van 45, via cron op `7,22,37,52`. Daarbij hoort een nieuwe regel in stap 8: vijftien minuten is kort, dus kies iets dat je in dat venster hélemaal af krijgt, en maak een onaffe ronde eerst áf voordat je iets nieuws begint.
- **12-08-2026, ronde 15** — Masterprompt volledig herschreven op verzoek van de gebruiker. Grootste toevoeging: **Deel 1, de complete eisenlijst** — alles wat hij in de bouwchat heeft gevraagd staat nu zwart op wit in de opdracht zelf (product, verslavendheid, personage, uitspraak, spel en bediening, zelf toetsen, account en web, publicatie, afwerking), zodat een latere ronde niet stilzwijgend een eis kan laten vallen. Het personagesysteem is verheven tot kernregel: Fluent moet daarin het rijkste van alle taal-apps zijn. Ook nieuw: de lus staat nu op **precies 45 minuten** via ScheduleWakeup in plaats van op 30 via cron (cron kan geen 45 uitdrukken), en stap 8 zorgt dat de lus zichzelf doorzet. Verder toegevoegd aan de werkwijze: een klacht van de gebruiker is de opdracht van die ronde en je lost hem ruim op, niet minimaal; kijk elke ronde ook één keer op een breed scherm; een schuifbalk is bijna altijd een ontwerpfout; `gh` staat niet in het PATH van de Bash-shell. **In dezelfde ronde gebouwd:** het personagescherm ging van **8 naar 24** kant-en-klare personages die samen alle tien haarstijlen, acht huidtinten, twaalf haarkleuren en tien outfits laten zien, en de **lelijke systeem-schuifbalk** onder de personagestrook is weg — het is nu een raster dat vanzelf afbreekt, ingeklapt op acht met een knop "Toon alle 24". Schuifbalken staan app-breed in de huisstijl.
- **12-08-2026, ronde 14** — Eerst de **herhaalsessie (SRS) voor het eerst helemaal uitgespeeld** en de belofte hard gecontroleerd: van 12 Spaanse kaarten werden er 10 herhaald (`reps` van 0 naar 1) en schoof hun herhaalmoment van 03:12 naar ~08:45, terwijl de 2 niet-behandelde kaarten netjes wachtend bleven. FSRS doet dus echt wat er staat — geen bug. Daarna **deelmomenten op de emotionele pieken** gebouwd, met bij een niveau-sprong **je eigen personage op de kaart** en een tweede knop bij een **veroverd land**. **Drie fouten in eigen werk gevonden door in te zoomen op het eindresultaat:** (1) de kaart toonde nog een ster — het kaart-object werd tijdens het renderen opgebouwd, en dan is de ref naar de SVG nog `null`; (2) een SVG rastert op zijn eigen schermformaat, dus uitvergroot zou het figuur uitgesmeerd zijn; (3) het figuur oogde half zo groot als bedoeld door lege ruimte in de viewBox — nu wordt het echte beeldvlak uitgesneden. Ook krimpt de grote waarde mee als hij buiten de kaart zou lopen. **Lessen, nu in stap 3 en 4:** haal iets uit de pagina pas op het moment van de handeling, en controleer bij beeld niet of het er stáát maar of het de ruimte vúlt.
- **12-08-2026, ronde 13** — De belofte "precies de vragen waar jij op struikelde" nu op **alle drie de plekken** waargemaakt: fouten in een **duel** telden als laatste nog niet mee. Duelvragen dragen nu hun herkomst mee (les-id + positie), net als lessen (ronde 7) en toetsen (ronde 12), en alle drie gebruiken dezelfde functie `isHerhaalbaar()`. Getest: een duel met 2 van de 10 goed leverde 8 onthouden fouten op. **Belangrijkste controle:** ik veranderde de vragenpoel die de duels voedt, dus moest ik bewijzen dat beide spelers nog steeds identieke vragen krijgen — dezelfde seed twee keer gespeeld en vergeleken: exact gelijk. Die regel staat nu in stap 2.
- **12-08-2026, ronde 12** — Twee nooit eerder geteste functies uitgespeeld. (1) **Eigen toets**: werkte, maar legde een **gebroken belofte** bloot — 8 van de 10 fout en de foutenlijst bleef op nul, want alleen fouten uit lessen werden onthouden. Toetsvragen dragen nu hun herkomst mee. (2) **Wisselen van taal**: in orde — Frans start op 0 van 42 terwijl de Spaanse voortgang blijft, de Franse gids laadt en de Franse stem speelt fr-FR. **Les, nu in stap 2:** loop elke ronde één bestaande belófte na en zoek de plekken die hem stilzwijgend niet nakomen.
- **12-08-2026, ronde 11** — Het **vrienden-duel voor het eerst helemaal uitgespeeld** en een echte bug gevonden: je eigen uitdaging-link openen gaf een nepduel "Gelijkspel 6–6" tegen jezelf, 15 XP cadeau en een vals duel in je geschiedenis. Opgelost met een markering in de deel-payload (`r: 1` = antwoord van je vriend, `r: 0` = uitdaging die nog gespeeld moet worden). **Twee gaten in mijn eigen fix gevonden vóór publicatie:** `sanitize()` gooide het nieuwe veld weg, en het resultaatscherm gaf altijd `r: 1` mee. **Les, nu in stap 2:** een gevonden bug gaat altijd voor een nieuwe functie, en speel elke ronde één functie helemaal uit inclusief de rare vervolgstappen.
- **12-08-2026, ronde 10** — **Je resultaat delen als plaatje** gebouwd in `src/share.ts`: een kaart van 1080×1350 die de app zelf met canvas tekent, gedeeld via het deelvenster van de telefoon of anders opgeslagen. Deelknoppen op het reeks-scherm en bij een minigame-record. **Les over testen:** een `blob:`-URL wordt na het downloaden opgeruimd, dus zet hem binnen dezelfde aanroep om naar een data-URL als je hem wilt zien. **Bug in eigen code gefixt vóór publicatie:** een timer die de knoptekst terugzette werd niet opgeruimd bij het verlaten van het scherm.
- **12-08-2026, ronde 9** — Eerst een minigame **helemaal uitgespeeld**: Woordstorm werkte en de verdiende XP schoof mijn divisieplek zichtbaar van #28 naar #25. Het echte gat zat elders: **er gebeurde niets als je een paar dagen wegbleef**. Gebouwd: een **welkom-terug-bericht** na twee dagen of langer, zonder verwijt, met 30 minuten dubbele XP en een knop die meteen je volgende les start. **Lay-outfout gefixt:** twee `.btn`-knoppen naast elkaar in een `.row` vechten om de ruimte omdat `.btn` zelf `width: 100%` heeft.
- **12-08-2026, ronde 8** — De fouten-oefening was **onzichtbaar vanaf het startscherm**. Nu een **roze 🎯-chip** met het aantal openstaande fouten die met één tik naar de oefening springt, en de **derde dagmissie is op twee manieren haalbaar** ("Speel een foutloze les" óf "Werk 3 fouten weg"). **Bug in eigen code gevonden vóór publicatie:** werkte je je láátste fouten weg, dan sprong de missie terug en zag je je zojuist verdiende beloning verdwijnen.
- **12-08-2026, ronde 7** — **Jouw fouten werden nergens bewaard.** Gebouwd: `src/mistakes.ts` met een compacte verwijzing (cursus + les-id + positie) in plaats van een kopie van de oefening; maximaal 60 fouten. In het Oefenen-tabblad een kaart "🎯 Jouw fouten", hardnekkigste eerst, dubbele punten. **Les:** nooit `sed` op code — een patroon met pipes verminkte een type-definitie.
- **12-08-2026, ronde 6** — De gids gekoppeld aan het **moment van falen**: een **"💡 Waarom?"-knop** in het feedbackpaneel die de best passende regel uit de unit-gids opent, gekozen met woordoverlap waarbij een treffer in de regeltitel dubbel telt.
- **12-08-2026, ronde 5** — Het grootste **leergat** gedicht: je hoorde wel dát een antwoord fout was, maar nooit **waarom**. **84 gidsen** (6 talen × 14 units) met uitleg in gewoon Nederlands. **Belangrijke vondst:** de voorbeeldzinnen bleven stil omdat ze niet in het audio-manifest stonden; het generatiescript verzamelt nu ook gids-zinnen (501 nieuwe fragmenten). **Lessen:** nieuwe tekst = nieuwe audio; gebruik `import.meta.glob` als bestanden nog kunnen ontbreken.
- **12-08-2026, ronde 4** — Het **lesresultaatscherm** was een **doodlopend spoor**. Gebouwd: een **"▶ Nog één les"-knop** die meteen de volgende les start, en een **dagdoel-balk**. **Bug gevonden vóór publicatie:** de slotknoppen waren een component dat binnen de render werd gedefinieerd en bij elke tik van de XP-teller (±24×) opnieuw werd opgebouwd.
- **12-08-2026, ronde 3** — Het **leerpad staat nu direct onder de Doorgaan-hero** (van 1,17 naar **0,44 scherm** scrollen), opgelost met `order` op flex-kinderen. Omdat de dagmissies daardoor wegzakten, is er een **compacte statusbalk** met tikbare chips gekomen. **Les:** weeg bij elke herschikking wat je begraaft en compenseer dat.
- **12-08-2026, ronde 2** — Op mobiel gemeten dat de eerste les pas op **1,3 schermen scrollen** stond. Opgelost met een **Doorgaan-hero** bovenaan. **Lessen:** beoordeel altijd op mobiel; meet scroll- en tikafstand; console-fouten van tijdens het bewerken zijn misleidend.
- **12-08-2026, ronde 1** — Drie echte problemen opgelost: minigames waren vergrendeld voor nieuwe spelers; de speelhal-tabs bleven zichtbaar tijdens een spel; een ontbrekende constante brak de bouw. **Ernstige bug gevonden vóór publicatie:** `rollWeek` gaf de volledige state terug, waardoor een spread in `set()` zojuist bijgewerkte voortgang zou overschrijven.
