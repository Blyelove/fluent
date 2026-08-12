import type { UnitGuide } from '../../types'

export const guides: Record<string, UnitGuide> = {
  'en-u1': {
    intro:
      'Je opent een gesprek in het Engels: groeten, vragen hoe het gaat en netjes afscheid nemen. Met deze handvol zinnen kom je overal ter wereld binnen.',
    rules: [
      {
        title: 'Am, is of are?',
        explanation:
          'Het werkwoord “to be” (zijn) verandert van vorm per persoon: I am, you are, he/she/it is, we/they are. Dat is precies wat je in het Nederlands ook doet met ik ben, jij bent, hij is. Eén verschil: bij “you” is het altijd are, of je nu tegen één persoon of tegen een hele groep praat.',
        examples: [
          { target: 'Hello, I am Tom.', nl: 'Hallo, ik ben Tom.' },
          { target: 'How are you?', nl: 'Hoe gaat het met je?' },
          { target: 'Emma is my friend.', nl: 'Emma is mijn vriendin.' },
        ],
      },
      {
        title: "De korte vorm: I am wordt I'm",
        explanation:
          "In gewoon gesproken Engels plak je het werkwoord vast aan het onderwerp: I am wordt I'm en you are wordt you're. Het stukje dat je weglaat vervang je door een apostrof. De betekenis blijft exact hetzelfde; de korte vorm klinkt alleen natuurlijker en minder plechtig.",
        examples: [
          { target: "I'm fine, thanks.", nl: 'Het gaat goed, dank je.' },
          { target: "Sorry, I'm late.", nl: 'Sorry, ik ben te laat.' },
          { target: "I'm Emma.", nl: 'Ik ben Emma.' },
        ],
      },
      {
        title: 'How are you? — een vraag bouwen',
        explanation:
          'In een vraag zet je het werkwoord vóór de persoon: niet “How you are?” maar “How are you?”. Eerst komt het vraagwoord (how = hoe), dan het werkwoord are, dan pas you. Antwoorden mag kort — “Fine, thanks.” — of met een hele zin: “I am fine, thank you.”',
        examples: [
          { target: 'How are you, James?', nl: 'Hoe gaat het, James?' },
          { target: "I'm fine, thank you.", nl: 'Het gaat goed, dank je wel.' },
        ],
      },
      {
        title: 'Groeten op het juiste moment',
        explanation:
          'Britten groeten met “good” plus het deel van de dag: good morning tot ongeveer twaalf uur, good afternoon daarna en good evening vanaf een uur of zes. “Good night” is géén begroeting maar een afscheid vlak voor het slapengaan. Twijfel je? “Hello” past altijd en op elk moment van de dag.',
        examples: [
          { target: 'Good morning, Emma.', nl: 'Goedemorgen, Emma.' },
          { target: 'Hello, nice to meet you.', nl: 'Hallo, leuk je te ontmoeten.' },
          { target: 'Goodbye, see you tomorrow.', nl: 'Tot ziens, tot morgen.' },
        ],
      },
    ],
    phrases: [
      { target: 'Hello, nice to meet you.', nl: 'Hallo, leuk je te ontmoeten.' },
      { target: 'Good morning, Emma.', nl: 'Goedemorgen, Emma.' },
      { target: 'How are you?', nl: 'Hoe gaat het?' },
      { target: "I'm fine, thanks.", nl: 'Het gaat goed, dank je.' },
      { target: "Sorry, I'm late.", nl: 'Sorry, ik ben te laat.' },
      { target: 'Goodbye, see you tomorrow.', nl: 'Tot ziens, tot morgen.' },
    ],
    tip: 'Het woordje “I” schrijf je in het Engels altijd met een hoofdletter, ook midden in de zin: “Sorry, I am late.” Let daarnaast op de th van “thank you”: dat is geen t, maar een zachte blaasklank met je tongpunt tussen je tanden. “Tenk joe” verraadt je meteen als Nederlander.',
  },

  'en-u2': {
    intro:
      'Je bestelt eten en drinken in een Brits café en zegt er beleefd bij wat je wilt. Na deze unit red je je bij elke toonbank en op elk terras.',
    rules: [
      {
        title: 'A, an of the?',
        explanation:
          'A en an betekenen allebei “een” en horen bij iets dat je nog niet eerder noemde. Je kiest an als het volgende woord met een klinkerklank begint, simpelweg omdat “a apple” lastig uitspreekt. Het gaat om de klank en niet om de letter: an apple, maar a university (want dat klinkt als “joe”). Weet de ander al precies welk ding je bedoelt, dan gebruik je the (de of het): the coffee is hot.',
        examples: [
          { target: 'I would like an apple.', nl: 'Ik wil graag een appel.' },
          { target: 'I would like a cup of tea.', nl: 'Ik wil graag een kopje thee.' },
          { target: 'A coffee and an apple, please.', nl: 'Een koffie en een appel, alsjeblieft.' },
          { target: 'The coffee is hot.', nl: 'De koffie is heet.' },
        ],
      },
      {
        title: 'Een kopje thee: a cup of tea',
        explanation:
          'Noem je een hoeveelheid, dan zet je “of” tussen de maat en het product: a cup of tea, a glass of water. Dat of mag je nooit weglaten, want “a cup tea” bestaat niet. In het Nederlands plak je de woorden gewoon aan elkaar (een kopje thee), dus juist dit vergeet je snel.',
        examples: [
          { target: 'A cup of tea, please.', nl: 'Een kopje thee, alsjeblieft.' },
          { target: 'A glass of water, please.', nl: 'Een glas water, alsjeblieft.' },
          { target: 'I would like a cup of coffee.', nl: 'Ik wil graag een kopje koffie.' },
        ],
      },
      {
        title: 'Beleefd bestellen met I would like',
        explanation:
          '“I want” betekent letterlijk “ik wil”, maar klinkt aan een balie kortaf, bijna als een bevel. Gebruik daarom “I would like” — dat is de normale, vriendelijke manier om iets te bestellen. Zet je er ook nog “please” achter, dan zit je altijd goed.',
        examples: [
          { target: 'I would like a coffee, please.', nl: 'Ik wil graag een koffie, alsjeblieft.' },
          { target: 'I would like a cheese sandwich.', nl: 'Ik wil graag een broodje kaas.' },
          { target: 'I would like tea with milk.', nl: 'Ik wil graag thee met melk.' },
        ],
      },
      {
        title: 'The coffee is hot: is bij één ding',
        explanation:
          'Gaat je zin over één ding, dan gebruik je is: the coffee is hot, the bread is fresh. Gaat het over meerdere dingen, dan wordt het are: the apples are green. Het is dezelfde keuze die je in het Nederlands maakt tussen “is” en “zijn”.',
        examples: [
          { target: 'The coffee is hot.', nl: 'De koffie is heet.' },
          { target: 'The bread is fresh.', nl: 'Het brood is vers.' },
          { target: 'The apples are green.', nl: 'De appels zijn groen.' },
        ],
      },
    ],
    phrases: [
      { target: 'A cup of tea, please.', nl: 'Een kopje thee, alsjeblieft.' },
      { target: 'Tea with milk, please.', nl: 'Thee met melk, alsjeblieft.' },
      { target: 'I would like a coffee, please.', nl: 'Ik wil graag een koffie, alsjeblieft.' },
      { target: 'A cheese sandwich, please.', nl: 'Een broodje kaas, alsjeblieft.' },
      { target: 'A glass of water, please.', nl: 'Een glas water, alsjeblieft.' },
    ],
    tip: 'Nederlanders vertalen “ik wil graag” vaak met “I want”, maar dat klinkt in een café als een bevel: zeg “I would like” of “Could I have a coffee, please?”. Let ook op de th van “the”: tongpunt tegen je tanden, nooit een d. Voor een klinker klinkt “the” bovendien als “thie”: the apple, maar the bread.',
  },

  'en-u3': {
    intro:
      'Je stelt je familie en vrienden voor en vertelt wie wat doet. Hier komt ook de beruchte -s aan het werkwoord voor het eerst langs.',
    rules: [
      {
        title: 'De -s bij he, she en it',
        explanation:
          'In de tegenwoordige tijd krijgt het werkwoord een -s als het onderwerp he, she of it is, of één persoon zoals “my father”. Bij I, you, we en they blijft het werkwoord kaal. Het Nederlands doet iets vergelijkbaars (ik werk, hij werkt), maar in het Engels is dit bij bijna elk werkwoord de énige verandering — juist daarom vergeet je hem zo makkelijk.',
        examples: [
          { target: 'My father works in London.', nl: 'Mijn vader werkt in Londen.' },
          { target: 'I work in London.', nl: 'Ik werk in Londen.' },
          { target: 'My friends work in London.', nl: 'Mijn vrienden werken in Londen.' },
        ],
      },
      {
        title: 'Have of has?',
        explanation:
          'Het werkwoord “to have” (hebben) volgt dezelfde regel, maar heeft een eigen vorm: I, you, we en they have, en he, she en it has. Je zegt dus niet “my sister have”, maar “my sister has a cat”. Zie je één persoon of een naam staan? Dan is het has.',
        examples: [
          { target: 'My sister has a cat.', nl: 'Mijn zus heeft een kat.' },
          { target: 'The woman has two children.', nl: 'De vrouw heeft twee kinderen.' },
          { target: 'I have two brothers.', nl: 'Ik heb twee broers.' },
        ],
      },
      {
        title: 'Meervoud: één child, twee children',
        explanation:
          'De meeste Engelse woorden worden meervoud met een -s: friend wordt friends, sister wordt sisters. Een klein groepje oude woorden verandert van binnen in plaats daarvan: child wordt children, man wordt men, woman wordt women. Die leer je uit je hoofd, want “childs” bestaat niet.',
        examples: [
          { target: 'The child is playing outside.', nl: 'Het kind speelt buiten.' },
          { target: 'The woman has two children.', nl: 'De vrouw heeft twee kinderen.' },
          { target: 'Tom and Sarah are my friends.', nl: 'Tom en Sarah zijn mijn vrienden.' },
        ],
      },
      {
        title: 'My, your, his, her',
        explanation:
          'Om te zeggen van wie iets is, zet je een bezittelijk woord vóór het zelfstandig naamwoord: my (mijn), your (jouw), his (zijn), her (haar), our (ons). Anders dan in het Nederlands verandert dat woord nooit van vorm: my brother, my sister, my children. Pas op met “me”: dat betekent “mij” en kan hier nooit staan.',
        examples: [
          { target: 'Sarah is my sister.', nl: 'Sarah is mijn zus.' },
          { target: 'My mother is at home.', nl: 'Mijn moeder is thuis.' },
          { target: 'Tom is my best friend.', nl: 'Tom is mijn beste vriend.' },
        ],
      },
    ],
    phrases: [
      { target: 'My mother is at home.', nl: 'Mijn moeder is thuis.' },
      { target: 'My father works in London.', nl: 'Mijn vader werkt in Londen.' },
      { target: 'My brother is ten.', nl: 'Mijn broer is tien.' },
      { target: 'My sister has a cat.', nl: 'Mijn zus heeft een kat.' },
      { target: 'Tom is my best friend.', nl: 'Tom is mijn beste vriend.' },
      { target: 'The woman has two children.', nl: 'De vrouw heeft twee kinderen.' },
    ],
    tip: 'Wij zeggen moeiteloos “hij werkt”, maar in het Engels vergeten Nederlanders massaal die ene -s: “he work” is de fout die je in Groot-Brittannië het vaakst hoort. Loop je zin dus na op he, she en it — staat daar een werkwoord zonder -s, dan klopt er iets niet.',
  },

  'en-u4': {
    intro:
      'Je vraagt de weg, benoemt plekken in de stad en begrijpt het antwoord dat je krijgt. Onderweg leer je welke voorzetsels de Britten gebruiken waar wij iets heel anders zeggen.',
    rules: [
      {
        title: 'Where is of where are?',
        explanation:
          'Vraag je naar één ding, dan gebruik je is: Where is the station? Gaat het om meerdere dingen, dan wordt het are: Where are the shops? Het werkwoord kijkt dus naar het woord dat erachter staat, niet naar het vraagwoord ervoor.',
        examples: [
          { target: 'Where is the station?', nl: 'Waar is het station?' },
          { target: 'Where are the shops?', nl: 'Waar zijn de winkels?' },
          { target: 'Where is the bus to London?', nl: 'Waar is de bus naar Londen?' },
        ],
      },
      {
        title: 'In, on, at en over there',
        explanation:
          'Engels kiest zijn voorzetsel per situatie, en die keuze loopt lang niet altijd gelijk met het Nederlands. Je woont in een straat (I live in this street), iets ligt aan een kant met on (on the right) en je slaat af bij een gebouw met at (turn left at the station). Voor “daar, verderop” bestaat de vaste combinatie “over there”.',
        examples: [
          { target: 'I live in this street.', nl: 'Ik woon in deze straat.' },
          { target: 'The shop is on the right.', nl: 'De winkel is aan de rechterkant.' },
          { target: 'The station is over there.', nl: 'Het station is daar.' },
        ],
      },
      {
        title: 'Turn left: iemand de weg wijzen',
        explanation:
          'Een opdracht geef je in het Engels met het kale werkwoord, zonder onderwerp: “Turn left” betekent “sla linksaf”. Dat werkt net als in het Nederlands, waar je ook geen “jij” toevoegt. Wil je het vriendelijker maken, plak er dan “please” achter.',
        examples: [
          { target: 'Turn left at the station.', nl: 'Sla linksaf bij het station.' },
          { target: 'Turn right at the shop.', nl: 'Sla rechtsaf bij de winkel.' },
        ],
      },
      {
        title: 'The bus leaves: de -s ook bij dingen',
        explanation:
          'Niet alleen he en she krijgen die -s aan het werkwoord, maar ook elk ding waar je “it” tegen kunt zeggen. Een bus is een it, dus: the bus leaves, the shop opens. Zijn het er meerdere, dan valt de -s weer weg: the shops open at nine.',
        examples: [
          { target: 'The bus leaves at ten.', nl: 'De bus vertrekt om tien uur.' },
          { target: 'The shop opens at nine.', nl: 'De winkel gaat om negen uur open.' },
          { target: 'The shops open at nine.', nl: 'De winkels gaan om negen uur open.' },
        ],
      },
      {
        title: 'A big city of the station?',
        explanation:
          'A (of an voor een klinkerklank) gebruik je als je iets voor het eerst noemt of als het niet om een bepaald exemplaar gaat: London is a big city. The gebruik je zodra duidelijk is wélk exemplaar je bedoelt: the station, the shop on the right. Daarom vraag je “Where is the station?” en niet “Where is a station?” — je zoekt hét station hier in de buurt.',
        examples: [
          { target: 'London is a big city.', nl: 'Londen is een grote stad.' },
          { target: 'Where is the station?', nl: 'Waar is het station?' },
          { target: 'The shop is on the right.', nl: 'De winkel is aan de rechterkant.' },
        ],
      },
    ],
    phrases: [
      { target: 'Where is the station?', nl: 'Waar is het station?' },
      { target: 'Turn left at the station.', nl: 'Sla linksaf bij het station.' },
      { target: 'The shop is on the right.', nl: 'De winkel is aan de rechterkant.' },
      { target: 'The station is over there.', nl: 'Het station is daar.' },
      { target: 'Where is the bus to London?', nl: 'Waar is de bus naar Londen?' },
      { target: 'I live in this street.', nl: 'Ik woon in deze straat.' },
    ],
    tip: 'Wij zeggen “op straat”, maar in Brits Engels woon en loop je “in the street”; “on the street” hoor je vooral in Amerika. En “aan de rechterkant” is “on the right”, nooit “at the right”. Spreek je iemand aan om de weg te vragen, begin dan met “Excuse me” en niet met “Sorry” — dat laatste betekent voor Britten vooral “het spijt me”.',
  },

  'en-u5': {
    intro:
      'Je telt tot tien, zegt hoe laat het is en maakt afspraken. De Engelse manier om de klok te lezen zit net even anders in elkaar dan de onze.',
    rules: [
      {
        title: 'Half past nine is half tien',
        explanation:
          'Bij “past” rekenen Engelsen vanaf het uur dat net geweest is. “Half past nine” betekent letterlijk “een half uur voorbij negen”, dus 9:30 — wat wij half tien noemen. Voor een heel uur gebruik je “o’clock”: it is three o’clock.',
        examples: [
          { target: "It's three o'clock.", nl: 'Het is drie uur.' },
          { target: 'The shop opens at half past nine.', nl: 'De winkel gaat om half tien open.' },
          { target: 'What time is it?', nl: 'Hoe laat is het?' },
        ],
      },
      {
        title: 'At + tijdstip',
        explanation:
          'Bij een kloktijd hoort altijd het voorzetsel at: at ten, at half past nine. Je gebruikt hier nooit on of in, want die zijn voor dagen en maanden. Onthoud het als één vaste combinatie: at plus een tijd.',
        examples: [
          { target: 'The bus to London leaves at ten.', nl: 'De bus naar Londen vertrekt om tien uur.' },
          { target: 'The shop opens at half past nine.', nl: 'De winkel gaat om half tien open.' },
          { target: 'The train leaves at ten.', nl: 'De trein vertrekt om tien uur.' },
        ],
      },
      {
        title: 'I have, she has',
        explanation:
          'Bij tellen vertel je vaak hoeveel je ergens van hebt. Het werkwoord “to have” is have bij I, you, we en they, en has bij he, she en it. Kijk dus naar wie het heeft, niet naar hoeveel het er zijn: “I have two sisters” tegenover “My sister has four cats”.',
        examples: [
          { target: 'I have two sisters.', nl: 'Ik heb twee zussen.' },
          { target: 'My sister has four cats.', nl: 'Mijn zus heeft vier katten.' },
          { target: 'I have two brothers.', nl: 'Ik heb twee broers.' },
        ],
      },
      {
        title: 'Het lege “it” bij tijd',
        explanation:
          'Een Engelse zin heeft altijd een onderwerp nodig, ook als er niemand iets doet. Bij de tijd vul je dat gat met it: It is three o’clock, What time is it? Je vertaalt dat it niet apart — het is precies het “het” uit “Het is drie uur”. Staat er wél een echt ding voorop, dan gebruik je gewoon is: the bus is late.',
        examples: [
          { target: "It's four o'clock.", nl: 'Het is vier uur.' },
          { target: 'What time is it, Tom?', nl: 'Hoe laat is het, Tom?' },
          { target: "It's half past nine.", nl: 'Het is half tien.' },
        ],
      },
    ],
    phrases: [
      { target: 'What time is it?', nl: 'Hoe laat is het?' },
      { target: "It's three o'clock.", nl: 'Het is drie uur.' },
      { target: 'The shop opens at half past nine.', nl: 'De winkel gaat om half tien open.' },
      { target: 'The bus is late.', nl: 'De bus is laat.' },
      { target: "Sorry, I'm late.", nl: 'Sorry, ik ben te laat.' },
      { target: 'I have two sisters.', nl: 'Ik heb twee zussen.' },
    ],
    tip: 'Dit is dé klassieker: half tien heet in het Engels “half past nine”, niet “half ten”. Zeg je “half ten” tegen een Brit, dan hoort die 10:30 en sta je een uur verkeerd. Reken bij “half” dus altijd één uur terug ten opzichte van het Nederlands.',
  },

  'en-u6': {
    intro:
      'Je doet boodschappen, vraagt naar de prijs en rekent af. Je leert bovendien hoe een Engelse vraag in elkaar zit als er een gewoon werkwoord in staat.',
    rules: [
      {
        title: 'How much is of how much are?',
        explanation:
          'Vraag je naar de prijs van één ding, dan is het “How much is the cheese?”. Gaat het om meerdere dingen, dan wordt het “How much are the apples?”. Het werkwoord past zich dus aan het product aan, net als bij Where is en Where are.',
        examples: [
          { target: 'How much is the cheese?', nl: 'Hoeveel kost de kaas?' },
          { target: 'How much are the apples?', nl: 'Hoeveel kosten de appels?' },
          { target: 'The apples are cheap today.', nl: 'De appels zijn vandaag goedkoop.' },
        ],
      },
      {
        title: 'Can I ...? — vragen of iets mag',
        explanation:
          '“Can” betekent kunnen of mogen. Het is een helper: een woordje dat vóór het echte werkwoord komt en er samen mee één geheel vormt. In een vraag staat can helemaal vooraan en blijft het werkwoord erna kaal. Dus “Can I pay with my card?” — geen to pay en geen pays. Deze vorm gebruik je de hele dag door om beleefd iets te vragen.',
        examples: [
          { target: 'Can I pay with my card?', nl: 'Kan ik met mijn kaart betalen?' },
          { target: 'Can I have a coffee, please?', nl: 'Mag ik een koffie, alsjeblieft?' },
        ],
      },
      {
        title: 'Would like to + werkwoord',
        explanation:
          'Wil je zeggen wat je van plan bent te doen, dan komt na “I would like” het woordje to plus het hele werkwoord: I would like to buy apples. Vergelijk het met “ik wil graag appels kopen” — alleen staat het werkwoord in het Engels vooraan in plaats van achteraan. Gaat het om een ding en niet om een handeling, dan valt to weg: I would like a coffee.',
        examples: [
          { target: 'I would like to buy apples.', nl: 'Ik wil graag appels kopen.' },
          { target: 'I would like to pay, please.', nl: 'Ik wil graag betalen, alsjeblieft.' },
          { target: 'I would like to buy bread and cheese.', nl: 'Ik wil graag brood en kaas kopen.' },
        ],
      },
      {
        title: 'The bread costs: -s bij prijzen',
        explanation:
          'Brood is één ding, dus een it, en dan krijgt het werkwoord zijn -s: the bread costs two pounds. Zijn het er meer, dan verdwijnt die -s: the apples cost two pounds. Let ook op de munt zelf: bij meer dan één wordt pound gewoon pounds.',
        examples: [
          { target: 'The bread costs two pounds.', nl: 'Het brood kost twee pond.' },
          { target: 'The apples cost three pounds.', nl: 'De appels kosten drie pond.' },
          { target: 'That is three pounds, please.', nl: 'Dat is drie pond, alsjeblieft.' },
        ],
      },
    ],
    phrases: [
      { target: 'How much is the cheese?', nl: 'Hoeveel kost de kaas?' },
      { target: 'Can I pay with my card?', nl: 'Kan ik met mijn kaart betalen?' },
      { target: 'That is three pounds, please.', nl: 'Dat is drie pond, alsjeblieft.' },
      { target: 'The apples are cheap today.', nl: 'De appels zijn vandaag goedkoop.' },
      { target: 'I would like to buy bread and cheese.', nl: 'Ik wil graag brood en kaas kopen.' },
      { target: 'The coffee is very expensive.', nl: 'De koffie is erg duur.' },
    ],
    tip: 'Nederlanders bouwen een vraag door het werkwoord naar voren te halen, en dan wordt “Hoeveel kost het brood?” al snel “How much costs the bread?”. Dat kan in het Engels niet. Zeg “How much is the bread?” of, met hulpwerkwoord, “How much does the bread cost?”.',
  },

  'en-u7': {
    intro:
      'Je beschrijft je huis, je kamer en waar de spullen staan. De voorzetsels in, on en at bepalen hier of je zin natuurlijk klinkt.',
    rules: [
      {
        title: 'The children play: geen -s bij meervoud',
        explanation:
          'De -s aan het werkwoord hoort alleen bij één persoon of ding, dus bij he, she en it. “The children” zijn er meer, en dan blijft het werkwoord kaal: the children play. Vergelijk: the child plays, met -s, want dat is er één.',
        examples: [
          { target: 'The children play in the garden.', nl: 'De kinderen spelen in de tuin.' },
          { target: 'The child plays in the garden.', nl: 'Het kind speelt in de tuin.' },
          { target: 'The cat sleeps on my bed.', nl: 'De kat slaapt op mijn bed.' },
        ],
      },
      {
        title: 'In, on of at?',
        explanation:
          'Gebruik in als iets zich bínnen een ruimte of gebied bevindt: in the garden, in the kitchen, in a quiet street. Gebruik on als iets ergens bovenop ligt of staat: on the table, on my bed. At gebruik je voor een punt of adres: at home, at the station.',
        examples: [
          { target: 'The tea is on the table.', nl: 'De thee staat op de tafel.' },
          { target: 'The children play in the garden.', nl: 'De kinderen spelen in de tuin.' },
          { target: 'Our house is in a quiet street.', nl: 'Ons huis staat in een rustige straat.' },
        ],
      },
      {
        title: 'This chair, that house',
        explanation:
          'This gebruik je voor iets dat dichtbij is (deze of dit) en that voor iets verderop (die of dat). Gaat het om meerdere dingen, dan worden ze these en those, en wordt is meteen ook are: this chair is old, these chairs are old. Het woord zelf verandert verder nooit: this chair, this room, this house.',
        examples: [
          { target: 'This chair is very old.', nl: 'Deze stoel is erg oud.' },
          { target: 'This room is small.', nl: 'Deze kamer is klein.' },
          { target: 'These chairs are very old.', nl: 'Deze stoelen zijn erg oud.' },
        ],
      },
      {
        title: 'My, our: van wie is het?',
        explanation:
          'Voor “ons” en “onze” gebruik je in het Engels altijd hetzelfde woord: our house, our garden, our children. Het Nederlands wisselt tussen ons en onze, het Engels niet. Dat geldt ook voor my, your, his, her en their — die veranderen nooit van vorm.',
        examples: [
          { target: 'Our house has a big garden.', nl: 'Ons huis heeft een grote tuin.' },
          { target: 'My room is small.', nl: 'Mijn kamer is klein.' },
          { target: 'My bed is in my room.', nl: 'Mijn bed staat in mijn kamer.' },
        ],
      },
    ],
    phrases: [
      { target: 'Our house is in a quiet street.', nl: 'Ons huis staat in een rustige straat.' },
      { target: 'The kitchen is very big.', nl: 'De keuken is erg groot.' },
      { target: 'My room is small.', nl: 'Mijn kamer is klein.' },
      { target: 'The window is open.', nl: 'Het raam staat open.' },
      { target: 'The tea is on the table.', nl: 'De thee staat op de tafel.' },
      { target: 'The children play in the garden.', nl: 'De kinderen spelen in de tuin.' },
    ],
    tip: 'Wij laten dingen staan, liggen of zitten: de thee staat op tafel, het raam staat open. Het Engels doet dat bijna nooit en gebruikt simpelweg is: the tea is on the table, the window is open. Vertaal “staan” hier dus niet met “stands” — dat klinkt alsof je thee rechtop in de houding staat.',
  },

  'en-u8': {
    intro:
      'Je vertelt wat je doet, waar je werkt en wat je op school leert. Je oefent hier met werkwoorden die van vorm wisselen en met voorzetsels die net anders liggen dan bij ons.',
    rules: [
      {
        title: 'I learn, she learns',
        explanation:
          'In de tegenwoordige tijd heeft bijna elk Engels werkwoord maar twee vormen: de kale vorm en de vorm met -s. Die -s komt er alleen bij he, she en it, of bij één persoon of ding zoals “my work”. Twee werkwoorden wijken af: to have wordt has (she has a new job) en to be wordt am, is of are.',
        examples: [
          { target: 'I learn English at school.', nl: 'Ik leer Engels op school.' },
          { target: 'My work starts at nine.', nl: 'Mijn werk begint om negen uur.' },
          { target: 'She has a new job.', nl: 'Zij heeft een nieuwe baan.' },
        ],
      },
      {
        title: 'In an office, to school, by bus',
        explanation:
          'Waar je werkt zeg je met in: I work in an office. Waar je naartoe gaat met to: the children go to school. Hoe je reist met by: by bus, by train — en daar staat nooit een lidwoord bij, dus niet “by the bus”.',
        examples: [
          { target: 'I work in an office in the city.', nl: 'Ik werk op een kantoor in de stad.' },
          { target: 'The children go to school by bus.', nl: 'De kinderen gaan met de bus naar school.' },
        ],
      },
      {
        title: 'About is het Nederlandse “over”',
        explanation:
          'Gaat een boek, film of gesprek érgens over, dan gebruik je about: this book is about London. Het Engelse woord “over” bestaat wel, maar betekent boven of overheen. “This book is over London” klinkt dus alsof het boek boven de stad zweeft.',
        examples: [
          { target: 'This book is about London.', nl: 'Dit boek gaat over Londen.' },
          { target: 'This book is about a teacher.', nl: 'Dit boek gaat over een leraar.' },
        ],
      },
      {
        title: 'Work of job?',
        explanation:
          '“Job” is de baan die je hebt. Banen kun je tellen — één baan, twee banen — dus zet je er a voor: she has a new job. “Work” is het werk zelf, en dat tel je niet: je zegt “I have a lot of work”, maar nooit “a work”. Daarnaast is to work gewoon het werkwoord werken: I work in an office.',
        examples: [
          { target: 'She has a new job.', nl: 'Zij heeft een nieuwe baan.' },
          { target: 'My work starts at nine.', nl: 'Mijn werk begint om negen uur.' },
          { target: 'I work in an office.', nl: 'Ik werk op een kantoor.' },
        ],
      },
    ],
    phrases: [
      { target: 'I work in an office in the city.', nl: 'Ik werk op een kantoor in de stad.' },
      { target: 'My work starts at nine.', nl: 'Mijn werk begint om negen uur.' },
      { target: 'I am very busy today.', nl: 'Ik ben erg druk vandaag.' },
      { target: 'I learn English at school.', nl: 'Ik leer Engels op school.' },
      { target: 'Our teacher is very friendly.', nl: 'Onze leraar is erg aardig.' },
      { target: 'The children go to school by bus.', nl: 'De kinderen gaan met de bus naar school.' },
    ],
    tip: 'Let op het valse vriendje “over”: dit boek gaat over Londen is “about London”, niet “over London”. En omdat wij op kantoor en op school zitten, zeggen Nederlanders al snel “on the office” of “on school” — in het Engels is het “in an office” en “at school”.',
  },

  'en-u9': {
    intro:
      'Je vraagt om herhaling, zegt dat je iets niet begrijpt en houdt een gesprek op gang. Hier zie je hoe Engelse vragen en ontkenningen echt in elkaar zitten.',
    rules: [
      {
        title: 'Vragen met do: Do you speak English?',
        explanation:
          'Voor een vraag met een gewoon werkwoord zet het Engels het hulpwoordje do vooraan: Do you speak English? Het hoofdwerkwoord blijft daarbij kaal, dus niet “Do you speaks”. Bij he, she en it wordt do het woordje does, en dan verhuist de -s naar dat hulpwoord: Does she speak English?',
        examples: [
          { target: 'Do you speak English?', nl: 'Spreek je Engels?' },
          { target: 'Does she speak English?', nl: 'Spreekt zij Engels?' },
          { target: 'Do you understand?', nl: 'Begrijp je het?' },
        ],
      },
      {
        title: "Ontkennen met don't",
        explanation:
          "Om te zeggen dat je iets níet doet, gebruik je do not — in spreektaal don't — vóór het kale werkwoord: I don't understand. Bij he, she en it wordt dat doesn't: she doesn't understand. Het woordje not alleen is niet genoeg, want “I not understand” bestaat niet.",
        examples: [
          { target: "Sorry, I don't understand.", nl: 'Sorry, ik begrijp het niet.' },
          { target: "I don't understand the teacher.", nl: 'Ik begrijp de leraar niet.' },
          { target: "She doesn't speak English.", nl: 'Zij spreekt geen Engels.' },
        ],
      },
      {
        title: 'How much, what time, where',
        explanation:
          'Engelse vragen beginnen vaak met een vast vraagwoord: where (waar), what time (hoe laat) en how much (hoeveel). Vraag je naar een prijs, dan is het altijd how much, terwijl how in zijn eentje gewoon “hoe” betekent. Direct achter het vraagwoord komt het werkwoord.',
        examples: [
          { target: 'Excuse me, how much is the cheese?', nl: 'Pardon, hoeveel kost de kaas?' },
          { target: 'Excuse me, where is the station?', nl: 'Pardon, waar is het station?' },
          { target: 'What time is it?', nl: 'Hoe laat is het?' },
        ],
      },
      {
        title: 'Na maybe draait de zin niet om',
        explanation:
          'Zet je maybe (misschien) vooraan, dan blijft de rest van de zin gewoon in de normale volgorde staan: Maybe the shop is open. In het Nederlands wisselen onderwerp en werkwoord van plek (“Misschien ís de winkel open”), maar het Engels doet dat niet. Dezelfde regel geldt na woorden als today en of course.',
        examples: [
          { target: 'Maybe the shop is open.', nl: 'Misschien is de winkel open.' },
          { target: 'Maybe tomorrow, I am busy today.', nl: 'Misschien morgen, ik ben vandaag druk.' },
          { target: 'Maybe my teacher is at school.', nl: 'Misschien is mijn leraar op school.' },
        ],
      },
      {
        title: 'I think the tea is good — “dat” laat je weg',
        explanation:
          'Zeg je wat je denkt of hoopt, dan volgt in het Nederlands “dat”: ik denk dát de thee goed is. In het Engels laat je dat woordje meestal gewoon weg en plak je de tweede zin er direct achter: I think the tea is very good. De volgorde blijft daarbij normaal — eerst het onderwerp, dan het werkwoord.',
        examples: [
          { target: 'I think the tea is very good.', nl: 'Ik denk dat de thee erg goed is.' },
          { target: 'I think the coffee here is very good.', nl: 'Ik denk dat de koffie hier erg goed is.' },
        ],
      },
    ],
    phrases: [
      { target: 'Excuse me, where is the station?', nl: 'Pardon, waar is het station?' },
      { target: "Sorry, I don't understand.", nl: 'Sorry, ik begrijp het niet.' },
      { target: 'Do you speak English?', nl: 'Spreek je Engels?' },
      { target: 'Can you say that again, please?', nl: 'Kun je dat opnieuw zeggen, alsjeblieft?' },
      { target: 'Of course, no problem.', nl: 'Natuurlijk, geen probleem.' },
      { target: 'See you later!', nl: 'Tot straks!' },
    ],
    tip: 'Het grootste struikelblok is de omgekeerde zin. Wij zeggen “Misschien is de winkel open” en “Vandaag ben ik druk”, maar het Engels houdt vast aan onderwerp eerst: “Maybe the shop is open”, “Today I am busy”. Draai je toch om, dan klinkt je zin als een vraag.',
  },

  'en-u10': {
    intro:
      'Je koopt een kaartje, vraagt naar het perron en vertelt over je vakantie. Reizen in het Engels betekent vooral: de juiste voorzetsels kennen.',
    rules: [
      {
        title: 'By bus, by train: zonder lidwoord',
        explanation:
          'Hoe je ergens komt zeg je met by plus het vervoermiddel, en daar hoort geen the of a bij: by bus, by train, by car. “With the bus” is een letterlijke vertaling van ons “met de bus” en klinkt fout. Alleen te voet wijkt af: dat is on foot.',
        examples: [
          { target: 'I travel to work by bus.', nl: 'Ik reis met de bus naar mijn werk.' },
          { target: 'In summer I travel by train.', nl: 'In de zomer reis ik met de trein.' },
        ],
      },
      {
        title: 'Dienstregelingen in de tegenwoordige tijd',
        explanation:
          'Voor vaste tijden — treinen, bussen, openingstijden — gebruikt het Engels de gewone tegenwoordige tijd, ook als het over morgen gaat: the train leaves at ten. Omdat “the train” een it is, krijgt het werkwoord zijn -s: leaves, arrives, opens. Dat werkt precies zoals in het Nederlands: de trein vertrekt om tien uur.',
        examples: [
          { target: 'The train leaves at ten.', nl: 'De trein vertrekt om tien uur.' },
          { target: 'The train arrives at six.', nl: 'De trein komt om zes uur aan.' },
          { target: 'The train to Manchester leaves at ten.', nl: 'De trein naar Manchester vertrekt om tien uur.' },
        ],
      },
      {
        title: 'On holiday, from platform two, near the station',
        explanation:
          'Sommige combinaties leer je als één geheel, omdat ze niet logisch te vertalen zijn. Je bent “on holiday”, een trein vertrekt “from platform two” en iets ligt “near the station”. Achter near zet je geen to: near the station is de gewone vorm.',
        examples: [
          { target: 'We are on holiday in Scotland.', nl: 'We zijn op vakantie in Schotland.' },
          { target: 'The train leaves from platform two.', nl: 'De trein vertrekt van perron twee.' },
          { target: 'The hotel is near the station.', nl: 'Het hotel is vlak bij het station.' },
        ],
      },
      {
        title: 'A ticket to London: waarheen met to',
        explanation:
          'De bestemming geef je aan met to: a ticket to York, the train to Manchester, I travel to work. Waar je vandaan komt is from. Gebruik hier geen for: “a ticket for York” hoor je soms wel, maar to is de gewone vorm aan het loket.',
        examples: [
          { target: 'A ticket to York, please.', nl: 'Een kaartje naar York, alsjeblieft.' },
          { target: 'A ticket to London, please.', nl: 'Een kaartje naar Londen, alsjeblieft.' },
          { target: 'I travel to work by bus.', nl: 'Ik reis met de bus naar mijn werk.' },
        ],
      },
    ],
    phrases: [
      { target: 'A ticket to York, please.', nl: 'Een kaartje naar York, alsjeblieft.' },
      { target: 'The train leaves from platform two.', nl: 'De trein vertrekt van perron twee.' },
      { target: 'The train arrives at six.', nl: 'De trein komt om zes uur aan.' },
      { target: 'The hotel is near the station.', nl: 'Het hotel is vlak bij het station.' },
      { target: 'We are on holiday in Scotland.', nl: 'We zijn op vakantie in Schotland.' },
      { target: 'My suitcase is very heavy.', nl: 'Mijn koffer is erg zwaar.' },
    ],
    tip: '“Met de bus” wordt “by bus” en niet “with the bus”, en dat geldt voor elk vervoermiddel. Let ook op het woord voor vakantie: Britten gaan “on holiday”, Amerikanen “on vacation”. In Groot-Brittannië gebruik je “vacation” dus beter niet.',
  },

  'en-u11': {
    intro:
      'Je zegt hoe je je voelt, vertelt wat er pijn doet en vraagt om hulp. Precies de zinnen die je hoopt nooit nodig te hebben, maar wel wilt kennen.',
    rules: [
      {
        title: 'Would like verandert nooit',
        explanation:
          'Would hoort bij het werkwoord dat erna komt en krijgt zelf nooit een -s, ook niet bij he, she of it: I would like, she would like. Het werkwoord dat erop volgt staat in de hele vorm, met to ervoor: she would like to see a doctor. Dus niet “she would likes” en niet “she would like see”.',
        examples: [
          { target: 'I would like to see a doctor.', nl: 'Ik wil graag een dokter zien.' },
          { target: 'She would like to see a doctor.', nl: 'Ze wil graag een dokter zien.' },
        ],
      },
      {
        title: 'My head hurts: één hoofd, dus -s',
        explanation:
          'Wat er pijn doet vertel je met het werkwoord to hurt. Gaat het om één lichaamsdeel, dan krijgt het werkwoord de bekende -s: my head hurts. Zijn het er twee, dan valt die -s weg: my hands hurt.',
        examples: [
          { target: 'My head hurts.', nl: 'Mijn hoofd doet pijn.' },
          { target: 'My head hurts a lot.', nl: 'Mijn hoofd doet erg pijn.' },
          { target: 'My hands hurt.', nl: 'Mijn handen doen pijn.' },
        ],
      },
      {
        title: 'Is of are bij lichaamsdelen',
        explanation:
          'Ook bij “to be” telt het aantal: my hand is cold bij één hand, my hands are cold bij twee. Het meervoud herken je aan de -s achter het zelfstandig naamwoord, en daar hoort dan are bij. Bij he, she en it is het altijd is: she is much better now.',
        examples: [
          { target: 'My hands are cold.', nl: 'Mijn handen zijn koud.' },
          { target: 'She is much better now.', nl: 'Ze is nu veel beter.' },
          { target: 'Emma is ill, she is at home.', nl: 'Emma is ziek, ze is thuis.' },
        ],
      },
      {
        title: 'At home, with water',
        explanation:
          '“Thuis” is in het Engels at home, zonder lidwoord; “at the home” betekent iets heel anders, namelijk in een tehuis. Neem je een medicijn ergens mee in, dan gebruik je with: take this medicine with water. Zulke combinaties volgen geen regel, dus je leert ze als geheel.',
        examples: [
          { target: 'Emma is ill, she is at home.', nl: 'Emma is ziek, ze is thuis.' },
          { target: 'Take this medicine with water.', nl: 'Neem dit medicijn met water.' },
          { target: 'My mother is at home.', nl: 'Mijn moeder is thuis.' },
        ],
      },
    ],
    phrases: [
      { target: 'I would like to see a doctor.', nl: 'Ik wil graag een dokter zien.' },
      { target: 'My head hurts.', nl: 'Mijn hoofd doet pijn.' },
      { target: 'I am very tired today.', nl: 'Ik ben erg moe vandaag.' },
      { target: 'I am ill.', nl: 'Ik ben ziek.' },
      { target: 'Take this medicine with water.', nl: 'Neem dit medicijn met water.' },
      { target: 'I am much better now.', nl: 'Ik ben nu veel beter.' },
    ],
    tip: 'Zeg niet “I have pain in my head”: dat is een letterlijke vertaling van “ik heb pijn in mijn hoofd” en klinkt houterig. Britten zeggen “My head hurts” of “I have a headache”. En ziek is in Groot-Brittannië meestal “ill”; “sick” betekent daar vaak letterlijk misselijk.',
  },

  'en-u12': {
    intro:
      'Je praat over regen, zon en de vier seizoenen — het favoriete gespreksonderwerp van elke Brit. Je leert ook het verschil tussen wat vaak gebeurt en wat nu gebeurt.',
    rules: [
      {
        title: 'Het weer begint met het lege it',
        explanation:
          'Een Engelse zin kan niet zonder onderwerp. Is er niemand die iets doet, dan vul je dat gat met it: it rains, it is cold. Je vertaalt dat it niet apart — het is hetzelfde “het” als in “het regent”. Laat je het weg (“Is cold outside”), dan klinkt de zin onaf. Noem je wél iets concreets, dan is dát het onderwerp: the sun is shining. Gaat het over meerdere dingen, dan wordt is natuurlijk are: the parks are green.',
        examples: [
          { target: 'It is cold outside.', nl: 'Het is koud buiten.' },
          { target: 'It often rains in England.', nl: 'Het regent vaak in Engeland.' },
          { target: 'The sun is shining today.', nl: 'De zon schijnt vandaag.' },
          { target: 'In spring the parks are green.', nl: 'In de lente zijn de parken groen.' },
        ],
      },
      {
        title: 'It rains of it is raining?',
        explanation:
          'Voor iets dat regelmatig of altijd zo is, gebruik je de gewone tegenwoordige tijd: it often rains in England. Voor iets dat op dit moment bezig is, gebruik je am, is of are plus het werkwoord met -ing: the sun is shining today. Het Nederlands maakt dat verschil niet, dus vraag jezelf af: gaat het over een gewoonte of over nu?',
        examples: [
          { target: 'It often rains in England.', nl: 'Het regent vaak in Engeland.' },
          { target: 'The sun is shining today.', nl: 'De zon schijnt vandaag.' },
          { target: 'It is raining now.', nl: 'Het regent nu.' },
        ],
      },
      {
        title: 'Often staat vóór het werkwoord',
        explanation:
          'Woorden die zeggen hoe vaak iets gebeurt — often (vaak), always (altijd), never (nooit) — komen in het Engels vlak vóór het gewone werkwoord: it often rains. Alleen bij “to be” springen ze erachter: it is often cold. In het Nederlands staat “vaak” juist verderop in de zin, dus hier moet je even omschakelen.',
        examples: [
          { target: 'It often rains in autumn.', nl: 'Het regent vaak in de herfst.' },
          { target: 'It is often cold in winter.', nl: 'Het is vaak koud in de winter.' },
        ],
      },
      {
        title: 'In summer, in winter',
        explanation:
          'Bij seizoenen hoort het voorzetsel in: in summer, in autumn, in spring. Het lidwoord the laat je daarbij meestal weg, terwijl wij juist “in de zomer” zeggen. Bij maanden geldt hetzelfde (in July), maar bij dagen wordt het on: on Monday.',
        examples: [
          { target: 'In summer we eat outside.', nl: 'In de zomer eten we buiten.' },
          { target: 'It often rains in autumn.', nl: 'Het regent vaak in de herfst.' },
          { target: 'It is warm in summer.', nl: 'Het is warm in de zomer.' },
        ],
      },
    ],
    phrases: [
      { target: 'The sun is shining today.', nl: 'De zon schijnt vandaag.' },
      { target: 'It is cold outside.', nl: 'Het is koud buiten.' },
      { target: 'It often rains in England.', nl: 'Het regent vaak in Engeland.' },
      { target: 'Winter in Scotland is very cold.', nl: 'De winter in Schotland is erg koud.' },
      { target: 'In spring the parks are green.', nl: 'In de lente zijn de parken groen.' },
      { target: 'In summer we eat outside.', nl: 'In de zomer eten we buiten.' },
    ],
    tip: 'Herfst heet in Groot-Brittannië “autumn”; “fall” is Amerikaans. Let ook op het verschil tussen “It rains” en “It is raining”: wijs je naar buiten en zeg je “It rains”, dan hoort een Brit “het regent hier wel vaker” in plaats van “het regent nu”.',
  },

  'en-u13': {
    intro:
      'Je maakt plannen voor de avond of het weekend: film, museum, theater en muziek. Je ziet meteen hoe de Britse spelling net iets anders werkt dan de Amerikaanse.',
    rules: [
      {
        title: 'She dances, my friends visit',
        explanation:
          'Hetzelfde werkwoord krijgt een andere vorm, afhankelijk van wie het doet: she dances (één persoon, dus met -s) tegenover my friends visit (meerdere, dus kaal). Ook “the film starts” heeft die -s, want een film is een it. Kijk dus eerst naar het onderwerp voordat je het werkwoord opschrijft.',
        examples: [
          { target: 'She dances very well.', nl: 'Ze danst erg goed.' },
          { target: 'My friends visit London in summer.', nl: 'Mijn vrienden bezoeken Londen in de zomer.' },
          { target: 'The film starts at eight.', nl: 'De film begint om acht uur.' },
        ],
      },
      {
        title: 'Listen to: het voorzetsel hoort bij het werkwoord',
        explanation:
          'Sommige Engelse werkwoorden hebben een vast voorzetsel dat er altijd bij hoort: je “listen to” muziek. Laat je to weg, dan is de zin fout, ook al lijkt hij compleet. Andere werkwoorden hebben juist géén voorzetsel nodig: we visit the museum, zonder to.',
        examples: [
          { target: 'I listen to music at home.', nl: 'Ik luister thuis naar muziek.' },
          { target: 'We visit the museum today.', nl: 'We bezoeken het museum vandaag.' },
        ],
      },
      {
        title: 'At the weekend, in the city centre',
        explanation:
          'In Brits Engels ga je “at the weekend” uit, en niet “in the weekend” zoals een letterlijke vertaling zou opleveren. Amerikanen zeggen “on the weekend”. Bij kloktijden blijft at de standaard: at seven, at eight. Voor een plek waar iets bínnen ligt, gebruik je in: the cinema is in the city centre.',
        examples: [
          { target: 'See you at the weekend!', nl: 'Tot in het weekend!' },
          { target: 'We visit my brother at the weekend.', nl: 'We bezoeken mijn broer in het weekend.' },
          { target: 'The theatre opens at seven.', nl: 'Het theater gaat om zeven uur open.' },
          { target: 'The cinema is in the city centre.', nl: 'De bioscoop is in het stadscentrum.' },
        ],
      },
      {
        title: 'Brits spellen: theatre en centre',
        explanation:
          'Een klein groepje woorden dat in het Amerikaans op -er eindigt, schrijf je in Brits Engels met -re: theatre, centre, metre. De uitspraak blijft precies hetzelfde; alleen de laatste twee letters wisselen van plek. Het gaat echt alleen om die handvol woorden — water en sister blijven gewoon water en sister. Los daarvan: “film” is in Groot-Brittannië gebruikelijker dan het Amerikaanse “movie”.',
        examples: [
          { target: 'The theatre opens at seven.', nl: 'Het theater gaat om zeven uur open.' },
          { target: 'The cinema is in the city centre.', nl: 'De bioscoop is in het stadscentrum.' },
        ],
      },
    ],
    phrases: [
      { target: 'The film starts at eight.', nl: 'De film begint om acht uur.' },
      { target: 'The cinema is in the city centre.', nl: 'De bioscoop is in het stadscentrum.' },
      { target: 'I listen to music at home.', nl: 'Ik luister thuis naar muziek.' },
      { target: 'We visit the museum today.', nl: 'We bezoeken het museum vandaag.' },
      { target: 'The theatre opens at seven.', nl: 'Het theater gaat om zeven uur open.' },
      { target: 'See you at the weekend!', nl: 'Tot in het weekend!' },
    ],
    tip: 'Wij zeggen “in het weekend”, maar in Brits Engels is het “at the weekend”. En “naar muziek luisteren” is “listen to music”: dat kleine to is verplicht, ook al hoor je het nauwelijks als iemand snel praat.',
  },

  'en-u14': {
    intro:
      'Alles komt hier samen: bestellen, de weg vragen, over het weer praten en vertellen hoe je je voelt. Deze gids zet de regels op een rij die je in het dagelijks leven het vaakst nodig hebt.',
    rules: [
      {
        title: 'De -s: de fout die je het vaakst maakt',
        explanation:
          'In de tegenwoordige tijd heeft bijna elk Engels werkwoord maar twee vormen: kaal (I work, we work, they work) en met -s (he works, she dances, it starts). Die -s hoort alleen bij he, she en it, en bij één persoon of ding. Alleen to be (am, is, are) en to have (have, has) wijken af. Loop je zin op dit punt altijd even na, want dit is verreweg de meest gemaakte fout.',
        examples: [
          { target: 'My father works in London.', nl: 'Mijn vader werkt in Londen.' },
          { target: 'She dances very well.', nl: 'Ze danst erg goed.' },
          { target: 'My friends work in London.', nl: 'Mijn vrienden werken in Londen.' },
        ],
      },
      {
        title: 'Would like, met of zonder to',
        explanation:
          'De beleefde standaardzin om iets te vragen is “I would like”. Volgt er een handeling, dan zet je to plus het hele werkwoord erachter: I would like to see a doctor. Volgt er een ding, dan valt to weg: I would like a coffee. Het woord would verandert nooit van vorm.',
        examples: [
          { target: 'I would like to see a doctor.', nl: 'Ik wil graag een dokter zien.' },
          { target: 'I would like a coffee, please.', nl: 'Ik wil graag een koffie, alsjeblieft.' },
          { target: 'I would like a ticket to London.', nl: 'Ik wil graag een kaartje naar Londen.' },
        ],
      },
      {
        title: 'Onregelmatige meervouden',
        explanation:
          'De meeste woorden krijgen simpelweg een -s in het meervoud, maar een kleine groep verandert van binnen: child wordt children, man wordt men, woman wordt women. Het zijn er maar een handvol, dus je leert ze uit je hoofd. “Childs” en “womans” bestaan niet.',
        examples: [
          { target: 'The woman has two children.', nl: 'De vrouw heeft twee kinderen.' },
          { target: 'The child is playing outside.', nl: 'Het kind speelt buiten.' },
          { target: 'The men are in the garden.', nl: 'De mannen zijn in de tuin.' },
        ],
      },
      {
        title: 'Vaste voorzetsels op een rij',
        explanation:
          'Voorzetsels volgen zelden een regel; je leert ze per uitdrukking. Onthoud in elk geval: tea with milk, on holiday, at the weekend, by bus en at nine. Vertaal ze nooit letterlijk vanuit het Nederlands, want dan kies je bijna altijd de verkeerde.',
        examples: [
          { target: 'Tea with milk, please.', nl: 'Thee met melk, alsjeblieft.' },
          { target: 'We are on holiday in Scotland.', nl: 'We zijn op vakantie in Schotland.' },
          { target: 'The shop opens at nine.', nl: 'De winkel gaat om negen uur open.' },
        ],
      },
    ],
    phrases: [
      { target: 'I would like a cup of tea.', nl: 'Ik wil graag een kopje thee.' },
      { target: 'Where is the station, please?', nl: 'Waar is het station, alstublieft?' },
      { target: 'I would like a ticket to London.', nl: 'Ik wil graag een kaartje naar Londen.' },
      { target: 'My head hurts and I am tired.', nl: 'Mijn hoofd doet pijn en ik ben moe.' },
      { target: 'It is warm and the sun is shining.', nl: 'Het is warm en de zon schijnt.' },
      { target: 'Thank you and goodbye!', nl: 'Dank je wel en tot ziens!' },
    ],
    tip: 'Drie dingen verraden een Nederlander meteen: de -s bij he, she en it vergeten, “half ten” zeggen terwijl je half tien bedoelt (dat is “half past nine”), en de zin omdraaien na een woord als misschien of vandaag. Check die drie en je Engels klinkt direct een stuk vloeiender.',
  },
}
