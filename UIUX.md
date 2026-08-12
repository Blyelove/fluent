# UI/UX-verbouwlijst

Uit een doorlichting van vijf flows (instap, leerlus, speelhal, voortgang, oefenen),
elk beoordeeld zoals een nieuwe gebruiker de app beleeft. Elk punt past in een
kwartierronde en heeft een eigen bewijs. Streep af wat af is.

## Samenvatting

Fluent heeft een kern die al als topspel voelt — chunky leslus met combo's en vergeving, echte arcade-minigames, een rijke voortgangslaag en de Wereldreis als handelsmerk — maar de randen eromheen lekken. Het grootste gat naar wereldtop zit in de eerste vijf minuten: een account-muur, twee botsende onboardings en een landing op een Home vol betekenisloze tellers schuiven het eerste geleerde woord naar minuut drie, waar de wereldtop op seconde dertig zit. Daarnaast liegen of zwijgen beloningen op precies de momenten die verslavend moeten zijn: dubbele XP wordt verdiend maar niet getoond, de reeks-groei wordt niet gevierd, weekmissies zijn onzichtbaar waar je ze haalt. Er zitten drie echte logica-lekken in (herspeelbare duel-link met XP-exploit, toetsen over nooit-geleerde stof, "probeer opnieuw" zonder opnieuw-knop) en één rode draad door alle vijf rapporten: mis-tikken wordt gestraft (× gooit lessen weg, raakvlakken onder 44px) terwijl NOOIT straffen de kernregel is. Alles hieronder is buiten de Wereldreis-fasen 5-10 gehouden en per item in één kwartierronde af.

## De lijst

### 1. ✅ AF (ronde 31) — Duel-link-lek dichten: na het lezen van ?duel= de parameter wissen met history.replaceState (App.tsx r70) en de seed van gespeelde inkomende duels persisteren (zoals OPEN_KEY al doet); gespeelde seed toont 'Al gespeeld — jij scoorde X-Y' in plaats van de aanneemknop. Nu keert dezelfde uitnodiging na elke tabwissel terug (Play.tsx r54 remount via key={tab}, hideIncoming is component-state) en betaalt hij elke keer opnieuw 25 XP.

**Bewijs:** Open een duel-link, speel hem, wissel tab heen en terug en herlaad: de uitdaging verschijnt niet opnieuw en XP stijgt maar één keer.

### 2. ✅ AF (ronde 32) — Laatste onboarding-tik start direct les 1: in Onboarding.tsx r96 na completeOnboarding meteen onStartLesson met flat[0] aanroepen ('Je eerste woorden — daar gaan we'), zodat de gebruiker Home pas ziet ná zijn eerste lesvoltooiing, wanneer de tellers iets betekenen.

**Bewijs:** Verse gebruiker: tik op een tempo en zit binnen één seconde in oefening 1 zonder Home te zien.

### 3. ✅ AF (ronde 33) — Stop-kruisjes krijgen een vangnet: Lesson.tsx r226 en de Review-runner (r397) roepen onExit direct aan en gooien 9 goede antwoorden weg zonder vraag. Bij idx > 0 eerst een sheet in huisstijl: 'Even pauze? Nog X vragen — je bent er bijna' met Doorgaan (primair) en Stoppen (ghost); bij idx === 0 direct sluiten.

**Bewijs:** Tik op × halverwege een les én een toets: sheet verschijnt, Doorgaan behoudt idx/combo/foutwachtrij; op vraag 1 sluit × direct.

### 4. Account-muur slopen: in Auth.tsx een primaire knop 'Direct proberen' die zonder e-mail/wachtwoord een gastprofiel start (de store kent al accounts-loze staat); 'Bewaar je voortgang' pas ná de eerste les aanbieden. Minimaal in dezelfde ronde: oog-toggle op het wachtwoordveld.

**Bewijs:** Verse gebruiker bereikt oefening 1 zonder één formulierveld in te vullen; bestaand inloggen werkt nog.

### 5. ✅ AF (ronde 35) — Eigen toets filtert op geleerde stof: Review.tsx r85+r288 toont álle units als aanklikbare chips, ook nooit-gestarte — een nieuweling zakt gegarandeerd. Filter op units met minstens één afgeronde les (store.progress[courseId].completed bestaat al); niet-gestarte units grijs met slotje en label 'Eerst leren'.

**Bewijs:** Met 1 afgeronde les is alleen die unit kiesbaar; rond een les in unit 2 af en de tweede chip ontgrendelt zichtbaar.

### 6. ✅ AF (ronde 35) — Opnieuw-knop op het klaar-scherm: Review.tsx r340-386 zegt 'Net niet — probeer opnieuw' maar biedt alleen 'Klaar'. Bewaar de gekozen units in de run-fase en toon bij zakken primair 'Probeer opnieuw' (zelfde units, verse schud); bij fouten-modus met restfouten 'Nog een ronde'.

**Bewijs:** Zak een toets: één tik op 'Probeer opnieuw' start direct een nieuwe run over dezelfde units.

### 7. ✅ AF (ronde 36) — Oefenen-tab krijgt altijd een uitweg: bij nul geleerde woorden een held-CTA 'Start je eerste les' (geef ReviewScreen een onGoLearn-prop vanuit App.tsx, zoals HomeScreen zijn callbacks krijgt); bij due.length === 0 (r266-279) een secundaire knop 'Oefen toch' met 10 willekeurige geleerde woorden (allCards, r83) zonder SRS-effect.

**Bewijs:** Vers profiel: Oefenen-tab heeft één werkende knop naar het leerpad; profiel met alles 'vers': 'Oefen toch' start een sessie van 10.

### 8. ✅ AF (ronde 36) — Comeback-kaart vervángt de hero in plaats van erbovenop te stapelen: Home.tsx r231-303 (hero '▶ Doorgaan') en r306-364 (comeback '▶ Rustig weer beginnen') starten exact dezelfde les. Bij comebackDays > 0 alleen de comeback-kaart tonen met de lesnaam in de knop; na dismiss de normale hero.

**Bewijs:** Zet lastActive kunstmatig 3 dagen terug: Home toont één primaire CTA, niet twee.

### 9. Botduels uit de verstopte 'Vrienden'-tab halen: hernoem de tab in Play.tsx r36 naar '⚔️ Duels' en zet in Arcade.tsx onder de drie spelkaarten een vierde chunky kaart 'Botduel — versla Robo Rens' die naar de duel-tab springt.

**Bewijs:** Nieuwe gebruiker ziet in de Minigames-hub een duel-ingang; één tik landt op de botkeuze.

### 10. Eén doorlopende onboarding: PersonaPicker en Onboarding tellen nu twee keer vanaf 'Stap 1'. Maak één teller 1 Taal → 2 Personage → 3 Tempo (taal eerst: de filterende keuze, en Avatar heeft al een courseId-prop) plus een '‹ Terug'-ghostknop op elke stap; op de tempostap de gekozen taal als chip ('🇪🇸 Spaans — wijzig').

**Bewijs:** Doorloop de flow: nummering loopt 1-2-3 zonder reset, en vanaf stap 3 kun je terug naar de taalkeuze.

### 11. ✅ AF (ronde 34) — Toon de écht uitbetaalde XP: Lesson.tsx r179-197 toont lokaal berekende xp terwijl store.completeLesson via metBoost (store.ts r386) verdubbelt — tijdens een boost zie je +10 maar krijg je 20. Gebruik xpAfter − xpBefore (al beschikbaar in advance) en toon bij actieve boost een gouden chip '+20 XP · ×2 boost ⚡'; laat de dagdoel-balk animeren vanaf todayXp-vóór-de-les.

**Bewijs:** Activeer een boost, rond een les af: het getal op het resultaatscherm is exact gelijk aan de XP-stijging in de store.

### 12. ✅ DEELS AF (ronde 32) — "🎲 Verras me" toegevoegd; de galerij blijft bewust volledig zichtbaar in een scrollvak, want verstoppen was juist de klacht. Personagemaker uit de kritieke route: PersonaPicker r93-133 zet 250+ helden vóór de startknop. Vul standaard een willekeurige passende held in met grote '🎲 Verras me'-knop; de volledige galerij ingeklapt achter 'Zelf samenstellen (300.000+ combinaties)' en bereikbaar via Profiel (setAvatarLook bestaat al).

**Bewijs:** Verse gebruiker passeert het personagescherm in twee tikken (Verras me → verder); de galerij opent nog volledig via de inklap en via Profiel.

### 13. Luisterjacht mag nooit geluidloos zijn: audio.ts r122-129 kiest bewust stilte zonder stem, maar Arcade.tsx start toch de 8s-timer met 'Wat hoor je?'. Check vóór start op manifest-hit of pickVoice != null; zo niet: melding op het startscherm en het woord na 3s visueel laten flitsen als vangnet.

**Bewijs:** Forceer pickVoice op null: het startscherm waarschuwt en elke ronde blijft speelbaar via de visuele flits.

### 14. ✅ AF (ronde 35) — Belofte '8 van de 10' één bron van waarheid geven: Review.tsx r285 belooft hard '8 van de 10' terwijl startTest (r150-152) bij kleine units bv. 6 vragen levert met lat ceil(total*0.8)=5. Kaarttekst generiek ('80% goed = geslaagd') en de exacte lat pas bij de start van de run tonen ('6 vragen — 5 goed = geslaagd').

**Bewijs:** Genereer een toets over een kleine unit: het getoonde aantal en de lat komen exact overeen met wat advance() hanteert.

### 15. ✅ AF (ronde 40) — Dagmissies boven het leerpad en de order-trucs eruit: Home.tsx duwt alle voortgangskaarten via flex order:1 visueel ónder het complete pad (DOM/kijk-mismatch breekt ook tab-volgorde). Dagmissies-kaart direct onder de Doorgaan-hero; id='vandaag' van de divisieknop (r453) naar de dagmissies; chips krijgen mini-labels ('Missies', 'Week') en de 🏆-chip vervalt (de nav-badge en divisiekaart tonen hetzelfde getal al).

**Bewijs:** Op 375px: dagmissies zichtbaar zonder scrollen onder de hero, chip ⚜️ scrolt naar de missies, en Tab-volgorde volgt de kijkvolgorde.

### 16. ✅ AF (ronde 37) — Antwoordknoppen kleuren na Controleren: SelectEx, ListenEx en FillEx zetten alleen locked; de klassen .opt.correct en .opt.wrong bestaan al in global.css (r272-282) maar alleen MatchEx gebruikt ze. Geef het resultaat als prop door en kleur de juiste optie groen (glow), de foute keuze rood (shake).

**Bewijs:** Antwoord bewust fout: jouw keuze schudt rood en het juiste antwoord licht groen op, zonder dat je de onderbalk hoeft te lezen.

### 17. ✅ AF (ronde 37) — Enter/Ga werkt in typ-oefeningen: TypeEx (exercises.tsx r421-449) heeft geen onKeyDown/submit, dus op mobiel moet je het toetsenbord wegvegen om Controleren te bereiken. Enter triggert Controleren (requestCheck-callback via Registration), in de feedback-fase gaat Enter naar Verder; enterKeyHint="go" op de input.

**Bewijs:** Typ een antwoord en druk Enter (desktop) of Ga (mobiel): evaluatie zonder extra handeling; nogmaals Enter gaat verder.

### 18. Eén 44px-pas over alle mini-raakvlakken: PersonaPicker-swatches 30×30 en chips ~29px, gids-knop 34×34 (Home.tsx r808), les-× ~38px (Lesson.tsx r226), doel-✕ met padding '0 4px' (Home.tsx r644), Review-× ~38px. Alles naar minstens 44×44 (desnoods 36px visueel met onzichtbare hit-area); de doel-✕ krijgt bovendien een 5-seconden 'Ongedaan maken'-toast.

**Bewijs:** Meet elk genoemd element in devtools: geen interactief raakvlak onder 44px; doel wissen is 5s terug te draaien.

### 19. Dagdoel-ring wordt een knop: de GoalRing in de Home-header (r190) is een dode div en dailyGoalXp is na onboarding nooit meer aanpasbaar (alleen gezet in store.ts r366; Profile.tsx r142-145 is onklikbare tekst). Ring (min. 44px) opent een sheet met vandaag-XP en dagdoel-keuzes 20/40/60/100 als arcade-kaartjes; dezelfde picker achter de Profiel-regel.

**Bewijs:** Tik op de ring: sheet opent, kies 60 XP en de ring en Profiel tonen direct het nieuwe doel.

### 20. ✅ AF (ronde 43) — Divisie-motivatiekaart omhoog mét actieknop: League.tsx rendert 'Nog 34 XP en je gaat Sanne voorbij!' pas ná 30 ranglijstrijen (r617-678) en nergens staat een knop om die les te doen. Kaart direct onder de statkaarten, met chunky knop '▶ Pak die plek — start een les' via een onLeren-prop vanuit App.tsx; vervang tegelijk de constante statkaart 'Spelers: 30' (r533-538) door 'Nog X XP tot promotiezone' (toPromoZone is al berekend, r380).

**Bewijs:** Open Divisie: inhaalprikkel zichtbaar zonder scrollen, één tik start een les, en de derde statkaart toont een getal dat per les verandert.

### 21. ✅ AF (ronde 38) — Sticky hoofdactie op de wereldkaart: de enige echte actie ('▶ Verder leren', WorldMap.tsx r641-653) zit verstopt in het bottom-sheet achter een tik op het pulserende land. Voeg een sticky voetbalk toe: '▶ Verder leren — nog 3 lessen tot 🇫🇷 Frankrijk' die direct onVerderLeren aanroept; het landpaneel blijft voor detail. (Home-instap zelf is Wereldreis fase 9 — niet aanraken.)

**Bewijs:** Open de kaart: onderaan staat altijd één primaire knop die zonder tussenstap de juiste les start.

### 22. ✅ AF (ronde 43) — Streak-scherm krijgt de lus-sluitende knop: Streak.tsx r112-116 zegt 'Doe vandaag één les en je reeks begint' zonder knop. Eén chunky primaire knop onder de vlam ('▶ Ontsteek je vlam' bij 0, anders '▶ Houd je vlam brandend'); StreakScreen wordt vanuit Home gerenderd (r147), dus onStartLesson-prop doorgeven.

**Bewijs:** Open het vlam-scherm bij streak 0 en 5: beide tonen een knop die direct de volgende les start.

### 23. ✅ AF (ronde 39) — Reeks-verlenging vieren in de resultaatketen: de streak groeit stilletjes (Lesson.tsx CompleteView toont alleen een stil kaartje, r531-534). Extra stap 'reeks' in de steps-array wanneer streak ná de les hoger is dan ervoor (before/after-patroon bestaat al voor XP): vlam-animatie, '🔥 Dag 12 op rij!', en mijlpalen 7/30/100 expliciet.

**Bewijs:** Eerste les van de dag: de keten toont een aparte vlam-stap; tweede les van dezelfde dag toont hem niet.

### 24. ✅ DEELS AF (ronde 41, speelhal) — Weekmissie-voortgang tonen waar je hem haalt: de store telt weekArcade/weekDuels al, maar Arcade.tsx (r214-354) toont er niets van en Duel.tsx r915 is statische tekst. Voortgangschip in de hub-kop ('🕹️ Weekmissie: 1/3 potjes → 🎁') en op het Result-scherm de trigger ('Nog 1 potje tot de weekkist!').

**Bewijs:** Speel één potje: de chip in de hub springt van 0/3 naar 1/3 en het eindscherm benoemt de afstand tot de kist.

### 25. ✅ AF (ronde 42) — Dagkist volledig verkopen én vieren: Home.tsx r541 belooft '+15 XP' maar store.ts r393-396 geeft óók 15 min dubbele XP, en het halen is één stille tekstregel terwijl de weekkist confetti krijgt. Tekst: 'Alle drie = kist: +15 XP én 15 min dubbele XP'; bij het derde vinkje confetti + sfx('complete') + korte kist-open-animatie.

**Bewijs:** Rond de derde dagmissie af: confetti en kist-animatie op de kaart, en de belofte-tekst dekt beide beloningen.

### 26. ✅ AF (ronde 41) — Medaille-tiers per minigame: Arcade.tsx r340 toont alleen 'Beste score' — daarna valt er niets meer te jagen. Brons/zilver/goud-drempels per spel (bv. Bliksem 40/70/100) op de spelkaart én het eindscherm met afstand tot de volgende tier ('nog 12 punten tot 🥈').

**Bewijs:** Score net onder een drempel: eindscherm toont de exacte afstand; haal de drempel en de kaart in de hub draagt de nieuwe medaille.

### 27. Countdown tapbaar en regels op het juiste moment: de 2,8s-countdown (Arcade.tsx r459-493) is niet te skippen, ook niet na 'Nog een keer', en de multiplier-regels staan in 12px onderaan tijdens het potje (r733-735). Countdown: 'tik om te starten' → direct GO; spelregels groot óp het countdown-scherm.

**Bewijs:** Vanaf het eindscherm: 'Nog een keer' + één tik = binnen een seconde spelen, en de regels zijn vóór de start leesbaar.

### 28. Progressiebalken belonen in plaats van straffen: de lesbalk (Lesson.tsx r221) krimpt zichtbaar bij een fout (her-aanbieden verlengt items) — houd de maximaal bereikte breedte vast; de Review-balk (r411) beweegt pas bij 'Verder' en haalt nooit 100% — vul op basis van beantwoord: ((idx + (answered?1:0)) / items.length).

**Bewijs:** Maak een fout in een les: de balk blijft staan; beantwoord de laatste toetsvraag: de balk loopt vol vóór het klaar-scherm.

### 29. Match-afronding positief framen: MatchEx geeft onAuto zonder correctAnswer (exercises.tsx r317), dus je ziet 'Bijna.' na een voltooide oefening, en vraagTekst geeft '' waardoor pickRule (guides/index.ts r32) een willekeurige regel toont. 'Alle paren gevonden!' met eventueel het foute paar benoemd; geen Waarom-knop bij match en pickRule geeft null bij score 0.

**Bewijs:** Maak één mis-tik in een match: de afronding blijft positief, benoemt het paar, en er verschijnt geen irrelevante Waarom-uitleg.

### 30. Langzame herhaalknop bij luisteroefeningen: ListenEx (exercises.tsx r374-417) kan alleen exact hetzelfde herhalen. Tweede 44px-knop 🐢 naast de speaker die dezelfde tekst op ~0.65 rate afspeelt (utterance.rate in audio.ts speak).

**Bewijs:** Tik 🐢: dezelfde zin klinkt hoorbaar langzamer; de normale knop blijft op vol tempo.

### 31. Bots worden een ladder: niets onthoudt wie je versloeg en na winst op de sterkste bot zegt r699 alsnog 'Er staat vast een sterkere bot voor je klaar'. Per-bot win/verlies-record in de store, kroontje op verslagen bots, na winst de volgende bot voorstellen; special-case de top-bot ('tijd om een echte vriend uit te dagen').

**Bewijs:** Versla Robo Rens: kroontje in de hub en het eindscherm stelt Turbo Tessa voor; versla Meester Milan en de copy verwijst naar vriendenduels.

### 32. Gids bereikbaar tijdens de les: klein 📖 (44px) in de lesson-top dat GuideSheet van de huidige unit opent (unit is al bekend, Lesson.tsx r62-66); verplaats tegelijk AnimatePresence van binnen GuideSheet.tsx (r69) naar de aanroepkant zodat de exit-animatie echt speelt.

**Bewijs:** Open de gids halverwege een les zonder de les te verliezen; sluiten toont een vloeiende exit-animatie.

### 33. Review-hub cijfers-eerst: elke kaart is nu kop + alinea + knop met de beloningen in lopende tekst. Groot getal per kaart (3 fouten / 7 klaar), tijdsindicatie ('± 2 min'), XP-chip, en 2-3 wachtende woorden als teaser-tegels ('hola · gracias · …'); alinea's naar één regel.

**Bewijs:** Op 375px scant elke kaart in één blik: getal, tijd, beloning en teaser zichtbaar zonder te lezen.

### 34. Profiel-transformatie als evolutierij: Profile.tsx r195-236 toont het unieke transformatie-idee als 19 tekstregels. Horizontaal swipebare rij met Avatar op niveau 1/5/10/15/20 (level-prop bestaat al), behaalde stadia in kleur, toekomstige als silhouet met '?', huidig stadium met amber ring; tik = itemlijst tot daar.

**Bewijs:** Op niveau 4: stadia 1 in kleur, 5-20 als silhouet, ring op je positie; tik op niveau 10 toont de bijbehorende items.

### 35. Kleine consistentie-veeg (één ronde, vier micro-fixes): feedbacktekst één keer per antwoord kiezen i.p.v. Math.random() in de render (Lesson.tsx r283-285); rode '+3s'-pop bij een Woordstorm-misser zoals Bliksem die heeft (Arcade.tsx r858 vs r614); duel-naam persisteren in de store en de key={tab}-remount beperken zodat halve invoer een tabwissel overleeft; in fouten-sessies bij opnieuw fout ook addMistake aanroepen zodat 'hardnekkigste eerst' klopt (Review.tsx r157-179).

**Bewijs:** Waarom-tik verandert de feedbacktekst niet meer; misser toont +3s bij de klok; naam staat voorgevuld na tabwissel; twee keer fout = hoger n in mistakes.

### 36. Eén etappe-definitie op de wereldkaart: het pad meet per etappe (WorldMap.tsx r126) maar het landpaneel (r638) meet vanaf nul — 14/19 lessen heet daar 74% terwijl je held op 0% van de etappe staat. Helper etappeFrac() in countries.ts en overal binnen WorldMap gebruiken. (Het Home-blok is Wereldreis fase 9 — niet aanraken.)

**Bewijs:** Bij 14 voltooide lessen en drempel 19 tonen pad én paneel dezelfde etappe-fractie, en een vers land begint op 0%.

