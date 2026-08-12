import type { CourseId } from '../types'
import type { GesprekScenario, GesprekStap } from './gesprekken'

/**
 * Uitbreiding op de gesprekken: het restaurantscenario en het vrije gesprek.
 *
 * Het vrije gesprek is het antwoord op "ik wil zelf zeggen waarover ik praat":
 * na de begroeting kies jij een onderwerp (eten, reizen, muziek, sport,
 * familie, het weer), praat je daar twee beurten over, en mag je daarna een
 * volgend onderwerp kiezen of afronden. Zo is elk gesprek anders en kan je
 * blijven doorpraten zolang je wilt.
 */

export interface GespreksOnderwerp {
  id: string
  /** Nederlandse chiplabel, bv. "Eten" */
  titel: string
  emoji: string
  /** twee beurten over dit onderwerp */
  stappen: GesprekStap[]
}

export interface VrijGesprek {
  partner: string
  /** de begroeting waarmee elk vrij gesprek opent */
  intro: GesprekStap
  /** "waar wil je over praten?" */
  keuzevraag: { zeg: string; nl: string }
  /** "zullen we het ergens anders over hebben?" */
  vervolgvraag: { zeg: string; nl: string }
  /** wat jij zegt als je afrondt */
  afscheid: { tekst: string; nl: string }
  slot: { zeg: string; nl: string }
  onderwerpen: GespreksOnderwerp[]
}

export const RESTAURANT: Record<CourseId, GesprekScenario> = {
  es: {
    id: 'restaurant',
    titel: 'In het restaurant',
    emoji: '🍽️',
    plek: 'Je gaat uit eten in Sevilla',
    partner: 'Rosa',
    stappen: [
      {
        zeg: '¡Buenas tardes! Bienvenido al restaurante. ¿Una mesa para uno?',
        nl: 'Goedemiddag! Welkom in het restaurant. Een tafel voor één?',
        antwoorden: [
          { tekst: 'Sí, por favor.', nl: 'Ja, graag.' },
          { tekst: 'Una mesa para dos, por favor.', nl: 'Een tafel voor twee, alstublieft.' },
        ],
      },
      {
        zeg: 'Perfecto. Aquí tiene el menú. ¿Qué desea comer?',
        nl: 'Perfect. Hier is de kaart. Wat wilt u eten?',
        antwoorden: [
          { tekst: 'La paella, por favor.', nl: 'De paella, alstublieft.' },
          { tekst: 'La sopa del día, por favor.', nl: 'De soep van de dag, alstublieft.' },
        ],
      },
      {
        zeg: 'Muy buena elección. ¿Y para beber?',
        nl: 'Een heel goede keuze. En om te drinken?',
        antwoorden: [
          { tekst: 'Agua, por favor.', nl: 'Water, alstublieft.' },
          { tekst: 'Una limonada, por favor.', nl: 'Een limonade, alstublieft.' },
        ],
      },
      {
        zeg: '¿Le ha gustado la comida?',
        nl: 'Heeft het eten gesmaakt?',
        antwoorden: [
          { tekst: '¡Estaba delicioso!', nl: 'Het was heerlijk!' },
          { tekst: 'Sí, muchas gracias.', nl: 'Ja, dank u wel.' },
        ],
      },
      {
        zeg: 'Me alegro. ¿Desea algo más?',
        nl: 'Fijn om te horen. Wilt u nog iets?',
        antwoorden: [
          { tekst: 'No, la cuenta, por favor.', nl: 'Nee, de rekening graag.' },
          { tekst: 'Un café, y luego la cuenta.', nl: 'Een koffie, en daarna de rekening.' },
        ],
      },
    ],
    slot: { zeg: 'Aquí tiene. ¡Gracias por su visita!', nl: 'Alstublieft. Bedankt voor uw bezoek!' },
  },
  fr: {
    id: 'restaurant',
    titel: 'In het restaurant',
    emoji: '🍽️',
    plek: 'Je gaat uit eten in Lyon',
    partner: 'Margot',
    stappen: [
      {
        zeg: 'Bonsoir ! Bienvenue au restaurant. Une table pour une personne ?',
        nl: 'Goedenavond! Welkom in het restaurant. Een tafel voor één persoon?',
        antwoorden: [
          { tekst: 'Oui, s’il vous plaît.', nl: 'Ja, graag.' },
          { tekst: 'Une table pour deux, s’il vous plaît.', nl: 'Een tafel voor twee, alstublieft.' },
        ],
      },
      {
        zeg: 'Parfait. Voici le menu. Qu’est-ce que vous voulez manger ?',
        nl: 'Perfect. Hier is de kaart. Wat wilt u eten?',
        antwoorden: [
          { tekst: 'Le poulet, s’il vous plaît.', nl: 'De kip, alstublieft.' },
          { tekst: 'La soupe du jour, s’il vous plaît.', nl: 'De soep van de dag, alstublieft.' },
        ],
      },
      {
        zeg: 'Très bon choix. Et comme boisson ?',
        nl: 'Een heel goede keuze. En om te drinken?',
        antwoorden: [
          { tekst: 'De l’eau, s’il vous plaît.', nl: 'Water, alstublieft.' },
          { tekst: 'Une limonade, s’il vous plaît.', nl: 'Een limonade, alstublieft.' },
        ],
      },
      {
        zeg: 'Ça vous a plu ?',
        nl: 'Heeft het gesmaakt?',
        antwoorden: [
          { tekst: 'C’était délicieux !', nl: 'Het was heerlijk!' },
          { tekst: 'Oui, merci beaucoup.', nl: 'Ja, dank u wel.' },
        ],
      },
      {
        zeg: 'J’en suis ravie. Vous désirez autre chose ?',
        nl: 'Daar ben ik blij om. Wilt u nog iets?',
        antwoorden: [
          { tekst: 'Non, l’addition, s’il vous plaît.', nl: 'Nee, de rekening graag.' },
          { tekst: 'Un café, et ensuite l’addition.', nl: 'Een koffie, en daarna de rekening.' },
        ],
      },
    ],
    slot: { zeg: 'Voilà. Merci de votre visite !', nl: 'Alstublieft. Bedankt voor uw bezoek!' },
  },
  de: {
    id: 'restaurant',
    titel: 'In het restaurant',
    emoji: '🍽️',
    plek: 'Je gaat uit eten in München',
    partner: 'Hannah',
    stappen: [
      {
        zeg: 'Guten Abend! Willkommen im Restaurant. Ein Tisch für eine Person?',
        nl: 'Goedenavond! Welkom in het restaurant. Een tafel voor één persoon?',
        antwoorden: [
          { tekst: 'Ja, bitte.', nl: 'Ja, graag.' },
          { tekst: 'Ein Tisch für zwei, bitte.', nl: 'Een tafel voor twee, alstublieft.' },
        ],
      },
      {
        zeg: 'Perfekt. Hier ist die Karte. Was möchten Sie essen?',
        nl: 'Perfect. Hier is de kaart. Wat wilt u eten?',
        antwoorden: [
          { tekst: 'Das Hähnchen, bitte.', nl: 'De kip, alstublieft.' },
          { tekst: 'Die Suppe des Tages, bitte.', nl: 'De soep van de dag, alstublieft.' },
        ],
      },
      {
        zeg: 'Sehr gute Wahl. Und zu trinken?',
        nl: 'Een heel goede keuze. En om te drinken?',
        antwoorden: [
          { tekst: 'Wasser, bitte.', nl: 'Water, alstublieft.' },
          { tekst: 'Eine Limonade, bitte.', nl: 'Een limonade, alstublieft.' },
        ],
      },
      {
        zeg: 'Hat es Ihnen geschmeckt?',
        nl: 'Heeft het gesmaakt?',
        antwoorden: [
          { tekst: 'Es war köstlich!', nl: 'Het was heerlijk!' },
          { tekst: 'Ja, vielen Dank.', nl: 'Ja, dank u wel.' },
        ],
      },
      {
        zeg: 'Das freut mich. Möchten Sie noch etwas?',
        nl: 'Dat doet me deugd. Wilt u nog iets?',
        antwoorden: [
          { tekst: 'Nein, die Rechnung, bitte.', nl: 'Nee, de rekening graag.' },
          { tekst: 'Einen Kaffee, und dann die Rechnung.', nl: 'Een koffie, en daarna de rekening.' },
        ],
      },
    ],
    slot: { zeg: 'Bitte sehr. Danke für Ihren Besuch!', nl: 'Alstublieft. Bedankt voor uw bezoek!' },
  },
  it: {
    id: 'restaurant',
    titel: 'In het restaurant',
    emoji: '🍽️',
    plek: 'Je gaat uit eten in Florence',
    partner: 'Chiara',
    stappen: [
      {
        zeg: 'Buonasera! Benvenuto al ristorante. Un tavolo per uno?',
        nl: 'Goedenavond! Welkom in het restaurant. Een tafel voor één?',
        antwoorden: [
          { tekst: 'Sì, per favore.', nl: 'Ja, graag.' },
          { tekst: 'Un tavolo per due, per favore.', nl: 'Een tafel voor twee, alstublieft.' },
        ],
      },
      {
        zeg: 'Perfetto. Ecco il menù. Cosa desidera mangiare?',
        nl: 'Perfect. Hier is de kaart. Wat wilt u eten?',
        antwoorden: [
          { tekst: 'La pasta, per favore.', nl: 'De pasta, alstublieft.' },
          { tekst: 'La zuppa del giorno, per favore.', nl: 'De soep van de dag, alstublieft.' },
        ],
      },
      {
        zeg: 'Ottima scelta. E da bere?',
        nl: 'Een uitstekende keuze. En om te drinken?',
        antwoorden: [
          { tekst: 'Acqua, per favore.', nl: 'Water, alstublieft.' },
          { tekst: 'Una limonata, per favore.', nl: 'Een limonade, alstublieft.' },
        ],
      },
      {
        zeg: 'Le è piaciuto il cibo?',
        nl: 'Heeft het eten gesmaakt?',
        antwoorden: [
          { tekst: 'Era delizioso!', nl: 'Het was heerlijk!' },
          { tekst: 'Sì, grazie mille.', nl: 'Ja, dank u wel.' },
        ],
      },
      {
        zeg: 'Mi fa piacere. Desidera qualcos’altro?',
        nl: 'Daar ben ik blij om. Wilt u nog iets?',
        antwoorden: [
          { tekst: 'No, il conto, per favore.', nl: 'Nee, de rekening graag.' },
          { tekst: 'Un caffè, e poi il conto.', nl: 'Een koffie, en daarna de rekening.' },
        ],
      },
    ],
    slot: { zeg: 'Ecco a lei. Grazie della visita!', nl: 'Alstublieft. Bedankt voor uw bezoek!' },
  },
  pt: {
    id: 'restaurant',
    titel: 'In het restaurant',
    emoji: '🍽️',
    plek: 'Je gaat uit eten in Porto',
    partner: 'Beatriz',
    stappen: [
      {
        zeg: 'Boa noite! Bem-vindo ao restaurante. Uma mesa para um?',
        nl: 'Goedenavond! Welkom in het restaurant. Een tafel voor één?',
        antwoorden: [
          { tekst: 'Sim, por favor.', nl: 'Ja, graag.' },
          { tekst: 'Uma mesa para dois, por favor.', nl: 'Een tafel voor twee, alstublieft.' },
        ],
      },
      {
        zeg: 'Perfeito. Aqui está o menu. O que deseja comer?',
        nl: 'Perfect. Hier is de kaart. Wat wilt u eten?',
        antwoorden: [
          { tekst: 'O frango, por favor.', nl: 'De kip, alstublieft.' },
          { tekst: 'A sopa do dia, por favor.', nl: 'De soep van de dag, alstublieft.' },
        ],
      },
      {
        zeg: 'Muito boa escolha. E para beber?',
        nl: 'Een heel goede keuze. En om te drinken?',
        antwoorden: [
          { tekst: 'Água, por favor.', nl: 'Water, alstublieft.' },
          { tekst: 'Uma limonada, por favor.', nl: 'Een limonade, alstublieft.' },
        ],
      },
      {
        zeg: 'Gostou da comida?',
        nl: 'Heeft het eten gesmaakt?',
        antwoorden: [
          { tekst: 'Estava deliciosa!', nl: 'Het was heerlijk!' },
          { tekst: 'Sim, muito obrigado.', nl: 'Ja, dank u wel.' },
        ],
      },
      {
        zeg: 'Fico contente. Deseja mais alguma coisa?',
        nl: 'Daar ben ik blij om. Wilt u nog iets?',
        antwoorden: [
          { tekst: 'Não, a conta, por favor.', nl: 'Nee, de rekening graag.' },
          { tekst: 'Um café, e depois a conta.', nl: 'Een koffie, en daarna de rekening.' },
        ],
      },
    ],
    slot: { zeg: 'Aqui tem. Obrigada pela visita!', nl: 'Alstublieft. Bedankt voor uw bezoek!' },
  },
  en: {
    id: 'restaurant',
    titel: 'In het restaurant',
    emoji: '🍽️',
    plek: 'Je gaat uit eten in York',
    partner: 'Sophie',
    stappen: [
      {
        zeg: 'Good evening! Welcome to the restaurant. A table for one?',
        nl: 'Goedenavond! Welkom in het restaurant. Een tafel voor één?',
        antwoorden: [
          { tekst: 'Yes, please.', nl: 'Ja, graag.' },
          { tekst: 'A table for two, please.', nl: 'Een tafel voor twee, alstublieft.' },
        ],
      },
      {
        zeg: 'Perfect. Here is the menu. What would you like to eat?',
        nl: 'Perfect. Hier is de kaart. Wat wilt u eten?',
        antwoorden: [
          { tekst: 'The chicken, please.', nl: 'De kip, alstublieft.' },
          { tekst: 'The soup of the day, please.', nl: 'De soep van de dag, alstublieft.' },
        ],
      },
      {
        zeg: 'Very good choice. And to drink?',
        nl: 'Een heel goede keuze. En om te drinken?',
        antwoorden: [
          { tekst: 'Water, please.', nl: 'Water, alstublieft.' },
          { tekst: 'A lemonade, please.', nl: 'Een limonade, alstublieft.' },
        ],
      },
      {
        zeg: 'Did you enjoy your meal?',
        nl: 'Heeft het gesmaakt?',
        antwoorden: [
          { tekst: 'It was delicious!', nl: 'Het was heerlijk!' },
          { tekst: 'Yes, thank you very much.', nl: 'Ja, dank u wel.' },
        ],
      },
      {
        zeg: 'I’m glad to hear that. Would you like anything else?',
        nl: 'Fijn om te horen. Wilt u nog iets?',
        antwoorden: [
          { tekst: 'No, the bill, please.', nl: 'Nee, de rekening graag.' },
          { tekst: 'A coffee, and then the bill.', nl: 'Een koffie, en daarna de rekening.' },
        ],
      },
    ],
    slot: { zeg: 'Here you are. Thank you for coming!', nl: 'Alstublieft. Bedankt voor uw komst!' },
  },
}

export const VRIJ_GESPREK: Record<CourseId, VrijGesprek> = {
  es: {
    partner: 'Diego',
    intro: {
      zeg: '¡Hola! Me alegro de verte. ¿Cómo estás?',
      nl: 'Hoi! Leuk je te zien. Hoe gaat het?',
      antwoorden: [
        { tekst: '¡Muy bien! ¿Y tú?', nl: 'Heel goed! En met jou?' },
        { tekst: 'Estoy un poco cansado, pero bien.', nl: 'Ik ben een beetje moe, maar goed.' },
      ],
    },
    keuzevraag: { zeg: '¡Qué bien! ¿De qué quieres hablar?', nl: 'Mooi zo! Waar wil je over praten?' },
    vervolgvraag: { zeg: '¡Qué interesante! ¿Hablamos de otra cosa?', nl: 'Interessant! Zullen we het ergens anders over hebben?' },
    afscheid: { tekst: 'Me tengo que ir. ¡Hasta pronto!', nl: 'Ik moet gaan. Tot gauw!' },
    slot: { zeg: '¡Claro! Me encanta hablar contigo. ¡Adiós!', nl: 'Natuurlijk! Ik praat graag met je. Doei!' },
    onderwerpen: [
      {
        id: 'eten',
        titel: 'Eten',
        emoji: '🍽️',
        stappen: [
          {
            zeg: 'A mí me encanta la paella. ¿Cuál es tu comida favorita?',
            nl: 'Ik ben dol op paella. Wat is jouw lievelingseten?',
            antwoorden: [
              { tekst: 'Me encanta la pizza.', nl: 'Ik ben dol op pizza.' },
              { tekst: 'Mi comida favorita es el pescado.', nl: 'Mijn lievelingseten is vis.' },
            ],
          },
          {
            zeg: '¡Qué rico! ¿Te gusta cocinar?',
            nl: 'Wat lekker! Hou je van koken?',
            antwoorden: [
              { tekst: 'Sí, cocino todos los días.', nl: 'Ja, ik kook elke dag.' },
              { tekst: 'No mucho, prefiero comer fuera.', nl: 'Niet zo, ik eet liever buiten de deur.' },
            ],
          },
        ],
      },
      {
        id: 'reizen',
        titel: 'Reizen',
        emoji: '✈️',
        stappen: [
          {
            zeg: 'Este verano quiero ir a la playa. ¿Te gusta viajar?',
            nl: 'Deze zomer wil ik naar het strand. Hou je van reizen?',
            antwoorden: [
              { tekst: 'Sí, me encanta viajar.', nl: 'Ja, ik ben dol op reizen.' },
              { tekst: 'Sí, pero prefiero las montañas.', nl: 'Ja, maar ik ga liever naar de bergen.' },
            ],
          },
          {
            zeg: '¿Qué país quieres visitar?',
            nl: 'Welk land wil je bezoeken?',
            antwoorden: [
              { tekst: 'Quiero visitar España.', nl: 'Ik wil Spanje bezoeken.' },
              { tekst: 'Quiero ver todo el mundo.', nl: 'Ik wil de hele wereld zien.' },
            ],
          },
        ],
      },
      {
        id: 'muziek',
        titel: 'Muziek',
        emoji: '🎵',
        stappen: [
          {
            zeg: 'Escucho música todos los días. ¿Qué música te gusta?',
            nl: 'Ik luister elke dag muziek. Welke muziek vind jij leuk?',
            antwoorden: [
              { tekst: 'Me gusta el pop.', nl: 'Ik hou van pop.' },
              { tekst: 'Escucho de todo.', nl: 'Ik luister van alles.' },
            ],
          },
          {
            zeg: '¿Tocas algún instrumento?',
            nl: 'Bespeel je een instrument?',
            antwoorden: [
              { tekst: 'Sí, toco la guitarra.', nl: 'Ja, ik speel gitaar.' },
              { tekst: 'No, pero me gusta cantar.', nl: 'Nee, maar ik zing graag.' },
            ],
          },
        ],
      },
      {
        id: 'sport',
        titel: 'Sport',
        emoji: '⚽',
        stappen: [
          {
            zeg: 'Yo juego al fútbol los sábados. ¿Haces deporte?',
            nl: 'Ik voetbal op zaterdag. Doe jij aan sport?',
            antwoorden: [
              { tekst: 'Sí, voy al gimnasio.', nl: 'Ja, ik ga naar de sportschool.' },
              { tekst: 'Corro en el parque.', nl: 'Ik hardloop in het park.' },
            ],
          },
          {
            zeg: '¡Muy bien! ¿Cuál es tu deporte favorito?',
            nl: 'Goed zo! Wat is jouw favoriete sport?',
            antwoorden: [
              { tekst: 'El fútbol, claro.', nl: 'Voetbal, natuurlijk.' },
              { tekst: 'Me gusta nadar.', nl: 'Ik zwem graag.' },
            ],
          },
        ],
      },
      {
        id: 'familie',
        titel: 'Familie',
        emoji: '👨‍👩‍👧',
        stappen: [
          {
            zeg: 'Tengo dos hermanas. ¿Tienes hermanos?',
            nl: 'Ik heb twee zussen. Heb jij broers of zussen?',
            antwoorden: [
              { tekst: 'Sí, tengo un hermano.', nl: 'Ja, ik heb een broer.' },
              { tekst: 'No, soy hijo único.', nl: 'Nee, ik ben enig kind.' },
            ],
          },
          {
            zeg: '¿Vives con tu familia?',
            nl: 'Woon je bij je familie?',
            antwoorden: [
              { tekst: 'Sí, vivo con mis padres.', nl: 'Ja, ik woon bij mijn ouders.' },
              { tekst: 'No, vivo solo.', nl: 'Nee, ik woon alleen.' },
            ],
          },
        ],
      },
      {
        id: 'weer',
        titel: 'Het weer',
        emoji: '☀️',
        stappen: [
          {
            zeg: 'Hoy hace muy buen tiempo. ¿Te gusta el sol?',
            nl: 'Vandaag is het mooi weer. Hou je van de zon?',
            antwoorden: [
              { tekst: 'Sí, me encanta el sol.', nl: 'Ja, ik ben dol op de zon.' },
              { tekst: 'Prefiero la lluvia.', nl: 'Ik hou meer van regen.' },
            ],
          },
          {
            zeg: '¿Qué tiempo hace en tu ciudad?',
            nl: 'Wat voor weer is het in jouw stad?',
            antwoorden: [
              { tekst: 'Llueve mucho.', nl: 'Het regent veel.' },
              { tekst: 'Hace frío y viento.', nl: 'Het is koud en winderig.' },
            ],
          },
        ],
      },
    ],
  },

  fr: {
    partner: 'Chloé',
    intro: {
      zeg: 'Salut ! Ça me fait plaisir de te voir. Comment ça va ?',
      nl: 'Hoi! Leuk je te zien. Hoe gaat het?',
      antwoorden: [
        { tekst: 'Très bien ! Et toi ?', nl: 'Heel goed! En met jou?' },
        { tekst: 'Je suis un peu fatigué, mais ça va.', nl: 'Ik ben een beetje moe, maar het gaat.' },
      ],
    },
    keuzevraag: { zeg: 'Super ! De quoi tu veux parler ?', nl: 'Super! Waar wil je over praten?' },
    vervolgvraag: { zeg: 'C’est intéressant ! On parle d’autre chose ?', nl: 'Interessant! Zullen we het ergens anders over hebben?' },
    afscheid: { tekst: 'Je dois y aller. À bientôt !', nl: 'Ik moet gaan. Tot gauw!' },
    slot: { zeg: 'Bien sûr ! J’adore parler avec toi. Au revoir !', nl: 'Natuurlijk! Ik praat graag met je. Tot ziens!' },
    onderwerpen: [
      {
        id: 'eten',
        titel: 'Eten',
        emoji: '🍽️',
        stappen: [
          {
            zeg: 'Moi, j’adore les crêpes. Quel est ton plat préféré ?',
            nl: 'Ik ben dol op pannenkoeken. Wat is jouw lievelingsgerecht?',
            antwoorden: [
              { tekst: 'J’adore la pizza.', nl: 'Ik ben dol op pizza.' },
              { tekst: 'Mon plat préféré, c’est le poisson.', nl: 'Mijn lievelingsgerecht is vis.' },
            ],
          },
          {
            zeg: 'Miam ! Tu aimes cuisiner ?',
            nl: 'Mmm! Hou je van koken?',
            antwoorden: [
              { tekst: 'Oui, je cuisine tous les jours.', nl: 'Ja, ik kook elke dag.' },
              { tekst: 'Pas trop, je préfère manger dehors.', nl: 'Niet zo, ik eet liever buiten de deur.' },
            ],
          },
        ],
      },
      {
        id: 'reizen',
        titel: 'Reizen',
        emoji: '✈️',
        stappen: [
          {
            zeg: 'Cet été, je veux aller à la mer. Tu aimes voyager ?',
            nl: 'Deze zomer wil ik naar zee. Hou je van reizen?',
            antwoorden: [
              { tekst: 'Oui, j’adore voyager.', nl: 'Ja, ik ben dol op reizen.' },
              { tekst: 'Oui, mais je préfère la montagne.', nl: 'Ja, maar ik ga liever naar de bergen.' },
            ],
          },
          {
            zeg: 'Quel pays tu veux visiter ?',
            nl: 'Welk land wil je bezoeken?',
            antwoorden: [
              { tekst: 'Je veux visiter la France.', nl: 'Ik wil Frankrijk bezoeken.' },
              { tekst: 'Je veux voir le monde entier.', nl: 'Ik wil de hele wereld zien.' },
            ],
          },
        ],
      },
      {
        id: 'muziek',
        titel: 'Muziek',
        emoji: '🎵',
        stappen: [
          {
            zeg: 'J’écoute de la musique tous les jours. Quelle musique tu aimes ?',
            nl: 'Ik luister elke dag muziek. Welke muziek vind jij leuk?',
            antwoorden: [
              { tekst: 'J’aime la pop.', nl: 'Ik hou van pop.' },
              { tekst: 'J’écoute de tout.', nl: 'Ik luister van alles.' },
            ],
          },
          {
            zeg: 'Tu joues d’un instrument ?',
            nl: 'Bespeel je een instrument?',
            antwoorden: [
              { tekst: 'Oui, je joue de la guitare.', nl: 'Ja, ik speel gitaar.' },
              { tekst: 'Non, mais j’aime chanter.', nl: 'Nee, maar ik zing graag.' },
            ],
          },
        ],
      },
      {
        id: 'sport',
        titel: 'Sport',
        emoji: '⚽',
        stappen: [
          {
            zeg: 'Je joue au foot le samedi. Tu fais du sport ?',
            nl: 'Ik voetbal op zaterdag. Doe jij aan sport?',
            antwoorden: [
              { tekst: 'Oui, je vais à la salle de sport.', nl: 'Ja, ik ga naar de sportschool.' },
              { tekst: 'Je cours dans le parc.', nl: 'Ik hardloop in het park.' },
            ],
          },
          {
            zeg: 'Très bien ! Quel est ton sport préféré ?',
            nl: 'Goed zo! Wat is jouw favoriete sport?',
            antwoorden: [
              { tekst: 'Le foot, bien sûr.', nl: 'Voetbal, natuurlijk.' },
              { tekst: 'J’aime nager.', nl: 'Ik zwem graag.' },
            ],
          },
        ],
      },
      {
        id: 'familie',
        titel: 'Familie',
        emoji: '👨‍👩‍👧',
        stappen: [
          {
            zeg: 'J’ai deux sœurs. Tu as des frères et sœurs ?',
            nl: 'Ik heb twee zussen. Heb jij broers of zussen?',
            antwoorden: [
              { tekst: 'Oui, j’ai un frère.', nl: 'Ja, ik heb een broer.' },
              { tekst: 'Non, je suis fils unique.', nl: 'Nee, ik ben enig kind.' },
            ],
          },
          {
            zeg: 'Tu habites avec ta famille ?',
            nl: 'Woon je bij je familie?',
            antwoorden: [
              { tekst: 'Oui, j’habite avec mes parents.', nl: 'Ja, ik woon bij mijn ouders.' },
              { tekst: 'Non, j’habite seul.', nl: 'Nee, ik woon alleen.' },
            ],
          },
        ],
      },
      {
        id: 'weer',
        titel: 'Het weer',
        emoji: '☀️',
        stappen: [
          {
            zeg: 'Aujourd’hui, il fait très beau. Tu aimes le soleil ?',
            nl: 'Vandaag is het heel mooi weer. Hou je van de zon?',
            antwoorden: [
              { tekst: 'Oui, j’adore le soleil.', nl: 'Ja, ik ben dol op de zon.' },
              { tekst: 'Je préfère la pluie.', nl: 'Ik hou meer van regen.' },
            ],
          },
          {
            zeg: 'Quel temps fait-il dans ta ville ?',
            nl: 'Wat voor weer is het in jouw stad?',
            antwoorden: [
              { tekst: 'Il pleut beaucoup.', nl: 'Het regent veel.' },
              { tekst: 'Il fait froid et il y a du vent.', nl: 'Het is koud en het waait.' },
            ],
          },
        ],
      },
    ],
  },

  de: {
    partner: 'Finn',
    intro: {
      zeg: 'Hallo! Schön, dich zu sehen. Wie geht es dir?',
      nl: 'Hallo! Leuk je te zien. Hoe gaat het met je?',
      antwoorden: [
        { tekst: 'Sehr gut! Und dir?', nl: 'Heel goed! En met jou?' },
        { tekst: 'Ich bin ein bisschen müde, aber gut.', nl: 'Ik ben een beetje moe, maar goed.' },
      ],
    },
    keuzevraag: { zeg: 'Schön! Worüber möchtest du reden?', nl: 'Mooi! Waar wil je over praten?' },
    vervolgvraag: { zeg: 'Wie interessant! Reden wir über etwas anderes?', nl: 'Interessant! Zullen we het over iets anders hebben?' },
    afscheid: { tekst: 'Ich muss los. Bis bald!', nl: 'Ik moet gaan. Tot gauw!' },
    slot: { zeg: 'Klar! Ich rede gern mit dir. Tschüss!', nl: 'Zeker! Ik praat graag met je. Doei!' },
    onderwerpen: [
      {
        id: 'eten',
        titel: 'Eten',
        emoji: '🍽️',
        stappen: [
          {
            zeg: 'Ich liebe Pfannkuchen. Was ist dein Lieblingsessen?',
            nl: 'Ik ben dol op pannenkoeken. Wat is jouw lievelingseten?',
            antwoorden: [
              { tekst: 'Ich liebe Pizza.', nl: 'Ik ben dol op pizza.' },
              { tekst: 'Mein Lieblingsessen ist Fisch.', nl: 'Mijn lievelingseten is vis.' },
            ],
          },
          {
            zeg: 'Lecker! Kochst du gern?',
            nl: 'Lekker! Kook je graag?',
            antwoorden: [
              { tekst: 'Ja, ich koche jeden Tag.', nl: 'Ja, ik kook elke dag.' },
              { tekst: 'Nicht so gern, ich esse lieber auswärts.', nl: 'Niet zo graag, ik eet liever buiten de deur.' },
            ],
          },
        ],
      },
      {
        id: 'reizen',
        titel: 'Reizen',
        emoji: '✈️',
        stappen: [
          {
            zeg: 'Diesen Sommer will ich ans Meer. Reist du gern?',
            nl: 'Deze zomer wil ik naar zee. Reis je graag?',
            antwoorden: [
              { tekst: 'Ja, ich reise sehr gern.', nl: 'Ja, ik reis heel graag.' },
              { tekst: 'Ja, aber ich mag die Berge lieber.', nl: 'Ja, maar ik hou meer van de bergen.' },
            ],
          },
          {
            zeg: 'Welches Land möchtest du besuchen?',
            nl: 'Welk land wil je bezoeken?',
            antwoorden: [
              { tekst: 'Ich möchte Deutschland besuchen.', nl: 'Ik wil Duitsland bezoeken.' },
              { tekst: 'Ich will die ganze Welt sehen.', nl: 'Ik wil de hele wereld zien.' },
            ],
          },
        ],
      },
      {
        id: 'muziek',
        titel: 'Muziek',
        emoji: '🎵',
        stappen: [
          {
            zeg: 'Ich höre jeden Tag Musik. Welche Musik magst du?',
            nl: 'Ik luister elke dag muziek. Welke muziek vind jij leuk?',
            antwoorden: [
              { tekst: 'Ich mag Pop.', nl: 'Ik hou van pop.' },
              { tekst: 'Ich höre alles.', nl: 'Ik luister van alles.' },
            ],
          },
          {
            zeg: 'Spielst du ein Instrument?',
            nl: 'Bespeel je een instrument?',
            antwoorden: [
              { tekst: 'Ja, ich spiele Gitarre.', nl: 'Ja, ik speel gitaar.' },
              { tekst: 'Nein, aber ich singe gern.', nl: 'Nee, maar ik zing graag.' },
            ],
          },
        ],
      },
      {
        id: 'sport',
        titel: 'Sport',
        emoji: '⚽',
        stappen: [
          {
            zeg: 'Ich spiele samstags Fußball. Machst du Sport?',
            nl: 'Ik voetbal op zaterdag. Doe jij aan sport?',
            antwoorden: [
              { tekst: 'Ja, ich gehe ins Fitnessstudio.', nl: 'Ja, ik ga naar de sportschool.' },
              { tekst: 'Ich laufe im Park.', nl: 'Ik hardloop in het park.' },
            ],
          },
          {
            zeg: 'Super! Was ist dein Lieblingssport?',
            nl: 'Super! Wat is jouw favoriete sport?',
            antwoorden: [
              { tekst: 'Fußball, natürlich.', nl: 'Voetbal, natuurlijk.' },
              { tekst: 'Ich schwimme gern.', nl: 'Ik zwem graag.' },
            ],
          },
        ],
      },
      {
        id: 'familie',
        titel: 'Familie',
        emoji: '👨‍👩‍👧',
        stappen: [
          {
            zeg: 'Ich habe zwei Schwestern. Hast du Geschwister?',
            nl: 'Ik heb twee zussen. Heb jij broers of zussen?',
            antwoorden: [
              { tekst: 'Ja, ich habe einen Bruder.', nl: 'Ja, ik heb een broer.' },
              { tekst: 'Nein, ich bin Einzelkind.', nl: 'Nee, ik ben enig kind.' },
            ],
          },
          {
            zeg: 'Wohnst du bei deiner Familie?',
            nl: 'Woon je bij je familie?',
            antwoorden: [
              { tekst: 'Ja, ich wohne bei meinen Eltern.', nl: 'Ja, ik woon bij mijn ouders.' },
              { tekst: 'Nein, ich wohne allein.', nl: 'Nee, ik woon alleen.' },
            ],
          },
        ],
      },
      {
        id: 'weer',
        titel: 'Het weer',
        emoji: '☀️',
        stappen: [
          {
            zeg: 'Heute ist das Wetter sehr schön. Magst du die Sonne?',
            nl: 'Vandaag is het heel mooi weer. Hou je van de zon?',
            antwoorden: [
              { tekst: 'Ja, ich liebe die Sonne.', nl: 'Ja, ik ben dol op de zon.' },
              { tekst: 'Ich mag Regen lieber.', nl: 'Ik hou meer van regen.' },
            ],
          },
          {
            zeg: 'Wie ist das Wetter in deiner Stadt?',
            nl: 'Hoe is het weer in jouw stad?',
            antwoorden: [
              { tekst: 'Es regnet viel.', nl: 'Het regent veel.' },
              { tekst: 'Es ist kalt und windig.', nl: 'Het is koud en winderig.' },
            ],
          },
        ],
      },
    ],
  },

  it: {
    partner: 'Sofia',
    intro: {
      zeg: 'Ciao! Che bello vederti. Come stai?',
      nl: 'Hoi! Wat leuk om je te zien. Hoe gaat het?',
      antwoorden: [
        { tekst: 'Molto bene! E tu?', nl: 'Heel goed! En met jou?' },
        { tekst: 'Sono un po’ stanco, ma bene.', nl: 'Ik ben een beetje moe, maar goed.' },
      ],
    },
    keuzevraag: { zeg: 'Che bello! Di cosa vuoi parlare?', nl: 'Wat fijn! Waar wil je over praten?' },
    vervolgvraag: { zeg: 'Che interessante! Parliamo di qualcos’altro?', nl: 'Interessant! Zullen we het ergens anders over hebben?' },
    afscheid: { tekst: 'Devo andare. A presto!', nl: 'Ik moet gaan. Tot gauw!' },
    slot: { zeg: 'Certo! Mi piace parlare con te. Ciao!', nl: 'Zeker! Ik praat graag met je. Doei!' },
    onderwerpen: [
      {
        id: 'eten',
        titel: 'Eten',
        emoji: '🍽️',
        stappen: [
          {
            zeg: 'Io adoro la pizza. Qual è il tuo piatto preferito?',
            nl: 'Ik ben dol op pizza. Wat is jouw lievelingsgerecht?',
            antwoorden: [
              { tekst: 'Adoro la pasta.', nl: 'Ik ben dol op pasta.' },
              { tekst: 'Il mio piatto preferito è il pesce.', nl: 'Mijn lievelingsgerecht is vis.' },
            ],
          },
          {
            zeg: 'Che buono! Ti piace cucinare?',
            nl: 'Wat lekker! Hou je van koken?',
            antwoorden: [
              { tekst: 'Sì, cucino tutti i giorni.', nl: 'Ja, ik kook elke dag.' },
              { tekst: 'Non molto, preferisco mangiare fuori.', nl: 'Niet zo, ik eet liever buiten de deur.' },
            ],
          },
        ],
      },
      {
        id: 'reizen',
        titel: 'Reizen',
        emoji: '✈️',
        stappen: [
          {
            zeg: 'Quest’estate voglio andare al mare. Ti piace viaggiare?',
            nl: 'Deze zomer wil ik naar zee. Hou je van reizen?',
            antwoorden: [
              { tekst: 'Sì, adoro viaggiare.', nl: 'Ja, ik ben dol op reizen.' },
              { tekst: 'Sì, ma preferisco la montagna.', nl: 'Ja, maar ik ga liever naar de bergen.' },
            ],
          },
          {
            zeg: 'Quale paese vuoi visitare?',
            nl: 'Welk land wil je bezoeken?',
            antwoorden: [
              { tekst: 'Voglio visitare l’Italia.', nl: 'Ik wil Italië bezoeken.' },
              { tekst: 'Voglio vedere tutto il mondo.', nl: 'Ik wil de hele wereld zien.' },
            ],
          },
        ],
      },
      {
        id: 'muziek',
        titel: 'Muziek',
        emoji: '🎵',
        stappen: [
          {
            zeg: 'Ascolto musica tutti i giorni. Che musica ti piace?',
            nl: 'Ik luister elke dag muziek. Welke muziek vind jij leuk?',
            antwoorden: [
              { tekst: 'Mi piace il pop.', nl: 'Ik hou van pop.' },
              { tekst: 'Ascolto di tutto.', nl: 'Ik luister van alles.' },
            ],
          },
          {
            zeg: 'Suoni uno strumento?',
            nl: 'Bespeel je een instrument?',
            antwoorden: [
              { tekst: 'Sì, suono la chitarra.', nl: 'Ja, ik speel gitaar.' },
              { tekst: 'No, ma mi piace cantare.', nl: 'Nee, maar ik zing graag.' },
            ],
          },
        ],
      },
      {
        id: 'sport',
        titel: 'Sport',
        emoji: '⚽',
        stappen: [
          {
            zeg: 'Gioco a calcio il sabato. Fai sport?',
            nl: 'Ik voetbal op zaterdag. Doe jij aan sport?',
            antwoorden: [
              { tekst: 'Sì, vado in palestra.', nl: 'Ja, ik ga naar de sportschool.' },
              { tekst: 'Corro nel parco.', nl: 'Ik hardloop in het park.' },
            ],
          },
          {
            zeg: 'Bravissimo! Qual è il tuo sport preferito?',
            nl: 'Heel goed! Wat is jouw favoriete sport?',
            antwoorden: [
              { tekst: 'Il calcio, certo.', nl: 'Voetbal, natuurlijk.' },
              { tekst: 'Mi piace nuotare.', nl: 'Ik zwem graag.' },
            ],
          },
        ],
      },
      {
        id: 'familie',
        titel: 'Familie',
        emoji: '👨‍👩‍👧',
        stappen: [
          {
            zeg: 'Ho due sorelle. Hai fratelli o sorelle?',
            nl: 'Ik heb twee zussen. Heb jij broers of zussen?',
            antwoorden: [
              { tekst: 'Sì, ho un fratello.', nl: 'Ja, ik heb een broer.' },
              { tekst: 'No, sono figlio unico.', nl: 'Nee, ik ben enig kind.' },
            ],
          },
          {
            zeg: 'Vivi con la tua famiglia?',
            nl: 'Woon je bij je familie?',
            antwoorden: [
              { tekst: 'Sì, vivo con i miei genitori.', nl: 'Ja, ik woon bij mijn ouders.' },
              { tekst: 'No, vivo da solo.', nl: 'Nee, ik woon alleen.' },
            ],
          },
        ],
      },
      {
        id: 'weer',
        titel: 'Het weer',
        emoji: '☀️',
        stappen: [
          {
            zeg: 'Oggi c’è un tempo bellissimo. Ti piace il sole?',
            nl: 'Vandaag is het prachtig weer. Hou je van de zon?',
            antwoorden: [
              { tekst: 'Sì, adoro il sole.', nl: 'Ja, ik ben dol op de zon.' },
              { tekst: 'Preferisco la pioggia.', nl: 'Ik hou meer van regen.' },
            ],
          },
          {
            zeg: 'Che tempo fa nella tua città?',
            nl: 'Wat voor weer is het in jouw stad?',
            antwoorden: [
              { tekst: 'Piove molto.', nl: 'Het regent veel.' },
              { tekst: 'Fa freddo e c’è vento.', nl: 'Het is koud en het waait.' },
            ],
          },
        ],
      },
    ],
  },

  pt: {
    partner: 'Rui',
    intro: {
      zeg: 'Olá! Que bom ver-te. Como estás?',
      nl: 'Hallo! Wat fijn om je te zien. Hoe gaat het?',
      antwoorden: [
        { tekst: 'Muito bem! E tu?', nl: 'Heel goed! En met jou?' },
        { tekst: 'Estou um pouco cansado, mas bem.', nl: 'Ik ben een beetje moe, maar goed.' },
      ],
    },
    keuzevraag: { zeg: 'Que bom! Sobre o que queres falar?', nl: 'Mooi zo! Waar wil je over praten?' },
    vervolgvraag: { zeg: 'Que interessante! Falamos de outra coisa?', nl: 'Interessant! Zullen we het ergens anders over hebben?' },
    afscheid: { tekst: 'Tenho de ir. Até breve!', nl: 'Ik moet gaan. Tot gauw!' },
    slot: { zeg: 'Claro! Gosto muito de falar contigo. Adeus!', nl: 'Natuurlijk! Ik praat heel graag met je. Doei!' },
    onderwerpen: [
      {
        id: 'eten',
        titel: 'Eten',
        emoji: '🍽️',
        stappen: [
          {
            zeg: 'Eu adoro pastéis de nata. Qual é a tua comida preferida?',
            nl: 'Ik ben dol op pastéis de nata. Wat is jouw lievelingseten?',
            antwoorden: [
              { tekst: 'Adoro pizza.', nl: 'Ik ben dol op pizza.' },
              { tekst: 'A minha comida preferida é peixe.', nl: 'Mijn lievelingseten is vis.' },
            ],
          },
          {
            zeg: 'Que delícia! Gostas de cozinhar?',
            nl: 'Wat lekker! Hou je van koken?',
            antwoorden: [
              { tekst: 'Sim, cozinho todos os dias.', nl: 'Ja, ik kook elke dag.' },
              { tekst: 'Não muito, prefiro comer fora.', nl: 'Niet zo, ik eet liever buiten de deur.' },
            ],
          },
        ],
      },
      {
        id: 'reizen',
        titel: 'Reizen',
        emoji: '✈️',
        stappen: [
          {
            zeg: 'Este verão quero ir à praia. Gostas de viajar?',
            nl: 'Deze zomer wil ik naar het strand. Hou je van reizen?',
            antwoorden: [
              { tekst: 'Sim, adoro viajar.', nl: 'Ja, ik ben dol op reizen.' },
              { tekst: 'Sim, mas prefiro a montanha.', nl: 'Ja, maar ik ga liever naar de bergen.' },
            ],
          },
          {
            zeg: 'Que país queres visitar?',
            nl: 'Welk land wil je bezoeken?',
            antwoorden: [
              { tekst: 'Quero visitar Portugal.', nl: 'Ik wil Portugal bezoeken.' },
              { tekst: 'Quero ver o mundo inteiro.', nl: 'Ik wil de hele wereld zien.' },
            ],
          },
        ],
      },
      {
        id: 'muziek',
        titel: 'Muziek',
        emoji: '🎵',
        stappen: [
          {
            zeg: 'Ouço música todos os dias. De que música gostas?',
            nl: 'Ik luister elke dag muziek. Van welke muziek hou jij?',
            antwoorden: [
              { tekst: 'Gosto de pop.', nl: 'Ik hou van pop.' },
              { tekst: 'Ouço de tudo.', nl: 'Ik luister van alles.' },
            ],
          },
          {
            zeg: 'Tocas algum instrumento?',
            nl: 'Bespeel je een instrument?',
            antwoorden: [
              { tekst: 'Sim, toco guitarra.', nl: 'Ja, ik speel gitaar.' },
              { tekst: 'Não, mas gosto de cantar.', nl: 'Nee, maar ik zing graag.' },
            ],
          },
        ],
      },
      {
        id: 'sport',
        titel: 'Sport',
        emoji: '⚽',
        stappen: [
          {
            zeg: 'Jogo futebol aos sábados. Fazes desporto?',
            nl: 'Ik voetbal op zaterdag. Doe jij aan sport?',
            antwoorden: [
              { tekst: 'Sim, vou ao ginásio.', nl: 'Ja, ik ga naar de sportschool.' },
              { tekst: 'Corro no parque.', nl: 'Ik hardloop in het park.' },
            ],
          },
          {
            zeg: 'Muito bem! Qual é o teu desporto preferido?',
            nl: 'Goed zo! Wat is jouw favoriete sport?',
            antwoorden: [
              { tekst: 'O futebol, claro.', nl: 'Voetbal, natuurlijk.' },
              { tekst: 'Gosto de nadar.', nl: 'Ik zwem graag.' },
            ],
          },
        ],
      },
      {
        id: 'familie',
        titel: 'Familie',
        emoji: '👨‍👩‍👧',
        stappen: [
          {
            zeg: 'Tenho duas irmãs. Tens irmãos?',
            nl: 'Ik heb twee zussen. Heb jij broers of zussen?',
            antwoorden: [
              { tekst: 'Sim, tenho um irmão.', nl: 'Ja, ik heb een broer.' },
              { tekst: 'Não, sou filho único.', nl: 'Nee, ik ben enig kind.' },
            ],
          },
          {
            zeg: 'Vives com a tua família?',
            nl: 'Woon je bij je familie?',
            antwoorden: [
              { tekst: 'Sim, vivo com os meus pais.', nl: 'Ja, ik woon bij mijn ouders.' },
              { tekst: 'Não, vivo sozinho.', nl: 'Nee, ik woon alleen.' },
            ],
          },
        ],
      },
      {
        id: 'weer',
        titel: 'Het weer',
        emoji: '☀️',
        stappen: [
          {
            zeg: 'Hoje está muito bom tempo. Gostas do sol?',
            nl: 'Vandaag is het heel mooi weer. Hou je van de zon?',
            antwoorden: [
              { tekst: 'Sim, adoro o sol.', nl: 'Ja, ik ben dol op de zon.' },
              { tekst: 'Prefiro a chuva.', nl: 'Ik hou meer van regen.' },
            ],
          },
          {
            zeg: 'Como está o tempo na tua cidade?',
            nl: 'Hoe is het weer in jouw stad?',
            antwoorden: [
              { tekst: 'Chove muito.', nl: 'Het regent veel.' },
              { tekst: 'Está frio e há vento.', nl: 'Het is koud en het waait.' },
            ],
          },
        ],
      },
    ],
  },

  en: {
    partner: 'Grace',
    intro: {
      zeg: 'Hi! It’s great to see you. How are you?',
      nl: 'Hoi! Wat leuk om je te zien. Hoe gaat het?',
      antwoorden: [
        { tekst: 'Very well! And you?', nl: 'Heel goed! En met jou?' },
        { tekst: 'I’m a bit tired, but fine.', nl: 'Ik ben een beetje moe, maar goed.' },
      ],
    },
    keuzevraag: { zeg: 'Lovely! What do you want to talk about?', nl: 'Fijn! Waar wil je over praten?' },
    vervolgvraag: { zeg: 'How interesting! Shall we talk about something else?', nl: 'Interessant! Zullen we het ergens anders over hebben?' },
    afscheid: { tekst: 'I have to go. See you soon!', nl: 'Ik moet gaan. Tot gauw!' },
    slot: { zeg: 'Of course! I love talking to you. Goodbye!', nl: 'Natuurlijk! Ik praat graag met je. Tot ziens!' },
    onderwerpen: [
      {
        id: 'eten',
        titel: 'Eten',
        emoji: '🍽️',
        stappen: [
          {
            zeg: 'I love pancakes. What is your favourite food?',
            nl: 'Ik ben dol op pannenkoeken. Wat is jouw lievelingseten?',
            antwoorden: [
              { tekst: 'I love pizza.', nl: 'Ik ben dol op pizza.' },
              { tekst: 'My favourite food is fish.', nl: 'Mijn lievelingseten is vis.' },
            ],
          },
          {
            zeg: 'Yummy! Do you like cooking?',
            nl: 'Lekker! Hou je van koken?',
            antwoorden: [
              { tekst: 'Yes, I cook every day.', nl: 'Ja, ik kook elke dag.' },
              { tekst: 'Not really, I prefer eating out.', nl: 'Niet echt, ik eet liever buiten de deur.' },
            ],
          },
        ],
      },
      {
        id: 'reizen',
        titel: 'Reizen',
        emoji: '✈️',
        stappen: [
          {
            zeg: 'This summer I want to go to the beach. Do you like travelling?',
            nl: 'Deze zomer wil ik naar het strand. Hou je van reizen?',
            antwoorden: [
              { tekst: 'Yes, I love travelling.', nl: 'Ja, ik ben dol op reizen.' },
              { tekst: 'Yes, but I prefer the mountains.', nl: 'Ja, maar ik ga liever naar de bergen.' },
            ],
          },
          {
            zeg: 'Which country do you want to visit?',
            nl: 'Welk land wil je bezoeken?',
            antwoorden: [
              { tekst: 'I want to visit England.', nl: 'Ik wil Engeland bezoeken.' },
              { tekst: 'I want to see the whole world.', nl: 'Ik wil de hele wereld zien.' },
            ],
          },
        ],
      },
      {
        id: 'muziek',
        titel: 'Muziek',
        emoji: '🎵',
        stappen: [
          {
            zeg: 'I listen to music every day. What music do you like?',
            nl: 'Ik luister elke dag muziek. Welke muziek vind jij leuk?',
            antwoorden: [
              { tekst: 'I like pop music.', nl: 'Ik hou van popmuziek.' },
              { tekst: 'I listen to everything.', nl: 'Ik luister van alles.' },
            ],
          },
          {
            zeg: 'Do you play an instrument?',
            nl: 'Bespeel je een instrument?',
            antwoorden: [
              { tekst: 'Yes, I play the guitar.', nl: 'Ja, ik speel gitaar.' },
              { tekst: 'No, but I like singing.', nl: 'Nee, maar ik zing graag.' },
            ],
          },
        ],
      },
      {
        id: 'sport',
        titel: 'Sport',
        emoji: '⚽',
        stappen: [
          {
            zeg: 'I play football on Saturdays. Do you do any sport?',
            nl: 'Ik voetbal op zaterdag. Doe jij aan sport?',
            antwoorden: [
              { tekst: 'Yes, I go to the gym.', nl: 'Ja, ik ga naar de sportschool.' },
              { tekst: 'I run in the park.', nl: 'Ik hardloop in het park.' },
            ],
          },
          {
            zeg: 'Very good! What is your favourite sport?',
            nl: 'Goed zo! Wat is jouw favoriete sport?',
            antwoorden: [
              { tekst: 'Football, of course.', nl: 'Voetbal, natuurlijk.' },
              { tekst: 'I like swimming.', nl: 'Ik zwem graag.' },
            ],
          },
        ],
      },
      {
        id: 'familie',
        titel: 'Familie',
        emoji: '👨‍👩‍👧',
        stappen: [
          {
            zeg: 'I have two sisters. Do you have any brothers or sisters?',
            nl: 'Ik heb twee zussen. Heb jij broers of zussen?',
            antwoorden: [
              { tekst: 'Yes, I have one brother.', nl: 'Ja, ik heb een broer.' },
              { tekst: 'No, I’m an only child.', nl: 'Nee, ik ben enig kind.' },
            ],
          },
          {
            zeg: 'Do you live with your family?',
            nl: 'Woon je bij je familie?',
            antwoorden: [
              { tekst: 'Yes, I live with my parents.', nl: 'Ja, ik woon bij mijn ouders.' },
              { tekst: 'No, I live alone.', nl: 'Nee, ik woon alleen.' },
            ],
          },
        ],
      },
      {
        id: 'weer',
        titel: 'Het weer',
        emoji: '☀️',
        stappen: [
          {
            zeg: 'The weather is lovely today. Do you like the sun?',
            nl: 'Het is heerlijk weer vandaag. Hou je van de zon?',
            antwoorden: [
              { tekst: 'Yes, I love the sun.', nl: 'Ja, ik ben dol op de zon.' },
              { tekst: 'I prefer the rain.', nl: 'Ik hou meer van regen.' },
            ],
          },
          {
            zeg: 'What’s the weather like in your city?',
            nl: 'Wat voor weer is het in jouw stad?',
            antwoorden: [
              { tekst: 'It rains a lot.', nl: 'Het regent veel.' },
              { tekst: 'It’s cold and windy.', nl: 'Het is koud en winderig.' },
            ],
          },
        ],
      },
    ],
  },
}
