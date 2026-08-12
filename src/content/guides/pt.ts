import type { UnitGuide } from '../../types'

export const guides: Record<string, UnitGuide> = {
  'pt-u1': {
    intro:
      'Je leert hier je eerste Portugese woorden: iemand groeten, ja en nee zeggen en netjes bedanken. Met olá, bom dia en obrigado kom je in Portugal de eerste dag al een heel eind.',
    rules: [
      {
        title: 'Obrigado of obrigada?',
        explanation:
          'In het Nederlands is "dank je" voor iedereen hetzelfde. In het Portugees past het woord zich aan aan degene die het zégt, niet aan degene die je bedankt. Een man zegt altijd obrigado, een vrouw altijd obrigada. Je kiest dus op basis van jezelf, en dat blijft je hele leven zo.',
        examples: [
          { target: 'Muito obrigado!', nl: 'Dank je wel! (gezegd door een man)' },
          { target: 'Muito obrigada!', nl: 'Dank je wel! (gezegd door een vrouw)' },
          { target: 'Não, obrigada.', nl: 'Nee, dank je. (gezegd door een vrouw)' },
        ],
      },
      {
        title: 'Tudo bem, niet tudo bom',
        explanation:
          'Bom zegt iets over een ding: o pão é bom, het brood is lekker. Bem zegt hoe iets gáát, en niet hoe iets is. Vraag je hoe het met iemand gaat, dan heb je dus bem nodig: tudo bem. Datzelfde tudo bem is meteen ook het antwoord.',
        examples: [
          { target: 'Olá, tudo bem?', nl: 'Hallo, alles goed?' },
          { target: 'Sim, tudo bem, obrigado.', nl: 'Ja, alles goed, dank je.' },
          { target: 'O pão é bom.', nl: 'Het brood is lekker.' },
        ],
      },
      {
        title: 'Bom dia, maar boa noite',
        explanation:
          'Elk Portugees woord voor een ding is mannelijk of vrouwelijk. Dia (dag) is mannelijk en krijgt bom, terwijl tarde (middag) en noite (avond) vrouwelijk zijn en boa krijgen. Het woordje voor "goed" verandert dus mee met het woord waar het bij hoort. Leer deze drie groeten als vaste combinaties, dan hoef je nooit te kiezen.',
        examples: [
          { target: 'Bom dia, senhor Silva!', nl: 'Goedemorgen, meneer Silva!' },
          { target: 'Boa tarde!', nl: 'Goedemiddag!' },
          { target: 'Boa noite!', nl: 'Goedenavond!' },
        ],
      },
    ],
    phrases: [
      { target: 'Olá, tudo bem?', nl: 'Hallo, alles goed?' },
      { target: 'Bom dia, senhor Silva!', nl: 'Goedemorgen, meneer Silva!' },
      { target: 'Sim, tudo bem, obrigado.', nl: 'Ja, alles goed, dank je.' },
      { target: 'Não, obrigado.', nl: 'Nee, dank je.' },
      { target: 'Um café, por favor.', nl: 'Een koffie, alsjeblieft.' },
      { target: 'Adeus, até amanhã!', nl: 'Tot ziens, tot morgen!' },
    ],
    tip: 'De ão in não en de m aan het eind van bem zijn nasale klanken: je laat de lucht deels door je neus gaan. Não klinkt ongeveer als "nauw" met een neusklank, en bem eindigt niet op een echte m maar op een neuzige eind-klank. Nederlanders spreken elke letter netjes en apart uit, en juist dat verraadt je meteen.',
  },

  'pt-u2': {
    intro:
      'Je bestelt hier je eerste koffie, water en pastel de nata. Meteen ontdek je waarom het um café is maar uma água — een verschil dat in het hele Portugees terugkomt.',
    rules: [
      {
        title: 'O of a: elk woord heeft een geslacht',
        explanation:
          'Elk Portugees woord voor een ding is mannelijk of vrouwelijk. Bij mannelijke woorden hoort het lidwoord (het woordje vóór een zelfstandig naamwoord) o, bij vrouwelijke woorden a. Woorden die op -o eindigen zijn meestal mannelijk, woorden op -a meestal vrouwelijk. Het Nederlandse de of het zegt hier niets over: het water is a água.',
        examples: [
          { target: 'O café é bom.', nl: 'De koffie is lekker.' },
          { target: 'A água é boa.', nl: 'Het water is lekker.' },
          { target: 'O pão é fresco.', nl: 'Het brood is vers.' },
        ],
      },
      {
        title: 'Um of uma: een koffie, een water',
        explanation:
          'Het woordje voor "een" volgt hetzelfde geslacht: um bij mannelijke woorden, uma bij vrouwelijke. Dus um café, maar uma água. Als je een nieuw woord meteen met o of a leert, weet je automatisch of het later um of uma wordt.',
        examples: [
          { target: 'Um café, por favor.', nl: 'Een koffie, alsjeblieft.' },
          { target: 'Uma água, por favor.', nl: 'Een water, alsjeblieft.' },
          { target: 'Um café e uma água, por favor.', nl: 'Een koffie en een water, alsjeblieft.' },
        ],
      },
      {
        title: 'Quero: het ik zit in het werkwoord',
        explanation:
          'In het Nederlands heb je altijd "ik" nodig. In het Portugees zit die informatie in de uitgang van het werkwoord: quero eindigt op -o en dat betekent al "ik". Je mag eu quero zeggen, maar in gewone spreektaal laten Portugezen dat eu weg, behalve als ze nadruk willen leggen.',
        examples: [
          { target: 'Quero um café.', nl: 'Ik wil een koffie.' },
          { target: 'Quero um pastel de nata.', nl: 'Ik wil een pastel de nata.' },
          { target: 'Eu quero a conta.', nl: 'Ík wil de rekening. (met nadruk)' },
        ],
      },
      {
        title: 'Com en e: met en en',
        explanation:
          'Com betekent "met" en e betekent "en". Allebei zijn het kleine woordjes die nooit van vorm veranderen, wat er ook achter komt. Na com komt bij eten en drinken meestal geen lidwoord: um café com leite, letterlijk "een koffie met melk".',
        examples: [
          { target: 'Um café com leite, por favor.', nl: 'Een koffie met melk, alsjeblieft.' },
          { target: 'O café com leite é bom.', nl: 'De koffie met melk is lekker.' },
          { target: 'Quero um pastel de nata e um café.', nl: 'Ik wil een pastel de nata en een koffie.' },
        ],
      },
    ],
    phrases: [
      { target: 'Um café, se faz favor.', nl: 'Een koffie, alsjeblieft.' },
      { target: 'Uma água, por favor.', nl: 'Een water, alsjeblieft.' },
      { target: 'Quero um café com leite.', nl: 'Ik wil een koffie met melk.' },
      { target: 'Um pastel de nata, por favor.', nl: 'Een pastel de nata, alsjeblieft.' },
      { target: 'Quero um vinho tinto.', nl: 'Ik wil een rode wijn.' },
      { target: 'A conta, se faz favor!', nl: 'De rekening, alsjeblieft!' },
    ],
    tip: 'Het Nederlandse de of het helpt je niet bij o of a: het water is a água en het brood is o pão. Leer een nieuw woord daarom altijd mét zijn lidwoord — dus niet água, maar a água. Dan hoef je later nooit te gokken tussen um en uma.',
  },

  'pt-u3': {
    intro:
      'Je leert over je familie praten: mijn moeder, mijn vader, mijn broer, mijn zus. En je ziet waarom Portugezen zelfs vóór namen en vóór bezit een lidwoord zetten.',
    rules: [
      {
        title: 'O meu pai: bezit mét lidwoord',
        explanation:
          'Wij zeggen "mijn vader". In Portugal zet je daar in gewone taal nog een lidwoord voor: o meu pai. Het woord voor "mijn" verandert bovendien mee met het geslacht: mannelijk o meu pai, vrouwelijk a minha mãe. Je kiest dus twee keer achter elkaar, en allebei de keren op basis van hetzelfde woord.',
        examples: [
          { target: 'O meu pai é de Lisboa.', nl: 'Mijn vader komt uit Lissabon.' },
          { target: 'A minha mãe é simpática.', nl: 'Mijn moeder is aardig.' },
          { target: 'A minha irmã tem dez anos.', nl: 'Mijn zus is tien jaar.' },
        ],
      },
      {
        title: 'Amigo of amiga, simpático of simpática',
        explanation:
          'Woorden voor personen en beschrijvende woorden eindigen op -o bij een man en op -a bij een vrouw. Een vriend is o amigo, een vriendin a amiga. Datzelfde geldt voor woorden als simpático (aardig) en alto (lang): a minha irmã é simpática, o meu irmão é alto.',
        examples: [
          { target: 'O Pedro é o meu amigo.', nl: 'Pedro is mijn vriend.' },
          { target: 'A Ana é a minha amiga.', nl: 'Ana is mijn vriendin.' },
          { target: 'O meu irmão é alto.', nl: 'Mijn broer is lang.' },
        ],
      },
      {
        title: 'Eu sou, tu és, ele é',
        explanation:
          'Ser betekent "zijn" en gebruik je voor wie of wat iemand is. De vorm verandert per persoon: eu sou (ik ben), tu és (jij bent), ele of ela é (hij of zij is). Die drie vormen lijken totaal niet op elkaar, dus die leer je gewoon uit je hoofd — je gebruikt ze in elke tweede zin.',
        examples: [
          { target: 'Eu sou o irmão do Pedro.', nl: 'Ik ben de broer van Pedro.' },
          { target: 'O meu pai é de Lisboa.', nl: 'Mijn vader komt uit Lissabon.' },
          { target: 'Tu és a irmã da Ana?', nl: 'Ben jij de zus van Ana?' },
        ],
      },
      {
        title: 'O Pedro, a Ana: namen krijgen een lidwoord',
        explanation:
          'In Portugal staat er voor voornamen bijna altijd o of a: o Pedro, a Ana. Dat klinkt voor ons vreemd, maar het is normaal en zelfs vriendelijk. Zeg je "van Pedro", dan versmelt het woordje de met dat lidwoord tot do: o irmão do Pedro, en bij een vrouw da: a irmã da Ana.',
        examples: [
          { target: 'A Ana é a minha amiga.', nl: 'Ana is mijn vriendin.' },
          { target: 'O Pedro é o meu irmão.', nl: 'Pedro is mijn broer.' },
          { target: 'Eu sou o irmão do Pedro.', nl: 'Ik ben de broer van Pedro.' },
        ],
      },
    ],
    phrases: [
      { target: 'A minha mãe é simpática.', nl: 'Mijn moeder is aardig.' },
      { target: 'O meu pai é de Lisboa.', nl: 'Mijn vader komt uit Lissabon.' },
      { target: 'A minha irmã tem dez anos.', nl: 'Mijn zus is tien jaar.' },
      { target: 'O Pedro é o meu amigo.', nl: 'Pedro is mijn vriend.' },
      { target: 'A família é grande.', nl: 'De familie is groot.' },
      { target: 'Eu sou o irmão do Pedro.', nl: 'Ik ben de broer van Pedro.' },
    ],
    tip: 'Nederlandstaligen laten het lidwoord bij bezit weg, omdat wij nu eenmaal "mijn moeder" zeggen. In Portugal klinkt minha mãe zonder a afgeknipt; zeg dus a minha mãe en o meu pai. In Brazilië laten ze dat lidwoord juist vaak wél weg — beide bestaan, maar deze cursus leert je de Portugese variant.',
  },

  'pt-u4': {
    intro:
      'Hier leer je de weg vragen en een kaartje kopen: waar is het station, is het links of rechts, en welke trein gaat naar Porto.',
    rules: [
      {
        title: 'À esquerda: waarom er een streepje op de a staat',
        explanation:
          'Het woordje a betekent hier "aan" of "op", en het lidwoord van esquerda is ook a. Twee keer a achter elkaar trekt het Portugees samen tot één letter met een accent: à. Zo ontstaan de vaste uitdrukkingen à esquerda (links) en à direita (rechts). Dat streepje is dus geen versiering, maar het bewijs dat er twee woordjes in verstopt zitten.',
        examples: [
          { target: 'A estação é à esquerda.', nl: 'Het station is links.' },
          { target: 'O café é à direita.', nl: 'Het café is rechts.' },
          { target: 'Onde é a estação? — É à esquerda.', nl: 'Waar is het station? — Het is links.' },
        ],
      },
      {
        title: 'Para: naar een bestemming',
        explanation:
          'Para betekent "naar" als je ergens heen gaat of iets ergens heen stuurt. Je gebruikt het bij treinen, bussen en kaartjes. Anders dan de, em en a versmelt para nooit met het lidwoord: het blijft netjes los staan, dus para o Porto in twee woorden.',
        examples: [
          { target: 'Quero um bilhete para Lisboa.', nl: 'Ik wil een kaartje naar Lissabon.' },
          { target: 'O comboio para o Porto é rápido.', nl: 'De trein naar Porto is snel.' },
          { target: 'Onde é o autocarro para Belém?', nl: 'Waar is de bus naar Belém?' },
        ],
      },
      {
        title: 'Onde é...? Vragen zonder extra woorden',
        explanation:
          'Een vraag bouw je door het vraagwoord vooraan te zetten en daarna het werkwoord: Onde é a estação? De volgorde is dus dezelfde als bij ons. Let wel op het lidwoord: dat blijft in het Portugees altijd staan, ook waar wij het zouden weglaten. Dus Onde é a rua?, nooit "Onde é rua?".',
        examples: [
          { target: 'Onde é a estação?', nl: 'Waar is het station?' },
          { target: 'Onde é a rua?', nl: 'Waar is de straat?' },
          { target: 'Onde é o autocarro para Belém?', nl: 'Waar is de bus naar Belém?' },
        ],
      },
      {
        title: 'O Porto, maar Lisboa',
        explanation:
          'Sommige plaatsnamen hebben in het Portugees een vast lidwoord en andere niet. Porto is o Porto, dus je zegt para o Porto en no Porto. Lisboa en Belém staan zonder lidwoord: para Lisboa, em Lisboa. Dat moet je per plaatsnaam onthouden, net als o of a bij gewone woorden.',
        examples: [
          { target: 'O comboio para o Porto é rápido.', nl: 'De trein naar Porto is snel.' },
          { target: 'Quero um bilhete para Lisboa.', nl: 'Ik wil een kaartje naar Lissabon.' },
          { target: 'O meu irmão mora no Porto.', nl: 'Mijn broer woont in Porto.' },
        ],
      },
    ],
    phrases: [
      { target: 'Onde é a estação?', nl: 'Waar is het station?' },
      { target: 'A estação é à esquerda.', nl: 'Het station is links.' },
      { target: 'O café é à direita.', nl: 'Het café is rechts.' },
      { target: 'Quero um bilhete para Lisboa.', nl: 'Ik wil een kaartje naar Lissabon.' },
      { target: 'Onde é o autocarro para Belém?', nl: 'Waar is de bus naar Belém?' },
      { target: 'O comboio para o Porto é rápido.', nl: 'De trein naar Porto is snel.' },
    ],
    tip: 'In Portugal wordt een s vóór een medeklinker of aan het eind van een woord een sj-klank, en onbeklemtoonde klinkers worden bijna ingeslikt. Estação klinkt daardoor ongeveer als "sjtasáuw" en esquerda als "sjkérda". Nederlandstaligen spreken elke letter even duidelijk uit; leer je dat af, dan klink je meteen een stuk Portugeser.',
  },

  'pt-u5': {
    intro:
      'Je leert tellen, vragen hoe laat het is en zeggen wanneer iets gebeurt. Precies wat je nodig hebt voor treinen, afspraken en twee koffie bestellen.',
    rules: [
      {
        title: 'É uma hora, maar são dez horas',
        explanation:
          'Voor de tijd gebruik je het werkwoord ser. Bij één uur gaat het om één uur, dus enkelvoud: É uma hora. Vanaf twee uur zijn het er meerdere, dus meervoud: São duas horas, São dez horas. Ook het woord hora krijgt dan een -s erbij: horas.',
        examples: [
          { target: 'Que horas são?', nl: 'Hoe laat is het?' },
          { target: 'É uma hora.', nl: 'Het is één uur.' },
          { target: 'São dez horas.', nl: 'Het is tien uur.' },
        ],
      },
      {
        title: 'Às dez: hoe laat iets gebeurt',
        explanation:
          'Zeg je wánneer iets gebeurt, dan gebruik je às. Dat is het woordje a (om) samengetrokken met as, het meervoudslidwoord van horas. Bij één uur wordt dat à uma hora. In gesproken taal laten Portugezen horas vaak weg: às dez is gewoon "om tien uur".',
        examples: [
          { target: 'O comboio para o Porto é às dez horas.', nl: 'De trein naar Porto is om tien uur.' },
          { target: 'O autocarro é às cinco.', nl: 'De bus gaat om vijf uur.' },
          { target: 'O comboio é à uma hora.', nl: 'De trein gaat om één uur.' },
        ],
      },
      {
        title: 'Dois of duas, um of uma',
        explanation:
          'Van de getallen tot en met tien veranderen alleen één en twee mee met het geslacht van het woord erna: um café maar uma água, dois cafés maar duas horas. De rest blijft precies zoals hij is: três, cinco en dez veranderen nooit. Het woord ná het getal krijgt wel een -s, want er zijn er meerdere: dois cafés, dez horas.',
        examples: [
          { target: 'Dois cafés, por favor.', nl: 'Twee koffies, alsjeblieft.' },
          { target: 'São duas horas.', nl: 'Het is twee uur.' },
          { target: 'Quero cinco bilhetes para o Porto.', nl: 'Ik wil vijf kaartjes naar Porto.' },
        ],
      },
    ],
    phrases: [
      { target: 'Que horas são?', nl: 'Hoe laat is het?' },
      { target: 'São dez horas.', nl: 'Het is tien uur.' },
      { target: 'É uma hora.', nl: 'Het is één uur.' },
      { target: 'Dois cafés, por favor.', nl: 'Twee koffies, alsjeblieft.' },
      { target: 'O comboio é às cinco horas.', nl: 'De trein gaat om vijf uur.' },
      { target: 'Boa noite!', nl: 'Goedenavond!' },
    ],
    tip: 'Boa noite is zowel "goedenavond" als "welterusten": Portugezen gebruiken het bij binnenkomst én bij vertrek, waar wij twee verschillende zinnen hebben. Let ook op dez: de z aan het eind klinkt in Portugal als een zachte sj, dus ongeveer "desj", en niet als de Nederlandse z.',
  },

  'pt-u6': {
    intro:
      'Je leert vragen wat iets kost, zeggen dat iets duur of goedkoop is en afrekenen op de markt of in de winkel.',
    rules: [
      {
        title: 'Barato of barata?',
        explanation:
          'Een bijvoeglijk naamwoord — een woord dat iets over een ding zegt — neemt het geslacht over van het woord waar het bij hoort. O pão é barato is mannelijk, a fruta é barata is vrouwelijk. Bij meerdere dingen komt er nog een -s bij: os bilhetes são baratos. Precies hetzelfde gebeurt met caro (duur).',
        examples: [
          { target: 'O pão é barato.', nl: 'Het brood is goedkoop.' },
          { target: 'A fruta é barata.', nl: 'Het fruit is goedkoop.' },
          { target: 'A loja é cara.', nl: 'De winkel is duur.' },
        ],
      },
      {
        title: 'No mercado, na loja',
        explanation:
          'Het woordje em (in of op) versmelt altijd met het lidwoord erachter: em plus o wordt no, em plus a wordt na. Je zegt dus nooit "em o mercado", maar no mercado, en na loja in plaats van "em a loja". Welke van de twee je nodig hebt, hangt af van het geslacht van het woord.',
        examples: [
          { target: 'Quanto custa a fruta no mercado?', nl: 'Hoeveel kost het fruit op de markt?' },
          { target: 'A minha mãe está na loja.', nl: 'Mijn moeder is in de winkel.' },
          { target: 'A fruta no mercado é boa.', nl: 'Het fruit op de markt is lekker.' },
        ],
      },
      {
        title: 'Custa of custam',
        explanation:
          'Het werkwoord past zich aan aan wat er geteld wordt. Gaat het om één ding, dan is het custa: O pão custa dois euros. Gaat het om meerdere dingen, dan wordt het custam: Os bilhetes custam dez euros. In de standaardvraag Quanto custa? denk je aan één ding, dus die vorm blijft zoals hij is.',
        examples: [
          { target: 'Quanto custa o pão?', nl: 'Hoeveel kost het brood?' },
          { target: 'O café custa um euro.', nl: 'De koffie kost één euro.' },
          { target: 'Os bilhetes custam dez euros.', nl: 'De kaartjes kosten tien euro.' },
        ],
      },
      {
        title: 'Tenho, tens, tem: hebben',
        explanation:
          'Ter (hebben) volgt geen vast patroon, dus deze drie vormen leer je uit je hoofd: eu tenho, tu tens, ele of ela tem. Ook hier verklapt de vorm al wie het is, dus eu mag weg: Não tenho dinheiro. Let op: bij leeftijd gebruikt het Portugees ter waar wij "zijn" zeggen — a minha irmã tem dez anos, letterlijk "mijn zus heeft tien jaar".',
        examples: [
          { target: 'Não tenho dinheiro.', nl: 'Ik heb geen geld.' },
          { target: 'A casa tem dois quartos.', nl: 'Het huis heeft twee slaapkamers.' },
          { target: 'A minha irmã tem dez anos.', nl: 'Mijn zus is tien jaar.' },
        ],
      },
      {
        title: 'Não: nee, niet en geen in één woord',
        explanation:
          'Waar wij drie woorden hebben — nee, niet en geen — heeft het Portugees er één: não. Als ontkenning staat het altijd vlak vóór het werkwoord. Waar wij "geen" gebruiken, zetten Portugezen dus gewoon não voor het werkwoord: Não tenho dinheiro is letterlijk "ik niet heb geld". Als antwoord op een vraag betekent datzelfde não simpelweg "nee".',
        examples: [
          { target: 'Não tenho dinheiro.', nl: 'Ik heb geen geld.' },
          { target: 'O pão não é caro.', nl: 'Het brood is niet duur.' },
          { target: 'Não, obrigado.', nl: 'Nee, dank je.' },
        ],
      },
    ],
    phrases: [
      { target: 'Quanto custa o pão?', nl: 'Hoeveel kost het brood?' },
      { target: 'O café custa um euro.', nl: 'De koffie kost één euro.' },
      { target: 'A fruta do mercado é barata.', nl: 'Het fruit van de markt is goedkoop.' },
      { target: 'Não tenho dinheiro.', nl: 'Ik heb geen geld.' },
      { target: 'O vinho é caro.', nl: 'De wijn is duur.' },
      { target: 'Quero fruta do mercado.', nl: 'Ik wil fruit van de markt.' },
    ],
    tip: 'Zoek niet naar een Portugees woord voor "geen" — dat bestaat niet. Alles loopt via não vlak voor het werkwoord. En let op het meervoud bij prijzen: wij zeggen "twee euro" zonder s, maar in het Portugees is het dois euros.',
  },

  'pt-u7': {
    intro:
      'Je vertelt waar je woont en wat er in huis staat. Onderweg leer je het lastigste én nuttigste verschil van het Portugees: ser tegenover estar.',
    rules: [
      {
        title: 'Ser of estar: twee keer "zijn"',
        explanation:
          'Het Nederlandse "zijn" is in het Portugees twee verschillende werkwoorden. Ser (é) gebruik je voor wat iets ís en blijft: eigenschappen, herkomst, beroep. Estar (está) gebruik je voor hoe of waar iets nú is: een plek of een tijdelijke toestand. A casa é grande blijft altijd waar, maar A mesa está na cozinha kan morgen anders zijn.',
        examples: [
          { target: 'A janela do quarto é grande.', nl: 'Het raam van de slaapkamer is groot.' },
          { target: 'A mesa está na cozinha.', nl: 'De tafel staat in de keuken.' },
          { target: 'A minha mãe está na cozinha.', nl: 'Mijn moeder is in de keuken.' },
        ],
      },
      {
        title: 'Em, no of na',
        explanation:
          'Em betekent "in" of "op". Bij een stadsnaam blijft het los staan: moro em Lisboa. Staat er een lidwoord achter, dan versmelt em ermee: em plus o wordt no, em plus a wordt na. Dus na cozinha en no quarto — en no Porto, omdat Porto zelf een lidwoord heeft.',
        examples: [
          { target: 'Moro em Lisboa.', nl: 'Ik woon in Lissabon.' },
          { target: 'A minha irmã está na cozinha.', nl: 'Mijn zus is in de keuken.' },
          { target: 'O meu irmão mora no Porto.', nl: 'Mijn broer woont in Porto.' },
        ],
      },
      {
        title: 'Do quarto: van de',
        explanation:
          'Ook de (van) versmelt met het lidwoord erachter: de plus o wordt do, de plus a wordt da. A janela do quarto betekent "het raam van de slaapkamer". Je kunt de en het lidwoord dus nooit los naast elkaar laten staan, net zomin als bij em.',
        examples: [
          { target: 'A janela do quarto é grande.', nl: 'Het raam van de slaapkamer is groot.' },
          { target: 'A porta da cozinha está à direita.', nl: 'De keukendeur is rechts.' },
          { target: 'A fruta do mercado é boa.', nl: 'Het fruit van de markt is lekker.' },
        ],
      },
      {
        title: 'Moro, moras, mora',
        explanation:
          'Werkwoorden die op -ar eindigen, zoals morar (wonen), krijgen vaste uitgangen: eu moro, tu moras, ele of ela mora. Aan die laatste letter hoor je dus al wie er woont, en daarom mag eu wegblijven. Trabalhar en falar volgen precies hetzelfde patroon.',
        examples: [
          { target: 'Moro em Lisboa.', nl: 'Ik woon in Lissabon.' },
          { target: 'O meu irmão mora no Porto.', nl: 'Mijn broer woont in Porto.' },
          { target: 'Onde moras?', nl: 'Waar woon jij?' },
        ],
      },
    ],
    phrases: [
      { target: 'Moro em Lisboa.', nl: 'Ik woon in Lissabon.' },
      { target: 'A casa é grande e bonita.', nl: 'Het huis is groot en mooi.' },
      { target: 'A casa tem dois quartos.', nl: 'Het huis heeft twee slaapkamers.' },
      { target: 'O pão está na mesa.', nl: 'Het brood staat op tafel.' },
      { target: 'A minha mãe está na cozinha.', nl: 'Mijn moeder is in de keuken.' },
      { target: 'A porta está à direita.', nl: 'De deur is rechts.' },
    ],
    tip: 'Waar wij "op tafel" zeggen, gebruikt het Portugees em: o pão está na mesa. Nederlandstaligen grijpen dan naar sobre (bovenop), maar dat klinkt in een gewoon gesprek stijf en overdreven. Voor zowel "in" als "op" pak je in bijna alle alledaagse zinnen em, no of na.',
  },

  'pt-u8': {
    intro:
      'Je vertelt wat je doet, waar je werkt en wat je wilt leren. Je leert ook de vaste uitgangen van werkwoorden op -ar, veruit de grootste groep van het Portugees.',
    rules: [
      {
        title: 'Falo, falas, fala',
        explanation:
          'Werkwoorden op -ar hebben vaste uitgangen: haal -ar weg en plak er -o (ik), -as (jij) of -a (hij of zij) achter. Falar wordt zo falo, falas, fala en trabalhar wordt trabalho, trabalhas, trabalha. Omdat die uitgang al verklapt wie het doet, laat je eu en tu meestal weg.',
        examples: [
          { target: 'Falo português.', nl: 'Ik spreek Portugees.' },
          { target: 'A professora fala português.', nl: 'De lerares spreekt Portugees.' },
          { target: 'Trabalho em Lisboa.', nl: 'Ik werk in Lissabon.' },
        ],
      },
      {
        title: 'Beroepen zonder lidwoord',
        explanation:
          'Bij een beroep gebruik je ser en laat je het woordje "een" weg. Waar wij zeggen "mijn vader is een arts", zegt het Portugees O meu pai é médico. Het beroep past zich wel aan het geslacht aan: médico of médica, professor of professora.',
        examples: [
          { target: 'O meu pai é médico.', nl: 'Mijn vader is arts.' },
          { target: 'A minha mãe é professora.', nl: 'Mijn moeder is lerares.' },
          { target: 'A minha irmã é médica.', nl: 'Mijn zus is arts.' },
        ],
      },
      {
        title: 'Twee werkwoorden achter elkaar',
        explanation:
          'Staat er een tweede werkwoord in de zin, dan blijft dat in de basisvorm: de vorm die in het woordenboek staat en op -ar, -er of -ir eindigt. Na quero vervoeg je dus niets meer: Quero aprender português, en nooit "quero aprendo". Dat werkt net als bij ons: ik wil leren.',
        examples: [
          { target: 'Quero aprender português.', nl: 'Ik wil Portugees leren.' },
          { target: 'Quero falar com a professora.', nl: 'Ik wil met de lerares praten.' },
          { target: 'Quero trabalhar em Lisboa.', nl: 'Ik wil in Lissabon werken.' },
        ],
      },
    ],
    phrases: [
      { target: 'Trabalho em Lisboa.', nl: 'Ik werk in Lissabon.' },
      { target: 'O meu pai é médico.', nl: 'Mijn vader is arts.' },
      { target: 'A minha mãe é professora.', nl: 'Mijn moeder is lerares.' },
      { target: 'Quero aprender português.', nl: 'Ik wil Portugees leren.' },
      { target: 'Falo português no trabalho.', nl: 'Ik spreek Portugees op het werk.' },
      { target: 'O livro está na mesa.', nl: 'Het boek ligt op tafel.' },
    ],
    tip: 'De lh en de nh zijn geen twee losse letters. Lh klinkt als de lj in "miljoen": trabalho zeg je ongeveer als tra-BA-ljoe, nooit met een hoorbare h. Nh klinkt als de nj in "oranje", zoals in dinheiro. Nederlandstaligen spreken die h uit of laten hem weg, en allebei klinkt verkeerd.',
  },

  'pt-u9': {
    intro:
      'Je leert een gesprek beginnen: jezelf voorstellen, beleefd iets vragen en zeggen wat je leuk vindt. Precies de zinnen waarmee een praatje op gang komt.',
    rules: [
      {
        title: 'Gostar gaat altijd met de',
        explanation:
          'Gostar (houden van) staat nooit alleen: er komt altijd de achter, ook als er een werkwoord op volgt. Gosto de café, gosto de dançar. Laat je die de weg, dan is de zin fout. Komt er een lidwoord achter, dan versmelt de ermee: gosto do vinho, gosto da música.',
        examples: [
          { target: 'Gosto de café.', nl: 'Ik houd van koffie.' },
          { target: 'Gosto de aprender português.', nl: 'Ik houd ervan om Portugees te leren.' },
          { target: 'Eu também gosto de vinho.', nl: 'Ik houd ook van wijn.' },
        ],
      },
      {
        title: 'Chamo-me: ik noem mij',
        explanation:
          '"Ik heet" is in het Portugees letterlijk "ik noem mij": chamo-me. Het woordje me hoort bij het werkwoord en wordt er in Portugal met een streepje achter geplakt. Vraag je het aan iemand anders, dan wordt het Como se chama? tegen een onbekende, of Como te chamas? tegen een vriend.',
        examples: [
          { target: 'Olá, chamo-me Ana.', nl: 'Hallo, ik heet Ana.' },
          { target: 'Como se chama?', nl: 'Hoe heet u?' },
          { target: 'Chamo-me Pedro e sou de Lisboa.', nl: 'Ik heet Pedro en ik kom uit Lissabon.' },
        ],
      },
      {
        title: 'Onde, como, quando, quanto',
        explanation:
          'Onde (waar), como (hoe), quando (wanneer) en quanto (hoeveel) zet je vooraan, en daarna laat je gewoon de zin volgen: Quando é o comboio? Er komt geen extra woord bij en de volgorde verandert niet. Op schrift staat er alleen aan het eind een vraagteken, en in spraak gaat je stem omhoog.',
        examples: [
          { target: 'Quando é o comboio para Lisboa?', nl: 'Wanneer gaat de trein naar Lissabon?' },
          { target: 'Como está?', nl: 'Hoe gaat het met u?' },
          { target: 'Quanto custa a fruta?', nl: 'Hoeveel kost het fruit?' },
        ],
      },
      {
        title: 'Desculpe of desculpa',
        explanation:
          'Desculpe is de beleefde vorm die je tegen onbekenden gebruikt, en desculpa zeg je tegen vrienden, familie of kinderen. Bij korte verzoeken en verontschuldigingen van werkwoorden op -ar eindigt de beleefde vorm op -e en de vertrouwde vorm op -a. In een winkel of op straat kies je dus altijd desculpe.',
        examples: [
          { target: 'Desculpe, onde é o mercado?', nl: 'Pardon, waar is de markt?' },
          { target: 'Desculpe, que horas são?', nl: 'Pardon, hoe laat is het?' },
          { target: 'Desculpa, não tenho dinheiro.', nl: 'Sorry, ik heb geen geld.' },
        ],
      },
    ],
    phrases: [
      { target: 'Olá, chamo-me Ana.', nl: 'Hallo, ik heet Ana.' },
      { target: 'Desculpe, onde é o mercado?', nl: 'Pardon, waar is de markt?' },
      { target: 'Gosto de café.', nl: 'Ik houd van koffie.' },
      { target: 'Eu também gosto de vinho.', nl: 'Ik houd ook van wijn.' },
      { target: 'Quando é o comboio para Lisboa?', nl: 'Wanneer gaat de trein naar Lissabon?' },
      { target: 'Até amanhã!', nl: 'Tot morgen!' },
    ],
    tip: 'Ons "houden van" heeft zijn eigen woordje van, en het Portugees wil er precies zo één: de. Zeg dus nooit "gosto café", maar altijd gosto de café. En também betekent "ook", maar het staat vlak vóór het werkwoord: Eu também gosto de vinho — niet achteraan de zin, zoals wij het vaak plakken.',
  },

  'pt-u10': {
    intro:
      'Je boekt een kamer, vindt je koffer terug en vraagt de weg naar het vliegveld. Je leert ook hoe je zegt dat iets dicht bij iets anders ligt.',
    rules: [
      {
        title: 'Perto da estação: dicht bij',
        explanation:
          'Perto betekent "dichtbij" en longe betekent "ver weg". Zeg je erbij waar iets dicht bij of ver van ligt, dan komt daar altijd de tussen, en die versmelt met het lidwoord: perto de plus a estação wordt perto da estação, perto de plus o cinema wordt perto do cinema.',
        examples: [
          { target: 'O hotel é perto da estação.', nl: 'Het hotel is dicht bij het station.' },
          { target: 'O hotel é perto da praia.', nl: 'Het hotel is dicht bij het strand.' },
          { target: 'A loja é longe do mercado.', nl: 'De winkel is ver van de markt.' },
        ],
      },
      {
        title: 'De comboio: met de trein',
        explanation:
          'Voor het vervoermiddel gebruik je de, en er komt géén lidwoord achter: de comboio, de autocarro, de avião. Zeg dus niet "com o comboio". Ben je op dat moment ín de trein, dan is het wel no comboio, want dan gaat het over een plek en niet over hoe je reist.',
        examples: [
          { target: 'A viagem de comboio é longa.', nl: 'De reis met de trein is lang.' },
          { target: 'A viagem de avião é rápida.', nl: 'De reis met het vliegtuig is snel.' },
          { target: 'A minha mala está no comboio.', nl: 'Mijn koffer is in de trein.' },
        ],
      },
      {
        title: 'Het hotel é, de koffer está',
        explanation:
          'Voor waar een gebouw ligt gebruik je ser, want dat verandert niet: O hotel é perto da estação. Voor waar een voorwerp of een persoon op dit moment is, gebruik je estar: A mala está no quarto. De koffer kan verhuizen, het hotel niet — dat is precies het verschil.',
        examples: [
          { target: 'O hotel é perto da estação.', nl: 'Het hotel is dicht bij het station.' },
          { target: 'A mala está no quarto.', nl: 'De koffer is in de kamer.' },
          { target: 'A chave está na mala.', nl: 'De sleutel zit in de koffer.' },
        ],
      },
    ],
    phrases: [
      { target: 'Onde é o aeroporto?', nl: 'Waar is het vliegveld?' },
      { target: 'Quero um quarto para duas noites.', nl: 'Ik wil een kamer voor twee nachten.' },
      { target: 'A chave do quarto, se faz favor.', nl: 'De sleutel van de kamer, alsjeblieft.' },
      { target: 'O hotel é perto da praia.', nl: 'Het hotel is dicht bij het strand.' },
      { target: 'A minha mala está no comboio.', nl: 'Mijn koffer is in de trein.' },
      { target: 'O avião parte às dez.', nl: 'Het vliegtuig vertrekt om tien uur.' },
    ],
    tip: 'De klank ão aan het eind van avião, estação en não is nasaal én beklemtoond: de nadruk ligt op die laatste lettergreep, dus a-vi-ÃO en esta-ÇÃO. Nederlandstaligen leggen de klemtoon vaak vooraan en spreken de o er los achteraan, waardoor het woord voor een Portugees onherkenbaar wordt.',
  },

  'pt-u11': {
    intro:
      'Je vertelt hoe je je voelt, waar je pijn hebt en wat je nodig hebt. Zinnen die je hopelijk zelden gebruikt, maar op dat moment onmisbaar zijn.',
    rules: [
      {
        title: 'Estou doente: hoe je je nú voelt',
        explanation:
          'Voor een toestand die weer overgaat gebruik je estar: estou doente (ik ben ziek), estou cansado (ik ben moe). Met ser zou je zeggen dat het een blijvende eigenschap is. Sou doente betekent daardoor zoiets als "ik ben een ziekelijk type" — niet wat je bedoelt als je griep hebt.',
        examples: [
          { target: 'Hoje estou doente.', nl: 'Vandaag ben ik ziek.' },
          { target: 'Estou muito cansado.', nl: 'Ik ben erg moe.' },
          { target: 'O meu pai está doente.', nl: 'Mijn vader is ziek.' },
        ],
      },
      {
        title: 'Dói-me a cabeça',
        explanation:
          'Bij pijn draait het Portugees de zin om: niet "ik heb hoofdpijn", maar "het hoofd doet mij pijn". Dói is het werkwoord, -me betekent "mij", en daarna komt het lichaamsdeel mét lidwoord: a cabeça, a barriga. Een woord voor "mijn" heb je niet nodig, want het is duidelijk van wie dat hoofd is.',
        examples: [
          { target: 'Dói-me a cabeça.', nl: 'Ik heb hoofdpijn.' },
          { target: 'Dói-me a barriga.', nl: 'Ik heb buikpijn.' },
          { target: 'Dói-me a cabeça e estou cansado.', nl: 'Ik heb hoofdpijn en ik ben moe.' },
        ],
      },
      {
        title: 'Preciso de: ik heb nodig',
        explanation:
          'Precisar (nodig hebben) krijgt net als gostar altijd de achter zich, of er nu een ding of een werkwoord op volgt: preciso de um médico, preciso de dormir. Zonder die de klopt de zin niet. Zo herken je een klein groepje werkwoorden dat je altijd samen met hun vaste woordje leert.',
        examples: [
          { target: 'Preciso de um médico.', nl: 'Ik heb een dokter nodig.' },
          { target: 'Preciso de um remédio.', nl: 'Ik heb een medicijn nodig.' },
          { target: 'Preciso de dormir mais.', nl: 'Ik moet meer slapen.' },
        ],
      },
      {
        title: 'Cansado of cansada',
        explanation:
          'Woorden die beschrijven hoe je je voelt, passen zich aan aan jouw geslacht. Een man zegt estou cansado, een vrouw estou cansada. Woorden die al op -e eindigen, zoals doente, veranderen niet: iedereen zegt estou doente.',
        examples: [
          { target: 'Estou cansado.', nl: 'Ik ben moe. (gezegd door een man)' },
          { target: 'Estou cansada.', nl: 'Ik ben moe. (gezegd door een vrouw)' },
          { target: 'A minha mãe está cansada.', nl: 'Mijn moeder is moe.' },
        ],
      },
    ],
    phrases: [
      { target: 'Hoje estou doente.', nl: 'Vandaag ben ik ziek.' },
      { target: 'Preciso de um médico.', nl: 'Ik heb een dokter nodig.' },
      { target: 'Dói-me a cabeça.', nl: 'Ik heb hoofdpijn.' },
      { target: 'Onde é a farmácia?', nl: 'Waar is de apotheek?' },
      { target: 'Estou muito cansado.', nl: 'Ik ben erg moe.' },
      { target: 'Preciso de dormir mais.', nl: 'Ik moet meer slapen.' },
    ],
    tip: 'Wij zeggen "ik heb hoofdpijn" met hebben, en daarom bouwen Nederlandstaligen de zin graag met ter (hebben). In Portugal is dói-me a cabeça veel gewoner: het lichaamsdeel is daar het onderwerp en jij bent degene aan wie het pijn doet. Draai de zin dus in je hoofd om voordat je hem uitspreekt.',
  },

  'pt-u12': {
    intro:
      'Je praat over het weer en de seizoenen: zon, regen, wind, warm en koud. En je leert hoe je zegt dat je ergens naartoe gaat.',
    rules: [
      {
        title: 'Está frio: het weer zonder "het"',
        explanation:
          'Bij het weer gebruikt het Portugees estar, en er is geen woord voor het Nederlandse "het". Está frio betekent letterlijk "is koud" en dat is een complete zin. Hetzelfde geldt voor está sol, está vento en está quente: je begint gewoon met het werkwoord.',
        examples: [
          { target: 'Hoje está frio.', nl: 'Het is vandaag koud.' },
          { target: 'Está sol em Lisboa.', nl: 'Het is zonnig in Lissabon.' },
          { target: 'No verão está muito quente.', nl: 'In de zomer is het erg warm.' },
        ],
      },
      {
        title: 'Ao cinema, à praia',
        explanation:
          'Ga je ergens naartoe, dan gebruik je a (naar), en dat versmelt met het lidwoord: a plus o wordt ao, a plus a wordt à. Dus vamos à praia en vamos ao cinema. Ben je er al, dan gebruik je em in de vorm no of na: estou na praia.',
        examples: [
          { target: 'No verão vamos à praia.', nl: 'In de zomer gaan we naar het strand.' },
          { target: 'Vamos ao cinema hoje à noite?', nl: 'Gaan we vanavond naar de bioscoop?' },
          { target: 'Estou na praia.', nl: 'Ik ben op het strand.' },
        ],
      },
      {
        title: 'No verão, no inverno',
        explanation:
          'Bij seizoenen zeg je no verão en no inverno: dat is em versmolten met het lidwoord o, want beide seizoenen zijn mannelijk. Waar wij "in de zomer" zeggen, zit dat lidwoord in het Portugese woordje no dus al ingebakken. Bij een stad werkt het anders: em Lisboa, zonder lidwoord.',
        examples: [
          { target: 'No verão vamos à praia.', nl: 'In de zomer gaan we naar het strand.' },
          { target: 'No inverno está frio em Lisboa.', nl: 'In de winter is het koud in Lissabon.' },
          { target: 'Não gosto do inverno.', nl: 'Ik houd niet van de winter.' },
        ],
      },
    ],
    phrases: [
      { target: 'O tempo hoje está bom.', nl: 'Het weer is vandaag goed.' },
      { target: 'Está sol em Lisboa.', nl: 'Het is zonnig in Lissabon.' },
      { target: 'Hoje está frio.', nl: 'Het is vandaag koud.' },
      { target: 'Não gosto de chuva.', nl: 'Ik houd niet van regen.' },
      { target: 'No verão vamos à praia.', nl: 'In de zomer gaan we naar het strand.' },
      { target: 'Hoje está muito vento.', nl: 'Het is vandaag erg winderig.' },
    ],
    tip: 'O tempo betekent zowel "het weer" als "de tijd"; uit de rest van de zin blijkt welke van de twee bedoeld is. Let ook op dit verschil: waar wij een beschrijvend woord gebruiken ("het is winderig"), pakt het Portugees een zelfstandig naamwoord — está muito vento, letterlijk "het is veel wind". Bij zon gaat het net zo: está sol.',
  },

  'pt-u13': {
    intro:
      'Je maakt plannen voor de avond: fado, een film, een restaurant en dansen. Onderweg leer je het verschil tussen ergens naartoe gaan en ergens zijn.',
    rules: [
      {
        title: 'Vamos ao cinema, canta no restaurante',
        explanation:
          'Ga je ergens naartoe, dan gebruik je ao of à. Ben je er al of gebeurt er iets ter plaatse, dan gebruik je no of na. Vamos ao cinema betekent dat je er nog heen moet, terwijl A mulher canta no restaurante betekent dat ze er is en daar zingt. Het onderscheid zit dus in de beweging, niet in de plaats zelf.',
        examples: [
          { target: 'Vamos ao cinema hoje à noite?', nl: 'Gaan we vanavond naar de bioscoop?' },
          { target: 'A mulher canta fado no restaurante.', nl: 'De vrouw zingt fado in het restaurant.' },
          { target: 'No verão vamos à praia.', nl: 'In de zomer gaan we naar het strand.' },
        ],
      },
      {
        title: 'Muito: heel of veel',
        explanation:
          'Staat muito bij een beschrijvend woord of bij een werkwoord, dan betekent het "heel" en verandert het nooit van vorm: canta muito bem, está muito quente. Staat het bij een woord voor een ding, dan betekent het "veel" en past het zich wél aan: muita chuva, muitos amigos.',
        examples: [
          { target: 'A minha irmã canta muito bem.', nl: 'Mijn zus zingt heel goed.' },
          { target: 'Hoje está muito quente.', nl: 'Het is vandaag erg warm.' },
          { target: 'Tenho muitos amigos.', nl: 'Ik heb veel vrienden.' },
        ],
      },
      {
        title: 'Vamos: we gaan, of zullen we?',
        explanation:
          'Vamos is de wij-vorm van ir (gaan) en betekent zowel "we gaan" als "zullen we". Zet je er een vraagteken achter, dan is het een uitnodiging: Vamos ao cinema? Je hebt dus geen extra woorden nodig om iets voor te stellen — de toon en het vraagteken doen het werk.',
        examples: [
          { target: 'Vamos ao cinema?', nl: 'Zullen we naar de bioscoop gaan?' },
          { target: 'Vamos ao restaurante hoje à noite.', nl: 'We gaan vanavond naar het restaurant.' },
          { target: 'Vamos a um concerto de fado.', nl: 'We gaan naar een fadoconcert.' },
        ],
      },
      {
        title: 'Música portuguesa: kleine letter',
        explanation:
          'Woorden die zeggen waar iets of iemand vandaan komt, schrijf je in het Portugees met een kleine letter: português, portuguesa. Ze passen zich ook aan het geslacht aan: o fado é português, a música é portuguesa. In het Nederlands schrijven we Portugees juist mét hoofdletter, dus dit is een echte spellingval.',
        examples: [
          { target: 'Gosto de música portuguesa.', nl: 'Ik houd van Portugese muziek.' },
          { target: 'O fado é português.', nl: 'De fado is Portugees.' },
          { target: 'Falo português.', nl: 'Ik spreek Portugees.' },
        ],
      },
    ],
    phrases: [
      { target: 'Gosto de música portuguesa.', nl: 'Ik houd van Portugese muziek.' },
      { target: 'Vamos ao cinema hoje à noite?', nl: 'Gaan we vanavond naar de bioscoop?' },
      { target: 'O filme começa às oito.', nl: 'De film begint om acht uur.' },
      { target: 'O restaurante é perto do cinema.', nl: 'Het restaurant is dicht bij de bioscoop.' },
      { target: 'Gosto de dançar com os meus amigos.', nl: 'Ik dans graag met mijn vrienden.' },
      { target: 'O concerto começa às nove.', nl: 'Het concert begint om negen uur.' },
    ],
    tip: 'De ç klinkt altijd als een s en nooit als een k: dançar zeg je als "dansár" en começa als "kumésa". De ch is een sj-klank, zoals in "chocola": chave klinkt als "sjaav" en chuva als "sjoeva". Nederlandstaligen maken van die ch vaak een harde g of een tsj, en allebei valt meteen op.',
  },

  'pt-u14': {
    intro:
      'De laatste unit brengt alles samen: bestellen, reizen, het weer, gezondheid en uitgaan. Deze gids zet de patronen op een rij die in de hele cursus zijn teruggekomen.',
    rules: [
      {
        title: 'Ser of estar: de korte versie',
        explanation:
          'Gebruik é (van ser) voor wat iets is en blijft: eigenschappen, beroep, herkomst en waar een gebouw staat. Gebruik está (van estar) voor hoe of waar iets nú is: een gevoel, het weer, een voorwerp op een plek. O comboio é rápido blijft altijd waar; A minha mãe está doente hopelijk niet.',
        examples: [
          { target: 'O comboio para o Porto é rápido.', nl: 'De trein naar Porto is snel.' },
          { target: 'A minha mãe está doente.', nl: 'Mijn moeder is ziek.' },
          { target: 'O tempo hoje está bom.', nl: 'Het weer is vandaag goed.' },
        ],
      },
      {
        title: 'Het versmeltingsschema',
        explanation:
          'Drie kleine woordjes plakken altijd vast aan het lidwoord erachter. De plus o wordt do en de plus a wordt da (van). Em plus o wordt no en em plus a wordt na (in of op). A plus o wordt ao en a plus a wordt à (naar). Zodra een van deze drie voor een lidwoord komt, schrijf je ze aan elkaar — los naast elkaar bestaat niet.',
        examples: [
          { target: 'A chave do quarto está na mala.', nl: 'De sleutel van de kamer zit in de koffer.' },
          { target: 'Vamos ao restaurante hoje à noite.', nl: 'We gaan vanavond naar het restaurant.' },
          { target: 'O filme começa às oito no cinema.', nl: 'De film begint om acht uur in de bioscoop.' },
        ],
      },
      {
        title: 'Parte of partem: het werkwoord telt mee',
        explanation:
          'Het werkwoord past zich aan aan wie of wat er iets doet. De ik-vorm eindigt altijd op -o: moro, falo, parto. Voor hij, zij of een ding eindigt hij op -a bij werkwoorden op -ar (fala, mora, começa) en op -e bij werkwoorden op -er en -ir (aprende, parte). Gaat het om meerdere, dan komt daar nog een -m achter: os comboios partem, os bilhetes custam.',
        examples: [
          { target: 'O avião parte às dez.', nl: 'Het vliegtuig vertrekt om tien uur.' },
          { target: 'O filme começa às oito.', nl: 'De film begint om acht uur.' },
          { target: 'Os bilhetes custam dez euros.', nl: 'De kaartjes kosten tien euro.' },
        ],
      },
      {
        title: 'Vou, vais, vai, vamos',
        explanation:
          'Ir (gaan) is onregelmatig: de vormen lijken niet op de basisvorm en die leer je uit je hoofd. Eu vou, tu vais, ele of ela vai, nós vamos. Wil je zeggen dat je ergens níet heen gaat, dan zet je não vlak vóór het werkwoord: No inverno não vamos à praia.',
        examples: [
          { target: 'Vou ao mercado.', nl: 'Ik ga naar de markt.' },
          { target: 'No inverno não vamos à praia.', nl: 'In de winter gaan we niet naar het strand.' },
          { target: 'Vamos ao cinema.', nl: 'We gaan naar de bioscoop.' },
        ],
      },
      {
        title: 'Rápido, longa, caras: alles past zich aan',
        explanation:
          'Beschrijvende woorden nemen het geslacht en het aantal over van het woord waar ze bij horen. O comboio é rápido is mannelijk, a viagem é longa is vrouwelijk en as lojas são caras is vrouwelijk meervoud. Bij meerdere dingen krijgt alles een -s: het lidwoord o wordt os en a wordt as, en het beschrijvende woord gaat mee. Kijk dus eerst naar het lidwoord, dan weet je meteen welke uitgang je nodig hebt.',
        examples: [
          { target: 'O comboio para o Porto é rápido.', nl: 'De trein naar Porto is snel.' },
          { target: 'A viagem é longa.', nl: 'De reis is lang.' },
          { target: 'As lojas são caras.', nl: 'De winkels zijn duur.' },
        ],
      },
    ],
    phrases: [
      { target: 'Quero um quarto para duas noites, por favor.', nl: 'Ik wil een kamer voor twee nachten, alsjeblieft.' },
      { target: 'A conta, se faz favor.', nl: 'De rekening, alsjeblieft.' },
      { target: 'Onde é a farmácia?', nl: 'Waar is de apotheek?' },
      { target: 'Estou cansado e preciso de dormir.', nl: 'Ik ben moe en ik moet slapen.' },
      { target: 'Hoje à noite vamos a um concerto de fado.', nl: 'Vanavond gaan we naar een fadoconcert.' },
      { target: 'Adeus, até amanhã!', nl: 'Tot ziens, tot morgen!' },
    ],
    tip: 'Nederlandstaligen zetten de tijd graag vooraan: "Vanavond gaan we naar het restaurant". Het Portugees noemt meestal eerst waar je heen gaat en daarna wanneer: Vamos ao restaurante hoje à noite. En het werkwoord blijft altijd op zijn plek vooraan in de zin — het schuift nooit naar het eind, zoals bij ons in een bijzin.',
  },
}
