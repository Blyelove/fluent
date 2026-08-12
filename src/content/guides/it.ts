import type { UnitGuide } from '../../types'

export const guides: Record<string, UnitGuide> = {
  'it-u1': {
    intro:
      'Je leert hier je eerste Italiaanse woorden: iemand groeten, jezelf voorstellen en netjes bedanken. Met deze handvol woorden red je je al in elke bar en elk hotel.',
    rules: [
      {
        title: 'Ciao of buongiorno?',
        explanation:
          'Ciao gebruik je bij mensen die je kent: vrienden, familie, leeftijdsgenoten. Tegen onbekenden, in een winkel of tegen iemand die duidelijk ouder is zeg je buongiorno (overdag) of buonasera (vanaf een uur of vier in de middag). Ciao betekent bovendien zowel hallo als dag: je kunt het bij aankomst én bij vertrek gebruiken. Neem je afscheid van iemand die je niet kent, zeg dan arrivederci.',
        examples: [
          { target: 'Ciao, come stai?', nl: 'Hallo, hoe gaat het?' },
          { target: 'Buongiorno, signora Rossi!', nl: 'Goedemorgen, mevrouw Rossi!' },
          { target: 'Buonasera, signor Bruni.', nl: 'Goedenavond, meneer Bruni.' },
        ],
      },
      {
        title: 'Mi chiamo: ik noem mij',
        explanation:
          'Het werkwoord chiamarsi betekent letterlijk "zich noemen". Je zegt dus niet "ik heet", maar "ik noem mij": mi chiamo. Gaat het over iemand anders, dan veranderen er twee dingen tegelijk: het woordje ervoor wordt si en de uitgang van het werkwoord wordt -a. Zo hoort mi bij chiamo en si bij chiama.',
        examples: [
          { target: 'Mi chiamo Marco.', nl: 'Ik heet Marco.' },
          { target: 'Mi chiamo Anna, piacere!', nl: 'Ik heet Anna, aangenaam!' },
          { target: 'Buongiorno! Mi chiamo Sofia.', nl: 'Goedemorgen! Ik heet Sofia.' },
        ],
      },
      {
        title: 'Prego doet meer dan je denkt',
        explanation:
          'Prego is het standaardantwoord op grazie en betekent dan "graag gedaan". Maar Italianen gebruiken het ook als "ga je gang": als ze de deur voor je openhouden, je een stoel aanbieden of je aan de beurt bent in een winkel. Je hoort het dus veel vaker dan alleen na een bedankje.',
        examples: [
          { target: 'Grazie mille! — Prego.', nl: 'Heel erg bedankt! — Graag gedaan.' },
          { target: 'Prego, signora.', nl: 'Gaat uw gang, mevrouw.' },
        ],
      },
    ],
    phrases: [
      { target: 'Ciao, come stai?', nl: 'Hallo, hoe gaat het?' },
      { target: 'Buongiorno! Mi chiamo Sofia.', nl: 'Goedemorgen! Ik heet Sofia.' },
      { target: 'Piacere, io sono Giulia.', nl: 'Aangenaam, ik ben Giulia.' },
      { target: 'Grazie mille!', nl: 'Heel erg bedankt!' },
      { target: 'Arrivederci, a domani!', nl: 'Tot ziens, tot morgen!' },
    ],
    tip:
      'In ciao klinkt de c als "tsj": tsjaow. Dat komt doordat een c vóór een i of een e in het Italiaans altijd die "tsj"-klank krijgt — denk aan cinema ("tsjinema"). Staat er een a, o of u achter, dan klinkt de c gewoon als een k: caffè is "kaffè". Nederlandstaligen maken van ciao vaak "sjaauw", en dat valt meteen op.',
  },

  'it-u2': {
    intro:
      'Hier bestel je je eerste koffie, pizza en glas wijn, en je vraagt om de rekening. Meteen leer je ook de belangrijkste basis van het Italiaans: elk woord is mannelijk of vrouwelijk.',
    rules: [
      {
        title: 'Mannelijk of vrouwelijk?',
        explanation:
          "Elk Italiaans zelfstandig naamwoord (een woord voor een ding of een persoon) is mannelijk of vrouwelijk. Woorden op -o zijn meestal mannelijk en krijgen il ervoor; woorden op -a zijn meestal vrouwelijk en krijgen la. Il en la betekenen allebei de of het — welke je kiest hangt af van het woord, niet van de betekenis. Begint het woord met een klinker (a, e, i, o of u), dan worden il en la allebei ingekort tot l'.",
        examples: [
          { target: 'Vorrei la pizza margherita.', nl: 'Ik wil graag de pizza margherita.' },
          { target: 'Il conto, per favore!', nl: 'De rekening, alsjeblieft!' },
          { target: "L'acqua è fresca.", nl: 'Het water is koel.' },
        ],
      },
      {
        title: "Un, una of un'?",
        explanation:
          "Het woord voor een is un bij een mannelijk woord en una bij een vrouwelijk woord. Begint een vrouwelijk woord met een klinker, dan wordt una ingekort tot un' met een apostrof: un'acqua. Bij mannelijke woorden gebeurt dat juist niet — daar blijft het gewoon un, ook voor een klinker: un amico.",
        examples: [
          { target: 'Vorrei un caffè, per favore.', nl: 'Ik wil graag een koffie, alsjeblieft.' },
          { target: "Vorrei un'acqua naturale.", nl: 'Ik wil graag een plat water.' },
          { target: 'Ho una sorella.', nl: 'Ik heb een zus.' },
        ],
      },
      {
        title: 'Een glas van wijn',
        explanation:
          "Bij hoeveelheden zet het Italiaans er di tussen, waar wij in het Nederlands niets zeggen. Un bicchiere di vino is letterlijk een glas van wijn. Voor een klinker wordt di ingekort tot d': una bottiglia d'acqua. Je vertaalt di niet mee naar het Nederlands, maar weglaten mag niet.",
        examples: [
          { target: 'Un bicchiere di vino rosso.', nl: 'Een glas rode wijn.' },
          { target: "Una bottiglia d'acqua, per favore.", nl: 'Een fles water, alsjeblieft.' },
        ],
      },
      {
        title: 'Vorrei is de beleefde vorm',
        explanation:
          'Vorrei betekent "ik zou graag willen" en is de beleefde variant van voglio (ik wil). In een bar of restaurant klinkt voglio nogal bot, ongeveer als ons "ik moet een koffie". Met vorrei doe je het altijd goed: je zet er simpelweg achter wat je wilt hebben.',
        examples: [
          { target: 'Vorrei un cappuccino.', nl: 'Ik wil graag een cappuccino.' },
          { target: "Vorrei la pizza e l'acqua.", nl: 'Ik wil graag de pizza en het water.' },
        ],
      },
    ],
    phrases: [
      { target: 'Un caffè, per favore.', nl: 'Een koffie, alsjeblieft.' },
      { target: "Vorrei un'acqua naturale.", nl: 'Ik wil graag een plat water.' },
      { target: 'Un bicchiere di vino rosso.', nl: 'Een glas rode wijn.' },
      { target: 'Il conto, per favore. Grazie!', nl: 'De rekening, alsjeblieft. Dank je!' },
      { target: 'La pizza e il vino, per favore.', nl: 'De pizza en de wijn, alsjeblieft.' },
    ],
    tip:
      'Un caffè is in Italië altijd een espresso, nooit een kop filterkoffie. Wil je iets wat op onze koffie lijkt, vraag dan om un caffè lungo of un caffè americano. Let ook op het streepje op de è van caffè: dat betekent dat de klemtoon achteraan valt, dus "kaf-FÈ" en niet "KAF-fe".',
  },

  'it-u3': {
    intro:
      'Je leert praten over je familie en de mensen om je heen: mijn moeder, mijn broer, een vriend van mijn vader. Meteen de eerste vraag die je in Italië krijgt.',
    rules: [
      {
        title: 'Mio of mia?',
        explanation:
          '"Mijn" heet mio bij een mannelijk woord en mia bij een vrouwelijk woord. Belangrijk: je kiest op grond van het woord dat erachter komt, niet op grond van wie de eigenaar is. Een man zegt dus ook mia madre, en een vrouw zegt ook mio padre.',
        examples: [
          { target: 'Mio padre è di Roma.', nl: 'Mijn vader komt uit Rome.' },
          { target: 'Mia madre si chiama Elena.', nl: 'Mijn moeder heet Elena.' },
          { target: 'Mia madre e mio padre sono di Napoli.', nl: 'Mijn moeder en mijn vader komen uit Napels.' },
        ],
      },
      {
        title: 'Familie krijgt geen lidwoord',
        explanation:
          'Normaal staat er bij "mijn" nog een lidwoord (het woordje de of het) voor: la mia casa. Maar gaat het over één familielid, dan valt dat lidwoord weg: mia madre, mio fratello, mia sorella. Bij famiglia, dat over de hele familie gaat, blijft het lidwoord wél staan.',
        examples: [
          { target: 'Mia sorella si chiama Sara.', nl: 'Mijn zus heet Sara.' },
          { target: 'La mia famiglia è grande.', nl: 'Mijn familie is groot.' },
          { target: "L'uomo è un amico di mio padre.", nl: 'De man is een vriend van mijn vader.' },
        ],
      },
      {
        title: "L' verbergt het geslacht",
        explanation:
          "Voor een klinker worden il en la allebei l': l'amico, l'uomo, l'acqua. Aan l' zie je dus niet meer of een woord mannelijk of vrouwelijk is; dat moet je bij het woord zelf onthouden. Amico en uomo zijn mannelijk, acqua is vrouwelijk. Zodra er een ander woord bij komt, zie je het verschil weer: il mio amico.",
        examples: [
          { target: "L'uomo si chiama Paolo.", nl: 'De man heet Paolo.' },
          { target: 'Marco è il mio migliore amico.', nl: 'Marco is mijn beste vriend.' },
          { target: 'Paolo è un amico di Marco.', nl: 'Paolo is een vriend van Marco.' },
        ],
      },
      {
        title: 'Ho: ik heb',
        explanation:
          'Ho is de ik-vorm van avere (hebben) en je gebruikt het net als bij ons: ho un fratello. Anders dan in het Nederlands hoef je het woordje io (ik) er niet bij te zetten, want aan de vorm ho hoor je al dat het over jezelf gaat. Italianen laten het onderwerp dan ook bijna altijd weg.',
        examples: [
          { target: 'Ho un fratello.', nl: 'Ik heb een broer.' },
          { target: 'Ho un fratello e una sorella.', nl: 'Ik heb een broer en een zus.' },
        ],
      },
    ],
    phrases: [
      { target: 'Mia madre si chiama Elena.', nl: 'Mijn moeder heet Elena.' },
      { target: 'Ho un fratello e una sorella.', nl: 'Ik heb een broer en een zus.' },
      { target: 'Mio padre è di Roma.', nl: 'Mijn vader komt uit Rome.' },
      { target: 'La famiglia di Marco è grande.', nl: 'De familie van Marco is groot.' },
      { target: 'Quella donna è mia madre.', nl: 'Die vrouw is mijn moeder.' },
    ],
    tip:
      "Wij kunnen kiezen tussen de familie van Marco en Marco's familie. Het Italiaans kent die tweede vorm niet: een bezits-s bestaat er niet. Je zegt altijd eerst het ding, dan di, dan de eigenaar — la famiglia di Marco, la casa di Anna. Draai de Nederlandse volgorde dus om.",
  },

  'it-u4': {
    intro:
      'Met deze unit vraag je de weg, koop je een treinkaartje en vind je het museum terug. Dove is het woord dat je het vaakst nodig hebt.',
    rules: [
      {
        title: "Dove + è = dov'è",
        explanation:
          "Dove betekent waar en è betekent is. Staan ze naast elkaar, dan botsen twee klinkers, en dat vermijdt het Italiaans. Daarom valt de e van dove weg en komt er een apostrof voor in de plaats: dov'è. Je spreekt het uit als één woord: do-VÈ.",
        examples: [
          { target: "Dov'è la stazione?", nl: 'Waar is het station?' },
          { target: "Dov'è il museo?", nl: 'Waar is het museum?' },
          { target: "Dov'è la piazza?", nl: 'Waar is het plein?' },
        ],
      },
      {
        title: 'Per wijst de bestemming aan',
        explanation:
          'Bij kaartjes, treinen en vliegtuigen gebruik je per voor de plaats waar het heen gaat: un biglietto per Roma, il treno per Firenze. Letterlijk betekent per "voor", maar hier is het onze "naar". Zeg je dat je zélf ergens bent of woont, dan gebruik je juist a: a Roma.',
        examples: [
          { target: 'Un biglietto per Roma, per favore.', nl: 'Een kaartje naar Rome, alsjeblieft.' },
          { target: 'Il treno per Firenze parte alle nove.', nl: 'De trein naar Florence vertrekt om negen uur.' },
          { target: 'Il treno per Roma parte alle otto.', nl: 'De trein naar Rome vertrekt om acht uur.' },
        ],
      },
      {
        title: 'Links en rechts met a',
        explanation:
          'Richtingen krijgen het voorzetsel a: a destra (rechts) en a sinistra (links). Een voorzetsel is een klein woordje dat een plaats of richting aangeeft, zoals a, di, in en su. Dat blijft hetzelfde of je nu vertelt waar iets ligt of waar iemand heen moet — het Italiaans maakt daar geen verschil tussen, terwijl wij kiezen tussen "aan de rechterkant" en "naar rechts".',
        examples: [
          { target: 'Il museo è a destra.', nl: 'Het museum is aan de rechterkant.' },
          { target: 'La stazione è a sinistra.', nl: 'Het station is aan de linkerkant.' },
          { target: 'Il bar è a destra.', nl: 'De bar is aan de rechterkant.' },
        ],
      },
    ],
    phrases: [
      { target: "Dov'è la stazione?", nl: 'Waar is het station?' },
      { target: 'Un biglietto per Roma, per favore.', nl: 'Een kaartje naar Rome, alsjeblieft.' },
      { target: 'Il museo è a destra.', nl: 'Het museum is aan de rechterkant.' },
      { target: 'La piazza è bellissima.', nl: 'Het plein is prachtig.' },
      { target: 'Il museo apre alle dieci.', nl: 'Het museum opent om tien uur.' },
    ],
    tip:
      'In stazione klinkt de z als "ts" en de i hoor je nauwelijks apart: "sta-TSJO-ne". Nederlandstaligen maken er vaak "sta-zie-OO-ne" van. Handig om te weten: bijna alle Italiaanse woorden op -zione komen overeen met onze woorden op -tie — stazione is station, informazione is informatie.',
  },

  'it-u5': {
    intro:
      'Je leert tellen en de klok lezen, zodat je weet wanneer de trein gaat en hoe laat het museum opengaat. Ook oggi en domani horen erbij.',
    rules: [
      {
        title: 'Waarom sono le due meervoud is',
        explanation:
          "Bij het klokkijken laat het Italiaans het woord ore (uren) weg, maar de rest van de zin blijft in het meervoud staan. Sono le due is dus letterlijk: het zijn de twee uren. Le hoort bij dat weggelaten meervoud. Eén uitzondering: bij één uur is er maar één uur, dus daar zeg je è l'una.",
        examples: [
          { target: 'Che ore sono? — Sono le dieci.', nl: 'Hoe laat is het? — Het is tien uur.' },
          { target: 'Sono le tre.', nl: 'Het is drie uur.' },
          { target: "È l'una.", nl: 'Het is één uur.' },
        ],
      },
      {
        title: 'Alle: om ... uur',
        explanation:
          "Om vijf uur is alle cinque. Alle is een samentrekking van a (om) plus le (de): a + le wordt alle. Zulke samentrekkingen zijn in het Italiaans verplicht, je mag a le nooit los schrijven. Bij één uur wordt het all'una.",
        examples: [
          { target: 'Il museo apre alle dieci.', nl: 'Het museum opent om tien uur.' },
          { target: 'Il treno parte alle cinque.', nl: 'De trein vertrekt om vijf uur.' },
          { target: "Il film comincia all'una.", nl: 'De film begint om één uur.' },
        ],
      },
      {
        title: 'Getallen veranderen niet mee',
        explanation:
          'Due, tre, cinque en dieci blijven altijd precies hetzelfde, of het woord erachter nu mannelijk of vrouwelijk is: due caffè, due sorelle. Alleen uno (één) past zich aan en gedraagt zich als het lidwoord: un caffè, una sorella.',
        examples: [
          { target: 'Due caffè, per favore.', nl: 'Twee koffie, alsjeblieft.' },
          { target: 'Ho tre fratelli.', nl: 'Ik heb drie broers.' },
          { target: 'Il treno parte tra cinque minuti.', nl: 'De trein vertrekt over vijf minuten.' },
        ],
      },
    ],
    phrases: [
      { target: 'Che ore sono?', nl: 'Hoe laat is het?' },
      { target: 'Sono le due.', nl: 'Het is twee uur.' },
      { target: 'Il treno parte alle cinque.', nl: 'De trein vertrekt om vijf uur.' },
      { target: 'Il museo apre oggi alle dieci.', nl: 'Het museum opent vandaag om tien uur.' },
      { target: 'Il treno per Roma parte domani.', nl: 'De trein naar Rome vertrekt morgen.' },
    ],
    tip:
      'Wij draaien de zin om zodra er iets vóór het werkwoord staat: "Morgen vertrekt de trein". Het Italiaans doet dat niet — het onderwerp blijft gewoon vóór het werkwoord staan: Domani il treno parte, en Oggi sono a Roma. Vertaal dus niet woord voor woord, maar houd de volgorde onderwerp-werkwoord vast.',
  },

  'it-u6': {
    intro:
      'Op de markt vraag je wat iets kost, je zegt wat je koopt en je klaagt dat de wijn te duur is. Handige woorden voor elke Italiaanse zaterdagochtend.',
    rules: [
      {
        title: 'Costa of costano?',
        explanation:
          'Het werkwoord past zich aan bij het aantal dingen. Gaat het om één ding, dan is het costa (kost); gaat het om meer dingen, dan costano (kosten). Dat werkt net als bij ons "kost" en "kosten", alleen zit het verschil in de laatste letters van het woord.',
        examples: [
          { target: 'Quanto costa il pane?', nl: 'Hoeveel kost het brood?' },
          { target: 'Quanto costano i biglietti?', nl: 'Hoeveel kosten de kaartjes?' },
          { target: 'Il caffè costa un euro.', nl: 'De koffie kost één euro.' },
        ],
      },
      {
        title: 'Euro blijft euro',
        explanation:
          'Bij een bedrag krijgt euro geen meervoudsvorm: je zegt dieci euro, nooit "dieci euri". Euro is daarin een uitzondering. Gewone Italiaanse woorden krijgen namelijk wél een meervoud: een -o wordt -i (il biglietto wordt i biglietti) en een -a wordt -e (la sorella wordt le sorelle).',
        examples: [
          { target: 'Il formaggio costa dieci euro.', nl: 'De kaas kost tien euro.' },
          { target: 'Il caffè costa un euro.', nl: 'De koffie kost één euro.' },
        ],
      },
      {
        title: 'A + il = al',
        explanation:
          "Voorzetsels (woordjes als a, di, in en su) en lidwoorden plakken in het Italiaans aan elkaar vast. A (op, naar) plus il (de) wordt al: al mercato. Dat is geen keuze maar een regel, want a il mercato bestaat niet. Op dezelfde manier krijg je a + la = alla en a + l' = all'.",
        examples: [
          { target: 'Compro il pane al mercato.', nl: 'Ik koop het brood op de markt.' },
          { target: 'Il mercato è vicino alla stazione.', nl: 'De markt is dicht bij het station.' },
          { target: 'Un caffè al banco, per favore.', nl: 'Een koffie aan de bar, alsjeblieft.' },
        ],
      },
      {
        title: 'De ik-vorm eindigt op -o',
        explanation:
          'Heel veel werkwoorden krijgen in de ik-vorm de uitgang -o: compro (ik koop), parlo (ik spreek), abito (ik woon), studio (ik studeer). Die -o vertelt al dat jij het bent, dus het woordje io (ik) laat je weg. Zo is compro in zijn eentje een complete zin.',
        examples: [
          { target: 'Compro la frutta al mercato.', nl: 'Ik koop het fruit op de markt.' },
          { target: 'Compro il formaggio e il pane.', nl: 'Ik koop de kaas en het brood.' },
        ],
      },
    ],
    phrases: [
      { target: 'Quanto costa il pane?', nl: 'Hoeveel kost het brood?' },
      { target: 'Quanto costa il caffè?', nl: 'Hoeveel kost de koffie?' },
      { target: 'Il vino è troppo caro.', nl: 'De wijn is te duur.' },
      { target: 'Compro il pane al mercato.', nl: 'Ik koop het brood op de markt.' },
      { target: 'Vorrei della frutta fresca.', nl: 'Ik wil graag wat vers fruit.' },
    ],
    tip:
      'Caro betekent duur, maar ook lief of dierbaar: Caro Marco is de aanhef van een brief, ons "Beste Marco". Uit de zin haal je welke betekenis bedoeld is — staat caro na è en gaat het over een product, dan gaat het over de prijs.',
  },

  'it-u7': {
    intro:
      'Je beschrijft je huis en vertelt waar je woont. Onderweg leer je het verschil tussen a en in, twee woordjes die Nederlandstaligen vaak verwisselen.',
    rules: [
      {
        title: 'A bij steden, in bij ruimtes',
        explanation:
          'Ben je of woon je in een stad, dan gebruik je a: abito a Roma, abito a Milano. Bij landen en bij ruimtes binnenshuis gebruik je in: in Italia, in cucina, in bagno. De keuze hangt dus af van wat voor plek het is, en niet van wat je daar doet.',
        examples: [
          { target: 'Abito a Milano con la mia famiglia.', nl: 'Ik woon in Milaan met mijn familie.' },
          { target: 'Abito a Roma.', nl: 'Ik woon in Rome.' },
          { target: 'Il tavolo è in cucina.', nl: 'De tafel staat in de keuken.' },
        ],
      },
      {
        title: 'Della: van de',
        explanation:
          "Net als a plakt ook di aan het lidwoord vast: di + la wordt della, di + il wordt del, di + l' wordt dell'. Zo zeg je la finestra della camera. Staat er een naam achter in plaats van een lidwoord, dan blijft di los: la casa di Anna.",
        examples: [
          { target: 'La finestra della camera è grande.', nl: 'Het raam van de slaapkamer is groot.' },
          { target: 'La porta della casa è verde.', nl: 'De deur van het huis is groen.' },
          { target: 'La casa di Anna è grande.', nl: 'Het huis van Anna is groot.' },
        ],
      },
      {
        title: 'Staan, liggen of zitten? Gewoon è',
        explanation:
          'Wij kiezen zorgvuldig tussen staan, liggen en zitten; het Italiaans gebruikt in al die gevallen simpelweg è (is). Il tavolo è in cucina is letterlijk "de tafel is in de keuken", maar wij zeggen "de tafel staat in de keuken". Vertaal è dus vrij naar het Nederlands.',
        examples: [
          { target: 'Il tavolo è in cucina.', nl: 'De tafel staat in de keuken.' },
          { target: 'Il libro è sul tavolo.', nl: 'Het boek ligt op de tafel.' },
          { target: 'La camera è al primo piano.', nl: 'De slaapkamer is op de eerste verdieping.' },
        ],
      },
    ],
    phrases: [
      { target: 'Abito a Roma.', nl: 'Ik woon in Rome.' },
      { target: 'La casa di Marco è grande.', nl: 'Het huis van Marco is groot.' },
      { target: 'La cucina è piccola ma bella.', nl: 'De keuken is klein maar mooi.' },
      { target: 'Il bagno è a destra.', nl: 'De badkamer is aan de rechterkant.' },
      { target: 'La camera ha una finestra grande.', nl: 'De slaapkamer heeft een groot raam.' },
    ],
    tip:
      'La camera is de slaapkamer, geen fototoestel — dat is la macchina fotografica. En let op: casa is vrouwelijk (la casa), terwijl wij "het huis" zeggen. Het Nederlandse geslacht van een woord zegt niets over het Italiaanse, dus leer il of la altijd meteen samen met het woord.',
  },

  'it-u8': {
    intro:
      'Je vertelt wat je doet voor werk of studie en waar dat is. Ook leer je waarom er soms een streepje op de e staat.',
    rules: [
      {
        title: 'Beroepen zonder "een"',
        explanation:
          'Zeg je wat iemands beroep is, dan laat het Italiaans het woordje un of una weg: mia sorella è medico, letterlijk "mijn zus is arts". Wij doen dat toevallig ook zo, maar wie via het Engels denkt ("she is a doctor") zet er per ongeluk un bij. Dat hoeft dus niet.',
        examples: [
          { target: 'Mia sorella è medico.', nl: 'Mijn zus is arts.' },
          { target: 'Mio padre è insegnante.', nl: 'Mijn vader is leraar.' },
          { target: 'Mia madre è medico.', nl: 'Mijn moeder is arts.' },
        ],
      },
      {
        title: 'È met streepje, e zonder',
        explanation:
          'È met een accentstreepje betekent "is"; e zonder streepje betekent "en". Ze klinken in een snelle zin bijna hetzelfde, dus het streepje is het enige waaraan je ziet welke van de twee bedoeld wordt. Vergeet je het, dan staat er iets heel anders dan je wilde zeggen.',
        examples: [
          { target: 'Mia sorella è medico e mio fratello è insegnante.', nl: 'Mijn zus is arts en mijn broer is leraar.' },
          { target: 'La pizza e il vino, per favore.', nl: 'De pizza en de wijn, alsjeblieft.' },
        ],
      },
      {
        title: 'Studio of studia?',
        explanation:
          'De uitgang van het werkwoord vertelt wie er iets doet — dat heet vervoegen, het aanpassen van het werkwoord aan de persoon. De uitgang -o hoort bij ik: studio, abito. De uitgang -i hoort bij jij: studi, abiti, parli. De uitgang -a hoort bij hij, zij of een naam: studia, abita. Je hoeft er geen woord voor ik, jij of hij bij te zetten, de uitgang doet dat werk al.',
        examples: [
          { target: 'Studio italiano a scuola.', nl: 'Ik studeer Italiaans op school.' },
          { target: 'Perché studi italiano?', nl: 'Waarom studeer je Italiaans?' },
          { target: 'Lo studente studia italiano.', nl: 'De student studeert Italiaans.' },
          { target: 'Anche mio fratello abita a Roma.', nl: 'Mijn broer woont ook in Rome.' },
        ],
      },
      {
        title: 'In centro, a scuola',
        explanation:
          'Bij een paar veelgebruikte plekken zeg je in of a zónder lidwoord ertussen: in centro (in het centrum), in ufficio (op kantoor), a scuola (op school), a casa (thuis). Wij zetten er wel de of het tussen, het Italiaans niet. Welke van de twee woordjes het is, ligt per plek vast, dus leer ze als geheel: in centro, a scuola.',
        examples: [
          { target: 'La scuola è in centro.', nl: 'De school is in het centrum.' },
          { target: "L'ufficio è in centro.", nl: 'Het kantoor is in het centrum.' },
          { target: 'Studio italiano a scuola.', nl: 'Ik studeer Italiaans op school.' },
        ],
      },
      {
        title: 'Su + il = sul',
        explanation:
          "Su betekent op. Ook su plakt aan het lidwoord vast: su + il wordt sul, su + la wordt sulla, su + l' wordt sull'. Il libro è sul tavolo is dus: het boek ligt op de tafel. Precies dezelfde truc als bij al (a + il) en della (di + la).",
        examples: [
          { target: 'Il libro è sul tavolo.', nl: 'Het boek ligt op de tafel.' },
          { target: "Il libro dell'insegnante è sul tavolo.", nl: 'Het boek van de leraar ligt op de tafel.' },
        ],
      },
    ],
    phrases: [
      { target: 'Il mio lavoro è interessante.', nl: 'Mijn werk is interessant.' },
      { target: 'Studio italiano a scuola.', nl: 'Ik studeer Italiaans op school.' },
      { target: "L'ufficio è in centro.", nl: 'Het kantoor is in het centrum.' },
      { target: 'La scuola è vicino alla stazione.', nl: 'De school is dicht bij het station.' },
      { target: 'Il libro è sul tavolo.', nl: 'Het boek ligt op de tafel.' },
    ],
    tip:
      'Scuola spreek je uit als "SKWÒ-la": sc vóór een a, o of u klinkt als "sk". Alleen vóór een i of een e wordt sc een "sj"-klank, zoals in scena ("SJÈ-na"). Het is dezelfde regel als bij de c, dus caffè met een k en cinema met "tsj".',
  },

  'it-u9': {
    intro:
      'Je leert vragen stellen met wie, hoe, wanneer en waarom, en je vertelt iets over jezelf. Hiermee kun je een gesprek op gang houden in plaats van alleen antwoorden.',
    rules: [
      {
        title: 'Vragen zonder hulpwoordje',
        explanation:
          'Een vraag begint met het vraagwoord, daarna komt het werkwoord en pas daarna het onderwerp: Quando parte il treno? Je hoeft er geen hulpwoord bij te verzinnen zoals het Engelse "does". Heb je geen vraagwoord nodig, dan houd je gewoon de volgorde van een gewone zin aan en laat je je stem aan het eind omhoog gaan: Parli italiano?',
        examples: [
          { target: 'Quando parte il treno?', nl: 'Wanneer vertrekt de trein?' },
          { target: 'Chi è quella donna?', nl: 'Wie is die vrouw?' },
          { target: 'Parli italiano?', nl: 'Spreek je Italiaans?' },
        ],
      },
      {
        title: 'Perché is waarom én omdat',
        explanation:
          'Perché doet twee dingen tegelijk. Aan het begin van een vraag betekent het waarom; midden in een zin betekent het omdat. Het Italiaans heeft dus één woord waar wij er twee hebben, en je ziet aan de plaats in de zin welke betekenis bedoeld is.',
        examples: [
          { target: 'Perché studi italiano?', nl: 'Waarom studeer je Italiaans?' },
          { target: 'Studio italiano perché mi piace.', nl: 'Ik studeer Italiaans omdat ik het leuk vind.' },
        ],
      },
      {
        title: 'Come si chiama?',
        explanation:
          'Vraag je hoe iemand anders heet, dan gebruik je si chiama: Come si chiama tua madre? Er staat letterlijk "hoe noemt zich jouw moeder?". Over jezelf zeg je mi chiamo, en vraag je het rechtstreeks aan iemand, dan is het ti chiami. Het woordje ervoor verandert dus mee met de persoon: mi, ti, si.',
        examples: [
          { target: 'Come si chiama tua madre?', nl: 'Hoe heet jouw moeder?' },
          { target: 'Come ti chiami?', nl: 'Hoe heet je?' },
          { target: 'Mi chiamo Luca.', nl: 'Ik heet Luca.' },
        ],
      },
      {
        title: "Un po' met apostrof",
        explanation:
          "Un po' betekent een beetje en is een afkorting van un poco. De apostrof laat zien dat er letters zijn weggevallen, dus hij hoort er echt bij en je mag hem niet vergeten. Zet je er een woord achter voor een ding of een taal, dan komt di ertussen: un po' di italiano, un po' di pane.",
        examples: [
          { target: "Parlo un po' di italiano.", nl: 'Ik spreek een beetje Italiaans.' },
          { target: "Parlo anche un po' di italiano.", nl: 'Ik spreek ook een beetje Italiaans.' },
        ],
      },
    ],
    phrases: [
      { target: 'Come stai? — Sto bene, grazie.', nl: 'Hoe gaat het? — Goed, dank je.' },
      { target: 'Quando parte il treno per Roma?', nl: 'Wanneer vertrekt de trein naar Rome?' },
      { target: "Parlo un po' di italiano.", nl: 'Ik spreek een beetje Italiaans.' },
      { target: 'Anche mia sorella studia italiano.', nl: 'Mijn zus studeert ook Italiaans.' },
      { target: 'Chi è quella donna?', nl: 'Wie is die vrouw?' },
    ],
    tip:
      'Anche betekent ook, maar het staat vlak vóór het woord waar het bij hoort, niet achteraan zoals bij ons. Anche mia sorella studia italiano betekent "mijn zús studeert ook Italiaans"; Mia sorella studia anche italiano betekent "mijn zus studeert óók Italiaans, naast iets anders". De plaats bepaalt dus de betekenis.',
  },

  'it-u10': {
    intro:
      'Je reserveert, boekt en reist: vliegtuig, bus, auto en trein. Precies de zinnen die je nodig hebt vanaf het moment dat je landt.',
    rules: [
      {
        title: 'Vorrei plus het hele werkwoord',
        explanation:
          'Na vorrei kan een ding staan, maar ook een werkwoord in zijn basisvorm: vorrei prenotare. Die basisvorm herken je aan de uitgang -are, -ere of -ire, en je verandert er niets aan: hij blijft precies zoals hij in het woordenboek staat. Wat je wilt reserveren komt er daarna achter.',
        examples: [
          { target: 'Vorrei prenotare una camera per due notti.', nl: 'Ik wil graag een kamer voor twee nachten reserveren.' },
          { target: 'Vorrei prenotare un tavolo per due.', nl: 'Ik wil graag een tafel voor twee reserveren.' },
          { target: 'Vorrei prenotare due biglietti per Venezia.', nl: 'Ik wil graag twee kaartjes naar Venetië reserveren.' },
        ],
      },
      {
        title: 'In macchina, in autobus',
        explanation:
          'Vertel je waarmee je reist, dan gebruikt het Italiaans in, waar wij "met" zeggen: in macchina, in treno, in autobus, in aereo. Het lidwoord valt daarbij weg, dus niet "in la macchina". Ga je te voet, dan is het a piedi.',
        examples: [
          { target: 'Andiamo a Firenze in macchina.', nl: 'We gaan met de auto naar Florence.' },
          { target: 'Vado a Roma in treno.', nl: 'Ik ga met de trein naar Rome.' },
          { target: 'Andiamo in centro a piedi.', nl: 'We gaan te voet naar het centrum.' },
        ],
      },
      {
        title: 'Per bij vertrekken en aankomen',
        explanation:
          "Bij vervoer wijst per altijd de bestemming aan, welk voertuig het ook is: l'aereo per Napoli, il treno per Milano, l'autobus per l'aeroporto. Dit ligt vast, dus je hoeft hier niet te twijfelen tussen a, di en per.",
        examples: [
          { target: "L'aereo per Napoli parte alle sei.", nl: 'Het vliegtuig naar Napels vertrekt om zes uur.' },
          { target: 'Il treno per Milano parte alle otto.', nl: 'De trein naar Milaan vertrekt om acht uur.' },
          { target: "Prendo l'autobus per l'aeroporto.", nl: 'Ik neem de bus naar het vliegveld.' },
        ],
      },
      {
        title: 'Andiamo: wij gaan',
        explanation:
          'De wij-vorm van een werkwoord eindigt op -iamo: andiamo (wij gaan), parliamo (wij spreken), compriamo (wij kopen). Net als bij de ik-vorm laat je het woord voor "wij" gewoon weg. Andiamo! wordt bovendien gebruikt als aansporing, ongeveer als ons "kom, we gaan!".',
        examples: [
          { target: 'Andiamo a Firenze in macchina.', nl: 'We gaan met de auto naar Florence.' },
          { target: 'Andiamo al cinema stasera.', nl: 'We gaan vanavond naar de bioscoop.' },
        ],
      },
    ],
    phrases: [
      { target: 'Ecco il mio passaporto.', nl: 'Hier is mijn paspoort.' },
      { target: 'Vorrei prenotare un tavolo per due.', nl: 'Ik wil graag een tafel voor twee reserveren.' },
      { target: "Dov'è l'autobus per la stazione?", nl: 'Waar is de bus naar het station?' },
      { target: 'La mia valigia è pesante.', nl: 'Mijn koffer is zwaar.' },
      { target: 'Buon viaggio!', nl: 'Goede reis!' },
    ],
    tip:
      'In valigia en viaggio klinkt de gi als "dzj": "va-LIE-dzja" en "VJAD-dzjo". Een g vóór een i of een e krijgt die zachte klank, precies zoals de c dat doet. Voor een a, o of u blijft de g hard, zoals in gamba. Nederlandstaligen maken van viaggio vaak "vi-a-GHI-o", en dat verstaat niemand.',
  },

  'it-u11': {
    intro:
      'Je legt uit wat er mis is en vraagt de weg naar de apotheek. Twee manieren om pijn te melden, allebei anders gebouwd dan bij ons.',
    rules: [
      {
        title: 'Ho mal di plus lichaamsdeel',
        explanation:
          'Pijn druk je uit met hebben: ho mal di testa is letterlijk "ik heb pijn van hoofd". Mal is de verkorte vorm van male (pijn) en di verbindt het met het lichaamsdeel. Er komt geen lidwoord tussen, dus mal di testa en mal di stomaco.',
        examples: [
          { target: 'Ho mal di testa.', nl: 'Ik heb hoofdpijn.' },
          { target: 'Ho mal di stomaco.', nl: 'Ik heb maagpijn.' },
          { target: 'Ho la febbre e mal di testa.', nl: 'Ik heb koorts en hoofdpijn.' },
        ],
      },
      {
        title: 'Mi fa male: het doet mij pijn',
        explanation:
          'De tweede manier is mi fa male la testa. Let op de omgekeerde bouw: het lichaamsdeel is hier het onderwerp, dus er staat letterlijk "het hoofd doet mij pijn". Nu staat er wél een lidwoord voor het lichaamsdeel, en juist géén woord voor "mijn" — dat is al duidelijk uit mi.',
        examples: [
          { target: 'Mi fa male la testa.', nl: 'Mijn hoofd doet pijn.' },
          { target: 'Mi fa male la gamba.', nl: 'Mijn been doet pijn.' },
          { target: 'Mi fa male lo stomaco.', nl: 'Mijn maag doet pijn.' },
        ],
      },
      {
        title: 'Lo: het derde lidwoord',
        explanation:
          "Naast il en la bestaat er ook lo. Dat gebruik je bij mannelijke woorden die beginnen met een s plus een medeklinker (st-, sp-, sc-) of met een z: lo stomaco, lo studente, lo zio. De reden is de uitspraak, want il stomaco levert drie medeklinkers achter elkaar op. Bij precies diezelfde woorden wordt un ook langer: uno studente, uno stomaco. Voor een klinker wordt lo weer l', zoals in l'ufficio.",
        examples: [
          { target: 'Mi fa male lo stomaco.', nl: 'Mijn maag doet pijn.' },
          { target: 'Lo studente studia italiano.', nl: 'De student studeert Italiaans.' },
        ],
      },
      {
        title: 'Dal medico: naar de dokter',
        explanation:
          'Da plus il wordt dal. Bij een persoon betekent da "naar toe" of "bij", dus devo andare dal medico is "ik moet naar de dokter". Gaat het om een plek in plaats van een persoon, dan gebruik je a of in: vado in farmacia. De vuistregel: bij mensen da, bij plekken a of in.',
        examples: [
          { target: 'Devo andare dal medico.', nl: 'Ik moet naar de dokter.' },
          { target: 'Vado dal medico oggi.', nl: 'Ik ga vandaag naar de dokter.' },
          { target: 'Vado in farmacia.', nl: 'Ik ga naar de apotheek.' },
        ],
      },
    ],
    phrases: [
      { target: 'Ho mal di testa.', nl: 'Ik heb hoofdpijn.' },
      { target: 'Mi fa male la gamba.', nl: 'Mijn been doet pijn.' },
      { target: 'Devo andare dal medico.', nl: 'Ik moet naar de dokter.' },
      { target: "Dov'è la farmacia?", nl: 'Waar is de apotheek?' },
      { target: 'La farmacia è aperta fino alle otto.', nl: 'De apotheek is open tot acht uur.' },
    ],
    tip:
      'La mano (de hand) eindigt op -o maar is toch vrouwelijk: je zegt la mano destra, niet "il mano". Zulke uitzonderingen moet je los onthouden, want de -o/-a-vuistregel klopt hier niet. Let ook op il medico: dat is zowel de dokter als de arts, terwijl la medicina het medicijn is.',
  },

  'it-u12': {
    intro:
      'Je praat over het weer en de seizoenen — het onderwerp waarmee in Italië ongeveer elk gesprek begint. Weerzinnen zijn anders gebouwd dan bij ons.',
    rules: [
      {
        title: 'Weer met fare',
        explanation:
          'Over temperatuur praat het Italiaans met fa, een vorm van fare (doen of maken): fa caldo, fa freddo. Er staat letterlijk "het maakt warm". Gebruik hier geen è, want è caldo zegt dat een ding warm is, bijvoorbeeld je koffie, en niet dat het buiten warm weer is.',
        examples: [
          { target: 'Oggi fa caldo.', nl: 'Vandaag is het warm.' },
          { target: 'In inverno fa freddo in montagna.', nl: 'In de winter is het koud in de bergen.' },
          { target: 'In estate fa molto caldo.', nl: 'In de zomer is het erg warm.' },
        ],
      },
      {
        title: "C'è: er is",
        explanation:
          "C'è betekent er is en is een samentrekking van ci (er) en è (is). Dingen die je kunt zien of die ergens plaatsvinden krijgen c'è: oggi c'è il sole, stasera c'è una festa. Gaat het om meer dan één ding, dan wordt het ci sono (er zijn).",
        examples: [
          { target: "Oggi c'è il sole.", nl: 'Vandaag schijnt de zon.' },
          { target: "Stasera c'è un concerto in piazza.", nl: 'Vanavond is er een concert op het plein.' },
          { target: "Sabato c'è una festa a casa di Giulia.", nl: 'Zaterdag is er een feest bij Giulia thuis.' },
        ],
      },
      {
        title: 'Piove: één woord is genoeg',
        explanation:
          'Piove betekent "het regent", en er staat geen woord voor "het" bij. Weerwerkwoorden hebben in het Italiaans geen onderwerp nodig, want er is niemand of niets dat de handeling uitvoert. Hetzelfde geldt voor nevica (het sneeuwt).',
        examples: [
          { target: 'Oggi piove e fa freddo.', nl: 'Vandaag regent het en is het koud.' },
          { target: 'In autunno piove spesso.', nl: 'In de herfst regent het vaak.' },
          { target: 'In inverno nevica in montagna.', nl: 'In de winter sneeuwt het in de bergen.' },
        ],
      },
      {
        title: 'In plus het seizoen',
        explanation:
          'Seizoenen krijgen in, en daar hoort geen lidwoord bij: in estate, in inverno, in primavera, in autunno. Wij zetten er wel een lidwoord tussen ("in de zomer"), maar in het Italiaans zou dat fout klinken. Staat het seizoen als onderwerp vooraan, dan komt het lidwoord juist wel terug: la primavera è bellissima.',
        examples: [
          { target: 'In estate andiamo al mare.', nl: 'In de zomer gaan we naar zee.' },
          { target: 'In autunno piove spesso.', nl: 'In de herfst regent het vaak.' },
          { target: 'La primavera è la mia stagione preferita.', nl: 'De lente is mijn favoriete seizoen.' },
        ],
      },
    ],
    phrases: [
      { target: 'Che tempo fa?', nl: 'Wat voor weer is het?' },
      { target: "Oggi c'è il sole.", nl: 'Vandaag schijnt de zon.' },
      { target: 'Fa molto caldo.', nl: 'Het is erg warm.' },
      { target: 'Non mi piace la pioggia.', nl: 'Ik hou niet van regen.' },
      { target: 'In estate andiamo al mare.', nl: 'In de zomer gaan we naar zee.' },
    ],
    tip:
      'Wij hebben bij het weer altijd een "het" nodig: het regent, het is koud. Het Italiaans niet. Begin daarom nooit met een vertaling van "het", maar meteen met fa of met het werkwoord zelf: fa freddo, piove, nevica. Dat ene weggelaten woordje maakt je zinnen in één klap Italiaans.',
  },

  'it-u13': {
    intro:
      'Je maakt plannen voor de avond: bioscoop, theater, concert of feest. En je leert zeggen waar je van houdt.',
    rules: [
      {
        title: 'Al cinema, alla festa',
        explanation:
          "Ga je ergens naartoe, dan gebruik je andare a, en die a plakt aan het lidwoord vast: a + il cinema wordt al cinema, a + la festa wordt alla festa, a + l'aeroporto wordt all'aeroporto. Kies dus eerst het juiste lidwoord van de plek en plak daarna pas de a eraan vast.",
        examples: [
          { target: 'Stasera andiamo al cinema.', nl: 'Vanavond gaan we naar de bioscoop.' },
          { target: 'Andiamo al teatro stasera.', nl: 'We gaan vanavond naar het theater.' },
          { target: 'Mi piace ballare alla festa.', nl: 'Ik dans graag op het feest.' },
        ],
      },
      {
        title: 'In piazza, zonder lidwoord',
        explanation:
          'Een paar plekken krijgen in en helemaal geen lidwoord: in piazza, in centro, in città, in montagna. Dat zijn vaste uitdrukkingen die de plek in het algemeen aanduiden, niet één bepaald plein. Bedoel je een specifiek plein, dan gebruik je wel een lidwoord: nella piazza principale.',
        examples: [
          { target: 'Il concerto è in piazza.', nl: 'Het concert is op het plein.' },
          { target: "L'ufficio è in centro.", nl: 'Het kantoor is in het centrum.' },
          { target: 'In inverno fa freddo in montagna.', nl: 'In de winter is het koud in de bergen.' },
        ],
      },
      {
        title: 'Mi piace: het bevalt mij',
        explanation:
          'Mi piace betekent letterlijk "het bevalt mij", dus de zin staat om: het ding dat je leuk vindt is het onderwerp. Mi piace la musica is "de muziek bevalt mij". Gaat het om meer dingen, dan wordt het mi piacciono. Na mi piace kan ook een heel werkwoord staan: mi piace ballare.',
        examples: [
          { target: 'Mi piace la musica italiana.', nl: 'Ik hou van Italiaanse muziek.' },
          { target: 'Mi piace ballare con gli amici.', nl: 'Ik dans graag met vrienden.' },
          { target: 'Non mi piace la pioggia.', nl: 'Ik hou niet van regen.' },
        ],
      },
      {
        title: 'Stasera en sabato',
        explanation:
          'Tijdwoorden als stasera (vanavond) en oggi (vandaag) mag je vooraan of achteraan in de zin zetten, allebei is goed. Bij dagen van de week gebruik je geen voorzetsel: sabato betekent al "op zaterdag", dus je zegt nooit "in sabato".',
        examples: [
          { target: 'Cosa facciamo stasera?', nl: 'Wat doen we vanavond?' },
          { target: 'La festa di Giulia è sabato.', nl: 'Het feest van Giulia is zaterdag.' },
          { target: 'Andiamo al cinema stasera?', nl: 'Gaan we vanavond naar de bioscoop?' },
        ],
      },
    ],
    phrases: [
      { target: 'Cosa facciamo stasera?', nl: 'Wat doen we vanavond?' },
      { target: 'Andiamo al cinema stasera?', nl: 'Gaan we vanavond naar de bioscoop?' },
      { target: 'Il film comincia alle nove.', nl: 'De film begint om negen uur.' },
      { target: 'Mi piace la musica italiana.', nl: 'Ik hou van Italiaanse muziek.' },
      { target: "Stasera c'è un concerto in piazza.", nl: 'Vanavond is er een concert op het plein.' },
    ],
    tip:
      'Cinema eindigt op -a maar is toch mannelijk: je zegt il cinema, niet la cinema. Datzelfde geldt voor il problema en il programma, woorden die uit het Grieks komen. De vuistregel dat -o mannelijk is en -a vrouwelijk klopt dus meestal, maar niet altijd — leer bij zulke woorden het lidwoord er los bij.',
  },

  'it-u14': {
    intro:
      'Alles komt hier samen: reizen, bestellen, het weer, uitgaan en over jezelf vertellen. Dit is de unit waarin je merkt hoeveel je inmiddels zelf kunt zeggen.',
    rules: [
      {
        title: 'Alle samentrekkingen op een rij',
        explanation:
          "A, di, da, in en su plakken altijd vast aan il, la en l'. Zo krijg je al, alla en all' (van a), del, della en dell' (van di), dal en dalla (van da), nel en nella (van in) en sul en sulla (van su). Twijfel je? Kies eerst het lidwoord dat bij het woord hoort, en plak er dan pas het voorzetsel aan vast.",
        examples: [
          { target: 'Andiamo al cinema?', nl: 'Gaan we naar de bioscoop?' },
          { target: "La mia valigia è all'aeroporto.", nl: 'Mijn koffer is op het vliegveld.' },
          { target: "Il libro dell'insegnante è sul tavolo.", nl: 'Het boek van de leraar ligt op de tafel.' },
        ],
      },
      {
        title: 'Mi, ti en si horen bij chiamarsi',
        explanation:
          'Bij chiamarsi (heten) verandert niet alleen de uitgang van het werkwoord, maar ook het woordje ervoor: mi chiamo, ti chiami, si chiama. Ze horen als een paar bij elkaar, dus mi hoort bij -o en si bij -a. Laat je dat woordje weg, dan betekent chiamo alleen nog "ik roep".',
        examples: [
          { target: 'Mi chiamo Marco.', nl: 'Ik heet Marco.' },
          { target: 'Mia sorella si chiama Sara.', nl: 'Mijn zus heet Sara.' },
          { target: 'Come ti chiami?', nl: 'Hoe heet je?' },
        ],
      },
      {
        title: 'Per, di of a?',
        explanation:
          'Per wijst een bestemming aan: il treno per Milano. Di zit vast in uitdrukkingen en betekent daarnaast "van": ho mal di stomaco, la casa di Anna. A gebruik je bij steden en bij tijdstippen: abito a Roma, alle otto. Deze drie zijn niet uitwisselbaar, dus leer ze per uitdrukking in plaats van per vertaling.',
        examples: [
          { target: 'Il treno per Milano parte alle otto.', nl: 'De trein naar Milaan vertrekt om acht uur.' },
          { target: 'Ho mal di stomaco.', nl: 'Ik heb maagpijn.' },
          { target: 'Abito a Roma.', nl: 'Ik woon in Rome.' },
        ],
      },
      {
        title: "Fa, è of c'è?",
        explanation:
          "Bij het weer gebruik je fa: in estate fa molto caldo. Bij een eigenschap van een ding of een persoon gebruik je è of sono: la pizza è buonissima. En wil je zeggen dat er iets is, dan gebruik je c'è of ci sono: stasera c'è una festa. Drie vaste keuzes die vaak door elkaar worden gehaald.",
        examples: [
          { target: 'In estate fa molto caldo.', nl: 'In de zomer is het erg warm.' },
          { target: 'La pizza e il vino sono buonissimi.', nl: 'De pizza en de wijn zijn heerlijk.' },
          { target: "Stasera c'è una festa.", nl: 'Vanavond is er een feest.' },
        ],
      },
    ],
    phrases: [
      { target: 'Buonasera, vorrei prenotare un tavolo per due.', nl: 'Goedenavond, ik wil graag een tafel voor twee reserveren.' },
      { target: 'Vorrei due biglietti per il concerto.', nl: 'Ik wil graag twee kaartjes voor het concert.' },
      { target: 'Mi fa male la testa, devo andare dal medico.', nl: 'Mijn hoofd doet pijn, ik moet naar de dokter.' },
      { target: "Dov'è la stazione?", nl: 'Waar is het station?' },
      { target: 'Arrivederci e buon viaggio!', nl: 'Tot ziens en goede reis!' },
    ],
    tip:
      "De grootste winst zit nu in de kleine woordjes, niet in nieuwe woorden. Nederlandstaligen struikelen het vaakst over drie dingen: het juiste lidwoord (il, la, lo of l'), de samentrekking (al in plaats van a il) en fa in plaats van è bij het weer. Loop die drie even na voordat je een zin uitspreekt, en je klinkt meteen een stuk Italiaanser.",
  },
}
