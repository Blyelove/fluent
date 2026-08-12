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
   - ALLES GAAT ALTIJD DIRECT LIVE OP DIE LINK. Een ronde is pas af als de wijziging gepusht is, de bouwstraat groen is en de nieuwe bundel aantoonbaar op de link staat. Werk dat alleen lokaal staat telt niet als af. Nooit werk laten liggen tot een volgende ronde als het al bewezen werkt.

I. AFWERKING
   - Alles wat de gebruiker ziet is foutloos, natuurlijk Nederlands.
   - SCHRIJF GEEN AI-TAAL. Vermijd gedachtestreepjes waar een gewone zin kan staan; los het op met een punt, een komma of een dubbele punt. Dit geldt voor alle teksten in de app, voor commitberichten én voor rapportages aan de gebruiker. Korte, natuurlijke zinnen winnen altijd.
   - Nooit een loze belofte in de tekst: staat er dat je iets verdient, dan krijg je het ook echt.
   - Visueel nooit saai, plat of leeg. Als het saai oogt, is dat een bug.

J. MAXIMALE CREATIVITEIT — woordelijk van de gebruiker, en permanent van kracht
   - "Je mag ook constant aan het design werken: verbeteren, vermeerderen qua karakters, keuzes, noem maar op — ga eens los." Designwerk en personage-uitbreiding zijn dus ALTIJD een geldige rondekeuze, ook zonder bug of missend punt op de lijst.
   - HET DESIGN BLIJFT IN ELK OPZICHT ALTIJD VERBETEREN — expliciete opdracht. Elke ronde wordt het design érgens zichtbaar beter, hoe klein ook: een strakkere spatiëring, een rijkere animatie, een leesbaarder contrast, een leger scherm dat karakter krijgt, een piekmoment dat feestelijker wordt. Stilstand in het design is een bug. Kies je tussen twee gelijkwaardige verbeteringen, dan wint de zichtbaar mooiste.
   - "Pak de gehele UI/UX aan." Doorlopende opdracht: elk scherm wordt keer op keer herzien tot het niveau van de allerbeste apps — niet alleen bugs, de hele beleving.
   - DE PERSONAGEGALERIJ BLIJFT ALTIJD GROEIEN (nu 1000: 500 mannen + 500 vrouwen uit alle taalwerelden, in themagolven — klassiek, neon, fel gekleed, wild). De gebruiker eist "gekke variatie in keuzes overal"; de galerij wordt gegenereerd in src/components/avatarGallery.ts, dus uitbreiden = de generator rijker maken (nieuwe haarstijlen, kledingstukken, extra's in Avatar.tsx geven meteen duizenden nieuwe combinaties). Eerst man of vrouw kiezen, dan pas de galerij — dat is de vaste volgorde van het keuzescherm.
   - ONTGRENDELBARE HELDEN: een deel van de personages is een zwart silhouet tot je een uitdaging haalt (een reeks, een divisie, een veroverd land, een gewonnen Grensproef). Vrijspelen is een feest; wat ontgrendeld is kan NOOIT meer op slot — vrijspelen mag, afpakken nooit. Nog te bouwen: silhouet-weergave + ontgrendelvoorwaarden + het vrijspeel-moment met confetti.
   - LOOP OVERAL DE LOGICA DOOR ZOALS EEN NIEUWE GEBRUIKER HEM BELEEFT — woordelijke opdracht na de man/vrouw-eerst-fix. Elke flow heeft een natuurlijke volgorde: een keuze bovenaan moet filteren wat eronder komt, stappen heten Stap 1/2/3 als dat helpt, en niets op het scherm mag de vraag oproepen "wat is dit en waarom zie ik het nu?". Ultiem makkelijk bedienbaar is de lat: één duim, één blik, nul uitleg nodig.
   - VERSLAVEND MET ALLES ERAAN: minigames, activiteiten en missies die je alleen ÓF met vrienden kunt doen — wees creatief, dat is een staande opdracht. Elke nieuwe functie krijgt waar mogelijk een solo-route én een vriendenroute (zoals de botduels naast de vriendenduels), en het aanbod aan speelbare dingen blijft groeien.
   - VERRAS IEDEREEN — DE GEBRUIKER ÉN JEZELF. Woordelijk: "verras iedereen, mij en ook jezelf in hoeveel creativiteit hierin mogelijk is — ga alles na, verbeter de prompt continu en werk als een beest." Durf per ronde iets te bouwen dat nog in geen enkel plan stond, als het de app aantoonbaar leuker maakt. Veilig herhalen van wat er al is telt niet als creativiteit; minstens af en toe moet een ronde iets opleveren waarvan zelfs dit document opkijkt.
   - "Maak ons uniek in alles — ook hoe je van landje naar landje beweegt. De hele ervaring moet unieker dan uniek zijn tegenover alle concurrentie die er is. Wij zijn maximaal creatief in elk opzicht." Meet elk scherm hieraan af: als Duolingo of een andere taal-app hetzelfde heeft, is het niet af.
   - "Maak er desnoods ook ergens een videogame-spel-achtig iets van voor die ultieme ervaring en keuzes." Dat wordt DE WERELDREIS (Blok H hieronder): de landenkaart als echte spelwereld waar je personage doorheen reist. Dit is het handelsmerk van Fluent in wording — elke ronde die eraan bouwt is een goede ronde.

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
   EEN SCHERM REKENT NOOIT NA WAT DE STORE AL BEREKENT. Toont een scherm een beloning, lees dan het verschil in de opgeslagen waarde (voor en na), nooit een eigen kopie van de formule. Twee sommen op twee plekken lopen gegarandeerd een keer uit elkaar: toen lessen dubbele XP kregen, bleef het lesresultaat zijn eigen som maken en stond er +10 terwijl je er 20 kreeg.
   HAAL IETS UIT DE PAGINA PAS OP HET MOMENT VAN DE HANDELING. Een `ref`, een gemeten afmeting of een stuk DOM is tijdens het renderen nog leeg. Geef een fúnctie door die het object maakt bij de klik (`kaart={() => ({...})}`), nooit een kant-en-klaar object.
   BOUW JE IETS DAT AFHANGT VAN EEN TELLER? Controleer expliciet wat er gebeurt als die teller nul wordt. Een missie "werk 3 fouten weg" mag niet omklappen zodra je lijst leeg is — dan zie je je zojuist verdiende beloning verdwijnen.
   WEEG ALTIJD DE KEERZIJDE. Haal je iets naar boven, dan zakt er iets anders weg. Vraag je af wat je zojuist begraven hebt en compenseer dat met een compacte samenvatting of snelkoppeling. Verplaatsen zonder compensatie is een ruil, geen verbetering.
   EEN SCHUIFBALK IS BIJNA ALTIJD EEN ONTWERPFOUT. Past iets niet, laat het dan afbreken in een raster, of klap het in met een "toon alles"-knop. Moet je toch schuiven met de duim, gebruik dan .no-scrollbar. Een grijze systeembalk hoort nergens in dit ontwerp.

4. CONTROLEREN — vijf keer nakijken. (a) npx tsc --noEmit geeft 0 fouten; (b) npm run build slaagt; (c) open de app opnieuw en test je wijziging zelf klikkend, met screenshot als bewijs — en controleer dat de knop écht doet wat hij belooft; (d) test de randgevallen door de opgeslagen staat tijdelijk te manipuleren via localStorage 'aurea-v1': nieuwe gebruiker zonder data, alles voltooid, lege lijsten, dag- of weekovergang — zet je testdata daarna terug; (e) lees je eigen diff terug en zoek actief naar bugs die je zelf introduceerde, vooral state die overschreven wordt, timers die niet opgeruimd worden en zustand-selectors die elke render een nieuw object teruggeven; (f) bouwde je een miniatuur of een klein beeld, meet dan of het betekenisvolle deel ook echt zíchtbaar overblijft — een lijn die je tekent maar die volledig wegvalt achter een vlag of een personage, bestaat voor de gebruiker niet.
   BOUW BEWIJS OP DE JUISTE LAAG. Door de app heen klikken is de laatste meter, niet het hele bewijs. Voor alles wat over dáta gaat (cursusinhoud, indexen, paren, audiodekking) bestaat scripts/check-content.ts — breid die uit in plaats van met de hand te klikken; hij draait in elke build en beschermt ook alle toekomstige rondes. Klikken bewijst alleen wat een controle-script niet kan zien: gevoel, animatie, leesbaarheid.
   KIJK NIET ALLEEN OF HET ER STAAT, MAAR OF HET DE RUIMTE VULT. "Zichtbaar" is niet "goed". Zoom in op het eindresultaat en vergelijk het met wat je bedoelde.
   LET OP bij de console: fouten van tijdens het bewerken blijven in de geschiedenis staan en zijn misleidend. Als tsc, de build én de echte render kloppen, is de app in orde.
   LET OOK OP bij screenshots en bij het uitlezen van tekst: een meting vlak na een klik, scroll of herlading kan een half gerenderd beeld tonen. VASTE REGEL: wacht ruim een seconde en meet opnieuw voordat je concludeert dat iets stuk is.

5. PUBLICEREN. Heb je een agent-team ingezet? Controleer ná afloop met `git status` of er nog wijzigingen binnenkwamen — controleurs leveren hun correcties vaak later aan. Zijn er nieuwe of gewijzigde zinnen, draai dan opnieuw `npx tsx scripts/generate-audio.ts` (idempotent) en bouw opnieuw, anders staat er content live zonder geluid. Daarna: git add -A, commit met een duidelijke Nederlandse beschrijving, git push. Dat publiceert automatisch naar https://blyelove.github.io/fluent/ — controleer daarna via de GitHub Actions API dat de bouw is geslaagd en dat de live site HTTP 200 geeft. Live is pas live als de spéler het ziet: vergelijk de bundelhash van de live index met je lokale dist, en weet dat de app zelf een bouwstempel toont (onderaan het profiel) en een verversknop zodra de service worker een nieuwe versie klaar heeft staan. `gh` staat niet in het PATH van de Bash-shell; gebruik PowerShell met Invoke-RestMethod op api.github.com.

6. RAPPORTEREN in het Nederlands: wat zag je, wat verbeterde je, en wat is de volgende grootste kans. Kort en zonder opsmuk.

7. JEZELF VERBETEREN. Werk als laatste stap dit bestand bij: voeg toe wat je miste, schrap wat niet werkte, scherp aan wat vaag bleek, streep af wat af is en zet er nieuwe ideeën bij die je tijdens het testen bedacht. Zet onderaan een korte logregel met de datum en wat je verbeterde. Commit het mee. De volgende ronde leest de nieuwe versie — zo wordt de opdracht elke keer scherper.

8. DE LUS LOOPT DOOR VIA CRON, elke 15 minuten. Je hoeft zelf niets opnieuw in te plannen. Een ronde vuurt alleen als de vorige klaar is, dus een zware ronde vertraagt hooguit de volgende — hij slaat niets over.
   HET LOGBOEK IS HET BEWIJSSTUK, NIET DE AFSLUITING. Een ronde zonder logregel telt niet als af. Tussen ronde 30 en 55 is er wel gebouwd maar niet gelogd, en daardoor is niet meer na te lezen wát er is besloten en waaróm — precies de kennis waar de volgende ronde op zou moeten voortbouwen. Schrijf de regel nog vóór je afsluit, en zet erin wat je hebt geleerd, niet alleen wat je hebt gemaakt.
   PAS JE RONDE AAN OP HET VENSTER. Vijftien minuten is kort. Kies dus iets dat je in die tijd hélemaal af krijgt: één bewezen bug, één klein scherm, één regel content. Kom je er toch niet uit, maak het dan de volgende ronde eerst áf voordat je iets nieuws begint — half werk in de repo is erger dan een gemiste ronde.

═══════════════════════════════════════════════════════════════
DEEL 3 — KERNREGELS DIE NOOIT VERANDEREN
═══════════════════════════════════════════════════════════════
- NOOIT STRAFFEN. Geen hartjes, geen energie, geen limieten, geen schuldgevoel. Motiveren doe je met beloningen, competitie, voortgang en trots. Dit is hét verschil met Duolingo.
- Design: de verlichte arcadehal (vastgelegd door zes ontwerplenzen plus een hoofdontwerper in ronde 57). Diepe achtergrond met vignet en drie kleurzones als vaste laag op body::before/::after (nooit background-attachment: fixed, dat is kapot op iOS). Kaarten zijn getint lila glas met een lichtrand van boven. Neon is een felle 1px-kern plus halo, geen wollige vlek. Eén held per scherm: alleen de Doorgaan-kaart draagt de goudroze gradiëntrand (.card-hero). Goud is exclusief voor beloningen (balken waar een kist of XP achter zit krijgen .progress-fill--gold, de rest blijft neonroze), cyaan is de systeemkleur. Voltooide lessen zijn scheve paspoortstempels op de Gouden Draad, en jouw personage staat op de huidige knoop. Baloo 2 op alle kaartkoppen (.card-title); Instrument Sans gaat tot 700, dus nooit font-weight 800 op de UI-font. Maximaal 3 oneindige animaties per scherm (vlam, ring-pulse, ademende Doorgaan-knop), al het andere is een eenmalige entrance (.rise met --d-delay). Chunky 3D-drukknoppen, alles minstens 44px, één duim.
- GEEN ENKEL SCHERM SCROLT OPZIJ. De pagina is een rechte kolom. Het knippen zit op html { overflow-x: clip } en NERGENS anders: een overflow op body maakt bódy het scrollvak en dan doet window.scrollTo niets meer (ronde 57 kostte dit een uur). Meet elke ronde documentElement.scrollWidth ≤ clientWidth op de schermen die je aanraakt.
- Geen middenstreepjes in teksten die de gebruiker ziet. Home is geveegd (ronde 57); veeg elke ronde één scherm tot de teller op nul staat, en schrijf nieuwe teksten er meteen zonder.
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

▓▓ DE KERNDIAGNOSE — lees dit voordat je iets kiest.
   Fluent is verder dan het lijkt: de hele schil staat er (XP-curve tot niveau
   20, dag- en weekmissies met kist, tien divisies, reeks met kalender, badges,
   wereldverovering, zes cursussen, 84 gidsen, 1931 moedertaal-opnames).
   Wat ontbreekt is niet de bréédte maar de EERLIJKHEID: de app belooft luid
   dingen die de code niet doet. Herhalen en spelen houden je reeks niet in
   leven, "dubbele XP" verdubbelt geen enkele les, de weekkist is voor iemand
   zonder vrienden permanent op slot, promotie gebeurt op een verborgen
   XP-drempel in plaats van de ranglijst die je zeven dagen lang ziet.
   HET INZICHT: elke gebroken belofte vóélt voor de gebruiker als een straf —
   precies wat de kernregel verbiedt. De nooit-straffen-regel wordt dus niet
   geschonden door hartjes of limieten, maar door beloftes die niet uitkomen.
   Daarom gaan de reparaties vóór de uitbreidingen: pas als de beloningen
   kloppen, heeft het zin om er een maandmissie, een uitspraakspel of een
   kledingkast bovenop te bouwen. En bijna elke reparatie hieronder is klein.

▓▓ DE VOLGORDE — zo werk je Blok A af, meest waardevol eerst. Deze rangschikking
   komt uit de audit en weegt impact tegen moeite; wijk er alleen van af als je
   iets vindt dat aantoonbaar erger is.
   1. ✅ AF (ronde 16): alle XP telt echt mee — herhalen, toetsen, minigames en duels houden je reeks in leven via registreerLeerdag().
   2. ✅ AF (ronde 17): de competitieweek rolt door zodra je de app opent, in registerVisit().
   3. ✅ AF (ronde 18): antwoordopties worden geschud bij het renderen (useGeschud), en scripts/check-content.ts bewaakt de content in elke build.
   4. ✅ AF (ronde 16): dubbele XP verdubbelt ook lessen en herhalingen via metBoost().
   5. ✅ AF (ronde 19): personage altijd aanpasbaar via het ✏️ op je profiel-avatar, met live opslaan; spelfout "volledig spaans" meteen hersteld.
   6. ✅ AF (ronde 20): drie oefenbots in de duel-hub met eigen moeilijkheid en revanche-knop; weekmissie "speel 1 duel" is solo haalbaar.
   7. ✅ AF (ronde 22): na elke fout of tikfout spreekt een moedertaalstem het juiste antwoord uit, in lessen, herhaling én duels; manifest van 1931 → 2480 fragmenten met volledige dekking, bewaakt door de poortwachter.
   8. ✅ AF (ronde 21): één tikfout of gemist accent telt goed met een spellingtip ("Let op de spelling: adiós"); twee fouten blijft fout. In lessen, herhaling én duels.
   9. ✅ AF (ronde 23): .unit-card gedefinieerd (20px 18px padding, 16px marge) — de vier hoofdkaarten plakken niet meer aan elkaar; gemeten op alle vier.
   10. ✅ AF (ronde 24): de app-brede onderbalk verdwijnt tijdens elk potje en duel (playing-signaal doorgetrokken van PlayScreen naar App); hele cyclus bewezen.
   11. ✅ AF (ronde 25): promotie en degradatie volgen de eindstand van de ranglijst (eindstand() + zoneFor()), met een uitslagkaart op de Divisie-pagina en confetti bij promotie. DE HELE TOP-12 IS AF.
   12. Volgende: DE WERELDREIS bouwen volgens WERELDREIS.md, fase voor fase — en daarnaast blok B t/m G.

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

▓▓ BLOK U — UI/UX-VERBOUWLIJST (zie UIUX.md)
   Uit een doorlichting van vijf flows door beoordelaars die de app als nieuwe
   gebruiker doorliepen: 36 punten, elk in één kwartierronde af en met een
   eigen bewijs. Grote lijn: de kern voelt al als een topspel, maar de eerste
   vijf minuten kosten te veel (accountmuur, dubbele onboarding, Home vol lege
   tellers vóór je eerste woord), en beloningen zwijgen of liegen op precies de
   momenten die verslavend horen te zijn. Werk de lijst van boven naar beneden
   af en streep af in UIUX.md.

▓▓ BLOK H — DE WERELDREIS (het videogame-handelsmerk; uitdrukkelijke wens van de gebruiker: "regel het")
   De wereldverovering is nu een saaie lijst vlaggetjes onderaan het startscherm,
   terwijl de data er al ligt (COUNTRIES + countryStates in src/countries.ts,
   14 landen per taal met veroverdrempels). Dat moet een échte spelwereld worden:
   een verticale, scrollende kaart met een slingerend pad, jouw eigen personage
   dat er zichtbaar overheen reist, per land een herkenbaar landmark-silhouet in
   neonstijl, het volgende land dat lokt, en de veroveringstoets als eindbaas.
   Het complete ontwerpplan staat in **WERELDREIS.md** (sinds ronde 25): visie,
   acht kernbeslissingen, tien bouwfasen met elk een eigen bewijs, en een
   bewust geparkeerde ideeënlijst. Bouw de fasen in volgorde, één per ronde,
   en streep ze daar af. Fase 1 t/m 9 zijn af (de kaart, de held erop, het
   land-paneel, de reisanimatie, de Poortwachter, het gevecht, de ceremonie,
   het paspoort en de Home-instap). Nog te doen: **fase 10, de sfeerlaag** —
   klimaatzones over de kaart, decorgroepjes per zone, mist over de toekomst.
   Daarna de geparkeerde ideeënlijst onderaan WERELDREIS.md, te beginnen bij
   de schatkisten halverwege een etappe en de zwaaiende bewoner met een groet.

▓▓ BLOK P — DUOLINGO-PARITEIT (uitdrukkelijke wens van de gebruiker, ronde 57:
   "we moeten alles hebben wat duolingo ook heeft ... zoals ai waar je mee kan
   praten"). De stand van de vergelijking, bijhouden bij elke ronde:
   ✅ Wij hebben (en vaak beter): leerpad met secties · reeks + bescherming ·
      dag- en weekmissies met kist · tien divisies met promotie op de échte
      ranglijst · duels tegen vrienden én bots · drie minigames · foutenlijst
      met SRS · grammatica-gidsen · 1000 personages · de Wereldreis met
      Poortwachters en paspoort · PWA · nooit straffen (hun hartjes-model is
      juist ons wapen).
   ✅ AF (ronde 59) — HET VRIJE GESPREK: de speler kiest zélf waar het over
      gaat (uitdrukkelijke wens van de gebruiker). src/content/gesprekkenExtra.ts
      + VrijSpeler in Gesprek.tsx: na de begroeting kies je uit zes onderwerpen
      (eten, reizen, muziek, sport, familie, het weer), praat je daar twee
      beurten over en kies je door of rond je af met een afscheid in de
      doeltaal. Elk gesprek is anders en oneindig herspeelbaar. Plus een
      restaurantscenario van vijf beurten in alle zes talen (bestellen,
      betalen, complimenten aan de kok). UITBREIDEN: nieuwe onderwerpen
      (werk, huisdieren, films, het weekend) en nieuwe scenario's; op termijn
      onderwerp-beurten laten meegroeien met je vaardigheidslevel.
   ✅ AF (ronde 57) — GESPREKKEN, ons antwoord op Duolingo Max Roleplay:
      src/content/gesprekken.ts (3 scenario's × 6 talen, elk antwoord is goed,
      fout bestaat niet) + src/screens/Gesprek.tsx (chatscherm met typindicator,
      moedertaal-audio per beurt, NL-vertaaltoggle, tik op een bel = opnieuw
      horen) + spraakherkenning via SpeechRecognition waar de browser dat kan
      (antwoord inspreken in plaats van tikken, met een ruime toleranmarge en
      een lieve fallback). 25 XP eerste keer, 10 XP daarna, telt als leerdag.
      UITBREIDEN: elke paar rondes een nieuw scenario in alle zes talen
      (restaurant, hotel, dokter, winkel, telefoongesprek, sollicitatie), en
      scenario's koppelen aan de landen van de Wereldreis.
   ◻ VERHALEN (Duolingo Stories): korte interactieve verhalen op A1/A2 met
      begripvragen tussendoor, hergebruik van de les-woordenschat en de
      bestaande audio-pijplijn. Grootste resterende pariteitsgat; ontwerp eerst
      één Spaans verhaal als sjabloon, dan uitrollen.
   ◻ Luisterverhalen (DuoRadio-achtig): een gesproken minidialoog afspelen en
      twee vragen stellen; kan volledig op de bestaande TTS-pijplijn draaien.
   ◻ Spreekoefeningen ín de les: het bestaande SpeechRecognition-werk uit
      Gesprek.tsx hergebruiken als oefentype "zeg het hardop" (alleen tonen als
      de browser het kan; het mag nooit blokkeren).
   ⛔ Echte vrije AI-chat (Duolingo Max Video Call): heeft een taalmodel-API
      nodig en dus een sleutel van de gebruiker. GEBLOKKEERD, zelfde regel als
      Supabase hieronder. De Gesprekken-architectuur is er al klaar voor: een
      vrije chatmodus is één extra bron van partnerbeurten.
   ✕ Bewust niet: hartjes/energie (straf), losse wiskunde- en muziekapps.

▓▓ BLOK R — VAARDIGHEDEN IN RUNESCAPE-STIJL (uitdrukkelijke wens van de
   gebruiker, ronde 59: "dat je dingen 99 kan halen in talen ... dat je op je
   poppetje kan drukken en alle skill levels kan zien").
   ✅ AF (ronde 59, curve verecht in ronde 60) — de kern: src/skills.ts met de
      AUTHENTIEKE RuneScape-formule (xp(l) = Σ floor((l + 300·2^(l/7))/4),
      geschaald door 217 zodat 99 op 60.066 XP landt; tabel strikt stijgend
      gehouden omdat level 2 anders nul XP breed werd). Daardoor kloppen de
      iconische eigenschappen exact: level 92 is precies de helft van 99, de
      eerste levels regenen binnen en de laatste zeven kosten evenveel als de
      eerste 92. Wie elke dag zijn dagdoel haalt is jaren bezig met een 99,
      net zo lang als daar. Plus per taal de rij "Soorten {taal}": alle
      landvarianten (Spanje-Spaans, Mexicaans-Spaans, ...) als vlaggen,
      veroverd in goud, de rest gedimd. SkillsSheet-component met
      totaalniveau (de som van al je taallevels, RS-stijl) en per taal
      level /99, voortgangsbalk, XP-stand, mijlpalen (10/25/50/75/90/99) en
      substats (lessen, woorden, gesprekken, stempels). Te openen door op je
      poppetje te drukken op Home (met gouden levelbadge op de avatar) en via
      de Vaardigheden-kaart op het profiel. De XP komt rechtstreeks uit
      progress[taal].xp: geen aparte boekhouding die uit de pas kan lopen.
   UITBREIDEN, in deze volgorde:
   1. Level-up-viering: bij elke levelsprong een korte fanfare + confetti op
      het lesresultaatscherm ("Spaans is nu level 10!"), bij mijlpalen groter.
   2. Deelvaardigheden per taal, elk met een eigen level richting 99:
      Luisteren (luisteroefeningen + Luisterjacht), Spreken (ingesproken
      gespreksbeurten), Lezen, Schrijven (typ-oefeningen), Gesprekken,
      Herhalen. Vergt per-oefentype XP-boekhouding in de store; bouw dat als
      één veld skillXp[taal][vaardigheid] dat elke evaluatie bijwerkt.
   3. De 99-mantel: wie een taal op 99 krijgt, verdient een gouden mantel als
      avatar-accessoire (RuneScape-kappe-gevoel), zichtbaar in de galerij.
   4. Skill-missies: "haal vandaag 3 levels" als extra dagmissie-variant.

▓▓ GEBLOKKEERD tot de gebruiker een Supabase-project en sleutels aanlevert:
   echte accounts op een server, "wachtwoord vergeten", vriendenlijsten,
   ranglijst tussen vrienden, synchronisatie tussen apparaten, het
   welkomstmailtje en meldingen die je reeks redden. Ik mag zelf geen account
   voor hem aanmaken. Vraag er niet elke ronde naar; noem het hooguit één keer
   in het rapport als het echt relevant is. Wat je wél mag doen: het schema,
   de beveiligingsregels en de synchronisatiecode klaarzetten zodat het
   aanzetten straks één handeling is.

✅ AL AF (niet opnieuw bouwen): vrienden-duels via deel-link · deelbare resultaatplaatjes, ook met je eigen personage erop · Nederlandstalige grammaticagidsen per unit · "Waarom?"-uitleg bij een fout antwoord · jouw-fouten-oefening gevoed door lessen, toetsen én duels · comeback-beloning na afwezigheid · "nog één les"-haakje · dagmissies met bonuskist · weekmissies · divisies · drie minigames · zelf samengestelde toetsen · 1000 personages plus een vrije personage-maker · gesprekken met keuzes en spraak in zes talen · de verlichte-arcadehal-designtaal op Home · PWA · automatische publicatie.

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

- **13-08-2026, ronde 60** — Op directe vraag van de gebruiker ("duurt het net zo lang als bij RuneScape?") de vaardigheidscurve verecht: niet langer een eigen kwadraat maar de **authentieke RuneScape-formule**, geschaald door 217. Bewezen met de tabel zelf: level 92 = 30.033 XP = exact de helft van 99 (60.066), level 10 kost 5 XP (levels regenen vroeg, net als daar), level 50 valt na ongeveer een week dagelijks spelen en daarna begint de grind van jaren. Valkuil gevonden en gefixt: door het schalen werd level 2 nul XP breed, wat de voortgangsbalk op NaN zette; de tabel is nu strikt stijgend. Ook "alle soorten Spaans" letterlijk zichtbaar gemaakt in het paneel: per taal een rij met alle veertien landvarianten als vlaggen, veroverd in goud met gloed, de rest gedimd, met een teller. Ondertussen draait een team van zeven scherm-beoordelaars plus toetsers en een hoofdontwerper aan de volgende sprong in design, logica en gebruiksgemak (uitdrukkelijke opdracht: "kan vele malen beter").
- **13-08-2026, ronde 59** — Twee nieuwe wensen van de gebruiker, allebei dezelfde dag gebouwd én live. (1) **Vaardigheden in RuneScape-stijl**: druk op je poppetje en je ziet per taal je level richting 99, met een totaalniveau bovenaan, mijlpalen en substats per taal. De curve (6·(l−1)²) is zo gekozen dat level 2 al in je eerste les valt maar 99 een meerjarenprestatie blijft, precies het RuneScape-gevoel. De XP komt rechtstreeks uit progress[taal].xp, dus historische voortgang telde meteen mee: het testaccount opende op Spaans level 9 met echte cijfers. Uitbreidingspad (level-up-viering, deelvaardigheden, de 99-mantel, skill-missies) staat in Blok R. (2) **Het vrije gesprek**: de speler kiest zelf waar het over gaat. Zes onderwerpen per taal, twee beurten per onderwerp, doorpraten of afronden, plus een restaurantscenario van vijf beurten in alle zes talen. Bewezen: intro → Muziek → terug in de keuze (Muziek weg uit de chips) → Het weer → afronden → +25 XP (465→490) en 'vrij' in de opslag. Ook gefixt: de bouwstempel toonde UTC-tijd omdat GitHub Actions in UTC bouwt; nu expliciet Europe/Amsterdam. **Les:** de bouwstempel maakte de bundelhash niet-deterministisch, waardoor "vergelijk lokale hash met live hash" als bewijs stierf op het moment dat de stempel erin kwam; het nieuwe bewijs is de stempel zélf uit de live bundel lezen. Wie een controle bouwt, moet checken welke oude controle hij daarmee sloopt.
- **12-08-2026, ronde 58** — **"Ik zie niet veel veranderen op de live link" bleek een cache-illusie, en die is nu structureel opgelost.** Er gingen die dag acht versies live, maar de PWA-service-worker stond op autoUpdate: hij haalt een nieuwe versie stilletjes binnen terwijl de speler nog naar de vórige uit de cache kijkt, dus je moest altijd twee keer laden om iets te zien. Nu: (1) registerType 'prompt' met een gouden zwevende knop "⚡ Nieuwe versie klaar, tik om te verversen"; de wissel gebeurt pas na een tik, dus een deploy breekt nooit meer een lopende les (dat risico stond al als zorg in Blok G); (2) de service worker checkt elke minuut én bij het terugkeren naar het tabblad of er een deploy is, dus ook een openstaande telefoon ontdekt hem binnen een minuut; (3) onderaan het profiel staat een bouwstempel ("Fluent · versie van 12-08 21:12", gezet via define in vite.config.ts), zodat iedereen op de live site kan zíen welke versie draait in plaats van te moeten raden. LES, nu bindend bij stap 5: live zetten is pas af als de gebruiker de verandering ook zonder harde refresh te zien krijgt; controleer voortaan de bouwstempel op het profiel in plaats van alleen de bundelhash in de HTML. Eenmalige overgangskost: wie nog op de oude autoUpdate-worker zit, ziet deze deploy pas na het sluiten en heropenen van het tabblad; daarna geldt het nieuwe gedrag voor altijd.
- **12-08-2026, ronde 57** — De grootste ronde tot nu toe, gestuurd door drie live-opdrachten. (1) **GESPREKKEN: praten met een personage in de doeltaal**, ons antwoord op Duolingo Max. Drie scenario's (café, nieuwe vrienden, de weg vragen) in alle zes talen, als chat met typindicator, moedertaal-audio per beurt (218 nieuwe fragmenten gegenereerd, manifest op 2698, 0 mislukt), NL-vertaaltoggle, en je antwoord inspreken via SpeechRecognition waar de browser dat kan. Elk antwoord is goed, fout bestaat niet. Bewezen: heel gesprek uitgespeeld, +25 XP exact geboekt (440→465), `gesprekken: {es: ["cafe"]}` in de opslag. Eigen bug direct gevonden en gefixt: een selector met `?? []` gaf elke render een nieuwe array (oneindige lus), precies de valkuil uit stap 4e. (2) **De designsprong "verlichte arcadehal"**: zes ontwerplenzen + hoofdontwerper (55 findings) leverden een 14-stappenplan dat nu op Home en app-breed staat: getint glas met lichtrand, echte neon-gloed (kern+halo), zwevend arcade-dock, één held per scherm (.card-hero met goudroze rand), Gouden Draad met scheve stempel-knopen mét lesletter, jouw personage wachtend op de huidige knoop, goud exclusief voor beloningen, motion-budget van 10+ naar 3, staggered entrance, grabber op elk paneel. (3) **Opzij scrollen bestaat niet meer**: html { overflow-x: clip }. LES, duur betaald: de eerste fix zette de overflow óók op body, en een overflow op body maakt bódy het scrollvak waardoor window.scrollTo stilletjes niets meer doet en de pagina raar rendert. Overflow-knippen hoort op html, nergens anders. Verder Home geveegd op middenstreepjes in zichtbare tekst, en Blok P (Duolingo-pariteit) toegevoegd met de resterende gaten: verhalen, luisterverhalen, spreekoefeningen in de les; vrije AI-chat geblokkeerd op een API-sleutel van de gebruiker.
- **12-08-2026, ronde 56** — **Wereldreis fase 8 én 9 af, allebei live.** (1) **Het paspoort.** Elke Grensproef die je doorstaat laat nu een echte afdruk achter: `src/components/PassportStamp.tsx` tekent een inktstempel met de vlag in het midden, de landnaam gebogen langs de rand via `textPath`, de datum eronder en een scheefstand die uit de landcode wordt afgeleid — Spanje staat op 7°, Mexico op 10°, en herladen verandert daar niets aan. Het paspoort zelf opent met de 🛂-knop in de kaartheader: een raster van drie kolommen over alle veertien landen, verdiende stempels in goud, de rest als stippellijn met een "?", en onderaan "2 van de 14 stempels · volgende: Colombia". Een verzameling die om vulling vraagt, nooit een slot. (2) **Het wereldblok op Home is een stukje route geworden.** Veertien vlaggetjes op een rij vertelden je niets over waar je stond; nu zie je de bocht waar je op loopt, met het land achter je in kleur, jouw eigen personage precies zo ver als je lessen reiken (`getPointAtLength` op hetzelfde pad, `etappeFrac` uit dezelfde functie als de grote kaart) en het volgende land dat voor je uit lonkt met een amber randje. Teller en lessenstand bleven exact gelijk aan de oude weergave, want beide lezen uit `countryStates`. **Les, nu in stap 4:** bij een miniatuur is "het staat er" niet genoeg — de eerste versie had de afgelegde route wél getekend, maar hij viel volledig weg achter de vlagcirkel en het personage. Meet bij elk klein beeld of het betekenisvolle deel ook echt zíchtbaar overblijft naast alles wat eroverheen staat. **Tweede les, nu in stap 8:** het logboek is niet de nette afsluiting maar het bewijsstuk van de ronde — tussen ronde 30 en 55 is er gebouwd zonder te loggen, en daardoor is niet meer na te lezen wat er is besloten. Een ronde zonder logboekregel telt niet als af.
- **12-08-2026, ronde 29** — Grote ronde, gestuurd door vijf live-opdrachten van de gebruiker. (1) **Wereldreis fase 4 af**: de veroveringsrun — kom je op de kaart terwijl er sinds je vorige bezoek een land bij is, dan rent je held er in 2,4s naartoe (het land blijft grijs tot hij aankomt), de vlag klapt open met een veer-pop, confetti spuit vanaf de knoop en een banner "🏆 {Land} veroverd!" verschijnt; daarna wandelt hij door naar zijn plek op de volgende etappe. Op verzoek van de gebruiker ("moet smoother") de hele run omgezet naar **motion-waarden buiten React om** — geen re-render per frame meer, 60fps. `worldSeen` in de store zorgt dat elke verovering precies één keer gevierd wordt. (2) **De personagegalerij: van 24 naar 1000** (500 mannen, 500 vrouwen), gegenereerd in themagolven (klassiek/neon/fel/wild) met echte namen uit alle taalwerelden, gegarandeerd uniek uiterlijk, en soepel scrollend dankzij content-visibility. (3) Het keuzescherm is **man/vrouw éérst** (Stap 1 → Stap 2 helden → Stap 3 zelf maken) — de gebruiker vond alles door elkaar onduidelijk, en had gelijk. (4) Nieuwe vaste regels in Deel J: de galerij blijft altijd groeien, de hele UI/UX is een doorlopende opdracht, en er komen **ontgrendelbare silhouet-helden** die je vrijspeelt met prestaties. (5) MASTERPROMPT.md als bestand naar de gebruiker gestuurd ter controle. **Les:** de 24 personages bestonden al maar zaten achter een inklapknop — de gebruiker zag ze niet en dacht dat ze er niet waren. Rijkdom die je verstopt bestaat niet; toon overvloed, en regel de prestatie met rendering-technieken in plaats van met verbergen.
- **12-08-2026, ronde 28** — **Wereldreis fase 3: het land-paneel.** Elke landknoop op de kaart is nu een echte knop; tikken opent een veerkrachtig paneel (modal-patroon met sleepbalkje) met per status een eigen verhaal: veroverd = "🏆 Veroverd" met vlag in gouden ring; volgende bestemming = "Nog X lessen en de vlag van {land} is van jou" met voortgangsbalk én de knop "▶ Verder leren →" die de kaart sluit en meteen de eerstvolgende les start; verderop = uitleg over de route; buiten de cursus = "🔭 Dit land komt met nieuwe lessen — jouw wereld groeit vanzelf", nooit een slot. Bewezen: Spanje toont de veroverd-variant, Colombia de volgende-variant met "nog 2 lessen", en de CTA startte aantoonbaar een echte les (NIEUW WOORD-scherm). De kaart is daarmee een lanceerplatform, geen galerij.
- **12-08-2026, ronde 27** — **Wereldreis fase 2: de held staat op de kaart.** Je eigen personage — met je zelfgekozen uiterlijk en culturele outfit — staat nu óp de actieve etappe, precies zo ver als je lessen reiken: de positie wordt gemeten aan het echte SVG-pad met `getPointAtLength(frac × totalLength)`, waarbij frac = (voltooide lessen − vorige drempel) / (drempel − vorige drempel). De actieve etappe vult live mee als roze→amber lijn (pathLength=1 + strokeDashoffset, 0,9s), de held kijkt in de reisrichting (scaleX bij een bocht naar links) en landt met een veerkrachtig spronkje. Bewijs conform plan: één les erbij verplaatste de held van y=2433,6 naar y=2395 — elke les is letterlijk een stap op de wereld. Alles-veroverd heeft een rustpunt: dan staat de held triomfantelijk bij het hoogste land.
- **12-08-2026, ronde 26** — **DE WERELDREIS FASE 1 IS LIVE: de kaart.** `src/screens/WorldMap.tsx` als volledig scherm vanaf de knop "🗺️ Reis verder →" op de wereldkaart-tegel van Home. Een verticale neon-sagakaart: onderaan "⛺ Hier begon jouw reis", dan elk land als 64px-knoop met echte vlag op een slingerend pad van kubische S-bochten (deterministische zigzag, dus stabiel), veroverde etappes als gloeiende paars→roze lijn over een gestippelde basislijn, het volgende land met pulserende amber ring (de enige oneindige animatie, conform het prestatiecontract), de verte gedimd en grijs met "na X lessen" of "🔭 komt met nieuwe lessen" — nooit een slot. Bij openen scrolt de kaart automatisch naar het volgende land op ~55% van het scherm. Geverifieerd op 375×812 met Spaans op 7 lessen: Spanje en Mexico veroverd met ✓ en gloeiende etappe, Colombia lonkt met "nog 3 lessen", geen horizontale overloop, schuifbalk verborgen met .no-scrollbar. Volgende: fase 2 — de held (je eigen personage) óp de kaart.
- **12-08-2026, ronde 25** — Top-12 punt 11, en daarmee is **de hele top-12 af**. Promotie en degradatie volgen nu de **eindstand van de ranglijst die je de hele week zag** in plaats van een verborgen XP-drempel: `eindstand()` in leagues.ts rekent de deterministische bots op volle weekvoortgang, `rollWeek` bepaalt je plek met `yourRank()` + `zoneFor()` en bewaart een `weekUitslag` in de store. De Divisie-pagina opent met een **uitslagkaart**: "🎉 Plek #4 — gepromoveerd!" met confetti, of bij degradatie een warme tekst zonder verwijt ("vanuit hier kan het alleen maar omhoog"). Deed je vorige week niets (0 XP), dan komt er géén kaart — niets om te betreuren. Beide richtingen bewezen: 900 XP in Zilver → plek #4 → gouden divisie; 10 XP in Goud → plek #30 → terug naar Zilver; wegklikken zet de uitslag op null. **Tegelijk het complete ontwerpplan voor DE WERELDREIS ontvangen en vastgelegd in WERELDREIS.md**: vier ontwerplenzen samengesmeed tot tien bouwfasen — de neon-sagakaart met je eigen personage als reizende held, de Poortwachter-eindbaas met vlagschild, en het paspoort met inktstempels. Volgende rondes: fase 1 (de kaart) bouwen.
- **12-08-2026, ronde 24** — Top-12 punt 10: **niets breekt je potje meer af**. De speelhal-tabs verdwenen al tijdens een spel, maar de app-brede onderbalk met vijf knoppen bleef gewoon onder je duim staan — één misveeg tijdens een potje op de klok en je run, reeksbonus en ongeboekte XP waren weg. Het playing-signaal ging simpelweg nooit verder dan PlayScreen. Nu doorgetrokken naar App, dat de onderbalk verbergt zodra een minigame of duel loopt. Bewezen over de hele cyclus: nav zichtbaar op start en in de speelhal-hub, wég tijdens een lopende Bliksemronde (klok liep), en terug na het verlaten van het spel.
- **12-08-2026, ronde 23** — Top-12 punt 9 én de vaste designregel in één: `.unit-card` bestond niet in de CSS terwijl vier hoofdkaarten op het startscherm erop leunden — dagmissies, weekmissies, doelen en wereldverovering hadden nul padding en plakten aan elkaar. Nu gedefinieerd (20px 18px binnenruimte, 16px onderlinge marge) en op alle vier gemeten en met een screenshot bevestigd. Op datzelfde screenshot was meteen te zien dat de weekmissie "Speel 1 duel" op 1/1 ✓ staat door het botduel van ronde 20 — de belofte uit die ronde is dus aantoonbaar overal waargemaakt.
- **12-08-2026, ronde 22** — Top-12 punt 7: **na elke fout hoor je hoe het wél klinkt**. `EvalResult` heeft nu `speakAnswer`: elk oefentype geeft door wat er in de doeltaal gezegd mag worden — en alléén als dat zeker de doeltaal is (bij een keuzevraag mét `speak` zijn de opties Nederlands, dus die zwijgt; een Spaanse stem die Nederlands voorleest is net zo fout als andersom). Lessen, herhaling en duels spreken het juiste antwoord uit na een fout én na een tikfout-met-tip, met 420ms vertraging zodat het feedbackpaneel eerst landt. De generator verzamelt nu ook de drie stille types (typ, woordtegels, invullen — de hele zin met het juiste woord erin) plus de juiste select-antwoorden: manifest van 1931 → **2480 fragmenten, 0 mislukt**, en de poortwachter controleert de dekking van álle zeven types bij elke build — die meldt nu **nul** ontbrekende teksten. Bewezen in de app: tikfout "grasias" → paneel toont de tip én `/audio/es-ES/….mp3` (het echte moedertaal-fragment) speelt af. Ondertussen draaide het ontwerpteam voor **De Wereldreis** (Blok H) en zijn de creativiteitsregels van de gebruiker als Deel J vastgelegd, inclusief: het design verbetert elke ronde ergens zichtbaar — stilstand is een bug.
- **12-08-2026, ronde 21** — Top-12 punt 8: **typefout-tolerantie met menselijke maat**. Eén tikfout in een typantwoord (letter te veel, te weinig of verkeerd, bij woorden van 4+ tekens) of een gemist accent telt nu als goed, met een spellingtip in het feedbackpaneel: "Let op de spelling: **adiós**". Twee fouten blijft gewoon fout — de tolerantie is exact één bewerking. Gebouwd als `beoordeelTypen()` in exercises.tsx met een eigen één-bewerkingscontrole (geen pakket nodig), `EvalResult` uitgebreid met `spellingTip`, en het paneel toont hem in lessen, herhaling én duels. Bewezen end-to-end: "adios" → goed met tip "adiós"; "grasias" → goed met tip "gracias"; tegenproef "grasia" (twee bewerkingen) → fout met "Juiste antwoord: gracias". Een tikfout is geen onwetendheid — en een antwoord afkeuren dat je eigenlijk wist, voelt als straf.
- **12-08-2026, ronde 20** — Top-12 punt 6: **oefenduels tegen bots**, dus de weekmissie "speel 1 duel" — en daarmee de weekkist — is eindelijk in je eentje haalbaar. Drie tegenstanders met een eigen karakter en trefkans (🤖 Robo Rens 50%, Turbo Tessa 68%, Meester Milan 85%); elke bot "speelt" zijn ronde per vraag met een kansje, dus de uitslag is elke keer anders en winnen blijft spannend. Volledig hergebruik van de bestaande duel-machinerie (payload met `x` = botscore), dus fouten uit een botduel belanden ook gewoon in je foutenlijst. Het uitslagscherm herkent een bot aan de naam en toont dan een **revanche-knop** in plaats van het "stuur je uitslag terug"-blok — een deel-link naar een bot sturen slaat nergens op. Bewezen in de app: duel gespeeld tegen Robo Rens (4–5, nipt verloren), weekDuels 0→1, duelgeschiedenis +1, +10 XP, en de revanche-knop staat er. Dit is meteen iets wat Duolingo níet heeft: duels zonder dat je vrienden nodig hebt.
- **12-08-2026, ronde 19** — Top-12 punt 5: **je personage is niet langer een eenmalige keuze**. Op je profiel-avatar zit nu een ✏️-knop die de volledige personage-maker openklapt (dezelfde als bij registratie, dus 24 presets plus alle vrije opties), met live opslaan: elke tik past je figuur direct overal aan. Store-actie `setAvatarLook` toegevoegd — die bestond simpelweg niet; het personage werd alleen bij registratie geschreven. Bewezen in de app: standaard-Sem → Yara met afro, direct zichtbaar in de kop van het profiel en bewaard in de opslag; de maker klapt netjes dicht met "Klaar — zo wil ik eruitzien". Onderweg de gemelde spelfout hersteld: "volledig spaans" → "volledig Spaans" (taalnamen krijgen in het Nederlands een hoofdletter).
- **12-08-2026, ronde 18** — Drie dingen in één ronde. (1) Top-12 punt 3: **antwoordopties worden nu geschud bij het renderen** (`useGeschud` in kiezen, luisteren en invullen) — in de content stond het juiste antwoord vrijwel altijd op knop 1 (Duits: alle 71 invuloefeningen), dus je leerde knoppen in plaats van taal. Bewezen: "hallo" staat hard op positie 1 in de content en verscheen op posities 2, 2, 0 over drie verse starts. (2) Onderweg een **ernstige bug gevonden die vóór het schudwerk ging**: het paar `hallo → hallo` in Duits les 1 (en `ja → ja`, `links → links` elders) zette de match-oefening voorgoed vast, omdat voltooide woorden in één set van kale strings werden bijgehouden — twee identieke woorden telden als één, de teller bleef op 7 van 8 staan en de les kwam nooit verder. **Meerdere Duitse lessen waren dus onvoltooibaar voor echte gebruikers.** Opgelost door per kant te markeren (`l:hallo` / `r:hallo`); bewezen met een schone run: 2/8 → 4/8 → 6/8 → 8/8 → les gaat verder. (3) **scripts/check-content.ts**: een poortwachter die in élke build alle zes cursussen controleert — correct-indexen binnen bereik, geen dubbele antwoordopties, geen dubbele woorden binnen een matchkolom (onoplosbaar dubbelzinnig), luistertekst zit bij de opties, en audiodekking van alles wat hoorbaar is. Vastgeklonken aan `npm run build`, dus scheve content kan nooit meer deployen. **Les, nu in stap 4: bouw bewijs op de juiste laag** — data-fouten vang je met een script dat elke build meedraait, niet met handmatig klikken; klikken is alleen voor wat een script niet ziet.
- **12-08-2026, ronde 17** — Top-12 punt 2: **de competitieweek rolt nu door zodra je de app opent** (`registerVisit` draait `rollWeek` en negeert daarbij de zelfde-dag-kortsluiting als de week gewisseld is). Voorheen zag je maandagochtend nog de stand van vorige week met valse promotie-verwachting, en kon je de weekkist claimen met oude voortgang — waarmee je de kist van de nieuwe week opbrandde. Bewezen met een gesimuleerde vorige week (500 XP, 8 lessen, kist niet geclaimd) op dezelfde dag: bij het openen gingen alle weektellers naar nul, werd de promotie naar divisie 1 netjes geboekt en is de kist niet meer met oude cijfers te claimen. **Les:** mijn eerste controle faalde omdat ik het weeknummer zelf narekende met een simpelere formule dan `weekIndex()` echt gebruikt (tijdzone + maandag-verschuiving) — controleer een uitkomst met de éigen functie van de app, niet met je eigen naberekening.
- **12-08-2026, ronde 16** — Top-12 punt 1 + 4 in één klap, zelfde oorzaak: alleen `completeLesson` werkte de reeks bij en alleen de speelhal paste dubbele XP toe. Nu lopen alle zes leeractiviteiten door `registreerLeerdag()` (reeks, bescherming, kalender) en `metBoost()` (XP). Bewezen: herhaalsessie bracht reeks 5→6 en zette vandaag op de kalender; les erna gedroeg zich onveranderd; met boost gaf een 6-punts-sessie er exact 12, op scherm én in opslag. Ook gevonden vóór publicatie: het resultaatscherm rekende de XP zelf uit en toonde "+6" bij 12 bijgeschreven — toont nu het echte bedrag.
- **12-08-2026** — Eerste versie. Dekt: verslavendheid, sociaal, personage, leren, techniek, de nooit-straffen-regel, het neon-arcade-design en de vijfvoudige controle. Zelfverbeterstap toegevoegd.
- **12-08-2026, ronde 15c** — De synthese van de audit toegevoegd, en die legde een scherpere diagnose bloot dan de losse bevindingen: **het probleem is niet de breedte maar de eerlijkheid**. De schil staat er compleet; wat rammelt zijn de beloftes die de code niet nakomt. Het bijbehorende inzicht staat nu bovenaan de bouwlijst: *elke gebroken belofte voelt voor de gebruiker als een straf* — de nooit-straffen-regel wordt hier dus niet geschonden door hartjes of limieten, maar door beloningen die niet uitkomen. Daarmee is ook de werkvolgorde omgedraaid: eerst repareren, dan pas uitbreiden. Er staat nu een **geordende top-12** in het bestand die impact tegen moeite weegt, met acht items die als "klein" zijn beoordeeld — dus haalbaar binnen één kwartierronde. De audit besloeg 50 agents en ruim 1000 gereedschapsaanroepen.
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
