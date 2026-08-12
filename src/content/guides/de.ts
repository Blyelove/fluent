import type { UnitGuide } from '../../types'

export const guides: Record<string, UnitGuide> = {
  'de-u1': {
    intro:
      'Je leert de eerste woorden die je in Duitsland meteen nodig hebt: groeten, bedanken en zeggen hoe het met je gaat. Met deze handvol zinnen open en sluit je elk gesprek netjes.',
    rules: [
      {
        title: 'Groeten op het juiste moment',
        explanation:
          'Duitsers groeten met guten plus het dagdeel: guten Morgen tot een uur of elf, guten Tag daarna en guten Abend vanaf een uur of zes. Gute Nacht is geen begroeting maar een afscheid vlak voor het slapengaan. Twijfel je? Hallo past altijd en op elk moment van de dag.',
        examples: [
          { target: 'Guten Morgen, Herr Müller!', nl: 'Goedemorgen, meneer Müller!' },
          { target: 'Guten Abend!', nl: 'Goedenavond!' },
          { target: 'Hallo, ich bin Anna.', nl: 'Hallo, ik ben Anna.' },
        ],
      },
      {
        title: 'Ich bin: jezelf voorstellen',
        explanation:
          'Het werkwoord sein (zijn) verandert van vorm per persoon, net als bij ons: ich bin, du bist, er of sie ist. Om jezelf voor te stellen zeg je ich bin plus je naam, precies zoals wij ik ben zeggen. Heb je het over iemand anders, dan wordt bin vanzelf bist of ist.',
        examples: [
          { target: 'Hallo, ich bin Anna.', nl: 'Hallo, ik ben Anna.' },
          { target: 'Du bist Stefan.', nl: 'Jij bent Stefan.' },
          { target: 'Danke, das ist nett.', nl: 'Dank je, dat is aardig.' },
        ],
      },
      {
        title: 'Mir geht es gut',
        explanation:
          'Hoe het met je gaat zeg je in het Duits niet met ich, maar met mir: letterlijk gaat het mij goed. Mir hoort vast bij deze uitdrukking en verandert alleen als je het over een ander hebt, bijvoorbeeld dir geht es gut. De volgordes mir geht es gut en es geht mir gut zijn allebei correct.',
        examples: [
          { target: "Wie geht's?", nl: 'Hoe gaat het?' },
          { target: 'Mir geht es gut.', nl: 'Het gaat goed met mij.' },
          { target: 'Es geht mir gut, danke.', nl: 'Het gaat goed met mij, dank je.' },
        ],
      },
    ],
    phrases: [
      { target: 'Hallo, ich bin Anna.', nl: 'Hallo, ik ben Anna.' },
      { target: 'Guten Morgen, Herr Müller!', nl: 'Goedemorgen, meneer Müller!' },
      { target: "Wie geht's?", nl: 'Hoe gaat het?' },
      { target: 'Danke, gut!', nl: 'Dank je, goed!' },
      { target: 'Nein, danke.', nl: 'Nee, dank je.' },
      { target: 'Tschüss, bis morgen!', nl: 'Doei, tot morgen!' },
    ],
    tip: 'Bitte is een woord met twee gezichten: geef je iemand iets aan, dan betekent het alsjeblieft, en zegt iemand danke tegen jou, dan antwoord je met bitte in de betekenis graag gedaan. Let daarnaast op de ü in tschüss en Müller: dat is geen oe en geen ie, maar allebei tegelijk. Zet je lippen als voor oe en zeg dan ie.',
  },

  'de-u2': {
    intro:
      'Je benoemt en bestelt je eerste eten en drinken. Meteen loop je tegen het bekendste struikelblok van het Duits aan: elk zelfstandig naamwoord heeft een geslacht, en het werkwoord beweegt mee met de persoon.',
    rules: [
      {
        title: 'Der, die of das?',
        explanation:
          'Waar wij de en het hebben, heeft het Duits er drie: der (mannelijk), die (vrouwelijk) en das (onzijdig). Welk lidwoord, het woordje vóór een zelfstandig naamwoord, erbij hoort kun je meestal niet aan het woord zien: der Kaffee, die Milch, das Brot. Leer daarom nooit het kale woord, maar altijd het woord mét zijn lidwoord, alsof het samen één woord is.',
        examples: [
          { target: 'Der Kaffee ist heiß.', nl: 'De koffie is heet.' },
          { target: 'Die Milch ist kalt.', nl: 'De melk is koud.' },
          { target: 'Das Brot ist frisch.', nl: 'Het brood is vers.' },
        ],
      },
      {
        title: 'Werkwoorden krijgen een uitgang',
        explanation:
          'Een werkwoord verandert van uitgang per persoon; dat heet vervoegen. Bij trinken (drinken) gaat dat zo: ich trinke, du trinkst, er of sie trinkt, wir trinken. Je herkent het ritme uit het Nederlands (ik drink, jij drinkt), alleen zet het Duits er bij ich nog een -e achter en bij wir een -en.',
        examples: [
          { target: 'Ich trinke Wasser.', nl: 'Ik drink water.' },
          { target: 'Du trinkst Tee.', nl: 'Jij drinkt thee.' },
          { target: 'Wir trinken Kaffee.', nl: 'Wij drinken koffie.' },
        ],
      },
      {
        title: 'Essen: du isst, niet du esst',
        explanation:
          'Een handjevol veelgebruikte werkwoorden verandert bovendien van klinker, maar alleen bij du en bij er of sie. Bij essen wordt de e een i: ich esse, maar du isst en er isst. Bij wir blijft alles gewoon zoals het is: wir essen.',
        examples: [
          { target: 'Ich esse Brot.', nl: 'Ik eet brood.' },
          { target: 'Du isst Brot.', nl: 'Jij eet brood.' },
          { target: 'Wir essen Brot.', nl: 'Wij eten brood.' },
        ],
      },
    ],
    phrases: [
      { target: 'Ich trinke Kaffee mit Milch.', nl: 'Ik drink koffie met melk.' },
      { target: 'Was trinkst du?', nl: 'Wat drink jij?' },
      { target: 'Der Kaffee ist heiß.', nl: 'De koffie is heet.' },
      { target: 'Wir essen Brot.', nl: 'Wij eten brood.' },
      { target: 'Der Apfel ist rot.', nl: 'De appel is rood.' },
      { target: 'Ich trinke Wasser.', nl: 'Ik drink water.' },
    ],
    tip: 'Duitse zelfstandige naamwoorden krijgen altijd een hoofdletter, ook midden in de zin: ich trinke Kaffee, wir essen Brot. Nederlanders vergeten dat massaal, want bij ons doen we het alleen bij namen. En de ß in heiß is gewoon een scherpe s; kun je hem niet typen, schrijf dan ss (heiss) — dat wordt overal begrepen.',
  },

  'de-u3': {
    intro:
      'Je vertelt wie er bij je horen: moeder, vader, broer, zus en vrienden. Daarbij leer je zeggen dat je iemand hébt, en waarom mijn in het Duits twee vormen heeft.',
    rules: [
      {
        title: 'Mein of meine?',
        explanation:
          'Mijn past zich in het Duits aan bij het geslacht van het woord dat erachter staat. Bij der- en das-woorden zeg je mein (mein Vater, mein Kind), bij die-woorden meine (meine Mutter, meine Schwester). Ken je het lidwoord, dan weet je dus meteen de juiste vorm; daarom loont het om der, die en das er altijd bij te leren.',
        examples: [
          { target: 'Mein Vater ist groß.', nl: 'Mijn vader is groot.' },
          { target: 'Meine Mutter heißt Petra.', nl: 'Mijn moeder heet Petra.' },
          { target: 'Mein Bruder ist jung.', nl: 'Mijn broer is jong.' },
        ],
      },
      {
        title: 'Sein: bin, bist, ist',
        explanation:
          'Sein (zijn) volgt geen enkele regel en moet je uit je hoofd kennen: ich bin, du bist, er of sie ist, wir sind. Gaat je zin over één andere persoon, zoals mijn zus of het kind, dan is het altijd ist. Twee of meer personen krijgen sind.',
        examples: [
          { target: 'Meine Schwester ist jung.', nl: 'Mijn zus is jong.' },
          { target: 'Das Kind ist klein.', nl: 'Het kind is klein.' },
          { target: 'Ich bin Anna.', nl: 'Ik ben Anna.' },
        ],
      },
      {
        title: 'Haben: habe, hast, hat',
        explanation:
          'Ook haben (hebben) is onregelmatig: ich habe, du hast, er of sie hat, wir haben. Let op dat de b verdwijnt bij du en bij er of sie. Verder werkt het net als bij ons: ik heb, jij hebt, hij heeft.',
        examples: [
          { target: 'Ich habe einen Bruder.', nl: 'Ik heb een broer.' },
          { target: 'Mein Bruder hat ein Kind.', nl: 'Mijn broer heeft een kind.' },
          { target: 'Hast du eine Schwester?', nl: 'Heb jij een zus?' },
        ],
      },
      {
        title: 'Ein, eine of einen',
        explanation:
          'Een is ein bij der- en das-woorden en eine bij die-woorden: ein Kind, eine Schwester. Staat het woord achter een werkwoord als haben, dan is het het lijdend voorwerp, dus het ding of de persoon waar de handeling op gericht is, en wordt ein bij mannelijke woorden einen: ich habe einen Bruder. Alleen die mannelijke vorm verandert; eine en ein blijven zoals ze zijn.',
        examples: [
          { target: 'Ich habe einen Bruder und eine Schwester.', nl: 'Ik heb een broer en een zus.' },
          { target: 'Mein Bruder hat ein Kind.', nl: 'Mijn broer heeft een kind.' },
          { target: 'Hast du einen Freund?', nl: 'Heb jij een vriend?' },
        ],
      },
    ],
    phrases: [
      { target: 'Meine Mutter heißt Petra.', nl: 'Mijn moeder heet Petra.' },
      { target: 'Mein Vater ist groß.', nl: 'Mijn vader is groot.' },
      { target: 'Ich habe einen Bruder und eine Schwester.', nl: 'Ik heb een broer en een zus.' },
      { target: 'Meine Schwester wohnt in Berlin.', nl: 'Mijn zus woont in Berlijn.' },
      { target: 'Das Kind ist klein.', nl: 'Het kind is klein.' },
      { target: 'Mein Freund wohnt in Köln.', nl: 'Mijn vriend woont in Keulen.' },
    ],
    tip: 'Pas op met mein Freund: voor Duitsers betekent dat meestal mijn vriendje, dus je partner. Bedoel je een gewone vriend, zeg dan ein Freund von mir. Hetzelfde geldt voor meine Freundin.',
  },

  'de-u4': {
    intro:
      'Je vraagt de weg en begrijpt het antwoord: waar is het station, waar is het hotel, links of rechts. Ook zie je hoe een Duitse vraagzin in elkaar zit.',
    rules: [
      {
        title: 'Vragen met wo',
        explanation:
          'Begin je een vraag met een vraagwoord als wo (waar) of was (wat), dan komt het werkwoord er direct achter en pas daarna de persoon of het ding: Wo ist der Bahnhof? Dat is dezelfde volgorde als in het Nederlands, dus hier kun je op je gevoel varen. Het lidwoord blijft in zo een vraag gewoon staan: der Bahnhof, das Hotel.',
        examples: [
          { target: 'Wo ist der Bahnhof?', nl: 'Waar is het station?' },
          { target: 'Wo ist das Hotel?', nl: 'Waar is het hotel?' },
          { target: 'Wo ist die Straße?', nl: 'Waar is de straat?' },
        ],
      },
      {
        title: 'Nach Berlin: naar een stad of land',
        explanation:
          'Reis je naar een plaatsnaam of naar de meeste landen, dan gebruik je nach: nach Berlin, nach Köln, nach Deutschland. Zu of in klinkt hier voor Duitse oren fout, ook al vertaal je alle drie met naar. Voor gebouwen en personen bestaat een andere vorm; die komt in een latere unit.',
        examples: [
          { target: 'Der Zug fährt nach Berlin.', nl: 'De trein rijdt naar Berlijn.' },
          { target: 'Ich fahre nach Köln.', nl: 'Ik reis naar Keulen.' },
          { target: 'Fährst du nach Hamburg?', nl: 'Reis jij naar Hamburg?' },
        ],
      },
      {
        title: 'Fahren wordt er fährt',
        explanation:
          'Bij een paar veelgebruikte werkwoorden krijgt de a twee puntjes, een umlaut, maar alleen bij du en bij er of sie. Fahren (rijden, reizen) gaat zo: ich fahre, du fährst, er of sie fährt, wir fahren. Der Zug is een hij, dus wordt het der Zug fährt.',
        examples: [
          { target: 'Der Zug fährt nach Berlin.', nl: 'De trein rijdt naar Berlijn.' },
          { target: 'Du fährst nach Köln.', nl: 'Jij reist naar Keulen.' },
          { target: 'Wir fahren nach Hamburg.', nl: 'Wij reizen naar Hamburg.' },
        ],
      },
    ],
    phrases: [
      { target: 'Wo ist der Bahnhof?', nl: 'Waar is het station?' },
      { target: 'Wo ist das Hotel?', nl: 'Waar is het hotel?' },
      { target: 'Das Hotel ist links, nicht rechts.', nl: 'Het hotel is links, niet rechts.' },
      { target: 'Der Zug fährt nach Berlin.', nl: 'De trein rijdt naar Berlijn.' },
      { target: 'Die Stadt ist schön.', nl: 'De stad is mooi.' },
      { target: 'Die Straße ist lang.', nl: 'De straat is lang.' },
    ],
    tip: 'Reken niet op het Nederlands om het geslacht te raden: het station is der Bahnhof en de stad is die Stadt, terwijl het hotel wél das Hotel is. Let ook op Straße: de a is lang, dus straa-se, en de ß spreek je uit als een scherpe s, nooit als een z.',
  },

  'de-u5': {
    intro:
      'Je telt, zegt hoe laat het is en spreekt af wanneer iets gebeurt. Met heute, jetzt en um zwei Uhr maak je een afspraak die niet misgaat.',
    rules: [
      {
        title: 'Het werkwoord staat op plek twee',
        explanation:
          'Zet je een tijdswoord vooraan, zoals heute of jetzt, dan schuift de persoon achter het werkwoord: Heute trinke ich Tee, en niet Heute ich trinke Tee. Het werkwoord blijft koppig op de tweede plaats in de zin. Goed nieuws: in het Nederlands doen we exact hetzelfde (vandaag drink ik thee), dus vertrouw hier op je gevoel.',
        examples: [
          { target: 'Heute trinke ich Tee.', nl: 'Vandaag drink ik thee.' },
          { target: 'Jetzt trinken wir Kaffee.', nl: 'Nu drinken wij koffie.' },
          { target: 'Heute esse ich Brot.', nl: 'Vandaag eet ik brood.' },
        ],
      },
      {
        title: 'Um zwei Uhr of in zehn Minuten?',
        explanation:
          'Um gebruik je voor een tijdstip op de klok: um zwei Uhr betekent om twee uur. In gebruik je voor tijd die nog moet verstrijken: in zehn Minuten betekent over tien minuten. Wij zeggen daar over, en juist daar gaat het mis, want über past hier niet.',
        examples: [
          { target: 'Der Zug fährt um drei Uhr.', nl: 'De trein vertrekt om drie uur.' },
          { target: 'Der Zug fährt in zehn Minuten.', nl: 'De trein vertrekt over tien minuten.' },
          { target: 'Wir essen um fünf Uhr.', nl: 'Wij eten om vijf uur.' },
        ],
      },
      {
        title: 'Es ist zwei Uhr: de klok',
        explanation:
          'De tijd zeg je met es ist plus het getal plus Uhr: Es ist zwei Uhr. Dat es is een loos onderwerp, net als het in het is twee uur; het verwijst nergens naar, maar het Duits kan er niet zonder. Uhr blijft altijd enkelvoud, ook bij tien: es ist zehn Uhr, nooit zehn Uhren.',
        examples: [
          { target: 'Es ist zwei Uhr.', nl: 'Het is twee uur.' },
          { target: 'Es ist zehn Uhr.', nl: 'Het is tien uur.' },
        ],
      },
    ],
    phrases: [
      { target: 'Es ist drei Uhr.', nl: 'Het is drie uur.' },
      { target: 'Der Zug fährt um fünf Uhr.', nl: 'De trein vertrekt om vijf uur.' },
      { target: 'Der Zug fährt in zehn Minuten.', nl: 'De trein vertrekt over tien minuten.' },
      { target: 'Heute trinke ich Tee.', nl: 'Vandaag drink ik thee.' },
      { target: 'Wir essen jetzt.', nl: 'Wij eten nu.' },
      { target: 'Ich habe zwei Brüder.', nl: 'Ik heb twee broers.' },
    ],
    tip: 'De Duitse z klinkt altijd als ts: zwei spreek je uit als tsvai en zehn als tseen. Zeg je hem als onze zachte z, dan hoort een Duitser er een s in en versta je elkaar net niet. Aan de telefoon hoor je trouwens vaak zwo in plaats van zwei, zodat het niet met drei verward wordt.',
  },

  'de-u6': {
    intro:
      'Je doet boodschappen: vragen wat iets kost, zeggen dat iets duur of goedkoop is, en afrekenen. Hier duikt den op, de eerste keer dat een lidwoord van vorm verandert.',
    rules: [
      {
        title: 'Der wordt den',
        explanation:
          'Is een mannelijk woord het lijdend voorwerp, dus het ding waar de handeling op gericht is, dan verandert der in den: der Kaffee, maar ich bezahle den Kaffee. Dat heet de vierde naamval. Alleen der verandert; die en das blijven precies hetzelfde, dus ich kaufe die Milch en ich kaufe das Brot.',
        examples: [
          { target: 'Ich bezahle den Kaffee.', nl: 'Ik betaal de koffie.' },
          { target: 'Ich kaufe den Apfel.', nl: 'Ik koop de appel.' },
          { target: 'Ich kaufe das Brot und die Milch.', nl: 'Ik koop het brood en de melk.' },
        ],
      },
      {
        title: 'Was kostet das?',
        explanation:
          'Kosten past zich aan bij wat er kost: één ding kostet, meerdere dingen kosten. Omdat de stam op een t eindigt, komt er een extra e tussen, want kostt is niet uit te spreken. Naar de prijs vraag je met Was kostet ...? of Wie viel kostet ...?; allebei is goed Duits.',
        examples: [
          { target: 'Was kostet der Apfel?', nl: 'Wat kost de appel?' },
          { target: 'Das Brot kostet zwei Euro.', nl: 'Het brood kost twee euro.' },
          { target: 'Was kosten die Äpfel?', nl: 'Wat kosten de appels?' },
        ],
      },
      {
        title: 'Gaat het over iemand anders? Dan -t',
        explanation:
          'Een naam of een persoon in het enkelvoud gedraagt zich als er of sie en krijgt dus die uitgang: meine Mutter kauft, mein Bruder bezahlt. Praat je over jezelf, dan is het -e (ich kaufe), en tegen iemand anders -st (du kaufst). Zoek dus eerst wie er iets doet en kies daarna pas de uitgang.',
        examples: [
          { target: 'Meine Mutter kauft Brot.', nl: 'Mijn moeder koopt brood.' },
          { target: 'Du kaufst Kaffee.', nl: 'Jij koopt koffie.' },
          { target: 'Wir kaufen Brot und Milch.', nl: 'Wij kopen brood en melk.' },
        ],
      },
    ],
    phrases: [
      { target: 'Was kostet das Brot?', nl: 'Wat kost het brood?' },
      { target: 'Das Brot kostet zwei Euro.', nl: 'Het brood kost twee euro.' },
      { target: 'Ich bezahle den Kaffee.', nl: 'Ik betaal de koffie.' },
      { target: 'Hast du Geld?', nl: 'Heb jij geld?' },
      { target: 'Das ist teuer.', nl: 'Dat is duur.' },
      { target: 'Der Supermarkt ist links.', nl: 'De supermarkt is links.' },
    ],
    tip: 'Billig lijkt op ons billijk, maar het betekent goedkoop, en soms zelfs goedkoop in de zin van waardeloos. Vind je een prijs redelijk, zeg dan günstig: dat klinkt positief. Bedragen blijven trouwens enkelvoud: zehn Euro, nooit zehn Euros.',
  },

  'de-u7': {
    intro:
      'Je vertelt waar en hoe je woont, en benoemt de kamers en meubels om je heen. Je krijgt hier bovendien twee trucjes om het geslacht van een woord te raden.',
    rules: [
      {
        title: 'Het woordeinde verraadt het lidwoord',
        explanation:
          'Je kunt het geslacht vaak afleiden uit het einde van een woord. Alles wat op -ung eindigt is die: die Wohnung, die Zeitung. Woorden die op een doffe -e eindigen zijn meestal ook die, zoals die Küche en die Straße, en verkleinwoorden op -chen zijn altijd das.',
        examples: [
          { target: 'Die Wohnung ist klein.', nl: 'De woning is klein.' },
          { target: 'Die Küche ist neu.', nl: 'De keuken is nieuw.' },
          { target: 'Die Straße ist lang.', nl: 'De straat is lang.' },
        ],
      },
      {
        title: 'Wohnen in Hamburg',
        explanation:
          'Woon je in een stad of land, dan gebruik je in plus de naam: ich wohne in Hamburg. Verwar dat niet met nach, dat je alleen gebruikt als je ergens naartoe reist. In staat dus voor waar je bent, nach voor waar je heen gaat.',
        examples: [
          { target: 'Ich wohne in Hamburg.', nl: 'Ik woon in Hamburg.' },
          { target: 'Wo wohnst du?', nl: 'Waar woon jij?' },
          { target: 'Meine Schwester wohnt in Berlin.', nl: 'Mijn zus woont in Berlijn.' },
        ],
      },
      {
        title: 'Twee dingen samen: sind',
        explanation:
          'Gaat je zin over meer dan één ding of persoon, dan wordt ist meteen sind: der Tisch und das Bett sind neu. Ook wir krijgt sind. Andere werkwoorden doen dan hetzelfde en eindigen op -en: wir wohnen in Köln.',
        examples: [
          { target: 'Der Tisch und das Bett sind neu.', nl: 'De tafel en het bed zijn nieuw.' },
          { target: 'Das Haus ist groß.', nl: 'Het huis is groot.' },
          { target: 'Wir wohnen in Köln.', nl: 'Wij wonen in Keulen.' },
        ],
      },
    ],
    phrases: [
      { target: 'Ich wohne in Hamburg.', nl: 'Ik woon in Hamburg.' },
      { target: 'Wo wohnst du?', nl: 'Waar woon jij?' },
      { target: 'Mein Zimmer ist schön.', nl: 'Mijn kamer is mooi.' },
      { target: 'Das Haus ist groß.', nl: 'Het huis is groot.' },
      { target: 'Wo ist die Küche?', nl: 'Waar is de keuken?' },
      { target: 'Die Wohnung ist klein.', nl: 'De woning is klein.' },
    ],
    tip: 'Let op het verschil tussen die Küche (de keuken) en der Kuchen (de taart): één letter, en toch sta je met een bord gebak in plaats van bij het fornuis. Denk er ook aan dat das Zimmer onzijdig is terwijl wij de kamer zeggen; het Nederlandse lidwoord helpt je hier niet.',
  },

  'de-u8': {
    intro:
      'Je vertelt wat je doet en waar: werken, leren, schrijven. Onderweg ontdek je waarom het du arbeitest is en niet du arbeitst.',
    rules: [
      {
        title: 'Een extra e bij arbeiten',
        explanation:
          'Eindigt de stam van een werkwoord op een t of een d, dan schuift er een e tussen de stam en de uitgang: du arbeitest, er arbeitet. Zonder die e zou je arbeitst moeten uitspreken, en dat lukt niemand. Bij ich en wir verandert er niets: ich arbeite, wir arbeiten.',
        examples: [
          { target: 'Ich arbeite in Berlin.', nl: 'Ik werk in Berlijn.' },
          { target: 'Du arbeitest heute.', nl: 'Jij werkt vandaag.' },
          { target: 'Mein Bruder arbeitet in Hamburg.', nl: 'Mijn broer werkt in Hamburg.' },
        ],
      },
      {
        title: 'Na ist blijft het woord kaal',
        explanation:
          'Een bijvoeglijk naamwoord, dus een woord dat zegt hoe iets is, krijgt geen uitgang wanneer het achter ist staat: die Schule ist neu, das Büro ist groß. Zet je het vóór het zelfstandig naamwoord, dan wél: die neue Schule. In deze unit heb je alleen die kale vorm nodig.',
        examples: [
          { target: 'Die Schule ist neu und groß.', nl: 'De school is nieuw en groot.' },
          { target: 'Das Buch ist gut.', nl: 'Het boek is goed.' },
          { target: 'Das Büro ist groß.', nl: 'Het kantoor is groot.' },
        ],
      },
      {
        title: 'Ich lerne Deutsch',
        explanation:
          'Talen schrijf je in het Duits met een hoofdletter en zonder lidwoord: ich lerne Deutsch. Wij zeggen soms ik leer het Duits, maar dat lidwoord laat je hier weg. De taalnaam komt gewoon achter het werkwoord, net als bij ons.',
        examples: [
          { target: 'Ich lerne Deutsch.', nl: 'Ik leer Duits.' },
          { target: 'Lernst du Deutsch?', nl: 'Leer jij Duits?' },
        ],
      },
    ],
    phrases: [
      { target: 'Ich arbeite in Berlin.', nl: 'Ik werk in Berlijn.' },
      { target: 'Ich lerne Deutsch.', nl: 'Ik leer Duits.' },
      { target: 'Die Arbeit beginnt um zehn Uhr.', nl: 'Het werk begint om tien uur.' },
      { target: 'Ich schreibe eine E-Mail.', nl: 'Ik schrijf een e-mail.' },
      { target: 'Das Buch ist gut.', nl: 'Het boek is goed.' },
      { target: 'Der Lehrer heißt Herr Braun.', nl: 'De leraar heet meneer Braun.' },
    ],
    tip: 'Ons leren betekent twee dingen: zelf iets opnemen én het aan een ander bijbrengen. Het Duits houdt die twee streng uit elkaar: lernen is leren voor jezelf, lehren of unterrichten is lesgeven. Zeg je Ich lehre Deutsch, dan sta je dus voor de klas.',
  },

  'de-u9': {
    intro:
      'Je houdt een gesprek gaande: zeggen dat je iets niet begrijpt, om hulp vragen en zelf vragen stellen. Hier komt ook de beleefde vorm Sie langs.',
    rules: [
      {
        title: 'Sie: u zeggen tegen iemand',
        explanation:
          'Tegen iemand die je niet kent gebruik je Sie in plaats van du, precies zoals wij u zeggen. Het werkwoord krijgt dan de -en-vorm: Sprechen Sie Deutsch? Sie schrijf je altijd met een hoofdletter, ook midden in de zin; dat is het verschil met sie, dat zij betekent.',
        examples: [
          { target: 'Sprechen Sie Deutsch?', nl: 'Spreekt u Duits?' },
          { target: 'Können Sie mir helfen?', nl: 'Kunt u mij helpen?' },
          { target: 'Verstehen Sie das?', nl: 'Begrijpt u dat?' },
        ],
      },
      {
        title: 'Wer, wo, warum, wie viel',
        explanation:
          'Een vraagwoord zet het werkwoord meteen achter zich en pas daarna de persoon: Warum lernst du Deutsch? Wer betekent wie, wo betekent waar, warum betekent waarom en wie viel betekent hoeveel. Wie viel bestaat uit twee woorden, maar werkt als één vraagwoord.',
        examples: [
          { target: 'Wer ist das?', nl: 'Wie is dat?' },
          { target: 'Warum lernst du Deutsch?', nl: 'Waarom leer jij Duits?' },
          { target: 'Wie viel kostet das Zimmer?', nl: 'Hoeveel kost de kamer?' },
        ],
      },
      {
        title: 'Nicht staat achteraan',
        explanation:
          'Wil je een hele zin ontkennen, dan zet je nicht zo ver mogelijk naar achteren: Ich verstehe das nicht. Dat voelt vertrouwd, want wij zeggen ook ik begrijp het niet. Ontken je één specifiek woord, dan komt nicht er vlak vóór: Das Hotel ist nicht rechts.',
        examples: [
          { target: 'Ich verstehe das nicht.', nl: 'Ik begrijp het niet.' },
          { target: 'Ich verstehe Sie nicht.', nl: 'Ik begrijp u niet.' },
          { target: 'Das Hotel ist nicht rechts.', nl: 'Het hotel is niet rechts.' },
        ],
      },
      {
        title: 'Sprechen wordt du sprichst',
        explanation:
          'Sprechen hoort bij de werkwoorden die van klinker wisselen, net als essen: de e wordt een i bij du en bij er of sie. Dus ich spreche, maar du sprichst en er spricht. Bij wir en bij Sie blijft het gewoon sprechen.',
        examples: [
          { target: 'Ich spreche ein bisschen Deutsch.', nl: 'Ik spreek een beetje Duits.' },
          { target: 'Sprichst du Deutsch?', nl: 'Spreek jij Duits?' },
          { target: 'Sprechen Sie Deutsch?', nl: 'Spreekt u Duits?' },
        ],
      },
    ],
    phrases: [
      { target: 'Entschuldigung, wo ist der Bahnhof?', nl: 'Pardon, waar is het station?' },
      { target: 'Ich spreche ein bisschen Deutsch.', nl: 'Ik spreek een beetje Duits.' },
      { target: 'Ich verstehe das nicht.', nl: 'Ik begrijp het niet.' },
      { target: 'Sprechen Sie Deutsch?', nl: 'Spreekt u Duits?' },
      { target: 'Wie viel kostet das Zimmer?', nl: 'Hoeveel kost de kamer?' },
      { target: 'Ja, natürlich!', nl: 'Ja, natuurlijk!' },
    ],
    tip: 'Hier trapt bijna elke Nederlander in: wer betekent wie en wo betekent waar. Met Wo ist das? vraag je waar iets is, met Wer ist das? vraag je wie iemand is. En was betekent wat, niet wie. Drie korte woordjes die je even uit je hoofd moet stampen.',
  },

  'de-u10': {
    intro:
      'Je regelt een reis: een kaartje kopen, weten wanneer je vertrekt en aankomt, en zeggen waar je heen gaat. Je maakt kennis met werkwoorden die in tweeën breken.',
    rules: [
      {
        title: 'Werkwoorden die in tweeën breken',
        explanation:
          'Sommige werkwoorden bestaan uit een klein voorzetsel plus een werkwoord: ab plus fahren, an plus kommen. In een gewone zin springt dat eerste stukje naar het einde: Der Zug fährt um neun Uhr ab. Precies zoals wij het met aankomen doen: de trein komt om negen uur aan.',
        examples: [
          { target: 'Der Zug fährt um neun Uhr ab.', nl: 'De trein vertrekt om negen uur.' },
          { target: 'Wir kommen um zehn Uhr an.', nl: 'Wij komen om tien uur aan.' },
          { target: 'Wann kommt der Bus an?', nl: 'Wanneer komt de bus aan?' },
        ],
      },
      {
        title: 'Nach of zum?',
        explanation:
          'Nach gebruik je bij steden en landen: nach München, nach Wien. Zu gebruik je bij gebouwen en personen, en dat smelt samen met het lidwoord: zu plus dem wordt zum, zu plus der wordt zur. Vandaar wir fahren zum Flughafen, want het is der Flughafen.',
        examples: [
          { target: 'Das Flugzeug fliegt nach Wien.', nl: 'Het vliegtuig vliegt naar Wenen.' },
          { target: 'Wir fahren zum Flughafen.', nl: 'Wij rijden naar het vliegveld.' },
          { target: 'Wir fahren nach Berlin.', nl: 'Wij reizen naar Berlijn.' },
        ],
      },
      {
        title: 'Mit dem Bus',
        explanation:
          'Na mit verandert het lidwoord: der en das worden allebei dem, en die wordt der. Dat is de derde naamval, en die gebruik je onder meer om te zeggen waarmee je reist. Je hoeft de hele tabel nu niet te kennen; onthoud mit dem als vaste combinatie bij vervoermiddelen.',
        examples: [
          { target: 'Wir fahren mit dem Bus zum Flughafen.', nl: 'Wij rijden met de bus naar het vliegveld.' },
          { target: 'Ich fahre mit dem Zug nach Berlin.', nl: 'Ik reis met de trein naar Berlijn.' },
          { target: 'Fährst du mit dem Bus?', nl: 'Ga jij met de bus?' },
        ],
      },
    ],
    phrases: [
      { target: 'Ich brauche eine Fahrkarte nach München.', nl: 'Ik heb een kaartje naar München nodig.' },
      { target: 'Wann fährt der Zug ab?', nl: 'Wanneer vertrekt de trein?' },
      { target: 'Der Bus kommt in zehn Minuten.', nl: 'De bus komt over tien minuten.' },
      { target: 'Wir fahren mit dem Bus zum Flughafen.', nl: 'Wij rijden met de bus naar het vliegveld.' },
      { target: 'Mein Koffer ist schwer.', nl: 'Mijn koffer is zwaar.' },
      { target: 'Die Reise nach Berlin ist lang.', nl: 'De reis naar Berlijn is lang.' },
    ],
    tip: 'Der Koffer en der Kaffee schelen maar één klank en toch een wereld. Koffer heeft een korte o en een doffe -er aan het eind; Kaffee klinkt als kaf-fee met een duidelijke ee. Vraag je op het perron naar je Kaffee terwijl je je bagage bedoelt, dan kijkt niemand op van de koffie die je krijgt.',
  },

  'de-u11': {
    intro:
      'Je vertelt hoe je je voelt en je redt je bij de dokter of de apotheek. Dit zijn de zinnen die je wilt kennen vóór je ze nodig hebt.',
    rules: [
      {
        title: 'Mein Kopf tut weh',
        explanation:
          'Pijn druk je uit met wehtun, letterlijk zeer doen. Het lichaamsdeel is dan het onderwerp en tut is de vorm van tun (doen) bij er of sie: mein Kopf tut weh. Machen betekent ook doen of maken, maar past hier niet; wehtun is een vaste combinatie.',
        examples: [
          { target: 'Mein Kopf tut weh.', nl: 'Mijn hoofd doet pijn.' },
          { target: 'Mein Bauch tut weh.', nl: 'Mijn buik doet pijn.' },
          { target: 'Tut das weh?', nl: 'Doet dat pijn?' },
        ],
      },
      {
        title: 'Ich bin krank, ich habe Fieber',
        explanation:
          'Voor hoe je je voelt gebruik je sein plus een bijvoeglijk naamwoord: ich bin krank, ich bin müde. Voor een klacht die je als het ware bij je draagt gebruik je haben plus een zelfstandig naamwoord zonder lidwoord: ich habe Fieber. Kies dus haben bij koorts en honger, en sein bij ziek en moe.',
        examples: [
          { target: 'Ich bin heute krank.', nl: 'Ik ben vandaag ziek.' },
          { target: 'Das Kind hat Fieber.', nl: 'Het kind heeft koorts.' },
          { target: 'Ich bin müde.', nl: 'Ik ben moe.' },
        ],
      },
      {
        title: 'Zum Arzt, zur Apotheke',
        explanation:
          'Ga je naar een persoon of een gebouw, dan gebruik je zu, en dat versmelt met het lidwoord: bij der- en das-woorden wordt het zum, bij die-woorden zur. Der Arzt geeft dus zum Arzt en die Apotheke geeft zur Apotheke. Nach past hier niet; dat bewaar je voor steden en landen.',
        examples: [
          { target: 'Ich gehe morgen zum Arzt.', nl: 'Ik ga morgen naar de dokter.' },
          { target: 'Ich gehe zur Apotheke.', nl: 'Ik ga naar de apotheek.' },
          { target: 'Wir fahren zum Bahnhof.', nl: 'Wij gaan naar het station.' },
        ],
      },
      {
        title: 'Und plakt twee zinnen aan elkaar',
        explanation:
          'Met und (en), oder (of) en aber (maar) verbind je twee zinnen zonder dat er iets aan de woordvolgorde verandert. Is het onderwerp in beide helften hetzelfde, dan hoef je het niet te herhalen: Ich bin müde und gehe ins Bett. Het werkwoord blijft na und gewoon op zijn plek staan.',
        examples: [
          { target: 'Ich bin müde und gehe ins Bett.', nl: 'Ik ben moe en ga naar bed.' },
          { target: 'Das Kind ist krank und hat Fieber.', nl: 'Het kind is ziek en heeft koorts.' },
          { target: 'Ich bin krank und gehe zum Arzt.', nl: 'Ik ben ziek en ga naar de dokter.' },
        ],
      },
    ],
    phrases: [
      { target: 'Ich bin heute krank.', nl: 'Ik ben vandaag ziek.' },
      { target: 'Mein Kopf tut weh.', nl: 'Mijn hoofd doet pijn.' },
      { target: 'Können Sie mir helfen?', nl: 'Kunt u mij helpen?' },
      { target: 'Ich gehe morgen zum Arzt.', nl: 'Ik ga morgen naar de dokter.' },
      { target: 'Die Apotheke ist neben dem Bahnhof.', nl: 'De apotheek is naast het station.' },
      { target: 'Ich bin müde.', nl: 'Ik ben moe.' },
    ],
    tip: 'Medicijnen haal je in Duitsland bij de Apotheke; een Drogerie verkoopt tandpasta en shampoo, maar geen medicijnen. Let ook op de ü in müde: die klinkt als een oe waarbij je je lippen tuit alsof je ie zegt. Zeg je moede, dan word je nog wel begrepen, maar hoort iedereen meteen waar je vandaan komt.',
  },

  'de-u12': {
    intro:
      'Je praat over het weer en de seizoenen, het gesprek dat overal ter wereld werkt. Je leert ook waarom het im Winter is en niet in dem Winter.',
    rules: [
      {
        title: 'Im Winter: in en dem samen',
        explanation:
          'Bij seizoenen en maanden zeg je in plus het lidwoord dem, en die twee smelten altijd samen tot im: im Winter, im Sommer, im Juli. In dem Winter zeggen Duitsers alleen als ze één heel specifieke winter bedoelen, dus in de praktijk nooit. Bij dagen van de week gebruik je am: am Montag.',
        examples: [
          { target: 'Im Winter liegt Schnee.', nl: 'In de winter ligt er sneeuw.' },
          { target: 'Im Frühling ist alles grün.', nl: 'In de lente is alles groen.' },
          { target: 'Im Herbst regnet es viel.', nl: 'In de herfst regent het veel.' },
        ],
      },
      {
        title: 'Het regent: es regnet',
        explanation:
          'Weerzinnen beginnen met es, net zoals bij ons met het: es regnet, es schneit, es ist kalt. Dat es verwijst nergens naar, maar je mag het nooit weglaten. Zet je een ander woord vooraan, dan schuift es achter het werkwoord: Im Winter ist es kalt.',
        examples: [
          { target: 'Es regnet und es ist kalt.', nl: 'Het regent en het is koud.' },
          { target: 'Im Winter ist es kalt.', nl: 'In de winter is het koud.' },
          { target: 'Es schneit im Winter.', nl: 'Het sneeuwt in de winter.' },
        ],
      },
      {
        title: 'Alle seizoenen zijn der',
        explanation:
          'De vier seizoenen zijn zonder uitzondering mannelijk: der Frühling, der Sommer, der Herbst, der Winter. Datzelfde geldt voor de dagen van de week en de maanden, dus der Montag en der Januar. Dit is een van de weinige plekken waar je het lidwoord niet apart hoeft te leren.',
        examples: [
          { target: 'Der Sommer ist warm.', nl: 'De zomer is warm.' },
          { target: 'Der Winter in Berlin ist kalt.', nl: 'De winter in Berlijn is koud.' },
          { target: 'Der Herbst ist schön.', nl: 'De herfst is mooi.' },
        ],
      },
    ],
    phrases: [
      { target: 'Das Wetter ist heute schön.', nl: 'Het weer is vandaag mooi.' },
      { target: 'Die Sonne scheint.', nl: 'De zon schijnt.' },
      { target: 'Im Winter ist es kalt.', nl: 'In de winter is het koud.' },
      { target: 'Im Herbst regnet es viel.', nl: 'In de herfst regent het veel.' },
      { target: 'Der Schnee ist weiß.', nl: 'De sneeuw is wit.' },
      { target: 'Der Sommer ist warm und schön.', nl: 'De zomer is warm en mooi.' },
    ],
    tip: 'Wij zeggen in de winter, en dat verleidt Nederlanders tot in dem Winter of zelfs in Winter. Het is altijd im Winter, want in en dem zijn tot één woord samengetrokken. En weiß kent twee betekenissen: der Schnee ist weiß betekent wit, maar ich weiß betekent ik weet.',
  },

  'de-u13': {
    intro:
      'Je maakt een avond rond: naar de bioscoop, uit eten, samen naar een concert. Hier leer je het verschil tussen waar je heen gaat en waar je al bent.',
    rules: [
      {
        title: 'Ins of im?',
        explanation:
          'Ga je ergens naar binnen, dan gebruik je ins: wir gehen ins Kino. Ben je er al en gebeurt het dáár, dan gebruik je im: wir essen im Restaurant. Het Nederlands maakt dat verschil niet, want wij zeggen in beide gevallen naar of in. Vraag jezelf dus af: beweeg ik ernaartoe, of ben ik er?',
        examples: [
          { target: 'Wir gehen ins Kino.', nl: 'Wij gaan naar de bioscoop.' },
          { target: 'Wir essen im Restaurant.', nl: 'Wij eten in het restaurant.' },
          { target: 'Ich gehe ins Bett.', nl: 'Ik ga naar bed.' },
        ],
      },
      {
        title: 'Gern: iets graag doen',
        explanation:
          'Doe je iets graag, dan zet je gern vlak achter het werkwoord: ich höre gern Musik. Een apart werkwoord voor houden van heb je hier niet nodig, want gern doet al het werk. Let er ook op dat hören geen voorzetsel krijgt: in het Duits luister je Musik, niet naar Musik.',
        examples: [
          { target: 'Ich höre gern Musik.', nl: 'Ik luister graag naar muziek.' },
          { target: 'Wir gehen gern ins Kino.', nl: 'Wij gaan graag naar de bioscoop.' },
          { target: 'Mein Freund hört gern Musik.', nl: 'Mijn vriend luistert graag naar muziek.' },
        ],
      },
      {
        title: 'Een vraag zonder vraagwoord',
        explanation:
          'Wil je een ja-of-nee-vraag stellen, dan zet je het werkwoord helemaal vooraan: Gehen wir zusammen ins Kino? Er komt geen extra hulpwoordje bij, anders dan in het Engels. Ook dit doen wij precies zo: gaan wij samen naar de bioscoop?',
        examples: [
          { target: 'Gehen wir zusammen ins Kino?', nl: 'Gaan wij samen naar de bioscoop?' },
          { target: 'Ist das Museum heute offen?', nl: 'Is het museum vandaag open?' },
          { target: 'Kommst du heute Abend?', nl: 'Kom jij vanavond?' },
        ],
      },
    ],
    phrases: [
      { target: 'Wir gehen heute Abend ins Kino.', nl: 'Wij gaan vanavond naar de bioscoop.' },
      { target: 'Was machst du heute Abend?', nl: 'Wat doe je vanavond?' },
      { target: 'Der Film ist sehr gut.', nl: 'De film is erg goed.' },
      { target: 'Das Konzert beginnt um acht Uhr.', nl: 'Het concert begint om acht uur.' },
      { target: 'Ich höre gern Musik.', nl: 'Ik luister graag naar muziek.' },
      { target: 'Das Museum ist heute offen.', nl: 'Het museum is vandaag open.' },
    ],
    tip: 'Vanavond is in het Duits heute Abend, letterlijk vandaag avond, en Abend krijgt een hoofdletter omdat het een zelfstandig naamwoord is. Schrijf dus niet heute abend. Let ook op morgen: heute Morgen betekent vanochtend, maar morgen in je eentje betekent de dag van morgen.',
  },

  'de-u14': {
    intro:
      'Alles komt samen: reizen, gezondheid, weer en uitgaan in één ronde. Deze gids zet de vier dingen op een rij die in de vorige units het vaakst misgaan.',
    rules: [
      {
        title: 'Mir of mich?',
        explanation:
          'Helfen (helpen) hoort bij een klein groepje werkwoorden dat mir eist in plaats van mich: Können Sie mir helfen? Wij zeggen kunt u mij helpen, en dat mij lijkt zo op mich dat het bijna altijd fout gaat. Dezelfde mir ken je al uit mir geht es gut; ook danken werkt zo.',
        examples: [
          { target: 'Können Sie mir helfen?', nl: 'Kunt u mij helpen?' },
          { target: 'Mir geht es gut.', nl: 'Het gaat goed met mij.' },
          { target: 'Hilfst du mir?', nl: 'Help jij mij?' },
        ],
      },
      {
        title: 'Nach, zum, ins of im?',
        explanation:
          'Het Duits heeft vier woordjes waar wij naar of in zeggen. Nach hoort bij steden en landen, zum en zur bij gebouwen en personen, ins als je een ruimte binnengaat en im als je er al bent. Vraag jezelf dus af: is het een plaatsnaam, ga ik ergens heen, of ben ik er?',
        examples: [
          { target: 'Wir fahren mit dem Zug nach Berlin.', nl: 'Wij reizen met de trein naar Berlijn.' },
          { target: 'Ich gehe zum Arzt.', nl: 'Ik ga naar de dokter.' },
          { target: 'Wir gehen ins Kino und essen im Restaurant.', nl: 'Wij gaan naar de bioscoop en eten in het restaurant.' },
        ],
      },
      {
        title: 'Het losse stukje komt achteraan',
        explanation:
          'Werkwoorden als ankommen en abfahren vallen in een gewone zin uit elkaar: het voorvoegsel schuift naar het einde en alles wat erbij hoort staat ertussen. Der Bus kommt in zehn Minuten an. Vergeet je dat stukje, dan verandert de betekenis, want kommen is komen en ankommen is aankomen.',
        examples: [
          { target: 'Der Bus kommt in zehn Minuten an.', nl: 'De bus komt over tien minuten aan.' },
          { target: 'Der Zug fährt um acht Uhr ab.', nl: 'De trein vertrekt om acht uur.' },
          { target: 'Wann kommen wir an?', nl: 'Wanneer komen wij aan?' },
        ],
      },
      {
        title: 'Sein of haben?',
        explanation:
          'Gaat het over een eigenschap, dan gebruik je sein: das Wetter ist schön, das Kind ist müde. Gaat het over iets wat iemand heeft of mankeert, dan haben: das Kind hat Fieber, ich habe Geld. In één zin kunnen ze rustig naast elkaar staan, elk met hun eigen vorm.',
        examples: [
          { target: 'Das Kind hat Fieber und ist müde.', nl: 'Het kind heeft koorts en is moe.' },
          { target: 'Das Wetter ist heute schön.', nl: 'Het weer is vandaag mooi.' },
          { target: 'Ich habe zwei Brüder.', nl: 'Ik heb twee broers.' },
        ],
      },
    ],
    phrases: [
      { target: 'Wo ist der Bahnhof?', nl: 'Waar is het station?' },
      { target: 'Können Sie mir helfen?', nl: 'Kunt u mij helpen?' },
      { target: 'Wir fahren mit dem Zug nach Berlin.', nl: 'Wij reizen met de trein naar Berlijn.' },
      { target: 'Das Wetter ist heute schön.', nl: 'Het weer is vandaag mooi.' },
      { target: 'Wir gehen heute Abend ins Kino.', nl: 'Wij gaan vanavond naar de bioscoop.' },
      { target: 'Tschüss, bis morgen!', nl: 'Doei, tot morgen!' },
    ],
    tip: 'Sie met een hoofdletter betekent u, sie met een kleine letter betekent zij. In gesproken Duits klinken ze identiek en beslist de situatie, maar in een bericht is die hoofdletter geen detail: sie können betekent zij kunnen, Sie können betekent u kunt. Blijf tegen onbekenden Sie zeggen tot zij zelf du voorstellen; dat gaat in Duitsland formeler dan bij ons.',
  },
}
