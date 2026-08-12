import type { UnitGuide } from '../../types'

export const guides: Record<string, UnitGuide> = {
  'es-u1': {
    intro:
      'Je leert hier je allereerste Spaanse woorden: iemand groeten, zeggen hoe je heet en vragen hoe het gaat. Met deze handvol zinnen kom je in elk Spaans café al een heel eind.',
    rules: [
      {
        title: 'Me llamo: ik heet',
        explanation:
          'Het werkwoord llamarse betekent letterlijk "zich noemen": je zegt dus niet "ik heet", maar "ik noem mij". De uitgang verklapt over wie het gaat: me llamo (ik), te llamas (jij), se llama (hij of zij). De rest van de zin blijft hetzelfde.',
        examples: [
          { target: 'Me llamo Sofía.', nl: 'Ik heet Sofía.' },
          { target: '¿Cómo te llamas?', nl: 'Hoe heet je?' },
          { target: 'Se llama Pablo.', nl: 'Hij heet Pablo.' },
        ],
      },
      {
        title: 'Bien of bueno?',
        explanation:
          'Op de vraag ¿Cómo estás? antwoord je met bien. Bien zegt hoe iets gaat en hoort bij een werkwoord. Bueno is een bijvoeglijk naamwoord, een woord dat iets over een ding zegt, en betekent "goed" of "lekker". Over jezelf zeg je dus altijd bien.',
        examples: [
          { target: 'Estoy bien, gracias.', nl: 'Het gaat goed, dank je.' },
          { target: '¿Cómo estás? — Muy bien.', nl: 'Hoe gaat het? — Heel goed.' },
          { target: 'El café está bueno.', nl: 'De koffie is lekker.' },
        ],
      },
      {
        title: 'Vraagtekens aan twee kanten',
        explanation:
          'Spaanse vragen en uitroepen krijgen ook aan het begin een teken: ¿ en ¡, ondersteboven. Zo weet je al bij het eerste woord dat er een vraag of een uitroep aankomt, wat handig is bij hardop lezen. Vraagwoorden als cómo en qué krijgen bovendien een accentteken.',
        examples: [
          { target: '¿Cómo estás?', nl: 'Hoe gaat het?' },
          { target: '¡Buenos días, señora García!', nl: 'Goedemorgen, mevrouw García!' },
          { target: '¿Qué tal?', nl: 'Hoe gaat het?' },
        ],
      },
      {
        title: 'Waarom buenos días meervoud is',
        explanation:
          'Groeten met een dagdeel staan in het Spaans in het meervoud: buenos días, buenas tardes, buenas noches. Días is mannelijk en krijgt buenos; tardes en noches zijn vrouwelijk en krijgen buenas. Leer ze als vaste combinaties, dan hoef je nooit na te denken.',
        examples: [
          { target: 'Buenos días, señora García.', nl: 'Goedemorgen, mevrouw García.' },
          { target: 'Buenas tardes, señor.', nl: 'Goedemiddag, meneer.' },
          { target: 'Buenas noches.', nl: 'Goedenavond.' },
        ],
      },
    ],
    phrases: [
      { target: 'Hola, ¿qué tal?', nl: 'Hallo, hoe gaat het?' },
      { target: 'Buenos días, señora García.', nl: 'Goedemorgen, mevrouw García.' },
      { target: 'Me llamo Carmen.', nl: 'Ik heet Carmen.' },
      { target: 'Estoy bien, gracias.', nl: 'Het gaat goed, dank je.' },
      { target: 'Un momento, por favor.', nl: 'Een momentje, alsjeblieft.' },
      { target: 'Adiós, hasta mañana.', nl: 'Dag, tot morgen.' },
    ],
    tip: 'Zeg nooit "estoy bueno" als je bedoelt dat het goed met je gaat: dat betekent in Spanje zoiets als "ik zie er lekker uit". Het antwoord op ¿Cómo estás? is altijd bien.',
  },

  'es-u2': {
    intro:
      'In deze unit bestel je eten en drinken: een koffie, een biertje en aan het eind de rekening. Je leert meteen het belangrijkste van Spaanse zelfstandige naamwoorden: ze zijn mannelijk of vrouwelijk.',
    rules: [
      {
        title: 'Mannelijk of vrouwelijk?',
        explanation:
          'Elk Spaans zelfstandig naamwoord, dus elk woord voor een ding, is mannelijk of vrouwelijk. Bij een mannelijk woord hoort het lidwoord el, bij een vrouwelijk woord la. Woorden op -o zijn meestal mannelijk en woorden op -a meestal vrouwelijk. Leer daarom nooit een los woord, maar altijd het woord met el of la erbij.',
        examples: [
          { target: 'el vino tinto', nl: 'de rode wijn' },
          { target: 'la cerveza fría', nl: 'het koude bier' },
          { target: 'el pan y la cuenta', nl: 'het brood en de rekening' },
        ],
      },
      {
        title: 'Un of una?',
        explanation:
          'Wil je "een" zeggen, dan kies je un bij een mannelijk woord en una bij een vrouwelijk woord. Een bijvoeglijk naamwoord dat erbij hoort past zich aan en komt meestal achter het woord: una cerveza fría, un vino tinto.',
        examples: [
          { target: 'Quiero un café, por favor.', nl: 'Ik wil graag een koffie, alsjeblieft.' },
          { target: 'Una cerveza fría, por favor.', nl: 'Een koud biertje, alsjeblieft.' },
          { target: 'Quiero un vino tinto.', nl: 'Ik wil graag een rode wijn.' },
        ],
      },
      {
        title: 'El agua: de rare uitzondering',
        explanation:
          'Agua is een vrouwelijk woord, maar toch zeg je el agua en un agua. Dat komt doordat het woord begint met een beklemtoonde a: "la agua" is lastig uit te spreken. Het woord blijft wel vrouwelijk, dus een bijvoeglijk naamwoord blijft de vrouwelijke vorm houden: el agua fría.',
        examples: [
          { target: 'Quiero un agua mineral.', nl: 'Ik wil graag een mineraalwater.' },
          { target: 'El agua está fría.', nl: 'Het water is koud.' },
          { target: 'Un agua, por favor.', nl: 'Een water, alsjeblieft.' },
        ],
      },
      {
        title: 'Twee werkwoorden achter elkaar',
        explanation:
          'Na quiero (ik wil) gebruik je het werkwoord in de basisvorm, de vorm die in het woordenboek staat: comer, comprar, bailar. Je past dus alleen het eerste werkwoord aan de persoon aan, precies zoals in het Nederlands: "ik wil eten".',
        examples: [
          { target: 'Quiero comer algo.', nl: 'Ik wil iets eten.' },
          { target: 'Quiero comer pan.', nl: 'Ik wil brood eten.' },
          { target: '¿Quieres comer algo?', nl: 'Wil je iets eten?' },
        ],
      },
    ],
    phrases: [
      { target: 'Un café con leche, por favor.', nl: 'Een koffie met melk, alsjeblieft.' },
      { target: 'Una cerveza fría, por favor.', nl: 'Een koud biertje, alsjeblieft.' },
      { target: 'Un vino tinto, por favor.', nl: 'Een rode wijn, alsjeblieft.' },
      { target: 'Quiero comer algo.', nl: 'Ik wil iets eten.' },
      { target: 'La cuenta, por favor.', nl: 'De rekening, alsjeblieft.' },
      { target: 'El pan está muy bueno.', nl: 'Het brood is erg lekker.' },
    ],
    tip: 'In Spanje spreek je de c voor e en i en de letter z uit als de Engelse th: cerveza klinkt als "ther-BE-tha" en gracias als "GRA-thias". Nederlandstaligen maken er automatisch een s van, en dat hoor je meteen.',
  },

  'es-u3': {
    intro:
      'Je stelt je familie voor: moeder, vader, broer, zus en vrienden. Je leert ook het werkwoord tener (hebben), waarmee je in het Spaans zelfs je leeftijd zegt.',
    rules: [
      {
        title: 'Mi: mijn, altijd hetzelfde',
        explanation:
          'Mi betekent "mijn" en verandert niet mee met het geslacht van het woord erachter: mi padre en mi madre. Alleen bij meerdere dingen wordt het mis. Praat je over iemand anders, gebruik dan se llama en niet me llamo.',
        examples: [
          { target: 'Mi madre se llama Elena.', nl: 'Mijn moeder heet Elena.' },
          { target: 'Mi hermana se llama Lucía.', nl: 'Mijn zus heet Lucía.' },
          { target: 'Mis hermanos se llaman Pablo y Ana.', nl: 'Mijn broer en zus heten Pablo en Ana.' },
        ],
      },
      {
        title: 'Hebben: tengo, tienes, tiene',
        explanation:
          'Tener betekent hebben en heeft eigenzinnige vormen: tengo (ik heb), tienes (jij hebt), tiene (hij of zij heeft). Je gebruikt tener ook voor leeftijd: in het Spaans "heb" je twintig jaar in plaats van dat je twintig bent.',
        examples: [
          { target: 'Tengo un hermano.', nl: 'Ik heb een broer.' },
          { target: 'Tengo una hermana.', nl: 'Ik heb een zus.' },
          { target: 'Mi hermana tiene veinte años.', nl: 'Mijn zus is twintig jaar.' },
        ],
      },
      {
        title: 'Amigo of amiga?',
        explanation:
          'Woorden voor mensen hebben vaak een mannelijke vorm op -o en een vrouwelijke vorm op -a: amigo en amiga, hermano en hermana. Je kiest de vorm die bij de persoon past, en el of la gaat mee.',
        examples: [
          { target: 'Carlos es mi mejor amigo.', nl: 'Carlos is mijn beste vriend.' },
          { target: 'Ana es mi mejor amiga.', nl: 'Ana is mijn beste vriendin.' },
          { target: 'Tengo un hermano y una hermana.', nl: 'Ik heb een broer en een zus.' },
        ],
      },
      {
        title: 'Wonen en werken: en',
        explanation:
          'Bij een plaats waar iets gebeurt of waar iemand is, gebruik je en: en Madrid, en Sevilla. Het woordje a bewaar je voor richting en tijdstippen. Waar het Nederlands "in" of "op" zegt, staat in het Spaans dus meestal en.',
        examples: [
          { target: 'Mi familia vive en Sevilla.', nl: 'Mijn familie woont in Sevilla.' },
          { target: 'Mi padre trabaja en Madrid.', nl: 'Mijn vader werkt in Madrid.' },
          { target: 'Mi hermana estudia en Madrid.', nl: 'Mijn zus studeert in Madrid.' },
        ],
      },
    ],
    phrases: [
      { target: 'Mi madre se llama Elena.', nl: 'Mijn moeder heet Elena.' },
      { target: 'Tengo un hermano y una hermana.', nl: 'Ik heb een broer en een zus.' },
      { target: 'Mi hermana tiene veinte años.', nl: 'Mijn zus is twintig jaar.' },
      { target: 'Carlos es mi mejor amigo.', nl: 'Carlos is mijn beste vriend.' },
      { target: 'Mi familia vive en Sevilla.', nl: 'Mijn familie woont in Sevilla.' },
      { target: 'Ese hombre es mi padre.', nl: 'Die man is mijn vader.' },
    ],
    tip: 'De h is in het Spaans altijd stom: hola klinkt als "OH-la", hermano als "er-MA-no" en hombre als "OM-bre". Nederlandstaligen blazen die h automatisch mee, en dat valt onmiddellijk op.',
  },

  'es-u4': {
    intro:
      'Je vraagt de weg en vindt het station, het plein en het museum. De sleutelzin is ¿Dónde está...?, en die werkt voor bijna alles wat je zoekt.',
    rules: [
      {
        title: 'Waar iets is: está',
        explanation:
          'Voor de plaats van iets of iemand gebruik je altijd estar, nooit ser. De vorm voor hij of zij is está, met een accent op de laatste a. ¿Dónde está la estación? betekent letterlijk "waar bevindt zich het station?". De vorm estás met -s hoort bij jij.',
        examples: [
          { target: '¿Dónde está la estación?', nl: 'Waar is het station?' },
          { target: 'La estación está cerca.', nl: 'Het station is dichtbij.' },
          { target: 'El museo está a la izquierda.', nl: 'Het museum is aan de linkerkant.' },
        ],
      },
      {
        title: 'Vraagwoorden dragen een accent',
        explanation:
          'Vraagwoorden krijgen een accentteken: dónde (waar), cómo (hoe), qué (wat). Dat accent laat zien dat het woord een vraag inleidt en niet iets anders betekent. De hele vraag begint bovendien met het omgekeerde vraagteken ¿.',
        examples: [
          { target: '¿Dónde está la calle Mayor?', nl: 'Waar is de Calle Mayor?' },
          { target: '¿Cómo estás?', nl: 'Hoe gaat het?' },
          { target: '¿Qué quieres?', nl: 'Wat wil je?' },
        ],
      },
      {
        title: 'A la izquierda, a la derecha',
        explanation:
          'Richtingen gaan met a: a la izquierda (naar links), a la derecha (naar rechts). Izquierda en derecha zijn vrouwelijk, dus staat er la tussen. Het is een vaste combinatie; en of de klinkt hier fout.',
        examples: [
          { target: 'El museo está a la izquierda.', nl: 'Het museum is aan de linkerkant.' },
          { target: 'La plaza está a la derecha.', nl: 'Het plein is aan de rechterkant.' },
          { target: 'La calle está a la izquierda.', nl: 'De straat is aan de linkerkant.' },
        ],
      },
    ],
    phrases: [
      { target: '¿Dónde está la estación?', nl: 'Waar is het station?' },
      { target: 'La estación está cerca.', nl: 'Het station is dichtbij.' },
      { target: 'El museo está a la izquierda.', nl: 'Het museum is aan de linkerkant.' },
      { target: 'La plaza está a la derecha.', nl: 'Het plein is aan de rechterkant.' },
      { target: 'Vivo en la calle Mayor.', nl: 'Ik woon in de Calle Mayor.' },
      { target: 'El tren sale a las nueve.', nl: 'De trein vertrekt om negen uur.' },
    ],
    tip: 'De dubbele l spreek je uit als een Nederlandse j: calle klinkt als "KA-je" en me llamo als "me JA-mo". Nederlandstaligen zeggen vaak "kal-le", en dan snapt niemand welke straat je bedoelt.',
  },

  'es-u5': {
    intro:
      'De eerste getallen, klokkijken en de woorden hoy en mañana. Hiermee spreek je af op een tijdstip en begrijp je wanneer de trein vertrekt.',
    rules: [
      {
        title: 'Meervoud maken',
        explanation:
          'Eindigt een woord op een klinker, dan plak je er -s achter: café wordt cafés en hermana wordt hermanas. Eindigt het op een medeklinker, dan komt er -es bij: tren wordt trenes. Het lidwoord gaat mee: el tren wordt los trenes en la hermana wordt las hermanas.',
        examples: [
          { target: 'Dos cafés, por favor.', nl: 'Twee koffie, alsjeblieft.' },
          { target: 'Tengo tres hermanos.', nl: 'Ik heb drie broers.' },
          { target: 'Los trenes salen a las tres.', nl: 'De treinen vertrekken om drie uur.' },
        ],
      },
      {
        title: 'Es la una, son las tres',
        explanation:
          'Bij het klokkijken laat je het woord horas (uren) weg, maar het vrouwelijke lidwoord blijft staan: la una, las dos, las tres. Eén uur is enkelvoud, dus zeg je es la una. Vanaf twee uur is het meervoud, dus son las dos.',
        examples: [
          { target: 'Es la una.', nl: 'Het is één uur.' },
          { target: 'Son las tres.', nl: 'Het is drie uur.' },
          { target: 'Son las cuatro.', nl: 'Het is vier uur.' },
        ],
      },
      {
        title: 'Uno wordt un of una',
        explanation:
          'Het getal uno gebruik je alleen als je los telt of niets erachter zet. Komt er een woord achter, dan wordt het un bij een mannelijk woord en una bij een vrouwelijk woord. Daarom is het un café, una cerveza en es la una, want daar gaat het om la hora.',
        examples: [
          { target: 'Solo quiero uno, gracias.', nl: 'Ik wil er maar één, dank je.' },
          { target: 'Quiero un café.', nl: 'Ik wil graag een koffie.' },
          { target: 'Es la una.', nl: 'Het is één uur.' },
        ],
      },
      {
        title: 'Om hoe laat: a las',
        explanation:
          'Voor een tijdstip gebruik je a: a las tres (om drie uur), a la una (om één uur). Vraag je ernaar, dan zeg je ¿A qué hora...?, letterlijk "op welk uur?". Het lidwoord la of las blijft ook hier staan.',
        examples: [
          { target: 'El tren sale a las tres.', nl: 'De trein vertrekt om drie uur.' },
          { target: '¿A qué hora sale el tren?', nl: 'Hoe laat vertrekt de trein?' },
          { target: 'Quiero comer a la una.', nl: 'Ik wil om één uur eten.' },
        ],
      },
    ],
    phrases: [
      { target: '¿Qué hora es?', nl: 'Hoe laat is het?' },
      { target: 'Son las tres.', nl: 'Het is drie uur.' },
      { target: '¿A qué hora sale el tren?', nl: 'Hoe laat vertrekt de trein?' },
      { target: 'Dos cafés, por favor.', nl: 'Twee koffie, alsjeblieft.' },
      { target: 'Hoy quiero comer en la plaza.', nl: 'Vandaag wil ik op het plein eten.' },
      { target: 'Mañana trabajo en Madrid.', nl: 'Morgen werk ik in Madrid.' },
    ],
    tip: 'Mañana betekent zowel "morgen" als "ochtend". Staat het los in de zin, dan is het de dag na vandaag; zeg je por la mañana, dan bedoel je "in de ochtend".',
  },

  'es-u6': {
    intro:
      'Winkelen, prijzen vragen en zeggen dat iets te duur is. Je leert ook hoe je in het Spaans iets ontkent, en dat is verrassend simpel.',
    rules: [
      {
        title: 'Nee zeggen met no',
        explanation:
          'Ontkennen doe je met no, en dat ene woordje dekt zowel "niet" als "geen". Het staat altijd direct vóór het werkwoord, ook waar het Nederlands het ergens anders in de zin zet. "Ik heb geen geld" wordt dus No tengo dinero.',
        examples: [
          { target: 'No tengo dinero.', nl: 'Ik heb geen geld.' },
          { target: 'El pan no es caro.', nl: 'Het brood is niet duur.' },
          { target: 'Hoy no trabajo.', nl: 'Ik werk vandaag niet.' },
        ],
      },
      {
        title: 'Cuesta of cuestan?',
        explanation:
          'Cuesta betekent "het kost" en hoort bij één ding. Gaat het om meerdere dingen, dan wordt het cuestan met -n. Het werkwoord kijkt dus naar wat er gekocht wordt, niet naar jou.',
        examples: [
          { target: '¿Cuánto cuesta el vino?', nl: 'Hoeveel kost de wijn?' },
          { target: '¿Cuánto cuesta la fruta?', nl: 'Hoeveel kost het fruit?' },
          { target: '¿Cuánto cuestan los libros?', nl: 'Hoeveel kosten de boeken?' },
        ],
      },
      {
        title: 'Het bijvoeglijk naamwoord komt achteraan',
        explanation:
          'Een bijvoeglijk naamwoord, dus een woord dat zegt hoe iets is, staat in het Spaans meestal áchter het zelfstandig naamwoord: un vino caro, fruta barata. Het past zich aan dat woord aan: bij een mannelijk woord eindigt het op -o, bij een vrouwelijk woord op -a. Ook als het achter es staat, blijft die aanpassing gelden.',
        examples: [
          { target: 'Es un vino muy caro.', nl: 'Het is een erg dure wijn.' },
          { target: 'Quiero comprar fruta barata.', nl: 'Ik wil goedkoop fruit kopen.' },
          { target: 'La fruta es barata.', nl: 'Het fruit is goedkoop.' },
        ],
      },
      {
        title: 'Quiero comprar: het tweede werkwoord blijft onveranderd',
        explanation:
          'Staan er twee werkwoorden achter elkaar, dan pas je alleen het eerste aan de persoon aan. Het tweede blijft in de basisvorm, de vorm die in het woordenboek staat: comprar, comer. Zeg dus Quiero comprar pan en nooit "quiero compro pan".',
        examples: [
          { target: 'Quiero comprar pan.', nl: 'Ik wil brood kopen.' },
          { target: 'Quiero comprar fruta en el mercado.', nl: 'Ik wil fruit kopen op de markt.' },
          { target: '¿Quieres comprar el vino?', nl: 'Wil jij de wijn kopen?' },
        ],
      },
      {
        title: 'Es of está bij eten en prijzen?',
        explanation:
          'Met es zeg je hoe iets altijd is: El vino es caro betekent dat die wijn nu eenmaal duur is. Met está zeg je hoe iets op dit moment is, bijvoorbeeld hoe het vandaag smaakt: La fruta está muy buena. Prijzen en eigenschappen krijgen dus es, een indruk van het moment krijgt está.',
        examples: [
          { target: 'El vino es muy caro.', nl: 'De wijn is erg duur.' },
          { target: 'La fruta está muy buena.', nl: 'Het fruit is erg lekker.' },
          { target: 'El pan está bueno hoy.', nl: 'Het brood is vandaag lekker.' },
        ],
      },
    ],
    phrases: [
      { target: '¿Cuánto cuesta el vino?', nl: 'Hoeveel kost de wijn?' },
      { target: 'Quiero comprar pan.', nl: 'Ik wil brood kopen.' },
      { target: 'No tengo dinero.', nl: 'Ik heb geen geld.' },
      { target: 'La tienda está en la calle Mayor.', nl: 'De winkel is in de Calle Mayor.' },
      { target: 'El mercado está en la plaza.', nl: 'De markt is op het plein.' },
      { target: 'El pan aquí es muy barato.', nl: 'Het brood is hier erg goedkoop.' },
    ],
    tip: 'Cuesta (het kost) en cuenta (de rekening) lijken sterk op elkaar, maar ze doen iets anders: in de winkel vraag je ¿Cuánto cuesta?, in het café zeg je La cuenta, por favor.',
  },

  'es-u7': {
    intro:
      'Je beschrijft je huis: de keuken, de badkamer, je kamer en wat er allemaal in staat. Hier komt het beroemde verschil tussen ser en estar echt aan bod.',
    rules: [
      {
        title: 'Ser of estar: hoe iets is, of waar het is',
        explanation:
          'Beide werkwoorden betekenen "zijn". Met es beschrijf je wat iets is of hoe het altijd is: La cocina es grande. Met está zeg je waar iets zich bevindt: La mesa está en la cocina. De vuistregel is kort: eigenschap krijgt es, plaats krijgt está.',
        examples: [
          { target: 'La cocina es muy grande.', nl: 'De keuken is erg groot.' },
          { target: 'La mesa está en la cocina.', nl: 'De tafel staat in de keuken.' },
          { target: 'Mi habitación es pequeña.', nl: 'Mijn kamer is klein.' },
        ],
      },
      {
        title: 'Pequeño, pequeña, grande',
        explanation:
          'Bijvoeglijke naamwoorden op -o passen zich aan het geslacht aan: el baño pequeño, la habitación pequeña. Woorden die al op -e eindigen, zoals grande, veranderen niet mee. In het meervoud komt er bij allebei een -s bij.',
        examples: [
          { target: 'Mi habitación es pequeña.', nl: 'Mijn kamer is klein.' },
          { target: 'La cocina es grande.', nl: 'De keuken is groot.' },
          { target: 'La casa tiene dos ventanas pequeñas.', nl: 'Het huis heeft twee kleine ramen.' },
        ],
      },
      {
        title: 'Hay: er is, er zijn',
        explanation:
          'Hay betekent "er is" of "er zijn" en gebruik je als je iets voor het eerst noemt: Hay una silla en la habitación. Weet de ander al over welk ding het gaat, dan gebruik je está. Hay verandert nooit van vorm, ook niet bij meerdere dingen. Zeg je erbij wát iets heeft, dan gebruik je tener: la habitación tiene dos ventanas.',
        examples: [
          { target: 'Hay una silla en la habitación.', nl: 'Er staat een stoel in de kamer.' },
          { target: 'Hay dos ventanas en la cocina.', nl: 'Er zijn twee ramen in de keuken.' },
          { target: 'La silla está en la cocina.', nl: 'De stoel staat in de keuken.' },
          { target: 'La habitación tiene dos ventanas.', nl: 'De kamer heeft twee ramen.' },
        ],
      },
      {
        title: 'Wonen: vivo, vives, vive',
        explanation:
          'Vivir (wonen of leven) is een werkwoord op -ir. Haal die -ir weg en plak de uitgang erachter: vivo (ik woon), vives (jij woont), vive (hij of zij woont). De plaats waar je woont komt erachter met en.',
        examples: [
          { target: 'Vivo en Ámsterdam.', nl: 'Ik woon in Amsterdam.' },
          { target: 'Mi familia vive en una casa grande.', nl: 'Mijn familie woont in een groot huis.' },
          { target: '¿Dónde vives?', nl: 'Waar woon je?' },
        ],
      },
    ],
    phrases: [
      { target: '¿Dónde está el baño, por favor?', nl: 'Waar is de badkamer, alsjeblieft?' },
      { target: 'La cocina es muy grande.', nl: 'De keuken is erg groot.' },
      { target: 'Mi habitación es pequeña.', nl: 'Mijn kamer is klein.' },
      { target: 'Hay una silla en la habitación.', nl: 'Er staat een stoel in de kamer.' },
      { target: 'La habitación tiene dos ventanas.', nl: 'De kamer heeft twee ramen.' },
      { target: 'La puerta está a la derecha.', nl: 'De deur is aan de rechterkant.' },
    ],
    tip: 'Het Nederlands kiest tussen staan, liggen en zitten, het Spaans niet: "de tafel staat in de keuken" en "het boek ligt op tafel" worden allebei gewoon está. Vertaal staan en liggen dus nooit letterlijk.',
  },

  'es-u8': {
    intro:
      'Werk, school en beroepen. Je leert het vaste patroon van werkwoorden op -ar, waarmee je in één klap trabajar, estudiar, comprar en bailar kunt gebruiken.',
    rules: [
      {
        title: 'Werkwoorden op -ar',
        explanation:
          'Heel veel Spaanse werkwoorden eindigen op -ar: trabajar, estudiar, comprar. Vervoegen, dus de vorm aanpassen aan wie iets doet, gaat bij allemaal hetzelfde. Haal -ar weg en plak -o voor ik, -as voor jij en -a voor hij of zij: trabajo, trabajas, trabaja.',
        examples: [
          { target: 'Hoy trabajo en la oficina.', nl: 'Vandaag werk ik op kantoor.' },
          { target: 'Mi padre trabaja en una oficina.', nl: 'Mijn vader werkt op een kantoor.' },
          { target: 'Mi hermana estudia en Madrid.', nl: 'Mijn zus studeert in Madrid.' },
        ],
      },
      {
        title: 'Na quiero juist géén vervoeging',
        explanation:
          'Vervoeg je een werkwoord alleen als het het eerste werkwoord van de zin is. Staat het achter quiero (ik wil), dan blijft het in de basisvorm op -ar: Quiero estudiar español, niet "quiero estudio español". Vergelijk: Estudio español is "ik studeer Spaans", Quiero estudiar español is "ik wil Spaans studeren".',
        examples: [
          { target: 'Quiero trabajar en España.', nl: 'Ik wil in Spanje werken.' },
          { target: 'Quiero estudiar español.', nl: 'Ik wil Spaans studeren.' },
          { target: 'Hoy estudio en la escuela.', nl: 'Vandaag studeer ik op school.' },
        ],
      },
      {
        title: 'Beroep zonder lidwoord',
        explanation:
          'Zeg je wat iemand van beroep is, dan laat je het woordje "een" weg: Mi amigo es médico. Waar het Nederlands "hij is een arts" zegt, zegt het Spaans letterlijk "hij is arts". Je gebruikt hier ser, want een beroep hoort bij wie iemand is.',
        examples: [
          { target: 'Mi amigo es médico.', nl: 'Mijn vriend is arts.' },
          { target: 'Mi madre es profesora.', nl: 'Mijn moeder is lerares.' },
          { target: 'Soy profesor.', nl: 'Ik ben leraar.' },
        ],
      },
      {
        title: 'Cerca de, lejos de',
        explanation:
          'Cerca betekent dichtbij en lejos ver weg. Noem je erbij waar het dichtbij is, dan moet er de achter: La escuela está cerca de casa. Zeg je alleen dat iets dichtbij is, dan laat je de weg.',
        examples: [
          { target: 'La escuela está cerca de casa.', nl: 'De school is dichtbij huis.' },
          { target: 'La oficina está lejos de la plaza.', nl: 'Het kantoor is ver van het plein.' },
          { target: 'La estación está cerca.', nl: 'Het station is dichtbij.' },
        ],
      },
    ],
    phrases: [
      { target: 'Tengo un trabajo nuevo.', nl: 'Ik heb een nieuwe baan.' },
      { target: 'Quiero trabajar en España.', nl: 'Ik wil in Spanje werken.' },
      { target: 'La oficina está en la plaza.', nl: 'Het kantoor is op het plein.' },
      { target: 'Quiero estudiar español.', nl: 'Ik wil Spaans studeren.' },
      { target: 'La escuela está cerca de casa.', nl: 'De school is dichtbij huis.' },
      { target: 'El profesor se llama señor López.', nl: 'De leraar heet meneer López.' },
    ],
    tip: 'Trabajo betekent zowel "het werk" als "ik werk". Je ziet het verschil aan wat ervoor staat: el trabajo of mi trabajo is het zelfstandig naamwoord, staat er niets voor, dan is het het werkwoord.',
  },

  'es-u9': {
    intro:
      'De kleine woorden die een gesprek soepel maken: pardon zeggen, iets beamen en een afspraak maken. Je leert ook vertellen waar je vandaan komt.',
    rules: [
      {
        title: 'Waar kom je vandaan: soy de',
        explanation:
          'Voor je herkomst gebruik je ser: soy (ik ben), eres (jij bent), es (hij of zij is), gevolgd door de en de plaats. ¿De dónde eres? is letterlijk "van waar ben je?". Verwar het niet met estar, want dat gaat over waar je op dit moment bent.',
        examples: [
          { target: '¿De dónde eres?', nl: 'Waar kom je vandaan?' },
          { target: 'Soy de Ámsterdam.', nl: 'Ik kom uit Amsterdam.' },
          { target: 'Mi amigo es de Sevilla.', nl: 'Mijn vriend komt uit Sevilla.' },
        ],
      },
      {
        title: 'Yo en tú mag je weglaten',
        explanation:
          'De uitgang van het werkwoord verklapt al wie iets doet, dus yo (ik) en tú (jij) laat je meestal weg: Quiero un café is een complete zin. Zet je yo er wel bij, dan leg je nadruk op de persoon.',
        examples: [
          { target: 'Quiero un café.', nl: 'Ik wil graag een koffie.' },
          { target: 'Yo también quiero un café.', nl: 'Ik wil ook een koffie.' },
          { target: 'Yo trabajo hoy.', nl: 'Ík werk vandaag.' },
        ],
      },
      {
        title: 'También en tampoco',
        explanation:
          'También betekent "ook" en hoort bij een gewone zin. Is de zin ontkennend, dan wordt "ook niet" één woord: tampoco. Je zet er dus geen no meer bij, want de ontkenning zit al in tampoco.',
        examples: [
          { target: 'Yo también quiero un café.', nl: 'Ik wil ook een koffie.' },
          { target: 'Mi hermana también trabaja en Madrid.', nl: 'Mijn zus werkt ook in Madrid.' },
          { target: 'No tengo dinero. — Yo tampoco.', nl: 'Ik heb geen geld. — Ik ook niet.' },
        ],
      },
      {
        title: 'Afspreken: a las tres, en la plaza',
        explanation:
          'In een afspraak noem je het tijdstip met a en de plaats met en: Nos vemos a las tres en la plaza. Bij één uur wordt dat a la una, vanaf twee uur a las dos. Het lidwoord la of las laat je nooit weg.',
        examples: [
          { target: 'Nos vemos a las tres.', nl: 'We zien elkaar om drie uur.' },
          { target: '¿En la plaza a las cuatro? Vale.', nl: 'Op het plein om vier uur? Oké.' },
          { target: 'Nos vemos mañana en la oficina.', nl: 'We zien elkaar morgen op kantoor.' },
        ],
      },
    ],
    phrases: [
      { target: 'Perdona, ¿qué hora es?', nl: 'Pardon, hoe laat is het?' },
      { target: '¿De dónde eres? Soy de Ámsterdam.', nl: 'Waar kom je vandaan? Ik kom uit Amsterdam.' },
      { target: 'Yo también quiero un café.', nl: 'Ik wil ook een koffie.' },
      { target: 'Lo siento, no tengo dinero.', nl: 'Het spijt me, ik heb geen geld.' },
      { target: '¿En la plaza a las cuatro? Vale.', nl: 'Op het plein om vier uur? Oké.' },
      { target: 'Nos vemos mañana en la oficina.', nl: 'We zien elkaar morgen op kantoor.' },
    ],
    tip: 'Perdona is de je-vorm. In Spanje wordt snel getutoyeerd, maar tegen iemand die duidelijk ouder is of in een formele situatie klinkt perdone of disculpe netter. Nederlandstaligen kiezen automatisch de je-vorm.',
  },

  'es-u10': {
    intro:
      'Alles voor onderweg: een kaartje kopen, het vliegveld vinden en je koffer terugvinden. De kleine woordjes a, en en para bepalen hier de hele betekenis.',
    rules: [
      {
        title: 'A, en of para?',
        explanation:
          'Deze drie kleine woorden verdelen het werk. A gebruik je voor een tijdstip of een richting: a las diez, a la derecha. En zegt waar iets is: en el hotel. Para wijst naar een bestemming of een doel: un billete para Madrid.',
        examples: [
          { target: 'El avión sale a las diez.', nl: 'Het vliegtuig vertrekt om tien uur.' },
          { target: 'Mi maleta está en el hotel.', nl: 'Mijn koffer is in het hotel.' },
          { target: 'Quiero un billete para Barcelona.', nl: 'Ik wil graag een kaartje naar Barcelona.' },
        ],
      },
      {
        title: 'En cinco minutos: over vijf minuten',
        explanation:
          'Voor een tijd die nog moet komen gebruik je en, precies waar het Nederlands "over" zegt. El autobús llega en cinco minutos betekent dus dat de bus over vijf minuten aankomt. Vertaal "over" hier niet met sobre, want dat betekent "over" in de zin van een onderwerp.',
        examples: [
          { target: 'El autobús llega en cinco minutos.', nl: 'De bus komt over vijf minuten.' },
          { target: 'El tren sale en diez minutos.', nl: 'De trein vertrekt over tien minuten.' },
          { target: 'Nos vemos en una hora.', nl: 'We zien elkaar over een uur.' },
        ],
      },
      {
        title: 'Sale of llega?',
        explanation:
          'Salir betekent vertrekken en llegar aankomen; in de vorm voor hij of zij worden dat sale en llega. Ze staan vaak in bijna dezelfde zin met een tijdstip erachter, dus dit ene woord bepaalt of je op tijd bent of net te laat.',
        examples: [
          { target: 'El avión sale a las diez.', nl: 'Het vliegtuig vertrekt om tien uur.' },
          { target: 'El tren llega a las nueve.', nl: 'De trein komt om negen uur aan.' },
          { target: 'El autobús llega en cinco minutos.', nl: 'De bus komt over vijf minuten.' },
        ],
      },
    ],
    phrases: [
      { target: 'Quiero un billete para Madrid.', nl: 'Ik wil graag een kaartje naar Madrid.' },
      { target: '¿Dónde está el aeropuerto?', nl: 'Waar is het vliegveld?' },
      { target: 'El avión sale a las diez.', nl: 'Het vliegtuig vertrekt om tien uur.' },
      { target: 'Mi maleta está en el tren.', nl: 'Mijn koffer is in de trein.' },
      { target: 'El hotel está en la Plaza Mayor.', nl: 'Het hotel is aan de Plaza Mayor.' },
      { target: 'Quiero un taxi, por favor.', nl: 'Ik wil graag een taxi, alsjeblieft.' },
    ],
    tip: 'Largo betekent "lang", niet "groot": El viaje es largo gaat over de duur van de reis. Nederlandstaligen denken via het Engelse large aan groot, maar groot is in het Spaans grande.',
  },

  'es-u11': {
    intro:
      'Vertellen dat je je niet lekker voelt en hulp vragen bij de apotheek. Je leert de Spaanse manier om over pijn te praten, en die draait de zin helemaal om.',
    rules: [
      {
        title: 'Hoe je je voelt: estar',
        explanation:
          'Voor een toestand die weer overgaat, zoals ziek of moe, gebruik je estar: estoy cansado, mi hermano está enfermo. Het woord erachter past zich aan de persoon aan: een man is cansado, een vrouw cansada. Met ser zou je zeggen dat het een blijvende eigenschap is.',
        examples: [
          { target: 'Estoy muy cansado.', nl: 'Ik ben erg moe.' },
          { target: 'Mi madre está enferma.', nl: 'Mijn moeder is ziek.' },
          { target: 'Mi hermano está enfermo.', nl: 'Mijn broer is ziek.' },
        ],
      },
      {
        title: 'Me duele: mijn hoofd doet mij pijn',
        explanation:
          'Me duele la cabeza betekent letterlijk "het hoofd doet mij pijn". Het lichaamsdeel bepaalt dus de vorm van het werkwoord, en het krijgt la of el, niet mi. Doen er meerdere dingen pijn, dan wordt het duelen met -n.',
        examples: [
          { target: 'Me duele la cabeza.', nl: 'Ik heb hoofdpijn.' },
          { target: '¿Te duele la cabeza?', nl: 'Heb jij hoofdpijn?' },
          { target: 'Me duelen los pies.', nl: 'Mijn voeten doen pijn.' },
        ],
      },
      {
        title: 'Necesito: ik heb nodig',
        explanation:
          'Necesito betekent "ik heb nodig" en is één werkwoord; het Nederlandse "hebben" vertaal je hier dus niet apart. Achter necesito komt gewoon het ding dat je nodig hebt, met un of una ervoor.',
        examples: [
          { target: 'Necesito un médico.', nl: 'Ik heb een dokter nodig.' },
          { target: 'Necesito una medicina.', nl: 'Ik heb een medicijn nodig.' },
          { target: 'Necesito dinero.', nl: 'Ik heb geld nodig.' },
        ],
      },
      {
        title: 'Cerca de la plaza',
        explanation:
          'Zeg je waar iets dichtbij is, dan komt er de achter cerca: La farmacia está cerca de la plaza. Hetzelfde geldt voor lejos (ver): lejos de la estación. Noem je geen tweede plek, dan laat je de weg.',
        examples: [
          { target: 'La farmacia está cerca de la plaza.', nl: 'De apotheek is dicht bij het plein.' },
          { target: 'El médico está lejos de aquí.', nl: 'De dokter is ver hiervandaan.' },
          { target: 'La farmacia está cerca.', nl: 'De apotheek is dichtbij.' },
        ],
      },
    ],
    phrases: [
      { target: 'Me duele la cabeza.', nl: 'Ik heb hoofdpijn.' },
      { target: 'Mi hermano está enfermo.', nl: 'Mijn broer is ziek.' },
      { target: 'Estoy muy cansado.', nl: 'Ik ben erg moe.' },
      { target: 'Necesito un médico.', nl: 'Ik heb een dokter nodig.' },
      { target: '¿Dónde está la farmacia?', nl: 'Waar is de apotheek?' },
      { target: 'Esta medicina es muy buena.', nl: 'Dit medicijn is erg goed.' },
    ],
    tip: 'Mucho komt direct achter het werkwoord: Me duele mucho la cabeza. Nederlandstaligen bewaren "erg" graag voor het eind en maken er "me duele la cabeza mucho" van, maar in het Spaans schuift het lichaamsdeel juist naar achteren.',
  },

  'es-u12': {
    intro:
      'Praten over het weer en de seizoenen. Het Spaans gebruikt daarvoor een werkwoord dat je niet verwacht: hacer, dat eigenlijk "maken" betekent.',
    rules: [
      {
        title: 'Het weer met hace',
        explanation:
          'Voor de meeste weersuitdrukkingen gebruik je hace, van hacer (maken): hace sol, hace frío, hace calor. Er staat letterlijk "het maakt zon". Es of está past hier niet, ook al zeg je in het Nederlands "het is koud".',
        examples: [
          { target: 'Hoy hace sol.', nl: 'Vandaag schijnt de zon.' },
          { target: 'En invierno hace frío.', nl: 'In de winter is het koud.' },
          { target: 'En Sevilla hace mucho calor.', nl: 'In Sevilla is het erg warm.' },
        ],
      },
      {
        title: 'Muy of mucho?',
        explanation:
          'Muy betekent "heel" en zet je vóór een bijvoeglijk naamwoord: muy bonita, muy caro. Mucho betekent "veel" en hoort bij een zelfstandig naamwoord of bij een werkwoord: hace mucho calor, llueve mucho. Omdat calor en frío zelfstandige naamwoorden zijn, zeg je nooit "muy calor".',
        examples: [
          { target: 'La primavera es muy bonita.', nl: 'De lente is erg mooi.' },
          { target: 'Hace mucho calor.', nl: 'Het is erg warm.' },
          { target: 'En Galicia llueve mucho.', nl: 'In Galicië regent het veel.' },
        ],
      },
      {
        title: 'Llueve heeft geen ik-vorm',
        explanation:
          'Weerwerkwoorden gaan niet over een persoon, dus bestaan ze alleen in de vorm voor hij of zij: llueve (het regent), nieva (het sneeuwt). Vormen als lluevo of llueves bestaan niet. Er is ook geen woord voor "het": llueve is in zijn eentje al een hele zin.',
        examples: [
          { target: 'Llueve.', nl: 'Het regent.' },
          { target: 'Hoy llueve mucho.', nl: 'Vandaag regent het veel.' },
          { target: 'En invierno llueve en Galicia.', nl: 'In de winter regent het in Galicië.' },
        ],
      },
      {
        title: 'En verano, en invierno',
        explanation:
          'Bij seizoenen gebruik je en zonder lidwoord: en verano, en invierno, en primavera. Alleen als je iets over het seizoen zelf zegt, komt el of la terug: La primavera es muy bonita.',
        examples: [
          { target: 'En verano hace calor.', nl: 'In de zomer is het warm.' },
          { target: 'En invierno llueve mucho.', nl: 'In de winter regent het veel.' },
          { target: 'La primavera es muy bonita.', nl: 'De lente is erg mooi.' },
        ],
      },
    ],
    phrases: [
      { target: 'Hoy hace sol en Valencia.', nl: 'Vandaag schijnt de zon in Valencia.' },
      { target: 'Hoy hace frío en la calle.', nl: 'Het is vandaag koud op straat.' },
      { target: 'En Galicia llueve mucho.', nl: 'In Galicië regent het veel.' },
      { target: 'En verano hace mucho calor.', nl: 'In de zomer is het erg warm.' },
      { target: 'La primavera es muy bonita.', nl: 'De lente is erg mooi.' },
      { target: 'Hoy estoy en Madrid.', nl: 'Vandaag ben ik in Madrid.' },
    ],
    tip: 'Calor en frío zijn zelfstandige naamwoorden. "Het is koud" is Hace frío, maar "ik heb het koud" is Tengo frío. Estoy frío zeg je niet: dat betekent dat je lichaam koud aanvoelt.',
  },

  'es-u13': {
    intro:
      'Uitgaan: feest, muziek, film en theater. Je leert de zin waarmee je vertelt wat je leuk vindt, me gusta, en die werkt anders dan je verwacht.',
    rules: [
      {
        title: 'Me gusta of me gustan?',
        explanation:
          'Me gusta betekent letterlijk "het bevalt mij". Het ding dat je leuk vindt bepaalt dus de vorm van het werkwoord: bij één ding gusta, bij meerdere dingen gustan. Het woordje me blijft hetzelfde, want dat ben jij.',
        examples: [
          { target: 'Me gusta la música.', nl: 'Ik hou van muziek.' },
          { target: 'Me gustan las fiestas españolas.', nl: 'Ik hou van Spaanse feesten.' },
          { target: 'Me gusta mucho el teatro.', nl: 'Ik hou erg van theater.' },
        ],
      },
      {
        title: 'Het lidwoord blijft staan',
        explanation:
          'Na me gusta laat je el of la nooit weg: het is Me gusta el teatro en niet "me gusta teatro". Volgt er een werkwoord in plaats van een ding, dan gebruik je de basisvorm, de vorm die in het woordenboek staat, en blijft het altijd gusta zonder -n.',
        examples: [
          { target: 'Me gusta el teatro.', nl: 'Ik hou van theater.' },
          { target: 'Me gusta la música española.', nl: 'Ik hou van Spaanse muziek.' },
          { target: 'Me gusta bailar en la fiesta.', nl: 'Ik hou van dansen op het feest.' },
        ],
      },
      {
        title: 'Español, española, españolas',
        explanation:
          'De naam van een taal en het woord voor een nationaliteit krijgen in het Spaans een kleine letter: español, española. Het land zelf houdt wél een hoofdletter: España. Gebruik je zo een woord om iets te beschrijven, dan past het zich aan: la música española, las fiestas españolas, el cine español.',
        examples: [
          { target: 'La música española es muy bonita.', nl: 'Spaanse muziek is erg mooi.' },
          { target: 'Me gustan las fiestas españolas.', nl: 'Ik hou van Spaanse feesten.' },
          { target: 'Quiero estudiar español en España.', nl: 'Ik wil Spaans studeren in Spanje.' },
        ],
      },
      {
        title: 'Empieza a las diez',
        explanation:
          'Hoe laat iets begint, zeg je met empieza en a: La película empieza a las nueve. Het lidwoord las blijft staan, en bij één uur wordt het a la una. Vraag je ernaar, dan zeg je ¿A qué hora empieza...?',
        examples: [
          { target: 'La fiesta empieza a las diez.', nl: 'Het feest begint om tien uur.' },
          { target: 'La película empieza a las nueve.', nl: 'De film begint om negen uur.' },
          { target: '¿A qué hora empieza la fiesta?', nl: 'Hoe laat begint het feest?' },
        ],
      },
    ],
    phrases: [
      { target: 'Me gusta la música.', nl: 'Ik hou van muziek.' },
      { target: 'Quiero bailar en la fiesta.', nl: 'Ik wil dansen op het feest.' },
      { target: 'La fiesta empieza a las diez.', nl: 'Het feest begint om tien uur.' },
      { target: 'Quiero dos entradas, por favor.', nl: 'Ik wil graag twee kaartjes, alsjeblieft.' },
      { target: 'La película empieza a las nueve.', nl: 'De film begint om negen uur.' },
      { target: 'El cine está cerca de la plaza.', nl: 'De bioscoop is dicht bij het plein.' },
    ],
    tip: 'Pas op met me gusta bij personen: Me gusta Carlos klinkt alsof je verliefd op hem bent. Bedoel je dat je hem gewoon aardig vindt, zeg dan Carlos me cae bien.',
  },

  'es-u14': {
    intro:
      'De laatste unit brengt alles samen: reizen, gezondheid, weer en uitgaan. Deze gids zet de dingen op een rij waar je in het Spaans het vaakst over struikelt.',
    rules: [
      {
        title: 'Es, está of hace?',
        explanation:
          'Drie werkwoorden die in het Nederlands allemaal "is" kunnen worden. Es (van ser) hoort bij een eigenschap, een beroep of je herkomst. Está (van estar) hoort bij een plaats of bij hoe iemand zich voelt. Hace hoort bij het weer.',
        examples: [
          { target: 'Mi amigo es médico.', nl: 'Mijn vriend is arts.' },
          { target: 'Mi hermano está muy enfermo.', nl: 'Mijn broer is erg ziek.' },
          { target: 'En invierno hace mucho frío.', nl: 'In de winter is het erg koud.' },
        ],
      },
      {
        title: 'Por of para?',
        explanation:
          'Para wijst vooruit naar een doel of een bestemming: dos entradas para el cine, un billete para Madrid. Por zit vooral in vaste uitdrukkingen als por favor en por la mañana. Twijfel je? Kun je "bedoeld voor" zeggen, dan is het para.',
        examples: [
          { target: 'Quiero dos entradas para el cine.', nl: 'Ik wil graag twee kaartjes voor de bioscoop.' },
          { target: 'Un billete para Barcelona, por favor.', nl: 'Een kaartje naar Barcelona, alsjeblieft.' },
          { target: 'Una cerveza fría, por favor.', nl: 'Een koud biertje, alsjeblieft.' },
        ],
      },
      {
        title: 'Al en del',
        explanation:
          'De woordjes a en de smelten samen met het lidwoord el: a el wordt al en de el wordt del. Dat gebeurt alleen bij el; bij la verandert er niets, dus blijft het a la estación en de la plaza.',
        examples: [
          { target: 'Necesito un taxi al aeropuerto.', nl: 'Ik heb een taxi naar het vliegveld nodig.' },
          { target: 'La fruta del mercado está muy buena.', nl: 'Het fruit van de markt is erg lekker.' },
          { target: 'El Museo del Prado está en Madrid.', nl: 'Het Prado-museum is in Madrid.' },
        ],
      },
      {
        title: 'Sale, llega, empieza',
        explanation:
          'Deze drie werkwoorden staan hier in de vorm voor hij of zij en gaan bijna altijd samen met een tijdstip met a las. Sale is vertrekken, llega is aankomen en empieza is beginnen; de rest van de zin blijft gelijk.',
        examples: [
          { target: 'El tren sale a las nueve.', nl: 'De trein vertrekt om negen uur.' },
          { target: 'El autobús llega a las diez.', nl: 'De bus komt om tien uur aan.' },
          { target: 'La película empieza a las nueve.', nl: 'De film begint om negen uur.' },
        ],
      },
      {
        title: 'Me duele en me gusta werken hetzelfde',
        explanation:
          'Bij deze twee draait de zin om: niet jij, maar het ding bepaalt de vorm van het werkwoord. Me gusta la música is letterlijk "de muziek bevalt mij" en me duele la cabeza "het hoofd doet mij pijn". Gaat het om meerdere dingen, dan komt er een -n bij: me gustan las fiestas, me duelen los pies.',
        examples: [
          { target: 'Me duele la cabeza.', nl: 'Ik heb hoofdpijn.' },
          { target: 'Me gusta la música española.', nl: 'Ik hou van Spaanse muziek.' },
          { target: 'Me duelen los pies.', nl: 'Mijn voeten doen pijn.' },
        ],
      },
    ],
    phrases: [
      { target: 'Necesito un taxi al aeropuerto.', nl: 'Ik heb een taxi naar het vliegveld nodig.' },
      { target: 'Me duele la cabeza.', nl: 'Ik heb hoofdpijn.' },
      { target: 'La cuenta, por favor.', nl: 'De rekening, alsjeblieft.' },
      { target: 'Quiero dos entradas para el teatro.', nl: 'Ik wil graag twee kaartjes voor het theater.' },
      { target: 'Hoy hace mucho calor.', nl: 'Vandaag is het erg warm.' },
      { target: 'Buenos días, me llamo Carmen.', nl: 'Goedemorgen, ik heet Carmen.' },
    ],
    tip: 'Een accentteken laat zien waar de klemtoon ligt: estación, avión, música, película. Nederlandstaligen laten het bij het schrijven weg, maar dan verschuift de klemtoon naar de verkeerde lettergreep en klinkt het woord echt anders.',
  },
}
