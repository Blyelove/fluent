# Masterprompt — Fluent naar het hoogste niveau

Deze prompt draait automatisch elke 30 minuten. Hij dekt alles wat in de bouwchat is afgesproken.

```
Werk zelfstandig aan Fluent in C:\Users\Blye\Desktop\aurea — de taal-leer-app die op ELK gebied beter moet zijn dan Duolingo en dan 99% van alle apps. Dit project staat volledig LOS van Blyelove: raak die map, repo of deploy nooit aan.

ELKE RONDE DOE JE DIT, IN DEZE VOLGORDE:
1. KIJKEN MET JE EIGEN OGEN — OP MOBIEL. Zorg dat de dev-server draait (npm run dev, poort 5199), zet het browservenster op 375×812 (mobiel!) en open de app. Bijna iedereen gebruikt dit op een telefoon; een oordeel op een breed scherm is waardeloos. Klik als een échte gebruiker door minstens drie schermen — bijvoorbeeld een les, een minigame, de divisie, een duel, de badges of het streak-scherm — en maak screenshots. Beoordeel wat je ziet keihard eerlijk: wat is saai, lelijk, traag, verwarrend, leeg, of niet verslavend genoeg? Noteer ook elke bug, elke lege staat en elk moment waarop een nieuwe gebruiker zou afhaken.
   MEET OOK, NIET ALLEEN KIJKEN: hoeveel schermen moet je scrollen voor de belangrijkste actie? Hoeveel tikken kost het om te beginnen met leren, een spel te starten of je ranglijst te zien? Gebruik javascript in de pagina om dat hard te meten (getBoundingClientRect + innerHeight). Alles wat meer dan één tik of één scherm kost, is een kandidaat om te verbeteren.
2. KIEZEN. Pak uit die lijst de ÉÉN verbetering met de grootste impact op verslavendheid, plezier, duidelijkheid of leerresultaat. Liever één ding helemaal af dan drie half.
3. BOUWEN. Maak het volledig af: geen TODO's, geen placeholders, geen loze beloftes in de tekst (als er staat dat je iets verdient, moet je het ook echt krijgen). Nederlandse teksten, natuurlijk geschreven.
   WEEG ALTIJD DE KEERZIJDE. Als je iets naar boven haalt, verdwijnt er iets anders naar beneden. Vraag jezelf af wat je zojuist hebt begraven en of dat erg is; los het op met een compacte samenvatting of snelkoppeling in plaats van het simpelweg te verplaatsen. Verplaatsen zonder compensatie is geen verbetering maar een ruil.
4. CONTROLEREN — vijf keer nakijken. (a) npx tsc --noEmit moet 0 fouten geven; (b) npm run build moet slagen; (c) open de app opnieuw en test de wijziging zelf klikkend, met screenshot als bewijs — en controleer dat de knop ook écht doet wat hij belooft (start hij de júiste les, telt de score echt op?); (d) test de randgevallen door de opgeslagen staat tijdelijk te manipuleren via localStorage 'aurea-v1': nieuwe gebruiker zonder data, álles voltooid, lege lijsten, week- of dagovergang — zet je testdata daarna netjes terug; (e) lees je eigen diff terug en zoek actief naar bugs die je zelf hebt geïntroduceerd — vooral state die per ongeluk overschreven wordt, timers die niet opgeruimd worden en zustand-selectors die elke render een nieuw object teruggeven.
   LET OP bij de console: fouten die tijdens het bewerken ontstonden blijven in de console-geschiedenis staan (bijvoorbeeld "X is not defined", of een Vite 500 terwijl een bestand half opgeslagen was). Laat je daardoor niet misleiden — als `tsc`, de build én de daadwerkelijke render kloppen, is de app in orde.
   LET OOK OP bij screenshots: een opname vlak na scrollen of herladen kan een half gerenderd beeld tonen met lege ruimte onderaan. Controleer een vermoedelijk lay-outprobleem altijd met gemeten waarden (getBoundingClientRect, innerHeight, getComputedStyle) voordat je gaat repareren — anders jaag je op een spook.
5. PUBLICEREN. git add -A, commit met een duidelijke Nederlandse beschrijving, git push. Dat publiceert automatisch naar https://blyelove.github.io/fluent/ — controleer daarna via de GitHub Actions API dat de bouw is geslaagd en dat de live site HTTP 200 geeft.
6. RAPPORTEREN in het Nederlands: wat zag je in de app, wat verbeterde je, en wat is volgens jou de volgende grootste kans.

KERNREGELS DIE NOOIT VERANDEREN:
- NOOIT STRAFFEN. Geen hartjes, geen energie, geen limieten, geen schuldgevoel. Motiveren doe je met beloningen, competitie, voortgang en trots. Dit is hét verschil met Duolingo.
- Design: neon arcade. Indigo #0E0B1F, paars/roze gradients (#A855F7 → #EC4899), amber XP (#FFC53D), cyaan selectie (#22D3EE), chunky 3D-drukknoppen die echt indrukken, Baloo 2 voor koppen, veel animatie en confetti op de piekmomenten. Alles minstens 44px hoog en makkelijk te bedienen met één duim op een telefoon.
- Uitspraak: elke taal klinkt als een moedertaalspreker. Nooit een Nederlandse stem die een vreemde taal uitspreekt. Na elke contentuitbreiding npx tsx scripts/generate-audio.ts draaien.
- Alles wat de gebruiker ziet is volledig vertaald en foutloos Nederlands.

WAAR JE AAN MAG WERKEN — pak steeds wat nu het meest ontbreekt:
- INDELING & GEMAK (vaak de grootste winst, wordt het snelst vergeten): staat de belangrijkste actie bovenaan? Kost iets onnodig veel tikken of scrollen? Is er ergens een dood spoor zonder vervolgstap? Elk scherm hoort een duidelijke volgende stap te bieden — ook als er niets te doen is.
- VERSLAVING: dagelijkse dubbel-XP-momenten, verrassingskisten, meer minigames (bijvoorbeeld een tijdrace tegen je eigen record, een woordslang, een uitspraak-spel), seizoenen met een eindbeloning, comeback-beloningen na afwezigheid, een "nog één les"-haakje aan het eind van elke sessie.
- SOCIAAL: vrienden toevoegen, onderlinge ranglijst, uitdagingen met inzet, samen een weekdoel halen, je resultaat delen als plaatje.
- PERSONAGE: nog meer kledingstukken, accessoires en animaties per niveau en per taal; een echte kledingkast waarin je zelf combineert; zeldzame items die je alleen met prestaties krijgt.
- LEREN: cursussen uitbreiden richting B1/B2, grammatica-uitleg in het Nederlands, verhalen en luisterfragmenten, een AI-gesprekspartner om echt te praten, en slimmer herhalen op basis van jouw fouten.
- TECHNIEK: offline werken, installeerbaar op het beginscherm, sneller laden, en op termijn een echte server voor accounts, vriendenlijsten, het welkomstmailtje en meldingen die je streak redden.

7. JEZELF VERBETEREN. Werk als laatste stap dit bestand (MASTERPROMPT.md) bij op basis van wat je deze ronde hebt geleerd: voeg toe wat je miste, schrap wat niet werkte, scherp aan wat vaag bleek, en houd de lijst met kansen actueel (streep af wat af is, zet er nieuwe ideeën bij die je tijdens het testen bedacht). Zet onderaan een korte logregel met de datum en wat je verbeterde. Commit het bestand mee. De volgende ronde leest deze nieuwe versie — zo wordt de opdracht elke keer scherper.

Werk door tot de ronde af is. Vraag niets, wacht nergens op, en stop pas als de verbetering live staat en bewezen werkt.
```

## Hoe de loop draait (zelfverbeterend)

De loop krijgt bewust een korte startopdracht die naar dit bestand verwijst. Omdat elke ronde dit bestand ook verbétert, wordt de opdracht zelf steeds beter — zonder dat je de loop opnieuw hoeft in te stellen:

```
/loop 30m Lees C:\Users\Blye\Desktop\aurea\MASTERPROMPT.md volledig en voer de instructies in het codeblok daarin uit, inclusief de laatste stap waarin je dit bestand zelf verbetert en meecommit.
```

Stoppen kan met `/loop stop`.

---

## Logboek

- **12-08-2026** — Eerste versie. Dekt: verslavendheid, sociaal, personage, leren, techniek, de nooit-straffen-regel, het neon-arcade-design en de vijfvoudige controle. Zelfverbeterstap toegevoegd.
- **12-08-2026, ronde 3** — De in ronde 2 gemarkeerde kans afgemaakt: het **leerpad staat nu direct onder de Doorgaan-hero** (van 1,17 naar **0,44 scherm** scrollen; de eerste lesknop is nu meteen zichtbaar). Technisch opgelost door `.shell` op Home een flex-kolom te maken en de zes meta-kaarten `order: 1` te geven — dus zonder 90 regels JSX te verplaatsen, wat foutgevoelig zou zijn. Omdat de dagmissies daardoor vijf schermen naar beneden zakten, is er een **compacte statusbalk** onder de hero gekomen: drie tikbare chips (⚜️ missies 0/3, 🎁 weekkist 0/4, 🏆 divisieplek) die de dagelijkse haakjes zichtbaar houden en met één tik naar het juiste blok of naar de Divisie-tab springen. **Lessen voor volgende rondes:** (1) een JSX-commentaar buiten het hoofdelement breekt het hele bestand — zet commentaar altijd binnen de root; (2) `order` op flex-kinderen is een veilige manier om de volgorde te veranderen zonder code te verplaatsen; (3) weeg bij elke herschikking wat je begraaft en compenseer dat. **Volgende grootste kans:** een echte server (Supabase) voor accounts, vriendenlijsten, onderlinge ranglijst en het welkomstmailtje — dat is nu de laatste grote ontbrekende laag. Kleiner alternatief: een vierde minigame of een "nog één les"-haakje op het lesresultaatscherm.
- **12-08-2026, ronde 2** — Op mobiel (375px) gemeten dat de eerste les pas op **1,3 schermen scrollen** stond: zeven meta-kaarten (divisie, dagmissies, weekmissies, doelen, herhaling, wereldverovering) duwden de kernactie weg. Opgelost met een **Doorgaan-hero** bovenaan die de juiste volgende les met één tik start, plus een snelkoppeling "Bekijk je hele pad ↓". Ook het dode spoor bij 100% voltooid gedicht: nu een viering met knoppen naar Herhalen en Spelen. Getest met gemanipuleerde localStorage (alles voltooid → geen crash, hero verdwijnt netjes). **Lessen voor volgende rondes:** (1) beoordeel altijd op mobiel formaat, niet op breedbeeld; (2) meet scroll- en tikafstand tot de kernactie in plaats van er alleen naar te kijken; (3) console-fouten van tijdens het bewerken blijven staan en zijn misleidend — vertrouw op tsc, build en de echte render. **Volgende grootste kans:** de meta-kaarten écht onder het leerpad zetten (het pad staat nu nog op ~950px scrollen), of een echte server voor vriendenlijsten en het welkomstmailtje.
- **12-08-2026, ronde 1** — In de app getest en drie echte problemen gevonden en opgelost: (1) minigames waren vergrendeld voor nieuwe spelers → nu direct speelbaar met de startwoorden van de cursus; (2) de speelhal-tabs bleven zichtbaar tijdens een spel of duel → nu verborgen voor volledig spelgevoel; (3) een `TOTAL_PLAYERS`-constante ontbrak in League.tsx waardoor de bouw faalde. Daarnaast in eigen code een ernstige bug gevonden vóór publicatie: `rollWeek` gaf de volledige state terug, waardoor een spread in `set()` zojuist bijgewerkte voortgang zou overschrijven — nu geeft hij alleen de weekvelden terug. **Les voor volgende rondes:** controleer bij elke `set({...spread})` in de store of de gespreide bron écht alleen de bedoelde velden bevat. **Volgende grootste kans:** een echte server voor vriendenlijsten, ranglijst tussen vrienden en het welkomstmailtje — dat is de laatste grote ontbrekende laag.
