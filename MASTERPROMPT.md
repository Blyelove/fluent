# Masterprompt — Fluent naar het hoogste niveau

Deze prompt draait automatisch elke 45 minuten. Hij dekt alles wat in de bouwchat is afgesproken.

```
Werk zelfstandig aan Fluent in C:\Users\Blye\Desktop\aurea — de taal-leer-app die op ELK gebied beter moet zijn dan Duolingo en dan 99% van alle apps. Dit project staat volledig LOS van Blyelove: raak die map, repo of deploy nooit aan.

ELKE RONDE DOE JE DIT, IN DEZE VOLGORDE:
1. KIJKEN MET JE EIGEN OGEN. Zorg dat de dev-server draait (npm run dev, poort 5199) en open de app zelf in de browser. Klik als een échte gebruiker door minstens drie schermen — bijvoorbeeld een les, een minigame, de divisie, een duel, de badges of het streak-scherm — en maak screenshots. Beoordeel wat je ziet keihard eerlijk: wat is saai, lelijk, traag, verwarrend, leeg, of niet verslavend genoeg? Noteer ook elke bug, elke lege staat en elk moment waarop een nieuwe gebruiker zou afhaken.
2. KIEZEN. Pak uit die lijst de ÉÉN verbetering met de grootste impact op verslavendheid, plezier, duidelijkheid of leerresultaat. Liever één ding helemaal af dan drie half.
3. BOUWEN. Maak het volledig af: geen TODO's, geen placeholders, geen loze beloftes in de tekst (als er staat dat je iets verdient, moet je het ook echt krijgen). Nederlandse teksten, natuurlijk geschreven.
4. CONTROLEREN — vijf keer nakijken. (a) npx tsc --noEmit moet 0 fouten geven; (b) npm run build moet slagen; (c) open de app opnieuw en test de wijziging zelf klikkend, met screenshot als bewijs; (d) controleer de randgevallen: nieuwe gebruiker zonder data, lege lijsten, week- of dagovergang, kleine schermen (375px breed); (e) lees je eigen diff terug en zoek actief naar bugs die je zelf hebt geïntroduceerd — vooral state die per ongeluk overschreven wordt, timers die niet opgeruimd worden en zustand-selectors die elke render een nieuw object teruggeven.
5. PUBLICEREN. git add -A, commit met een duidelijke Nederlandse beschrijving, git push. Dat publiceert automatisch naar https://blyelove.github.io/fluent/ — controleer daarna via de GitHub Actions API dat de bouw is geslaagd en dat de live site HTTP 200 geeft.
6. RAPPORTEREN in het Nederlands: wat zag je in de app, wat verbeterde je, en wat is volgens jou de volgende grootste kans.

KERNREGELS DIE NOOIT VERANDEREN:
- NOOIT STRAFFEN. Geen hartjes, geen energie, geen limieten, geen schuldgevoel. Motiveren doe je met beloningen, competitie, voortgang en trots. Dit is hét verschil met Duolingo.
- Design: neon arcade. Indigo #0E0B1F, paars/roze gradients (#A855F7 → #EC4899), amber XP (#FFC53D), cyaan selectie (#22D3EE), chunky 3D-drukknoppen die echt indrukken, Baloo 2 voor koppen, veel animatie en confetti op de piekmomenten. Alles minstens 44px hoog en makkelijk te bedienen met één duim op een telefoon.
- Uitspraak: elke taal klinkt als een moedertaalspreker. Nooit een Nederlandse stem die een vreemde taal uitspreekt. Na elke contentuitbreiding npx tsx scripts/generate-audio.ts draaien.
- Alles wat de gebruiker ziet is volledig vertaald en foutloos Nederlands.

WAAR JE AAN MAG WERKEN — pak steeds wat nu het meest ontbreekt:
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
/loop 45m Lees C:\Users\Blye\Desktop\aurea\MASTERPROMPT.md volledig en voer de instructies in het codeblok daarin uit, inclusief de laatste stap waarin je dit bestand zelf verbetert en meecommit.
```

Stoppen kan met `/loop stop`.

---

## Logboek

- **12-08-2026** — Eerste versie. Dekt: verslavendheid, sociaal, personage, leren, techniek, de nooit-straffen-regel, het neon-arcade-design en de vijfvoudige controle. Zelfverbeterstap toegevoegd.
- **12-08-2026, ronde 1** — In de app getest en drie echte problemen gevonden en opgelost: (1) minigames waren vergrendeld voor nieuwe spelers → nu direct speelbaar met de startwoorden van de cursus; (2) de speelhal-tabs bleven zichtbaar tijdens een spel of duel → nu verborgen voor volledig spelgevoel; (3) een `TOTAL_PLAYERS`-constante ontbrak in League.tsx waardoor de bouw faalde. Daarnaast in eigen code een ernstige bug gevonden vóór publicatie: `rollWeek` gaf de volledige state terug, waardoor een spread in `set()` zojuist bijgewerkte voortgang zou overschrijven — nu geeft hij alleen de weekvelden terug. **Les voor volgende rondes:** controleer bij elke `set({...spread})` in de store of de gespreide bron écht alleen de bedoelde velden bevat. **Volgende grootste kans:** een echte server voor vriendenlijsten, ranglijst tussen vrienden en het welkomstmailtje — dat is de laatste grote ontbrekende laag.
