# De Wereldreis — het videogame-handelsmerk van Fluent

Ontworpen op 12-08-2026 door vier ontwerplenzen (spelgevoel, beloningsritme,
haalbaarheid, art direction), samengesmeed tot één bouwbaar plan. De lus bouwt
dit fase voor fase; elke fase past in één ronde en heeft een eigen bewijs.

## Visie

De Wereldreis maakt van Fluent het enige taal-leerspel waarin jouw zelf
samengestelde personage — in de culturele outfit van de taal die je leert —
zichtbaar als held over een verticale neon-sagakaart reist, land na land
omhoog, met elke les letterlijk als stap op het pad. De kaart is één
gememoïseerde SVG met een slingerend Bézier-pad door de landen uit
countryStates, waar het volgende land amber lonkt en de toekomst geen slot is
maar mist die optrekt. Bij elke veroverdrempel rent je avatar over het pad,
klapt de vlag in kleur open en regent het confetti; wie wil, daagt daarna de
Poortwachter uit — een eindbaas met het vlagschild van het land, die je nooit
iets kan afnemen en alleen een paspoortstempel en XP kan toevoegen. Het
paspoort met scheef geslagen, gedateerde inktstempels wordt de verzameling die
om vulling vraagt. **Duolingo heeft een pad; Fluent heeft een reis met een
held, en die held ben jij.**

## Kernbeslissingen

- Verovering blijft 100% drempel-gestuurd uit countryStates; de Grensproef (Poortwachter) is een pure glorie-laag die stempel + 40 XP toevoegt en nooit blokkeert — zo blijven bestaande accounts kloppen en blijft de nooit-straffen-belofte hard.
- De eindbaas is één Poortwachter-SVG met een rond schild waarin de bestaande Flag-component zit — elk land krijgt zo automatisch zijn eigen boss, tegen de kosten van één component in plaats van 30+ handgetekende landmarks.
- Performantie-contract is bindend: één useMemo-SVG, landknopen als HTML-knoppen (64px) erboven, voortgang via pathLength=1 + strokeDashoffset, maximaal 3 oneindige animaties tegelijk, geen blur/filters op bewegende elementen, native scroll zonder listeners.
- De reis gaat van onder naar boven (vooruitgang voelt als klimmen) met deterministische zigzag-coördinaten — geen willekeur, dus een stabiele kaart.
- Het paspoort wint van de souvenirkast als verzameling: één PassportStamp-component genereert alle stempels uit landcode + datum.
- Toekomstige landen zijn mist met "komt met nieuwe lessen", nooit een slot-icoon of rood.
- De Grensproef hergebruikt de bestaande 10-vragen-runner uit Review.tsx (8/10-grens, fouten naar de foutenlijst) — nul nieuwe content, wel een persoonlijke eindbaas; jij hebt geen levensbalk, alleen de boss verliest pantser.
- Nieuwe store-velden blijven minimaal: worldSeen (laatst geziene veroverde telling), stamps (landcode→datum) en bossWins — de veroverd-status komt altijd uit countryStates, nooit uit de store.

## Bouwfasen (elk ≤ één ronde, met bewijs)

1. ✅ **AF (ronde 26) — De kaart.** `src/screens/WorldMap.tsx` als fullscreen overlay (StreakScreen-patroon, state worldOpen in Home): sticky header (terugknop 44px, "X/14 veroverd" in goud), scrollcontainer met hoogte 200 + N×190, deterministische zigzag-knopen uit countryStates (onder→boven), per segment een kubische S-bocht als dubbele lijn (gestippelde basislijn + paars→roze verloop op veroverde segmenten), HTML-landknoppen 64px met Flag in drie staten: veroverd goud met ✓, volgende met pulserende amber ring, toekomst grijs op 0.3. Home krijgt de knop "Reis verder →".
   *Bewijs: open op 375px, tik "Reis verder →": scrollbare neonroute met juiste vlaggen, veroverde segmenten in verloop, volgende land pulseert — zonder horizontale scroll.*
2. ✅ **AF (ronde 27) — De held op de kaart.** `<Avatar size={84}>` als absolute laag op het actieve segment via getPointAtLength(frac × totalLength), frac = (voltooid − vorige drempel)/(drempel − vorige drempel); kijkrichting via scaleX(−1); het actieve segment vult live mee (motion.path, 0.9s); useLayoutEffect-scroll zet de avatar bij openen op 55% van het scherm.
   *Bewijs: rond één les af, heropen de kaart: de avatar staat zichtbaar één stap verder.*
3. ✅ **AF (ronde 28) — Land-sheet.** Bottom sheet per status: veroverd = gouden badge + datum; volgende = voortgangsbalk "nog X van Y lessen" + knop "Verder leren →" die de juiste les start; toekomst = "Dit land komt met nieuwe lessen — jouw wereld groeit vanzelf", nooit een slot.
   *Bewijs: alle drie de staten tonen de juiste variant en "Verder leren →" start echt de volgende les.*
4. ✅ **AF (ronde 29) — Reisanimatie.** Store-veld worldSeen; bij openen delta detecteren: avatar mode='run' rent in 2,2s over het pad (motionValues, geen rerenders), knoop-pop, vlag-crossfade grijs→kleur, confetti vanaf de knooppositie, banner "{Land} veroverd!"; bij prefers-reduced-motion direct de eindtoestand.
   *Bewijs: drempel kunstmatig naderen, les afronden, kaart openen: de held rent zichtbaar naar het nieuwe land — één keer (worldSeen).*
5. ✅ **AF (ronde 55) — De Poortwachter.** `src/components/Gatekeeper.tsx`: donker harnas met cyaan neonrand, helm met T-vizier, knipperende amber ogen, rond schild 84px met de Flag van het land in een cirkelmasker. Introscherm: poortdeuren met amber kier, instamp met schermschud, "De Grensproef van {land}", uitleg "10 vragen, 8 goed — verliezen bestaat niet", 3-2-1-aftelling. Bereikbaar via de land-sheet op veroverde knopen.
   *Bewijs: bij twee verschillende landen klopt het vlagschild automatisch.*
6. ✅ **AF (ronde 55) — Het gevecht.** De 10-vragen-runner uit Review.tsx met stof tot de landdrempel; boven de vragen de compacte Poortwachter met een pantserbalk van 8 gouden segmenten — per goed antwoord knalt er één weg met terugstoot; per fout wiegt de boss spottend maar verlies jij niets; ≥8 → poortdeuren schuiven open; <8 → "Nog {n} rake antwoorden en de poort zwaait open" met gratis "Nog een ronde".
   *Bewijs: winnen opent de poort; bewust verliezen kost niets en kan direct opnieuw.*
7. ✅ **AF (ronde 55) — De ceremonie.** Vlaggenmast met hijsende Flag (1,2s, wapperende skew), avatar mode='cheer', confetti, stempel-klap (scale 2.2→1, rotate −14°, korte schermschud), "+40 XP · stempel n van N"; store: stamps (landcode→dagstring) en bossWins via winBoss() met awardXp(40); afsluiten met ShareButton en "Reis verder".
   *Bewijs: XP +40, en na herladen staat de stempeldatum nog in de opslag.*
8. ✅ **AF (ronde 56) — Het paspoort.** `src/components/PassportStamp.tsx` (~40 regels: gestippelde inktcirkel #FFC53D, Flag 22px in minimasker, landnaam gebogen via textPath met useId, datum, deterministische rotatie geseed op landcode) plus het paspoortscherm als sheet vanuit de kaartheader: raster van 3 kolommen, veroverd gestempeld, rest stippellijn met "?", onderaan "X van de N stempels · volgende: {land}".
   *Bewijs: twee stempels staan nét verschillend scheef en herladen verandert niets.*
9. **Home-instap.** Het wereldblok op Home vervangen door een mini-viewport: statische SVG ~340×96 met het gebogen verlooppad, laatst veroverde vlag in kleur, `<Avatar size={44} still/>` op de huidige positie, volgende vlag gedimd met amber randje, voortgangsbalk en de knop "Reis verder →".
   *Bewijs: je eigen poppetje staat in de preview vlak voor het volgende land; teller klopt exact met de oude weergave.*
10. **De sfeerlaag.** Klimaatzone-verloop over de kaart (vallei → hoogland → kosmische top), per zone 3-4 decorgroepjes (boompjes, cactussen, sterren, maan) in één useMemo-groep van <80 knopen, mist over toekomst-etappes, afsluitende controlepas op 375×812.
    *Bewijs: zones verlopen zichtbaar, niets scrolt horizontaal, scrollen blijft vloeiend.*

## Later (bewust geparkeerd)

- Landmark-bibliotheek: per land een handgetekend neon-monument — invoeren als pakketten per taal zodra de kern draait, te beginnen met de Spaanse vijf.
- Weerlagen per land (mist boven Big Ben, noorderlicht boven Canada) — eerst animatiebudget-check.
- Souvenirkast met silhouet-teasers en cultuurweetjes.
- Veerboot-etappes met waterband en dobberend bootje (Spanje→Mexico, VK→VS).
- Schatkisten halverwege veroverde segmenten (+15 XP).
- De zwaaiende bewoner die één lokale groet leert ("¿Qué onda?") met uitspraak.
- Gouden "met lof"-stempelrand en herspeelbare Grenswachter.
- Parallax-sterren, mijlpaal-pulsen op 25/50/75/100%, zegetocht-ketting.
- Mist-onthulling wanneer nieuwe cursuscontent een land opent.
