import type { CourseId } from '../types'

/**
 * Gesprekken: echte dialogen met een personage in de doeltaal.
 *
 * Elke stap is een beurt van je gesprekspartner plus twee of drie antwoorden
 * waar je uit kiest (of die je inspreekt). Alle antwoorden zijn goed; ze
 * sturen alleen de toon. De vervolgbeurt van de partner is zo geschreven dat
 * hij op elk van de antwoorden natuurlijk aansluit, dus het gesprek loopt
 * nooit vast en fout bestaat hier niet.
 */

export interface GesprekAntwoord {
  /** Wat jij zegt, in de doeltaal */
  tekst: string
  /** Nederlandse vertaling */
  nl: string
}

export interface GesprekStap {
  /** Wat je gesprekspartner zegt, in de doeltaal */
  zeg: string
  nl: string
  antwoorden: GesprekAntwoord[]
}

export interface GesprekScenario {
  id: string
  /** Nederlandse titel, bv. "In het café" */
  titel: string
  emoji: string
  /** Korte Nederlandse setting, bv. "Je bestelt iets te drinken in Madrid" */
  plek: string
  /** Naam van je gesprekspartner */
  partner: string
  stappen: GesprekStap[]
  /** Afsluitende zin van de partner */
  slot: { zeg: string; nl: string }
}

export const GESPREKKEN: Record<CourseId, GesprekScenario[]> = {
  es: [
    {
      id: 'cafe',
      titel: 'In het café',
      emoji: '☕',
      plek: 'Je bestelt iets te drinken in Madrid',
      partner: 'Mateo',
      stappen: [
        {
          zeg: '¡Hola! Bienvenido al café. ¿Qué quieres tomar?',
          nl: 'Hallo! Welkom in het café. Wat wil je drinken?',
          antwoorden: [
            { tekst: 'Un café con leche, por favor.', nl: 'Een koffie met melk, alstublieft.' },
            { tekst: 'Un té, por favor.', nl: 'Een thee, alstublieft.' },
            { tekst: 'Un zumo de naranja, por favor.', nl: 'Een sinaasappelsap, alstublieft.' },
          ],
        },
        {
          zeg: 'Muy bien. ¿Quieres algo más?',
          nl: 'Prima. Wil je nog iets anders?',
          antwoorden: [
            { tekst: 'Sí, un cruasán, por favor.', nl: 'Ja, een croissant, alstublieft.' },
            { tekst: 'No, gracias. Eso es todo.', nl: 'Nee, dank je. Dat is alles.' },
          ],
        },
        {
          zeg: 'Perfecto. Son cuatro euros.',
          nl: 'Perfect. Dat is vier euro.',
          antwoorden: [
            { tekst: 'Aquí tiene.', nl: 'Alstublieft.' },
            { tekst: '¿Puedo pagar con tarjeta?', nl: 'Kan ik met kaart betalen?' },
          ],
        },
        {
          zeg: '¡Claro que sí! Muchas gracias.',
          nl: 'Natuurlijk! Dank je wel.',
          antwoorden: [
            { tekst: 'Gracias a ti. ¡Hasta luego!', nl: 'Jij bedankt. Tot ziens!' },
            { tekst: '¡Que tengas un buen día!', nl: 'Fijne dag!' },
          ],
        },
      ],
      slot: { zeg: '¡Igualmente! ¡Hasta pronto!', nl: 'Jij ook! Tot gauw!' },
    },
    {
      id: 'vrienden',
      titel: 'Nieuwe vrienden',
      emoji: '👋',
      plek: 'Je ontmoet iemand in het park',
      partner: 'Lucía',
      stappen: [
        {
          zeg: '¡Hola! Soy Lucía. ¿Cómo estás?',
          nl: 'Hoi! Ik ben Lucía. Hoe gaat het?',
          antwoorden: [
            { tekst: '¡Hola! Muy bien, gracias. ¿Y tú?', nl: 'Hoi! Heel goed, dank je. En met jou?' },
            { tekst: 'Bien, gracias. Encantado.', nl: 'Goed, dank je. Aangenaam.' },
          ],
        },
        {
          zeg: '¡Muy bien también! ¿De dónde eres?',
          nl: 'Ook heel goed! Waar kom je vandaan?',
          antwoorden: [
            { tekst: 'Soy de los Países Bajos.', nl: 'Ik kom uit Nederland.' },
            { tekst: 'Vivo en Ámsterdam.', nl: 'Ik woon in Amsterdam.' },
          ],
        },
        {
          zeg: '¡Qué interesante! ¿Hablas español?',
          nl: 'Wat interessant! Spreek je Spaans?',
          antwoorden: [
            { tekst: 'Un poco. Estoy aprendiendo.', nl: 'Een beetje. Ik ben het aan het leren.' },
            { tekst: 'Sí, pero hablo despacio.', nl: 'Ja, maar ik praat langzaam.' },
          ],
        },
        {
          zeg: '¡Hablas muy bien! ¿Tomamos un café juntos?',
          nl: 'Je spreekt heel goed! Zullen we samen een koffie drinken?',
          antwoorden: [
            { tekst: '¡Sí, buena idea!', nl: 'Ja, goed idee!' },
            { tekst: 'Sí, ¡vamos!', nl: 'Ja, kom!' },
          ],
        },
      ],
      slot: { zeg: '¡Genial! Conozco un café muy bueno.', nl: 'Super! Ik ken een heel goed café.' },
    },
    {
      id: 'deweg',
      titel: 'De weg vragen',
      emoji: '🧭',
      plek: 'Je bent verdwaald in een nieuwe stad',
      partner: 'Carmen',
      stappen: [
        {
          zeg: 'Hola, ¿estás perdido? ¿Necesitas ayuda?',
          nl: 'Hoi, ben je verdwaald? Heb je hulp nodig?',
          antwoorden: [
            { tekst: 'Sí, ¿dónde está la estación?', nl: 'Ja, waar is het station?' },
            { tekst: 'Sí, busco el museo.', nl: 'Ja, ik zoek het museum.' },
          ],
        },
        {
          zeg: 'Está cerca. Sigue todo recto y gira a la izquierda.',
          nl: 'Het is dichtbij. Ga rechtdoor en sla linksaf.',
          antwoorden: [
            { tekst: '¿Está lejos de aquí?', nl: 'Is het ver hiervandaan?' },
            { tekst: 'Todo recto y a la izquierda, vale.', nl: 'Rechtdoor en naar links, oké.' },
          ],
        },
        {
          zeg: 'No, está a cinco minutos a pie.',
          nl: 'Nee, het is vijf minuten lopen.',
          antwoorden: [
            { tekst: 'Perfecto, muchas gracias.', nl: 'Perfect, dank je wel.' },
            { tekst: '¡Qué bien! Gracias por tu ayuda.', nl: 'Wat fijn! Bedankt voor je hulp.' },
          ],
        },
      ],
      slot: { zeg: '¡De nada! ¡Buen viaje!', nl: 'Graag gedaan! Goede reis!' },
    },
  ],

  fr: [
    {
      id: 'cafe',
      titel: 'In het café',
      emoji: '☕',
      plek: 'Je bestelt iets te drinken in Parijs',
      partner: 'Camille',
      stappen: [
        {
          zeg: 'Bonjour ! Bienvenue au café. Qu’est-ce que vous voulez boire ?',
          nl: 'Goedendag! Welkom in het café. Wat wilt u drinken?',
          antwoorden: [
            { tekst: 'Un café au lait, s’il vous plaît.', nl: 'Een koffie met melk, alstublieft.' },
            { tekst: 'Un thé, s’il vous plaît.', nl: 'Een thee, alstublieft.' },
            { tekst: 'Un jus d’orange, s’il vous plaît.', nl: 'Een sinaasappelsap, alstublieft.' },
          ],
        },
        {
          zeg: 'Très bien. Vous voulez autre chose ?',
          nl: 'Heel goed. Wilt u nog iets anders?',
          antwoorden: [
            { tekst: 'Oui, un croissant, s’il vous plaît.', nl: 'Ja, een croissant, alstublieft.' },
            { tekst: 'Non, merci. C’est tout.', nl: 'Nee, dank u. Dat is alles.' },
          ],
        },
        {
          zeg: 'Parfait. Ça fait quatre euros.',
          nl: 'Perfect. Dat is vier euro.',
          antwoorden: [
            { tekst: 'Voilà.', nl: 'Alstublieft.' },
            { tekst: 'Je peux payer par carte ?', nl: 'Kan ik met kaart betalen?' },
          ],
        },
        {
          zeg: 'Bien sûr ! Merci beaucoup.',
          nl: 'Natuurlijk! Dank u wel.',
          antwoorden: [
            { tekst: 'Merci à vous. Au revoir !', nl: 'U bedankt. Tot ziens!' },
            { tekst: 'Bonne journée !', nl: 'Fijne dag!' },
          ],
        },
      ],
      slot: { zeg: 'À bientôt !', nl: 'Tot gauw!' },
    },
    {
      id: 'vrienden',
      titel: 'Nieuwe vrienden',
      emoji: '👋',
      plek: 'Je ontmoet iemand in het park',
      partner: 'Louis',
      stappen: [
        {
          zeg: 'Salut ! Moi, c’est Louis. Ça va ?',
          nl: 'Hoi! Ik ben Louis. Hoe gaat het?',
          antwoorden: [
            { tekst: 'Salut ! Ça va bien, merci. Et toi ?', nl: 'Hoi! Het gaat goed, dank je. En met jou?' },
            { tekst: 'Ça va, merci. Enchanté.', nl: 'Het gaat goed, dank je. Aangenaam.' },
          ],
        },
        {
          zeg: 'Très bien aussi ! Tu viens d’où ?',
          nl: 'Ook heel goed! Waar kom je vandaan?',
          antwoorden: [
            { tekst: 'Je viens des Pays-Bas.', nl: 'Ik kom uit Nederland.' },
            { tekst: 'J’habite à Amsterdam.', nl: 'Ik woon in Amsterdam.' },
          ],
        },
        {
          zeg: 'C’est intéressant ! Tu parles français ?',
          nl: 'Wat interessant! Spreek je Frans?',
          antwoorden: [
            { tekst: 'Un peu. J’apprends le français.', nl: 'Een beetje. Ik leer Frans.' },
            { tekst: 'Oui, mais je parle lentement.', nl: 'Ja, maar ik praat langzaam.' },
          ],
        },
        {
          zeg: 'Tu parles très bien ! On prend un café ensemble ?',
          nl: 'Je spreekt heel goed! Zullen we samen een koffie drinken?',
          antwoorden: [
            { tekst: 'Oui, bonne idée !', nl: 'Ja, goed idee!' },
            { tekst: 'Oui, allons-y !', nl: 'Ja, laten we gaan!' },
          ],
        },
      ],
      slot: { zeg: 'Génial ! Je connais un très bon café.', nl: 'Super! Ik ken een heel goed café.' },
    },
    {
      id: 'deweg',
      titel: 'De weg vragen',
      emoji: '🧭',
      plek: 'Je bent verdwaald in een nieuwe stad',
      partner: 'Hugo',
      stappen: [
        {
          zeg: 'Bonjour, vous êtes perdu ? Je peux vous aider ?',
          nl: 'Goedendag, bent u verdwaald? Kan ik u helpen?',
          antwoorden: [
            { tekst: 'Oui, où est la gare ?', nl: 'Ja, waar is het station?' },
            { tekst: 'Oui, je cherche le musée.', nl: 'Ja, ik zoek het museum.' },
          ],
        },
        {
          zeg: 'C’est tout près. Allez tout droit, puis à gauche.',
          nl: 'Het is heel dichtbij. Ga rechtdoor en dan naar links.',
          antwoorden: [
            { tekst: 'C’est loin d’ici ?', nl: 'Is het ver hiervandaan?' },
            { tekst: 'Tout droit et à gauche, d’accord.', nl: 'Rechtdoor en naar links, oké.' },
          ],
        },
        {
          zeg: 'Non, c’est à cinq minutes à pied.',
          nl: 'Nee, het is vijf minuten lopen.',
          antwoorden: [
            { tekst: 'Parfait, merci beaucoup.', nl: 'Perfect, dank u wel.' },
            { tekst: 'Super ! Merci pour votre aide.', nl: 'Super! Bedankt voor uw hulp.' },
          ],
        },
      ],
      slot: { zeg: 'De rien ! Bon voyage !', nl: 'Graag gedaan! Goede reis!' },
    },
  ],

  de: [
    {
      id: 'cafe',
      titel: 'In het café',
      emoji: '☕',
      plek: 'Je bestelt iets te drinken in Berlijn',
      partner: 'Lena',
      stappen: [
        {
          zeg: 'Hallo! Willkommen im Café. Was möchtest du trinken?',
          nl: 'Hallo! Welkom in het café. Wat wil je drinken?',
          antwoorden: [
            { tekst: 'Einen Kaffee mit Milch, bitte.', nl: 'Een koffie met melk, alstublieft.' },
            { tekst: 'Einen Tee, bitte.', nl: 'Een thee, alstublieft.' },
            { tekst: 'Einen Orangensaft, bitte.', nl: 'Een sinaasappelsap, alstublieft.' },
          ],
        },
        {
          zeg: 'Sehr gern. Möchtest du noch etwas?',
          nl: 'Heel graag. Wil je nog iets?',
          antwoorden: [
            { tekst: 'Ja, ein Croissant, bitte.', nl: 'Ja, een croissant, alstublieft.' },
            { tekst: 'Nein, danke. Das ist alles.', nl: 'Nee, dank je. Dat is alles.' },
          ],
        },
        {
          zeg: 'Perfekt. Das macht vier Euro.',
          nl: 'Perfect. Dat is vier euro.',
          antwoorden: [
            { tekst: 'Hier, bitte.', nl: 'Alstublieft.' },
            { tekst: 'Kann ich mit Karte zahlen?', nl: 'Kan ik met kaart betalen?' },
          ],
        },
        {
          zeg: 'Natürlich! Vielen Dank.',
          nl: 'Natuurlijk! Dank je wel.',
          antwoorden: [
            { tekst: 'Danke dir. Tschüss!', nl: 'Jij bedankt. Doei!' },
            { tekst: 'Schönen Tag noch!', nl: 'Nog een fijne dag!' },
          ],
        },
      ],
      slot: { zeg: 'Bis bald!', nl: 'Tot gauw!' },
    },
    {
      id: 'vrienden',
      titel: 'Nieuwe vrienden',
      emoji: '👋',
      plek: 'Je ontmoet iemand in het park',
      partner: 'Jonas',
      stappen: [
        {
          zeg: 'Hallo! Ich bin Jonas. Wie geht’s?',
          nl: 'Hallo! Ik ben Jonas. Hoe gaat het?',
          antwoorden: [
            { tekst: 'Hallo! Sehr gut, danke. Und dir?', nl: 'Hallo! Heel goed, dank je. En met jou?' },
            { tekst: 'Gut, danke. Freut mich.', nl: 'Goed, dank je. Aangenaam.' },
          ],
        },
        {
          zeg: 'Auch sehr gut! Woher kommst du?',
          nl: 'Ook heel goed! Waar kom je vandaan?',
          antwoorden: [
            { tekst: 'Ich komme aus den Niederlanden.', nl: 'Ik kom uit Nederland.' },
            { tekst: 'Ich wohne in Amsterdam.', nl: 'Ik woon in Amsterdam.' },
          ],
        },
        {
          zeg: 'Wie interessant! Sprichst du Deutsch?',
          nl: 'Wat interessant! Spreek je Duits?',
          antwoorden: [
            { tekst: 'Ein bisschen. Ich lerne Deutsch.', nl: 'Een beetje. Ik leer Duits.' },
            { tekst: 'Ja, aber ich spreche langsam.', nl: 'Ja, maar ik praat langzaam.' },
          ],
        },
        {
          zeg: 'Du sprichst sehr gut! Trinken wir zusammen einen Kaffee?',
          nl: 'Je spreekt heel goed! Zullen we samen een koffie drinken?',
          antwoorden: [
            { tekst: 'Ja, gute Idee!', nl: 'Ja, goed idee!' },
            { tekst: 'Ja, gern!', nl: 'Ja, graag!' },
          ],
        },
      ],
      slot: { zeg: 'Super! Ich kenne ein sehr gutes Café.', nl: 'Super! Ik ken een heel goed café.' },
    },
    {
      id: 'deweg',
      titel: 'De weg vragen',
      emoji: '🧭',
      plek: 'Je bent verdwaald in een nieuwe stad',
      partner: 'Mia',
      stappen: [
        {
          zeg: 'Hallo, hast du dich verlaufen? Brauchst du Hilfe?',
          nl: 'Hoi, ben je verdwaald? Heb je hulp nodig?',
          antwoorden: [
            { tekst: 'Ja, wo ist der Bahnhof?', nl: 'Ja, waar is het station?' },
            { tekst: 'Ja, ich suche das Museum.', nl: 'Ja, ik zoek het museum.' },
          ],
        },
        {
          zeg: 'Das ist ganz in der Nähe. Geh geradeaus und dann links.',
          nl: 'Het is heel dichtbij. Ga rechtdoor en dan naar links.',
          antwoorden: [
            { tekst: 'Ist es weit von hier?', nl: 'Is het ver hiervandaan?' },
            { tekst: 'Geradeaus und dann links, okay.', nl: 'Rechtdoor en dan links, oké.' },
          ],
        },
        {
          zeg: 'Nein, es sind fünf Minuten zu Fuß.',
          nl: 'Nee, het is vijf minuten lopen.',
          antwoorden: [
            { tekst: 'Perfekt, vielen Dank.', nl: 'Perfect, dank je wel.' },
            { tekst: 'Wie schön! Danke für deine Hilfe.', nl: 'Wat fijn! Bedankt voor je hulp.' },
          ],
        },
      ],
      slot: { zeg: 'Gern geschehen! Gute Reise!', nl: 'Graag gedaan! Goede reis!' },
    },
  ],

  it: [
    {
      id: 'cafe',
      titel: 'In het café',
      emoji: '☕',
      plek: 'Je bestelt iets te drinken in Rome',
      partner: 'Marco',
      stappen: [
        {
          zeg: 'Ciao! Benvenuto al bar. Cosa vuoi da bere?',
          nl: 'Hoi! Welkom in de bar. Wat wil je drinken?',
          antwoorden: [
            { tekst: 'Un cappuccino, per favore.', nl: 'Een cappuccino, alstublieft.' },
            { tekst: 'Un tè, per favore.', nl: 'Een thee, alstublieft.' },
            { tekst: 'Un succo d’arancia, per favore.', nl: 'Een sinaasappelsap, alstublieft.' },
          ],
        },
        {
          zeg: 'Va bene. Vuoi qualcos’altro?',
          nl: 'Goed. Wil je nog iets anders?',
          antwoorden: [
            { tekst: 'Sì, un cornetto, per favore.', nl: 'Ja, een croissant, alstublieft.' },
            { tekst: 'No, grazie. È tutto.', nl: 'Nee, dank je. Dat is alles.' },
          ],
        },
        {
          zeg: 'Perfetto. Sono quattro euro.',
          nl: 'Perfect. Dat is vier euro.',
          antwoorden: [
            { tekst: 'Ecco qui.', nl: 'Alstublieft.' },
            { tekst: 'Posso pagare con la carta?', nl: 'Kan ik met kaart betalen?' },
          ],
        },
        {
          zeg: 'Certo! Grazie mille.',
          nl: 'Zeker! Heel erg bedankt.',
          antwoorden: [
            { tekst: 'Grazie a te. Ciao!', nl: 'Jij bedankt. Doei!' },
            { tekst: 'Buona giornata!', nl: 'Fijne dag!' },
          ],
        },
      ],
      slot: { zeg: 'A presto!', nl: 'Tot gauw!' },
    },
    {
      id: 'vrienden',
      titel: 'Nieuwe vrienden',
      emoji: '👋',
      plek: 'Je ontmoet iemand in het park',
      partner: 'Giulia',
      stappen: [
        {
          zeg: 'Ciao! Sono Giulia. Come stai?',
          nl: 'Hoi! Ik ben Giulia. Hoe gaat het?',
          antwoorden: [
            { tekst: 'Ciao! Molto bene, grazie. E tu?', nl: 'Hoi! Heel goed, dank je. En met jou?' },
            { tekst: 'Bene, grazie. Piacere.', nl: 'Goed, dank je. Aangenaam.' },
          ],
        },
        {
          zeg: 'Anch’io sto bene! Di dove sei?',
          nl: 'Met mij gaat het ook goed! Waar kom je vandaan?',
          antwoorden: [
            { tekst: 'Vengo dai Paesi Bassi.', nl: 'Ik kom uit Nederland.' },
            { tekst: 'Vivo ad Amsterdam.', nl: 'Ik woon in Amsterdam.' },
          ],
        },
        {
          zeg: 'Che interessante! Parli italiano?',
          nl: 'Wat interessant! Spreek je Italiaans?',
          antwoorden: [
            { tekst: 'Un po’. Sto imparando l’italiano.', nl: 'Een beetje. Ik leer Italiaans.' },
            { tekst: 'Sì, ma parlo lentamente.', nl: 'Ja, maar ik praat langzaam.' },
          ],
        },
        {
          zeg: 'Parli molto bene! Prendiamo un caffè insieme?',
          nl: 'Je spreekt heel goed! Zullen we samen een koffie drinken?',
          antwoorden: [
            { tekst: 'Sì, buona idea!', nl: 'Ja, goed idee!' },
            { tekst: 'Sì, andiamo!', nl: 'Ja, laten we gaan!' },
          ],
        },
      ],
      slot: { zeg: 'Fantastico! Conosco un bar molto buono.', nl: 'Fantastisch! Ik ken een heel goede bar.' },
    },
    {
      id: 'deweg',
      titel: 'De weg vragen',
      emoji: '🧭',
      plek: 'Je bent verdwaald in een nieuwe stad',
      partner: 'Luca',
      stappen: [
        {
          zeg: 'Ciao, ti sei perso? Hai bisogno di aiuto?',
          nl: 'Hoi, ben je verdwaald? Heb je hulp nodig?',
          antwoorden: [
            { tekst: 'Sì, dov’è la stazione?', nl: 'Ja, waar is het station?' },
            { tekst: 'Sì, cerco il museo.', nl: 'Ja, ik zoek het museum.' },
          ],
        },
        {
          zeg: 'È qui vicino. Vai dritto e poi a sinistra.',
          nl: 'Het is hier dichtbij. Ga rechtdoor en dan naar links.',
          antwoorden: [
            { tekst: 'È lontano da qui?', nl: 'Is het ver hiervandaan?' },
            { tekst: 'Dritto e poi a sinistra, va bene.', nl: 'Rechtdoor en dan links, oké.' },
          ],
        },
        {
          zeg: 'No, sono cinque minuti a piedi.',
          nl: 'Nee, het is vijf minuten lopen.',
          antwoorden: [
            { tekst: 'Perfetto, grazie mille.', nl: 'Perfect, heel erg bedankt.' },
            { tekst: 'Che bello! Grazie per il tuo aiuto.', nl: 'Wat fijn! Bedankt voor je hulp.' },
          ],
        },
      ],
      slot: { zeg: 'Prego! Buon viaggio!', nl: 'Graag gedaan! Goede reis!' },
    },
  ],

  pt: [
    {
      id: 'cafe',
      titel: 'In het café',
      emoji: '☕',
      plek: 'Je bestelt iets te drinken in Lissabon',
      partner: 'Inês',
      stappen: [
        {
          zeg: 'Olá! Bem-vindo ao café. O que queres beber?',
          nl: 'Hallo! Welkom in het café. Wat wil je drinken?',
          antwoorden: [
            { tekst: 'Um café com leite, por favor.', nl: 'Een koffie met melk, alstublieft.' },
            { tekst: 'Um chá, por favor.', nl: 'Een thee, alstublieft.' },
            { tekst: 'Um sumo de laranja, por favor.', nl: 'Een sinaasappelsap, alstublieft.' },
          ],
        },
        {
          zeg: 'Muito bem. Queres mais alguma coisa?',
          nl: 'Heel goed. Wil je nog iets?',
          antwoorden: [
            { tekst: 'Sim, um croissant, por favor.', nl: 'Ja, een croissant, alstublieft.' },
            { tekst: 'Não, obrigado. É tudo.', nl: 'Nee, dank je. Dat is alles.' },
          ],
        },
        {
          zeg: 'Perfeito. São quatro euros.',
          nl: 'Perfect. Dat is vier euro.',
          antwoorden: [
            { tekst: 'Aqui tem.', nl: 'Alstublieft.' },
            { tekst: 'Posso pagar com cartão?', nl: 'Kan ik met kaart betalen?' },
          ],
        },
        {
          zeg: 'Claro que sim! Muito obrigada.',
          nl: 'Natuurlijk! Dank je wel.',
          antwoorden: [
            { tekst: 'Obrigado eu. Até logo!', nl: 'Jij bedankt. Tot straks!' },
            { tekst: 'Um bom dia para ti!', nl: 'Een fijne dag voor jou!' },
          ],
        },
      ],
      slot: { zeg: 'Até à próxima!', nl: 'Tot de volgende keer!' },
    },
    {
      id: 'vrienden',
      titel: 'Nieuwe vrienden',
      emoji: '👋',
      plek: 'Je ontmoet iemand in het park',
      partner: 'Tiago',
      stappen: [
        {
          zeg: 'Olá! Sou o Tiago. Como estás?',
          nl: 'Hoi! Ik ben Tiago. Hoe gaat het?',
          antwoorden: [
            { tekst: 'Olá! Muito bem, obrigado. E tu?', nl: 'Hoi! Heel goed, dank je. En met jou?' },
            { tekst: 'Bem, obrigado. Muito prazer.', nl: 'Goed, dank je. Aangenaam.' },
          ],
        },
        {
          zeg: 'Também estou bem! De onde és?',
          nl: 'Met mij gaat het ook goed! Waar kom je vandaan?',
          antwoorden: [
            { tekst: 'Sou dos Países Baixos.', nl: 'Ik kom uit Nederland.' },
            { tekst: 'Vivo em Amesterdão.', nl: 'Ik woon in Amsterdam.' },
          ],
        },
        {
          zeg: 'Que interessante! Falas português?',
          nl: 'Wat interessant! Spreek je Portugees?',
          antwoorden: [
            { tekst: 'Um pouco. Estou a aprender português.', nl: 'Een beetje. Ik leer Portugees.' },
            { tekst: 'Sim, mas falo devagar.', nl: 'Ja, maar ik praat langzaam.' },
          ],
        },
        {
          zeg: 'Falas muito bem! Tomamos um café juntos?',
          nl: 'Je spreekt heel goed! Zullen we samen een koffie drinken?',
          antwoorden: [
            { tekst: 'Sim, boa ideia!', nl: 'Ja, goed idee!' },
            { tekst: 'Sim, vamos!', nl: 'Ja, laten we gaan!' },
          ],
        },
      ],
      slot: { zeg: 'Ótimo! Conheço um café muito bom.', nl: 'Geweldig! Ik ken een heel goed café.' },
    },
    {
      id: 'deweg',
      titel: 'De weg vragen',
      emoji: '🧭',
      plek: 'Je bent verdwaald in een nieuwe stad',
      partner: 'Ana',
      stappen: [
        {
          zeg: 'Olá, estás perdido? Precisas de ajuda?',
          nl: 'Hoi, ben je verdwaald? Heb je hulp nodig?',
          antwoorden: [
            { tekst: 'Sim, onde é a estação?', nl: 'Ja, waar is het station?' },
            { tekst: 'Sim, procuro o museu.', nl: 'Ja, ik zoek het museum.' },
          ],
        },
        {
          zeg: 'É perto. Segue em frente e depois vira à esquerda.',
          nl: 'Het is dichtbij. Ga rechtdoor en sla dan linksaf.',
          antwoorden: [
            { tekst: 'É longe daqui?', nl: 'Is het ver hiervandaan?' },
            { tekst: 'Em frente e à esquerda, está bem.', nl: 'Rechtdoor en naar links, oké.' },
          ],
        },
        {
          zeg: 'Não, são cinco minutos a pé.',
          nl: 'Nee, het is vijf minuten lopen.',
          antwoorden: [
            { tekst: 'Perfeito, muito obrigado.', nl: 'Perfect, dank je wel.' },
            { tekst: 'Que bom! Obrigado pela ajuda.', nl: 'Wat fijn! Bedankt voor de hulp.' },
          ],
        },
      ],
      slot: { zeg: 'De nada! Boa viagem!', nl: 'Graag gedaan! Goede reis!' },
    },
  ],

  en: [
    {
      id: 'cafe',
      titel: 'In het café',
      emoji: '☕',
      plek: 'Je bestelt iets te drinken in Londen',
      partner: 'Oliver',
      stappen: [
        {
          zeg: 'Hello! Welcome to the café. What would you like to drink?',
          nl: 'Hallo! Welkom in het café. Wat wil je drinken?',
          antwoorden: [
            { tekst: 'A coffee with milk, please.', nl: 'Een koffie met melk, alstublieft.' },
            { tekst: 'A cup of tea, please.', nl: 'Een kop thee, alstublieft.' },
            { tekst: 'An orange juice, please.', nl: 'Een sinaasappelsap, alstublieft.' },
          ],
        },
        {
          zeg: 'Of course. Would you like anything else?',
          nl: 'Natuurlijk. Wil je nog iets anders?',
          antwoorden: [
            { tekst: 'Yes, a croissant, please.', nl: 'Ja, een croissant, alstublieft.' },
            { tekst: 'No, thank you. That’s all.', nl: 'Nee, dank je. Dat is alles.' },
          ],
        },
        {
          zeg: 'Perfect. That’s four pounds.',
          nl: 'Perfect. Dat is vier pond.',
          antwoorden: [
            { tekst: 'Here you are.', nl: 'Alstublieft.' },
            { tekst: 'Can I pay by card?', nl: 'Kan ik met kaart betalen?' },
          ],
        },
        {
          zeg: 'Of course you can! Thank you very much.',
          nl: 'Natuurlijk kan dat! Dank je wel.',
          antwoorden: [
            { tekst: 'Thank you. Goodbye!', nl: 'Dank je. Tot ziens!' },
            { tekst: 'Have a nice day!', nl: 'Fijne dag!' },
          ],
        },
      ],
      slot: { zeg: 'See you soon!', nl: 'Tot gauw!' },
    },
    {
      id: 'vrienden',
      titel: 'Nieuwe vrienden',
      emoji: '👋',
      plek: 'Je ontmoet iemand in het park',
      partner: 'Emma',
      stappen: [
        {
          zeg: 'Hi! I’m Emma. How are you?',
          nl: 'Hoi! Ik ben Emma. Hoe gaat het?',
          antwoorden: [
            { tekst: 'Hi! Very well, thank you. And you?', nl: 'Hoi! Heel goed, dank je. En met jou?' },
            { tekst: 'I’m fine, thanks. Nice to meet you.', nl: 'Goed, dank je. Aangenaam.' },
          ],
        },
        {
          zeg: 'I’m great too! Where are you from?',
          nl: 'Met mij gaat het ook super! Waar kom je vandaan?',
          antwoorden: [
            { tekst: 'I’m from the Netherlands.', nl: 'Ik kom uit Nederland.' },
            { tekst: 'I live in Amsterdam.', nl: 'Ik woon in Amsterdam.' },
          ],
        },
        {
          zeg: 'How interesting! Do you speak English?',
          nl: 'Wat interessant! Spreek je Engels?',
          antwoorden: [
            { tekst: 'A little. I’m learning English.', nl: 'Een beetje. Ik leer Engels.' },
            { tekst: 'Yes, but I speak slowly.', nl: 'Ja, maar ik praat langzaam.' },
          ],
        },
        {
          zeg: 'You speak very well! Shall we have a coffee together?',
          nl: 'Je spreekt heel goed! Zullen we samen een koffie drinken?',
          antwoorden: [
            { tekst: 'Yes, good idea!', nl: 'Ja, goed idee!' },
            { tekst: 'Yes, let’s go!', nl: 'Ja, laten we gaan!' },
          ],
        },
      ],
      slot: { zeg: 'Great! I know a very good café.', nl: 'Super! Ik ken een heel goed café.' },
    },
    {
      id: 'deweg',
      titel: 'De weg vragen',
      emoji: '🧭',
      plek: 'Je bent verdwaald in een nieuwe stad',
      partner: 'Jack',
      stappen: [
        {
          zeg: 'Hello, are you lost? Do you need help?',
          nl: 'Hallo, ben je verdwaald? Heb je hulp nodig?',
          antwoorden: [
            { tekst: 'Yes, where is the station?', nl: 'Ja, waar is het station?' },
            { tekst: 'Yes, I’m looking for the museum.', nl: 'Ja, ik zoek het museum.' },
          ],
        },
        {
          zeg: 'It’s very close. Go straight on and then turn left.',
          nl: 'Het is heel dichtbij. Ga rechtdoor en sla dan linksaf.',
          antwoorden: [
            { tekst: 'Is it far from here?', nl: 'Is het ver hiervandaan?' },
            { tekst: 'Straight on and then left, okay.', nl: 'Rechtdoor en dan links, oké.' },
          ],
        },
        {
          zeg: 'No, it’s five minutes on foot.',
          nl: 'Nee, het is vijf minuten lopen.',
          antwoorden: [
            { tekst: 'Perfect, thank you very much.', nl: 'Perfect, dank je wel.' },
            { tekst: 'Great! Thanks for your help.', nl: 'Super! Bedankt voor je hulp.' },
          ],
        },
      ],
      slot: { zeg: 'You’re welcome! Have a good trip!', nl: 'Graag gedaan! Goede reis!' },
    },
  ],
}
