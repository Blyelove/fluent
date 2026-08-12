import type { UnitGuide } from '../../types'

export const guides: Record<string, UnitGuide> = {
  'fr-u1': {
    intro:
      'Je leert hier hoe je een gesprek opent, vraagt hoe het met iemand gaat en netjes afscheid neemt. Met deze handvol woorden kom je in elke Franse bakkerij, winkel of hotel beleefd binnen.',
    rules: [
      {
        title: 'Bonjour of salut?',
        explanation:
          "Bonjour is de veilige keuze: dat zeg je tegen iedereen, van de buurvrouw tot de conducteur, van 's ochtends tot een uur of zes. Salut is vertrouwelijk, zoals ons “hoi”, en bewaar je voor vrienden, klasgenoten en familie. Salut werkt trouwens twee kanten op: het betekent zowel hoi als doei.",
        examples: [
          { target: 'Bonjour, madame !', nl: 'Goedendag, mevrouw!' },
          { target: 'Salut, Marie !', nl: 'Hoi, Marie!' },
          { target: 'Au revoir, monsieur !', nl: 'Tot ziens, meneer!' },
        ],
      },
      {
        title: 'Ça va: vraag en antwoord tegelijk',
        explanation:
          'Ça va betekent letterlijk “het gaat”. Laat je je stem aan het eind omhoog gaan, dan is het een vraag; blijft je stem vlak, dan is het een antwoord. Het Frans draait dus geen woorden om zoals wij dat doen bij “gaat het?” — je verandert alleen je toon.',
        examples: [
          { target: 'Salut, ça va ?', nl: 'Hoi, gaat het?' },
          { target: 'Oui, ça va.', nl: 'Ja, het gaat.' },
          { target: 'Bonjour, ça va bien ?', nl: 'Goedendag, gaat het goed?' },
        ],
      },
      {
        title: 'Bien of bon?',
        explanation:
          'Bien zegt iets over hoe iets gáát of gebeurt en hoort dus bij een werkwoord: ça va bien. Bon beschrijft een ding of een persoon en hoort bij een zelfstandig naamwoord (een woord als koffie, brood, stad): le café est bon. Beide vertalen we in het Nederlands nogal eens met “goed”, maar in het Frans mag je ze niet omruilen.',
        examples: [
          { target: 'Ça va bien, merci.', nl: 'Het gaat goed, dank je.' },
          { target: 'Oui, ça va très bien.', nl: 'Ja, het gaat heel goed.' },
          { target: 'Le café est bon.', nl: 'De koffie is lekker.' },
        ],
      },
      {
        title: 'Madame en monsieur horen erbij',
        explanation:
          'Fransen plakken bijna automatisch madame of monsieur achter bonjour, merci en au revoir. Het is geen plechtige formaliteit maar gewone hoffelijkheid: zonder dat woordje klinkt je groet kortaf. Weet je niet of iemand madame of mademoiselle is? Madame is tegenwoordig altijd goed.',
        examples: [
          { target: 'Bonjour, madame !', nl: 'Goedendag, mevrouw!' },
          { target: 'Merci, monsieur !', nl: 'Dank u wel, meneer!' },
          { target: 'Au revoir, madame !', nl: 'Tot ziens, mevrouw!' },
        ],
      },
    ],
    phrases: [
      { target: 'Bonjour, madame !', nl: 'Goedendag, mevrouw!' },
      { target: 'Salut, ça va ?', nl: 'Hoi, gaat het?' },
      { target: 'Ça va bien, merci.', nl: 'Het gaat goed, dank je.' },
      { target: 'Oui, merci.', nl: 'Ja, dank je.' },
      { target: 'Non, merci.', nl: 'Nee, dank je.' },
      { target: 'Au revoir, monsieur !', nl: 'Tot ziens, meneer!' },
    ],
    tip:
      'Een Franse medeklinker aan het eind van een woord blijft meestal stil: salut klinkt als “salu”, non klinkt niet als onze n maar als een neusklank waarbij je de n niet echt afmaakt. En de j van bonjour is de zachte j van garage of jury, niet de sj van sjaal.',
  },

  'fr-u2': {
    intro:
      'Je bestelt in het café en op het terras: koffie, thee, brood, kaas en wijn. Je leert ook de beleefde vorm waarmee Fransen alles bestellen, zodat je niet klinkt alsof je iets eist.',
    rules: [
      {
        title: 'Un of une? Le of la?',
        explanation:
          'Elk Frans zelfstandig naamwoord (een woord als koffie, tafel of water) is mannelijk of vrouwelijk. Mannelijk krijgt un (een) en le (de), vrouwelijk krijgt une en la. Er zit weinig logica in, dus leer een nieuw woord altijd samen met zijn lidwoord: niet café maar un café. Voor een woord dat met een klinker begint worden le en la allebei l’, want twee klinkers achter elkaar spreekt lastig: l’eau.',
        examples: [
          { target: "Un café, s'il vous plaît.", nl: 'Een koffie, alstublieft.' },
          { target: 'Le croissant est bon.', nl: 'De croissant is lekker.' },
          { target: "L'eau, s'il vous plaît.", nl: 'Water, alstublieft.' },
        ],
      },
      {
        title: 'Je voudrais: beleefd bestellen',
        explanation:
          'Je voudrais betekent letterlijk “ik zou graag willen”. Het is de beleefde vorm van willen; het kortere je veux (ik wil) klinkt in een café net zo bot als bij ons “geef mij een koffie”. Je voudrais hoort bij ik: bij jij zeg je tu voudrais.',
        examples: [
          { target: 'Je voudrais un café.', nl: 'Ik wil graag een koffie.' },
          { target: 'Je voudrais un croissant.', nl: 'Ik wil graag een croissant.' },
          { target: "Un thé, s'il vous plaît.", nl: 'Een thee, alstublieft.' },
        ],
      },
      {
        title: 'Du, de la, de l’: een beetje van iets',
        explanation:
          'Wij zeggen gewoon “ik wil graag brood”, zonder woordje ervoor. Het Frans moet daar altijd iets neerzetten als het om een onbepaalde hoeveelheid gaat: du bij een mannelijk woord, de la bij een vrouwelijk woord en de l’ voor een klinker. Vertaal het maar als “wat” of “een beetje”.',
        examples: [
          { target: 'Je voudrais du pain.', nl: 'Ik wil graag brood.' },
          { target: 'Je voudrais du fromage.', nl: 'Ik wil graag kaas.' },
          { target: "Je voudrais de l'eau.", nl: 'Ik wil graag water.' },
        ],
      },
      {
        title: 'Bon of bonne?',
        explanation:
          'Bon (lekker, goed) past zich aan het woord aan waar het bij hoort. Bij een mannelijk woord blijft het bon, bij een vrouwelijk woord komt er een -e bij: bonne. Die extra -e hoor je ook: bon klinkt als een neusklank, bonne klinkt als “bon” met een duidelijke n.',
        examples: [
          { target: 'Le pain est bon.', nl: 'Het brood is lekker.' },
          { target: 'Le vin est très bon.', nl: 'De wijn is erg lekker.' },
          { target: "L'eau est bonne.", nl: 'Het water is lekker.' },
        ],
      },
    ],
    phrases: [
      { target: "Un café, s'il vous plaît.", nl: 'Een koffie, alstublieft.' },
      { target: 'Je voudrais un croissant.', nl: 'Ik wil graag een croissant.' },
      { target: "Je voudrais de l'eau.", nl: 'Ik wil graag water.' },
      { target: "Un café et un croissant, s'il vous plaît.", nl: 'Een koffie en een croissant, alstublieft.' },
      { target: 'Le vin est très bon.', nl: 'De wijn is erg lekker.' },
      { target: 'Merci beaucoup !', nl: 'Heel erg bedankt!' },
    ],
    tip:
      "S'il vous plaît gebruik je tegen onbekenden en in winkels; tegen vrienden en kinderen zeg je s'il te plaît. Laat het niet weg zoals wij vaak doen: een bestelling zonder s'il vous plaît en zonder bonjour vooraf komt in Frankrijk echt onbeleefd over.",
  },

  'fr-u3': {
    intro:
      'Je stelt jezelf voor en vertelt over je familie: je moeder, je vader, je broer, je zus en je vrienden. Precies de vragen die je in Frankrijk als eerste krijgt.',
    rules: [
      {
        title: 'Mon, ma of mes?',
        explanation:
          'Mon, ma en mes betekenen alle drie “mijn”. Welke je kiest hangt niet af van jou, maar van het woord dat erachter komt: mon bij een mannelijk woord, ma bij een vrouwelijk woord, mes bij meerdere. Mon père en ma mère hebben dus niets met de man of vrouw te maken die spreekt — le père is nu eenmaal mannelijk en la mère vrouwelijk.',
        examples: [
          { target: 'Voici mon père.', nl: 'Dit is mijn vader.' },
          { target: 'Voici ma mère.', nl: 'Dit is mijn moeder.' },
          { target: 'Mon frère et ma sœur.', nl: 'Mijn broer en mijn zus.' },
        ],
      },
      {
        title: 'Mon amie: waarom niet ma?',
        explanation:
          'Staat er een woord achter dat met een klinker begint, dan gebruik je mon — ook als dat woord vrouwelijk is. “Ma amie” zou je moeten uitspreken met twee klinkers tegen elkaar, en dat vermijdt het Frans consequent. Je hoort dan mooi mon-n-amie aan elkaar.',
        examples: [
          { target: "C'est mon amie Marie.", nl: 'Dat is mijn vriendin Marie.' },
          { target: "C'est mon ami Marc.", nl: 'Dat is mijn vriend Marc.' },
          { target: "Mon amie s'appelle Emma.", nl: 'Mijn vriendin heet Emma.' },
        ],
      },
      {
        title: "Je m'appelle: ik noem mezelf",
        explanation:
          "Je m'appelle betekent letterlijk “ik noem mij”. Het Frans zegt niet “ik heet”, maar draait het om: je noemt jezelf zo. Bij iemand anders verandert dat kleine woordje mee: il s'appelle (hij heet), elle s'appelle (zij heet), ma sœur s'appelle Emma.",
        examples: [
          { target: "Je m'appelle Paul.", nl: 'Ik heet Paul.' },
          { target: "Ma sœur s'appelle Julie.", nl: 'Mijn zus heet Julie.' },
          { target: "Mon frère s'appelle Marc.", nl: 'Mijn broer heet Marc.' },
        ],
      },
      {
        title: "J'ai un frère: hebben",
        explanation:
          "Avoir is het werkwoord hebben; bij ik wordt dat ai. Omdat je en ai allebei met een klinker botsen, plak je ze aan elkaar met een apostrof: j'ai. Achter j'ai kies je un of une naargelang het woord mannelijk of vrouwelijk is: un frère, une sœur.",
        examples: [
          { target: "J'ai un frère.", nl: 'Ik heb een broer.' },
          { target: "J'ai une sœur.", nl: 'Ik heb een zus.' },
          { target: "J'ai une grande famille.", nl: 'Ik heb een grote familie.' },
        ],
      },
    ],
    phrases: [
      { target: "Je m'appelle Emma.", nl: 'Ik heet Emma.' },
      { target: 'Voici mon père et ma mère.', nl: 'Dit zijn mijn vader en mijn moeder.' },
      { target: "J'ai un frère et une sœur.", nl: 'Ik heb een broer en een zus.' },
      { target: "C'est mon ami Marc.", nl: 'Dat is mijn vriend Marc.' },
      { target: 'Ma famille est grande.', nl: 'Mijn familie is groot.' },
      { target: "Ma sœur s'appelle Julie.", nl: 'Mijn zus heet Julie.' },
    ],
    tip:
      'Let op met mon ami: dat kan ook “mijn vriendje” betekenen, dus je partner. Wil je duidelijk maken dat het gewoon een vriend is, zeg dan c’est un ami. En de letter œ in sœur is één teken; kun je hem niet typen, dan is soeur overal geaccepteerd.',
  },

  'fr-u4': {
    intro:
      'Je vindt je weg in een Franse stad: het station, de metro, een straat, een museum. Je leert vragen waar iets is en begrijpen of het links of rechts ligt.',
    rules: [
      {
        title: 'Où est… ? — de weg vragen',
        explanation:
          'Een vraag naar een plek bouw je heel simpel: où (waar) + est (is) + het ding, precies in die volgorde. Het lidwoord laat je nooit weg: je zegt où est la gare, nooit “où est gare”. In geschreven Frans zet je bovendien een spatie vóór het vraagteken.',
        examples: [
          { target: 'Où est la gare ?', nl: 'Waar is het station?' },
          { target: 'Où est le musée ?', nl: 'Waar is het museum?' },
          { target: "Où est le métro, s'il vous plaît ?", nl: 'Waar is de metro, alstublieft?' },
        ],
      },
      {
        title: 'Est, es of et?',
        explanation:
          'Est en es klinken precies hetzelfde, en et scheelt daar zo weinig van dat je oor je nauwelijks helpt. Toch doen ze iets heel anders: est is de hij/zij-vorm van zijn (la gare est…), es hoort bij tu (tu es), en et betekent gewoon “en”. Bij het schrijven moet je dus denken aan de betekenis.',
        examples: [
          { target: 'La gare est à gauche.', nl: 'Het station is links.' },
          { target: 'Le musée est à droite.', nl: 'Het museum is rechts.' },
          { target: 'La rue est à gauche et le métro est à droite.', nl: 'De straat is links en de metro is rechts.' },
        ],
      },
      {
        title: 'À: het woordje voor plaatsen en richtingen',
        explanation:
          'À vertaal je afhankelijk van de zin als in, naar, op of te. Bij steden gebruik je altijd à: à Paris, à Lyon. En het zit vast in de richtingen: à gauche (links) en à droite (rechts) schrijf je nooit zonder à.',
        examples: [
          { target: 'Le musée est à Paris.', nl: 'Het museum is in Parijs.' },
          { target: 'La rue est à gauche.', nl: 'De straat is links.' },
          { target: 'Le métro est à droite.', nl: 'De metro is rechts.' },
        ],
      },
      {
        title: 'La gare est grande',
        explanation:
          'Een beschrijvend woord zoals grand (groot) past zich aan bij het woord waar het over gaat. Bij een vrouwelijk woord komt er een -e achter: la gare est grande, la ville est grande. Bij een mannelijk woord blijft het grand: le musée est grand. Een enkel woord verandert meer dan alleen die -e: beau (mooi) wordt bij een vrouwelijk woord belle, zoals in une belle ville.',
        examples: [
          { target: 'La gare est grande.', nl: 'Het station is groot.' },
          { target: 'Le musée est grand.', nl: 'Het museum is groot.' },
          { target: 'Paris est une belle ville.', nl: 'Parijs is een mooie stad.' },
        ],
      },
    ],
    phrases: [
      { target: 'Où est la gare ?', nl: 'Waar is het station?' },
      { target: "Où est le métro, s'il vous plaît ?", nl: 'Waar is de metro, alstublieft?' },
      { target: 'La gare est à gauche.', nl: 'Het station is links.' },
      { target: 'Le musée est à droite.', nl: 'Het museum is rechts.' },
      { target: 'Je prends le métro.', nl: 'Ik neem de metro.' },
      { target: 'Paris est une belle ville.', nl: 'Parijs is een mooie stad.' },
    ],
    tip:
      'Où (waar) en ou (of) klinken identiek; alleen dat streepje op de u maakt het verschil, dus vergeet het niet als je schrijft. En begin een vraag aan een vreemde nooit koud met Où est… : plak er eerst bonjour of excusez-moi voor, anders klink je in Franse oren behoorlijk bruusk.',
  },

  'fr-u5': {
    intro:
      'Je telt tot tien en zegt hoe laat het is. Daarmee kun je bestellen met aantallen, een afspraak maken en begrijpen wanneer je trein vertrekt.',
    rules: [
      {
        title: 'Hoe laat is het? Il est + uur',
        explanation:
          'De tijd begin je altijd met il est, letterlijk “het is”. Daarna komt het getal en dan heures. Vanaf twee uur krijgt heures een -s, want het zijn er meer dan één; bij één uur zeg je il est une heure (heure is vrouwelijk, dus une). Twaalf uur ’s middags heeft een eigen woord: midi.',
        examples: [
          { target: 'Il est trois heures.', nl: 'Het is drie uur.' },
          { target: 'Il est une heure.', nl: 'Het is één uur.' },
          { target: 'Il est midi.', nl: 'Het is twaalf uur.' },
        ],
      },
      {
        title: 'Quelle heure est-il ?',
        explanation:
          'Om naar de tijd te vragen draai je het werkwoord en het onderwerp om en verbind je ze met een streepje: est-il. Letterlijk staat er “welk uur is het”. Deze omdraaiing heet inversie; het is de nette manier om een vraag te stellen.',
        examples: [
          { target: 'Quelle heure est-il ?', nl: 'Hoe laat is het?' },
          { target: 'Quelle heure est-il, madame ?', nl: 'Hoe laat is het, mevrouw?' },
        ],
      },
      {
        title: "'s Ochtends = le matin",
        explanation:
          "Waar wij een apart woordje maken (’s ochtends, ’s avonds), zet het Frans er gewoon het lidwoord le voor: le matin, le soir. Er komt géén extra woordje bij, dus niet “à le matin”. Je kunt het vooraan of achteraan in de zin zetten.",
        examples: [
          { target: 'Le matin, je prends un café.', nl: "'s Ochtends neem ik een koffie." },
          { target: 'Le soir, je prends un thé.', nl: "'s Avonds neem ik een thee." },
          { target: 'Je prends le métro le matin.', nl: "Ik neem 's ochtends de metro." },
        ],
      },
      {
        title: 'Getallen die aan het volgende woord plakken',
        explanation:
          'De laatste letter van een getal blijft stil vóór een medeklinker, maar komt tot leven vóór een klinker en plakt dan aan het volgende woord. Deux frères klinkt als “deu frèr”, maar deux heures klinkt als “deu-zeur”. Dat aan elkaar plakken heet liaison en gebeurt in het Frans overal.',
        examples: [
          { target: "J'ai deux frères.", nl: 'Ik heb twee broers.' },
          { target: 'Il est deux heures.', nl: 'Het is twee uur.' },
          { target: 'Il est dix heures.', nl: 'Het is tien uur.' },
        ],
      },
    ],
    phrases: [
      { target: 'Quelle heure est-il ?', nl: 'Hoe laat is het?' },
      { target: 'Il est midi.', nl: 'Het is twaalf uur.' },
      { target: 'Il est dix heures.', nl: 'Het is tien uur.' },
      { target: "Trois cafés, s'il vous plaît.", nl: 'Drie koffie, alstublieft.' },
      { target: 'Le matin, je prends un café.', nl: "'s Ochtends neem ik een koffie." },
      { target: 'Le soir, je prends le métro.', nl: "'s Avonds neem ik de metro." },
    ],
    tip:
      'Pas op met “half”. Ons half drie betekent 14.30 uur, maar het Frans telt vanaf het hele uur: deux heures et demie is letterlijk “twee uur en een half”, dus ook 14.30. Vertaal je ons half drie als trois heures et demie, dan sta je er een uur te laat.',
  },

  'fr-u6': {
    intro:
      'Je doet boodschappen op de markt: fruit, groenten, prijzen vragen en zeggen dat iets te duur is. Handig, want op een Franse markt onderhandelen hoort erbij.',
    rules: [
      {
        title: 'Des: het meervoud van un en une',
        explanation:
          'In het Nederlands zeg je “ik koop groenten”, zonder woordje ervoor. Het Frans zet daar altijd des neer: j’achète des légumes. Des is simpelweg het meervoud van un en une, en je laat het nooit weg — ook al voelt dat voor ons als een woord te veel.',
        examples: [
          { target: 'Je voudrais des légumes.', nl: 'Ik wil graag groenten.' },
          { target: "J'achète des fruits.", nl: 'Ik koop fruit.' },
          { target: "Des croissants, s'il vous plaît.", nl: 'Croissants, alstublieft.' },
        ],
      },
      {
        title: 'À + le wordt au',
        explanation:
          'Het Frans laat à en le nooit naast elkaar staan: samen worden ze au. Dus au marché (op de markt), maar à la gare blijft gewoon à la, want daar is niets om samen te trekken. Voor een klinker gebruik je à l’: à l’école.',
        examples: [
          { target: "J'achète du pain au marché.", nl: 'Ik koop brood op de markt.' },
          { target: 'Le marché est à gauche.', nl: 'De markt is links.' },
          { target: 'Je prends un café à la gare.', nl: 'Ik neem een koffie op het station.' },
        ],
      },
      {
        title: 'Hoeveel kost het?',
        explanation:
          'Er zijn twee gewone manieren: c’est combien (letterlijk “het is hoeveel”) en ça coûte combien (“het kost hoeveel”). Bij één ding krijgt coûter de uitgang -e: ça coûte. Gaat het om meerdere dingen, dan wordt dat -ent: les légumes coûtent — die uitgang schrijf je wel, maar hoor je niet.',
        examples: [
          { target: "C'est combien, le fromage ?", nl: 'Hoeveel kost de kaas?' },
          { target: 'Ça coûte deux euros.', nl: 'Het kost twee euro.' },
          { target: 'Les légumes coûtent cinq euros.', nl: 'De groenten kosten vijf euro.' },
        ],
      },
      {
        title: 'Trop cher: te duur',
        explanation:
          'Trop betekent “te” en zet je vlak vóór het beschrijvende woord: trop cher, trop grand. Cher past zich net als andere beschrijvende woorden aan: bij een vrouwelijk woord wordt het chère — er komt een -e achter en de e ervóór krijgt een accentstreepje. Uitspreken doe je cher en chère precies hetzelfde.',
        examples: [
          { target: "C'est trop cher !", nl: 'Dat is te duur!' },
          { target: 'Le fromage est cher.', nl: 'De kaas is duur.' },
          { target: 'La maison est chère.', nl: 'Het huis is duur.' },
        ],
      },
    ],
    phrases: [
      { target: "C'est combien, le fromage ?", nl: 'Hoeveel kost de kaas?' },
      { target: 'Ça coûte deux euros.', nl: 'Het kost twee euro.' },
      { target: "C'est trop cher !", nl: 'Dat is te duur!' },
      { target: "Je voudrais des légumes, s'il vous plaît.", nl: 'Ik wil graag groenten, alstublieft.' },
      { target: "J'achète du pain au marché.", nl: 'Ik koop brood op de markt.' },
      { target: 'Le marché est à gauche.', nl: 'De markt is links.' },
    ],
    tip:
      'Cher heeft twee betekenissen: duur, maar aan het begin van een brief of mailtje betekent het “beste” of “lieve” (Cher Marc). Uit de zin blijkt altijd welke je nodig hebt. En het slot van combien is een neusklank: je zegt geen n, je laat de lucht door je neus ontsnappen.',
  },

  'fr-u7': {
    intro:
      'Je vertelt waar je woont en beschrijft je huis: de keuken, de slaapkamer, de tafel, de deur en het raam. Ook leer je zeggen waar iets ligt of staat.',
    rules: [
      {
        title: "J'habite à Paris: wonen in",
        explanation:
          "Habiter is wonen. Bij ik wordt dat j'habite: de e van je verdwijnt, want habite begint eigenlijk met een klinker (de h spreek je in het Frans niet uit). Woon je in een stad, dan gebruik je à; gaat het om het gebouw zelf, dan dans: dans une grande maison.",
        examples: [
          { target: "J'habite à Paris.", nl: 'Ik woon in Parijs.' },
          { target: "J'habite dans une grande maison.", nl: 'Ik woon in een groot huis.' },
          { target: 'Ma sœur habite à Nice.', nl: 'Mijn zus woont in Nice.' },
        ],
      },
      {
        title: 'Sur, dans, sous',
        explanation:
          'Deze drie zeggen waar iets zich bevindt: sur is op, dans is in, sous is onder. Ze staan altijd vóór het lidwoord: sur la table, dans la cuisine. Onthoud vooral het verschil tussen sur (op een oppervlak) en sous (eronder), want die twee lijken op papier sterk op elkaar.',
        examples: [
          { target: 'Le pain est sur la table.', nl: 'Het brood ligt op tafel.' },
          { target: 'La chaise est dans la cuisine.', nl: 'De stoel staat in de keuken.' },
          { target: "L'eau est sur la table.", nl: 'Het water staat op tafel.' },
        ],
      },
      {
        title: 'Grande of grand? Petite of petit?',
        explanation:
          'Bij een vrouwelijk woord krijgt een beschrijvend woord een -e erachter, en die -e verandert ook de klank. Grand klinkt als “gran” zonder d, maar grande laat de d duidelijk horen. Hetzelfde gebeurt bij petit (“peti”) en petite (“petiet”).',
        examples: [
          { target: 'Ma maison est grande.', nl: 'Mijn huis is groot.' },
          { target: 'La cuisine est petite.', nl: 'De keuken is klein.' },
          { target: 'Le musée est grand.', nl: 'Het museum is groot.' },
        ],
      },
      {
        title: 'Une grande maison: waar staat het beschrijvende woord?',
        explanation:
          'Anders dan bij ons komt een beschrijvend woord in het Frans meestal achter het zelfstandig naamwoord: la musique française, une ville magnifique. Maar een klein groepje veelgebruikte korte woorden staat er juist vóór, net als in het Nederlands: grand, petit, beau, bon en joli. Die uitzonderingen kom je zo vaak tegen dat ze snel vertrouwd zijn. In une grande maison zie je alles samenkomen: maison is vrouwelijk, dus wordt het une én grande.',
        examples: [
          { target: "J'habite dans une grande maison.", nl: 'Ik woon in een groot huis.' },
          { target: 'Paris est une belle ville.', nl: 'Parijs is een mooie stad.' },
          { target: "J'aime la musique française.", nl: 'Ik hou van Franse muziek.' },
        ],
      },
    ],
    phrases: [
      { target: "J'habite à Paris.", nl: 'Ik woon in Parijs.' },
      { target: 'Ma maison est grande.', nl: 'Mijn huis is groot.' },
      { target: 'La cuisine est petite.', nl: 'De keuken is klein.' },
      { target: 'Le pain est sur la table.', nl: 'Het brood ligt op tafel.' },
      { target: 'La porte est à droite.', nl: 'De deur is rechts.' },
      { target: 'La fenêtre est grande.', nl: 'Het raam is groot.' },
    ],
    tip:
      "De h aan het begin van een Frans woord spreek je niet uit: habiter klinkt als “abiteer” en j'habite als “zjabiet”. Nederlanders blazen die h uit gewoonte toch. Let ook op la chambre: dat is specifiek de slaapkamer, niet zomaar een kamer — een kamer in het algemeen is une pièce.",
  },

  'fr-u8': {
    intro:
      'Je vertelt wat je doet: werken, studeren, waar je kantoor of school is en wat je beroep is. Hiermee kun je een gesprek over jezelf een stuk verder brengen.',
    rules: [
      {
        title: 'Werkwoorden op -er: je travaille, tu travailles, vous travaillez',
        explanation:
          'De grootste groep Franse werkwoorden eindigt op -er (travailler, parler, étudier). Je haalt die -er eraf en plakt er een uitgang aan: je -e, tu -es, il/elle -e, nous -ons, vous -ez, ils -ent. Het rare is dat je travaille, tu travailles en il travaille exact hetzelfde klinken; het verschil zie je alleen op papier.',
        examples: [
          { target: 'Je travaille au bureau.', nl: 'Ik werk op kantoor.' },
          { target: 'Tu travailles le soir ?', nl: "Werk jij 's avonds?" },
          { target: 'Vous travaillez à Paris ?', nl: 'Werkt u in Parijs?' },
        ],
      },
      {
        title: 'Ma sœur est médecin: een beroep zonder lidwoord',
        explanation:
          'Na het werkwoord zijn laat het Frans un en une weg bij beroepen. Je zegt dus elle est médecin, niet “elle est une médecin”. Gelukkig doet het Nederlands precies hetzelfde: wij zeggen ook “zij is dokter”, zonder “een”.',
        examples: [
          { target: 'Ma mère est médecin.', nl: 'Mijn moeder is dokter.' },
          { target: 'Mon père est professeur.', nl: 'Mijn vader is leraar.' },
          { target: 'Ma sœur est médecin.', nl: 'Mijn zus is dokter.' },
        ],
      },
      {
        title: 'Le français: talen krijgen een lidwoord',
        explanation:
          'Bij talen, schoolvakken en dingen die je in het algemeen bedoelt, zet het Frans le of la ervoor waar wij niets zetten: j’étudie le français, j’aime la musique. Na parler (spreken) laat je het bij een taal juist weg: je parle français. Namen van talen krijgen bovendien geen hoofdletter, anders dan bij ons.',
        examples: [
          { target: "J'étudie le français.", nl: 'Ik studeer Frans.' },
          { target: "J'aime la musique.", nl: 'Ik hou van muziek.' },
          { target: 'Je parle français.', nl: 'Ik spreek Frans.' },
        ],
      },
      {
        title: 'Au bureau of dans un bureau?',
        explanation:
          'Au bureau betekent “op kantoor” in het algemeen: daar ben je aan het werk. Dans un bureau wijst op de ruimte of het gebouw zelf: binnen in een kantoor. Hetzelfde verschil zie je bij à l’école (op school) en dans l’école (in het schoolgebouw).',
        examples: [
          { target: 'Je travaille au bureau.', nl: 'Ik werk op kantoor.' },
          { target: 'Je travaille dans un bureau à Paris.', nl: 'Ik werk op een kantoor in Parijs.' },
          { target: "J'étudie à l'école.", nl: 'Ik studeer op school.' },
        ],
      },
    ],
    phrases: [
      { target: 'Je travaille à Paris.', nl: 'Ik werk in Parijs.' },
      { target: "J'étudie le français.", nl: 'Ik studeer Frans.' },
      { target: 'Mon travail est intéressant.', nl: 'Mijn werk is interessant.' },
      { target: 'Ma mère est médecin.', nl: 'Mijn moeder is dokter.' },
      { target: "L'école est à gauche.", nl: 'De school is links.' },
      { target: 'Le livre est sur la table.', nl: 'Het boek ligt op tafel.' },
    ],
    tip:
      'Le professeur is gewoon de leraar of lerares, ook op de middelbare school — het is dus geen professor aan de universiteit. En le bureau betekent zowel het bureau (het meubel) als het kantoor; welke van de twee je bedoelt, blijkt uit de zin.',
  },

  'fr-u9': {
    intro:
      'Je houdt een echt gesprek gaande: je vertelt wat je vandaag en morgen doet, stelt vragen en geeft antwoord met een reden. Hier leer je hoe een Franse zin in elkaar zit.',
    rules: [
      {
        title: 'Vragen stellen zonder iets om te draaien',
        explanation:
          'In alledaags gesproken Frans laat je de zin gewoon staan en ga je met je stem omhoog: tu parles français ? Het vraagwoord mag je zelfs achteraan zetten: tu travailles quand ? Alleen in nette, geschreven taal draai je om (quand travailles-tu ?), maar dat hoef je zelf nog niet te doen. Let wel op de tu-vorm: bij werkwoorden op -er krijgt die altijd een -s die je niet uitspreekt — tu parles, tu travailles, ook in een vraag.',
        examples: [
          { target: 'Tu travailles quand ?', nl: 'Wanneer werk je?' },
          { target: 'Pourquoi tu travailles le soir ?', nl: "Waarom werk je 's avonds?" },
          { target: 'Tu parles français ?', nl: 'Spreek je Frans?' },
        ],
      },
      {
        title: 'Pourquoi vraagt, parce que antwoordt',
        explanation:
          'Op een vraag met pourquoi (waarom) hoort een antwoord met parce que (omdat). Daarna komt een hele zin, met onderwerp en werkwoord. Begint dat volgende woord met een klinker, dan wordt het parce qu’: parce qu’il est malade.',
        examples: [
          { target: 'Pourquoi tu travailles le soir ?', nl: "Waarom werk je 's avonds?" },
          { target: 'Parce que le café est bon !', nl: 'Omdat de koffie lekker is!' },
          { target: "Parce que j'aime mon travail.", nl: 'Omdat ik van mijn werk hou.' },
        ],
      },
      {
        title: 'Het onderwerp blijft vooraan',
        explanation:
          'Zet je in het Nederlands een tijdsbepaling vooraan, dan verhuist het werkwoord naar plek twee: “Vandaag werk ik.” Het Frans doet dat níét. Daar blijft de volgorde altijd onderwerp + werkwoord, ook na aujourd’hui, demain of le soir. Je zegt dus aujourd’hui, je travaille — nooit “aujourd’hui travaille je”.',
        examples: [
          { target: "Aujourd'hui, je travaille au bureau.", nl: 'Vandaag werk ik op kantoor.' },
          { target: 'Demain, je parle avec ma sœur.', nl: 'Morgen spreek ik met mijn zus.' },
          { target: 'Le soir, je prends un thé.', nl: "'s Avonds neem ik een thee." },
        ],
      },
      {
        title: 'Avec, et en aussi',
        explanation:
          'Avec betekent “met”, in de zin van samen met iemand of iets. Et is “en” en verbindt twee dingen. Aussi betekent “ook” en zet je achter het werkwoord of aan het eind van de zin, niet vooraan zoals wij soms doen.',
        examples: [
          { target: 'Je travaille avec ma sœur.', nl: 'Ik werk met mijn zus.' },
          { target: 'Je parle français et néerlandais.', nl: 'Ik spreek Frans en Nederlands.' },
          { target: 'Ma sœur parle aussi français.', nl: 'Mijn zus spreekt ook Frans.' },
        ],
      },
    ],
    phrases: [
      { target: "Aujourd'hui, je travaille.", nl: 'Vandaag werk ik.' },
      { target: "Demain, j'étudie à la maison.", nl: 'Morgen studeer ik thuis.' },
      { target: 'Je parle français et néerlandais.', nl: 'Ik spreek Frans en Nederlands.' },
      { target: 'Tu travailles quand ?', nl: 'Wanneer werk je?' },
      { target: 'Parce que le café est bon !', nl: 'Omdat de koffie lekker is!' },
      { target: 'Je prends un café avec mon ami.', nl: 'Ik drink een koffie met mijn vriend.' },
    ],
    tip:
      "Aujourd'hui ziet er wild uit, maar je zegt gewoon “o-zjoer-dwie”. De apostrof hoort er echt bij: aujourd hui zonder apostrof is fout. Denk er ook aan dat parce que altijd twee woorden zijn.",
  },

  'fr-u10': {
    intro:
      'Je reist met trein en vliegtuig: een kaartje kopen, weten hoe laat je vertrekt en zeggen waar je aankomt. Hiermee red je je op elk Frans station en vliegveld.',
    rules: [
      {
        title: 'Un billet pour Paris',
        explanation:
          'Bij een bestemming van een kaartje of een trein gebruik je pour: un billet pour Paris, le train pour Lyon. Gaat het erom waar iemand ís of aankomt, dan gebruik je à: l’avion arrive à Nice. Kort gezegd: pour wijst vooruit naar het doel, à wijst naar de plek zelf.',
        examples: [
          { target: 'Je voudrais un billet pour Paris.', nl: 'Ik wil graag een kaartje naar Parijs.' },
          { target: 'Le train pour Lyon part à dix heures.', nl: 'De trein naar Lyon vertrekt om tien uur.' },
          { target: "L'avion arrive à Nice.", nl: 'Het vliegtuig komt aan in Nice.' },
        ],
      },
      {
        title: 'Partir: een werkwoord dat zijn eigen gang gaat',
        explanation:
          'Niet elk werkwoord volgt het nette rijtje van de -er-werkwoorden. Partir (vertrekken) gaat zo: je pars, tu pars, il/elle part, nous partons, vous partez, ils partent. De laatste letters hoor je niet, dus pars en part klinken hetzelfde — je moet vooral weten welke vorm je opschrijft.',
        examples: [
          { target: 'Le train part à neuf heures.', nl: 'De trein vertrekt om negen uur.' },
          { target: 'Je pars demain.', nl: 'Ik vertrek morgen.' },
          { target: 'Nous partons à midi.', nl: 'Wij vertrekken om twaalf uur.' },
        ],
      },
      {
        title: 'Nous arrivons: de wij-vorm op -ons',
        explanation:
          'Arriver (aankomen) is wel een gewoon -er-werkwoord. Bij nous (wij) haal je -er weg en zet je -ons erachter: nous arrivons. Die uitgang hoor je duidelijk, anders dan bij de andere vormen, en hij werkt bij bijna elk werkwoord: nous parlons, nous travaillons.',
        examples: [
          { target: 'Nous arrivons à la gare.', nl: 'Wij komen aan op het station.' },
          { target: "Nous arrivons à l'aéroport.", nl: 'Wij komen aan op het vliegveld.' },
          { target: 'Nous prenons le métro.', nl: 'Wij nemen de metro.' },
        ],
      },
      {
        title: 'À betekent ook “om”',
        explanation:
          'Naast in of naar gebruik je à voor een tijdstip: à dix heures betekent om tien uur. De opbouw is altijd hetzelfde: werkwoord + à + getal + heures. Zo lees je moeiteloos elk Frans vertrekbord.',
        examples: [
          { target: 'Le train part à dix heures.', nl: 'De trein vertrekt om tien uur.' },
          { target: "L'avion arrive à midi.", nl: 'Het vliegtuig komt om twaalf uur aan.' },
          { target: 'Le film commence à huit heures.', nl: 'De film begint om acht uur.' },
        ],
      },
    ],
    phrases: [
      { target: 'Je voudrais un billet pour Paris.', nl: 'Ik wil graag een kaartje naar Parijs.' },
      { target: 'Le train part à dix heures.', nl: 'De trein vertrekt om tien uur.' },
      { target: "Où est l'aéroport ?", nl: 'Waar is het vliegveld?' },
      { target: 'Ma valise est dans le train.', nl: 'Mijn koffer is in de trein.' },
      { target: 'Nous arrivons à la gare.', nl: 'Wij komen aan op het station.' },
      { target: 'Le voyage à Paris est long.', nl: 'De reis naar Parijs is lang.' },
    ],
    tip:
      'De dubbele l na een i klinkt in het Frans als een j: billet zeg je als “bi-jee”, en zo gaan ook famille en travailler. Een paar woorden houden zich er niet aan, en juist die ken je al: ville en mille spreek je uit met een gewone l, dus “vil” en “mil”.',
  },

  'fr-u11': {
    intro:
      'Je vertelt hoe je je voelt en waar je pijn hebt, en je vindt de weg naar de dokter of de apotheek. Precies de woorden die je op vakantie het hardst nodig hebt als er iets misgaat.',
    rules: [
      {
        title: "J'ai mal à… — pijn hébben",
        explanation:
          'Wij maken één woord van hoofd en pijn: hoofdpijn. Het Frans zegt letterlijk “ik heb pijn aan het hoofd”: j’ai mal à la tête. Let op dat het lichaamsdeel het gewone lidwoord krijgt (la tête), niet “mijn” zoals bij ons.',
        examples: [
          { target: "J'ai mal à la tête.", nl: 'Ik heb hoofdpijn.' },
          { target: "J'ai mal au ventre.", nl: 'Ik heb buikpijn.' },
          { target: 'Ma jambe me fait mal.', nl: 'Mijn been doet pijn.' },
        ],
      },
      {
        title: 'À la, au of aux?',
        explanation:
          'Welke vorm je kiest, hangt af van het lidwoord dat erachter hoort. À + la blijft à la (à la tête), à + le wordt samengetrokken tot au (au ventre) en à + les wordt aux bij meerdere dingen (aux jambes). Voor een klinker gebruik je à l’.',
        examples: [
          { target: "J'ai mal aux jambes.", nl: 'Ik heb pijn aan mijn benen.' },
          { target: 'Je vais à la pharmacie.', nl: 'Ik ga naar de apotheek.' },
          { target: 'Il travaille au bureau.', nl: 'Hij werkt op kantoor.' },
        ],
      },
      {
        title: 'Chez: bij een persoon',
        explanation:
          'Ga je naar een plaats, dan gebruik je à: à la pharmacie. Maar ga je naar iemand toe — naar zijn praktijk, huis of winkel — dan gebruik je chez: chez le médecin, chez ma mère. Chez moi betekent bij mij thuis.',
        examples: [
          { target: 'Je vais chez le médecin.', nl: 'Ik ga naar de dokter.' },
          { target: 'Demain, je vais chez ma mère.', nl: 'Morgen ga ik naar mijn moeder.' },
          { target: 'Je vais à la pharmacie.', nl: 'Ik ga naar de apotheek.' },
        ],
      },
      {
        title: 'Fatigué of fatiguée?',
        explanation:
          'Woorden die iets over jou zeggen, passen zich aan jou aan. Een man schrijft je suis fatigué, een vrouw schrijft je suis fatiguée met een extra -e; horen doe je het verschil niet. Malade (ziek) eindigt al op een -e en verandert dus niet: mon frère est malade én ma sœur est malade.',
        examples: [
          { target: 'Je suis fatigué.', nl: 'Ik ben moe.' },
          { target: "Ma mère est fatiguée aujourd'hui.", nl: 'Mijn moeder is moe vandaag.' },
          { target: 'Mon frère est malade.', nl: 'Mijn broer is ziek.' },
        ],
      },
    ],
    phrases: [
      { target: "J'ai mal à la tête.", nl: 'Ik heb hoofdpijn.' },
      { target: "J'ai mal au ventre.", nl: 'Ik heb buikpijn.' },
      { target: 'Je suis malade.', nl: 'Ik ben ziek.' },
      { target: 'Je suis fatigué ce soir.', nl: 'Ik ben moe vanavond.' },
      { target: 'Je vais chez le médecin.', nl: 'Ik ga naar de dokter.' },
      { target: 'Où est la pharmacie ?', nl: 'Waar is de apotheek?' },
    ],
    tip:
      'Le médecin lijkt op ons “medicijn”, maar het is de dókter. Een medicijn is un médicament, en la médecine is het vak geneeskunde. Vraag je in een Franse apotheek om un médecin, dan vraag je dus of ze een arts voor je hebben.',
  },

  'fr-u12': {
    intro:
      'Je praat over het weer en de seizoenen — het gesprek dat in Frankrijk net zo goed werkt als bij ons om een stilte te vullen. Je leert de vaste constructies die Fransen daarvoor gebruiken.',
    rules: [
      {
        title: 'Het weer “doet”: il fait beau',
        explanation:
          'Voor het weer gebruikt het Frans faire (doen, maken): il fait beau, il fait froid, il fait chaud. Die il verwijst naar niemand, net als het Nederlandse “het” in “het regent”. Zeg dus niet il est froid voor het weer — dat zou over een voorwerp gaan dat koud aanvoelt.',
        examples: [
          { target: 'Il fait beau ce matin.', nl: 'Het is mooi weer vanochtend.' },
          { target: 'Il fait froid ce soir.', nl: 'Het is koud vanavond.' },
          { target: 'Il fait chaud en été.', nl: 'Het is warm in de zomer.' },
        ],
      },
      {
        title: 'Il pleut: één woord voor “het regent”',
        explanation:
          'Sommige weerwerkwoorden bestaan alleen in de il-vorm, want er is geen persoon die het doet: il pleut (het regent), il neige (het sneeuwt). Naast il neige heb je het woord la neige (de sneeuw). De zon doet wél zelf iets: briller (schijnen) is een gewoon werkwoord op -er, dus achter le soleil krijgt het de uitgang -e: le soleil brille.',
        examples: [
          { target: "Il pleut à Paris aujourd'hui.", nl: 'Het regent vandaag in Parijs.' },
          { target: 'Il neige en hiver.', nl: 'Het sneeuwt in de winter.' },
          { target: 'Le soleil brille.', nl: 'De zon schijnt.' },
        ],
      },
      {
        title: 'En été, en hiver — maar au printemps',
        explanation:
          'Bij seizoenen gebruik je en: en été (in de zomer), en automne (in de herfst), en hiver (in de winter). Eén seizoen doet niet mee: de lente krijgt au printemps. Dat is puur gewoonte, dus die ene onthoud je apart.',
        examples: [
          { target: 'En été, il fait chaud.', nl: 'In de zomer is het warm.' },
          { target: 'En hiver, il fait froid.', nl: 'In de winter is het koud.' },
          { target: 'Au printemps, il fait beau.', nl: 'In de lente is het mooi weer.' },
        ],
      },
      {
        title: 'Ce matin, ce soir: vanochtend en vanavond',
        explanation:
          'Zet ce vóór een deel van de dag en je krijgt “deze”, oftewel vandaag: ce matin (vanochtend), ce soir (vanavond). Vergelijk het met le matin, dat juist “elke ochtend” of “’s ochtends in het algemeen” betekent. Eén klein woordje verschil, twee heel andere betekenissen.',
        examples: [
          { target: 'Il fait beau ce matin.', nl: 'Het is mooi weer vanochtend.' },
          { target: 'Ce soir, je prends un thé.', nl: 'Vanavond neem ik een thee.' },
          { target: 'Le matin, je prends un café.', nl: "'s Ochtends neem ik een koffie." },
        ],
      },
    ],
    phrases: [
      { target: "Il fait beau aujourd'hui.", nl: 'Het is mooi weer vandaag.' },
      { target: 'Il fait froid ce soir.', nl: 'Het is koud vanavond.' },
      { target: 'Il pleut à Paris.', nl: 'Het regent in Parijs.' },
      { target: 'Le soleil brille.', nl: 'De zon schijnt.' },
      { target: 'En été, il fait chaud.', nl: 'In de zomer is het warm.' },
      { target: 'La neige est belle en hiver.', nl: 'De sneeuw is mooi in de winter.' },
    ],
    tip:
      'Warm en koud hebben in het Frans drie verschillende constructies. Het weer: il fait chaud (het is warm). Jijzelf: j’ai chaud (ik heb het warm, letterlijk “ik heb warm”). Een ding: le café est chaud (de koffie is heet). Zeg je je suis chaud, dan zeg je iets heel anders dan je bedoelt.',
  },

  'fr-u13': {
    intro:
      'Je maakt plannen voor een avondje uit: bioscoop, theater, restaurant of concert. Je leert ook hoe je zegt wat je leuk vindt om te doen.',
    rules: [
      {
        title: 'Aller: gaan',
        explanation:
          'Aller is onmisbaar en volgt geen enkel patroon: je vais, tu vas, il/elle/on va, nous allons, vous allez, ils vont. Erachter komt de plek met à: au cinéma (want à + le wordt au), à la gare, à l’école. Bij een persoon gebruik je in plaats daarvan chez.',
        examples: [
          { target: 'Je vais au cinéma.', nl: 'Ik ga naar de bioscoop.' },
          { target: 'Nous allons au restaurant.', nl: 'Wij gaan naar het restaurant.' },
          { target: 'Elle va au concert ce soir.', nl: 'Zij gaat vanavond naar het concert.' },
        ],
      },
      {
        title: 'On betekent gewoon “we”',
        explanation:
          'In gesproken Frans zeggen mensen zelden nous; ze zeggen on. On va au cinéma betekent dus “we gaan naar de bioscoop”. Het handige is dat on altijd de hij/zij-vorm van het werkwoord krijgt, dus de kortste vorm die je toch al kent: on va, on parle, on arrive.',
        examples: [
          { target: 'On va au cinéma ce soir ?', nl: 'Gaan we vanavond naar de bioscoop?' },
          { target: 'On parle français à la maison.', nl: 'Wij spreken thuis Frans.' },
          { target: 'En hiver, on va au théâtre.', nl: 'In de winter gaan we naar het theater.' },
        ],
      },
      {
        title: "J'aime danser: twee werkwoorden achter elkaar",
        explanation:
          'Na aimer (houden van) komt het tweede werkwoord in zijn hele vorm, de vorm die in het woordenboek staat: j’aime danser, j’aime chanter. Wij zeggen “ik dans graag”, het Frans zegt letterlijk “ik hou van dansen”. Volgt er geen werkwoord maar een ding, dan komt het lidwoord er wél bij: j’aime la musique.',
        examples: [
          { target: "J'aime danser avec mes amis.", nl: 'Ik dans graag met mijn vrienden.' },
          { target: "J'aime chanter.", nl: 'Ik zing graag.' },
          { target: "J'aime la musique française.", nl: 'Ik hou van Franse muziek.' },
        ],
      },
      {
        title: 'Près du théâtre: de + le wordt du',
        explanation:
          'Près de betekent “dicht bij”, en dat de smelt samen met een volgend le: de + le wordt du. Bij een vrouwelijk woord verandert er niets (près de la gare) en voor een klinker wordt het près de l’. Dezelfde samentrekking zie je overal terug, bijvoorbeeld in le musée du Louvre.',
        examples: [
          { target: 'Le restaurant est près du théâtre.', nl: 'Het restaurant is bij het theater.' },
          { target: 'Le théâtre est près du musée.', nl: 'Het theater is bij het museum.' },
          { target: 'Le cinéma est près de la gare.', nl: 'De bioscoop is bij het station.' },
        ],
      },
    ],
    phrases: [
      { target: 'On va au cinéma ce soir ?', nl: 'Gaan we vanavond naar de bioscoop?' },
      { target: 'Le film commence à huit heures.', nl: 'De film begint om acht uur.' },
      { target: "J'aime la musique française.", nl: 'Ik hou van Franse muziek.' },
      { target: "J'aime danser avec mes amis.", nl: 'Ik dans graag met mijn vrienden.' },
      { target: 'Le restaurant est près du théâtre.', nl: 'Het restaurant is bij het theater.' },
      { target: 'Elle chante très bien.', nl: 'Zij zingt heel goed.' },
    ],
    tip:
      'Aimer is bij dingen ongevaarlijk (j’aime la musique = ik hou van muziek), maar bij mensen is het sterk: j’aime Marie klinkt als een liefdesverklaring. Wil je zeggen dat je iemand aardig vindt, zet er dan bien bij: j’aime bien Marie. Bij dingen doet bien juist het omgekeerde en zwakt het je enthousiasme af.',
  },

  'fr-u14': {
    intro:
      'Alles komt hier samen: bestellen, de weg vragen, over het weer praten, naar de dokter gaan en plannen maken. Deze gids zet de regels op een rij die je in alle eerdere units bent tegengekomen.',
    rules: [
      {
        title: 'Être en avoir: de twee werkwoorden die je overal nodig hebt',
        explanation:
          'Zijn (être) gaat zo: je suis, tu es, il/elle est, nous sommes, vous êtes, ils sont. Hebben (avoir) gaat zo: j’ai, tu as, il/elle a, nous avons, vous avez, ils ont. Ze zitten in half je zinnen, van je suis malade tot j’ai mal à la tête, dus deze twee rijtjes kun je maar beter uit je hoofd kennen.',
        examples: [
          { target: 'Je suis fatigué.', nl: 'Ik ben moe.' },
          { target: "J'ai mal à la tête.", nl: 'Ik heb hoofdpijn.' },
          { target: 'Ma sœur est médecin.', nl: 'Mijn zus is dokter.' },
        ],
      },
      {
        title: 'Au, aux, du, des: de samentrekkingen op een rij',
        explanation:
          'Het Frans laat à en de nooit tegen le of les aan staan. À + le wordt au, à + les wordt aux, de + le wordt du en de + les wordt des. Bij la en bij een klinker verandert er niets: à la gare, à l’école, près de la gare.',
        examples: [
          { target: 'Je vais au cinéma.', nl: 'Ik ga naar de bioscoop.' },
          { target: "J'ai mal aux jambes.", nl: 'Ik heb pijn aan mijn benen.' },
          { target: 'Le restaurant est près du musée.', nl: 'Het restaurant is bij het museum.' },
        ],
      },
      {
        title: 'De uitgangen van de -er-werkwoorden in één blik',
        explanation:
          'Haal -er van het werkwoord af en plak erachter: je -e, tu -es, il/elle/on -e, nous -ons, vous -ez, ils/elles -ent. Alleen nous en vous klinken echt anders; de vier andere vormen klinken exact hetzelfde, inclusief die -ent, die je helemaal niet uitspreekt. Schrijf je dus, dan moet je nadenken; praat je, dan komt het vanzelf goed.',
        examples: [
          { target: 'Je parle français.', nl: 'Ik spreek Frans.' },
          { target: 'Nous arrivons à la gare.', nl: 'Wij komen aan op het station.' },
          { target: 'Vous travaillez à Paris ?', nl: 'Werkt u in Parijs?' },
        ],
      },
      {
        title: 'Drie manieren om een vraag te stellen',
        explanation:
          'De makkelijkste is je stem laten stijgen zonder iets te veranderen: tu parles français ? Met een vraagwoord zet je dat vooraan of achteraan: où est la gare ? of tu travailles quand ? De nette vorm draait werkwoord en onderwerp om met een streepje: quelle heure est-il ? Alle drie zijn goed Frans.',
        examples: [
          { target: 'Tu parles français ?', nl: 'Spreek je Frans?' },
          { target: 'Où est la gare ?', nl: 'Waar is het station?' },
          { target: 'Quelle heure est-il ?', nl: 'Hoe laat is het?' },
        ],
      },
    ],
    phrases: [
      { target: 'Bonjour, je voudrais un billet pour Paris.', nl: 'Goedendag, ik wil graag een kaartje naar Parijs.' },
      { target: "Où est la gare, s'il vous plaît ?", nl: 'Waar is het station, alstublieft?' },
      { target: 'Je suis malade et je vais chez le médecin.', nl: 'Ik ben ziek en ik ga naar de dokter.' },
      { target: "Il fait beau aujourd'hui.", nl: 'Het is mooi weer vandaag.' },
      { target: 'On va au cinéma ce soir ?', nl: 'Gaan we vanavond naar de bioscoop?' },
      { target: 'Au revoir et merci beaucoup !', nl: 'Tot ziens en heel erg bedankt!' },
    ],
    tip:
      'De grootste uitspraakwinst zit in wat je níét zegt: de laatste medeklinker van een Frans woord blijft meestal stil. Petit klinkt als “peti”, ils parlent als “il parl” en salut als “salu”. Vaak wél hoorbaar zijn c, r, f en l (avec, cher, chef, mal) — maar de -r van werkwoorden op -er is juist weer stil: danser klinkt als “dansé”.',
  },
}
