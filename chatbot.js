// Assistant du 92Lab : chatbot FAQ (réponses prévues à l'avance, sans IA)
(function () {
  var MAIL = 'association92lab@gmail.com';
  var TEL1 = ['06 01 32 34 46', '+33601323446'];
  var TEL2 = ['07 81 77 49 77', '+33781774977'];

  var CONTACT_LIENS = [
    { t: '✉ Écrire un mail', h: 'mailto:' + MAIL },
    { t: '📞 ' + TEL1[0], h: 'tel:' + TEL1[1] },
    { t: '📞 ' + TEL2[0], h: 'tel:' + TEL2[1] }
  ];

  /* ------------------------------------------------------------------
     LES QUESTIONS / RÉPONSES
     Pour ajouter ou modifier une réponse, change simplement une ligne
     ci-dessous :
       mots  = les mots que les gens peuvent taper (sans accents, en
               minuscules). Un mot terminé par * accepte toutes les fins
               (ex. benevol* → bénévole, bénévolat, bénévoles…).
               Une expression avec des espaces doit apparaître telle quelle.
       r     = la réponse (le HTML simple est accepté : <b>, <br>)
       liens = les boutons sous la réponse
     ------------------------------------------------------------------ */
  var FAQ = [
    {
      id: 'bonjour',
      mots: ['bonjour', 'bonsoir', 'salut', 'coucou', 'hello', 'hey', 'cc'],
      r: 'Bonjour ! 👋 Je suis l\'assistant du 92Lab. Choisis un sujet ci-dessous ou écris ta question.'
    },
    {
      id: 'merci',
      mots: ['merci', 'super', 'parfait', 'genial', 'au revoir', 'bye', 'a bientot'],
      r: 'Avec plaisir ! 😊 À bientôt au Lab.'
    },
    {
      id: 'adherer',
      mots: ['adher*', 'inscri*', 'cotisation', 'membre', 'rejoindre', 'rejoins', 'comment participer'],
      r: '<b>Pour adhérer</b> : va sur la page « Rejoins l\'expérience ». Tu peux payer en ligne (HelloAsso, paiement sécurisé) ou en espèces / par chèque. Dans tous les cas, tu dois aussi <b>remplir le formulaire</b> de la page.<br><b>Cotisation : 15 € pour l\'année 2026/2027</b>, ateliers compris.',
      liens: [{ t: 'Adhérer', h: 'adherer.html' }]
    },
    {
      id: 'prix',
      mots: ['prix', 'tarif*', 'combien', 'cout*', 'coute', 'payant', 'gratuit*', 'euro*', 'cher', 'cotise'],
      r: 'L\'adhésion coûte <b>15 € pour l\'année</b> (2026/2027) et <b>les ateliers sont compris</b> dans la cotisation.',
      liens: [{ t: 'Adhérer', h: 'adherer.html' }]
    },
    {
      id: 'paiement',
      mots: ['espece*', 'cheque*', 'paiement', 'payer', 'helloasso', 'carte bancaire', 'cb'],
      r: 'Tu peux régler <b>en ligne</b> (HelloAsso, sécurisé) ou <b>en espèces / par chèque</b>. Pour ces deux derniers, indique-le dans le formulaire : on te recontacte rapidement pour convenir des modalités et confirmer ton adhésion.',
      liens: [{ t: 'Page d\'adhésion', h: 'adherer.html' }]
    },
    {
      id: 'formulaire',
      mots: ['formulaire*', 'autorisation*', 'droit a l image', 'papier*', 'document*', 'dossier'],
      r: 'Le formulaire est <b>obligatoire pour tout le monde</b>, même si tu paies en ligne : il contient les autorisations nécessaires (droit à l\'image, autorisations diverses, etc.). Tu le trouves sur la page d\'adhésion.',
      liens: [{ t: 'Remplir le formulaire', h: 'adherer.html' }]
    },
    {
      id: 'horaires',
      mots: ['horaire*', 'heure*', 'quand', 'vendredi', 'jour*', 'planning', 'calendrier', 'annule*', 'a quelle heure', 'semaine'],
      r: '<b>Les ateliers de programmation ont lieu tous les vendredis de 17h à 19h</b>, à l\'espace Nelly Roussel, en salle Océan.<br>Pour l\'instant, il n\'y a pas d\'ateliers les autres jours.<br>En cas d\'annulation, c\'est annoncé sur la page « Ça bouge ! ».',
      liens: [{ t: 'Voir les actualités', h: 'ca-bouge.html' }]
    },
    {
      id: 'ateliers',
      mots: ['atelier*', 'labo', 'pole*', 'activite*', 'programmation', 'robotique', 'electronique', 'maths', 'mathematique*', 'physique', 'chimie', 'biologie', 'astronomie', 'ecologie', 'science*', 'proposez', 'faites'],
      r: 'Le Labo, c\'est <b>six pôles</b> pour expérimenter, comprendre et créer :<br>💻 Numérique & Code · 🤖 Robotique & Électronique · 🔬 Sciences exactes · 🌍 Vivant & Univers · 📚 Accompagnement scolaire · 🎤 Rencontres & Conférences.<br>En ce moment, les ateliers de programmation ont lieu <b>le vendredi de 17h à 19h</b>.',
      liens: [{ t: 'Découvrir le Labo', h: 'labo.html' }]
    },
    {
      id: 'age',
      mots: ['age*', 'ans', 'a partir de', 'trop jeune', 'trop vieux', 'enfant*', 'ecole', 'college', 'lycee', 'primaire'],
      r: 'Les ateliers sont ouverts <b>à partir de 8 ans</b>.'
    },
    {
      id: 'ordi',
      mots: ['ordi*', 'pc', 'portable*', 'chargeur', 'apporter', 'amener', 'emmener', 'materiel', 'prendre', 'equipement', 'mac', 'tablette'],
      r: 'Oui, <b>il faut apporter son ordinateur et son chargeur</b>. L\'ordinateur doit être <b>assez puissant pour pouvoir coder et faire tourner des programmes</b>. Dans l\'Antisèche, tu trouveras les logiciels à installer (Python, VS Code, Scratch).',
      liens: [{ t: 'Voir l\'Antisèche', h: 'flash-lab.html#antiseche' }]
    },
    {
      id: 'devoirs',
      mots: ['devoir*', 'soutien', 'scolaire*', 'methodologie', 'aide scolaire', 'cours particulier*', 'rattrapage', 'reviser', 'revision*'],
      r: 'L\'<b>aide aux devoirs</b> est <b>en cours d\'installation</b> : elle n\'est pas encore disponible. Nous cherchons justement des bénévoles pour la mettre en place. Si tu peux nous aider, dis-nous-le !',
      liens: [{ t: 'Devenir bénévole', h: 'contact.html#benevoles' }]
    },
    {
      id: 'lieu',
      mots: ['adresse*', 'lieu*', 'situe*', 'localis*', 'plan', 'villeneuve*', 'roussel', 'ocean', 'trouve*', 'acces', 'ou etes', 'ou est', 'ou se', 'ou vous', 'ou ca', 'ou on'],
      r: 'Le 92Lab est à <b>Villeneuve-la-Garenne (92390)</b>. Les ateliers ont lieu à l\'<b>espace Nelly Roussel</b>, en <b>salle Océan</b>.',
      liens: [{ t: '📍 Voir sur la carte', h: 'https://www.google.com/maps/search/?api=1&query=92390+Villeneuve-la-Garenne' }]
    },
    {
      id: 'contact',
      mots: ['contact*', 'mail*', 'email*', 'courriel', 'telephone', 'tel', 'appeler', 'appel', 'numero*', 'joindre', 'ecrire', 'instagram', 'insta', 'reseaux', 'parler', 'humain', 'question'],
      r: 'Tu peux nous joindre :<br>✉ <b>' + MAIL + '</b><br>📞 <b>' + TEL1[0] + '</b> ou <b>' + TEL2[0] + '</b><br>📸 Instagram : <b>@asso92lab</b>',
      liens: CONTACT_LIENS.concat([{ t: '📸 Instagram', h: 'https://www.instagram.com/asso92lab' }])
    },
    {
      id: 'benevole',
      mots: ['benevol*', 'aider', 'volontaire*', 'animer', 'animateur*', 'animatrice*', 'intervenir', 'enseigner', 'transmettre', 'donner de mon temps', 'proposer mes services', 'engager', 'mission*', 'passionne*', 'partager ma passion'],
      r: '<b>Nous cherchons activement des bénévoles !</b> 🙌 Pour animer des <b>ateliers scientifiques</b> (physique-chimie, biologie, programmation et Scratch, maths et modélisation, astronomie, électronique et robotique), mais aussi pour l\'<b>aide aux devoirs</b>, l\'art oratoire ou la mémorisation.<br>Tu choisis un rôle sur mesure, selon ton temps et tes envies. Écris-nous ou appelle-nous : on en parle !',
      liens: [{ t: 'Je me lance 🚀', h: 'mailto:' + MAIL + '?subject=Je%20veux%20devenir%20b%C3%A9n%C3%A9vole%20!' }, { t: TEL1[0], h: 'tel:' + TEL1[1] }, { t: 'En savoir plus', h: 'contact.html#benevoles' }]
    },
    {
      id: 'don',
      mots: ['don', 'dons', 'donner', 'donation*', 'soutenir', 'soutien financier', 'financer', 'financement', 'cagnotte', 'impot*', 'defiscalisation', 'recu fiscal', 'faire un don'],
      r: '<b>Merci de vouloir soutenir le Lab !</b> 💙 Chaque don, petit ou grand, ponctuel ou régulier, permet d\'acheter du matériel, d\'organiser des sorties et de garder les ateliers accessibles à tous.<br>Les dons peuvent ouvrir droit à une <b>réduction d\'impôt</b> : écris-nous pour connaître les modalités.',
      liens: [{ t: 'Faire un don 💙', h: 'https://www.helloasso.com/associations/92lab/formulaires/1' }, { t: 'Nous écrire', h: 'mailto:' + MAIL + '?subject=Soutenir%20le%2092Lab' }]
    },
    {
      id: 'mecenat',
      mots: ['mecen*', 'entreprise*', 'societe*', 'sponsor*', 'parrain*', 'rse', 'fondation*', 'sponsoring'],
      r: '<b>Entreprises, soutenez la jeunesse scientifique de votre territoire !</b> 🏆 Deux formes possibles : le <b>mécénat d\'entreprise</b> et le <b>parrainage</b> (d\'un jeune, d\'un atelier ou d\'un projet, avec un impact direct et visible). Les dons peuvent ouvrir droit à une réduction d\'impôt.<br>Écrivez-nous, on vous explique tout simplement.',
      liens: [{ t: 'Écrire au Lab', h: 'mailto:' + MAIL + '?subject=Soutenir%20le%2092Lab%20(parrainage%20%2F%20m%C3%A9c%C3%A9nat)' }, { t: TEL1[0], h: 'tel:' + TEL1[1] }, { t: 'En savoir plus', h: 'contact.html#mecenat' }]
    },
    {
      id: 'partenariat',
      mots: ['partenaire*', 'partenariat*', 'professionnel*', 'metier*', 'stagiaire*', 'stage*', 'conference*', 'visite*', 'coacher', 'orienter', 'orientation', 'temoignage*', 'intervenant*', 'collaborer', 'collaboration'],
      r: '<b>Professionnels, ouvrez les portes de votre métier !</b> 🤝 Vous pouvez :<br>• présenter votre métier aux jeunes<br>• accueillir un stagiaire (collégiens et lycéens cherchent des stages d\'observation)<br>• donner une conférence<br>• faire visiter votre entreprise<br>• coacher et orienter<br>• proposer un projet commun, un défi ou un atelier sur mesure<br>Un échange, un café, une idée : parlons-en !',
      liens: [{ t: 'Devenir partenaire', h: 'mailto:' + MAIL + '?subject=Proposition%20de%20partenariat%20professionnel' }, { t: 'En savoir plus', h: 'contact.html#partenariat' }]
    },
    {
      id: 'materiel',
      mots: ['don de materiel', 'donner du materiel', 'donner des ordinateurs', 'donner un ordinateur', 'donner mon ordinateur', 'materiel informatique', 'composants', 'livres', 'instruments', 'ancien ordinateur', 'vieil ordinateur', 'vieux ordinateur', 'ordinateur a donner', 'ordinateurs a donner', 'materiel a donner', 'a donner', 'ordinateurs usages', 'recuperer'],
      r: 'Ce que vous n\'utilisez plus peut servir ici ! 🔧 Nous acceptons les <b>dons de matériel</b> : ordinateurs, composants, instruments, livres… Écrivez-nous pour qu\'on organise ça ensemble.',
      liens: [{ t: 'Nous écrire', h: 'mailto:' + MAIL + '?subject=Don%20de%20mat%C3%A9riel' }, { t: TEL1[0], h: 'tel:' + TEL1[1] }]
    },
    {
      id: 'sortie',
      mots: ['weekend', 'week end', 'ce week end', 'que faire', 'quoi faire', 'on fait quoi', 'idee*', 'sortie*', 'sortir', 'bon plan', 'bons plans', 'agenda', 'evenement*', 'hors les murs', 'animation*', 'a faire', 'programme', 'vacances', 'mercredi', 'samedi', 'dimanche', 'occuper'],
      r: 'Des idées de sorties et de bons plans, c\'est dans <b>« Hors les murs »</b> ! 🧭 Tu y trouves nos événements (ceux qui sont terminés sont marqués « Déjà passé ») et des lieux à visiter, comme le Musée des Arts et Métiers, ouvert du mardi au dimanche.',
      liens: [{ t: 'Voir Hors les murs', h: 'hors-les-murs.html' }, { t: 'Ça bouge ! (actus)', h: 'ca-bouge.html' }]
    },
    {
      id: 'muam',
      mots: ['musee*', 'musee', 'muam', 'arts et metiers', 'cnam', 'paris', 'reaumur'],
      r: '<b>Musée des Arts et Métiers (MuAM)</b> 🏛️<br>📍 60 rue Réaumur - 75003 Paris<br>📅 Du mardi au dimanche, de 10h à 18h<br>🌙 Nocturne le vendredi jusqu\'à 21h<br>📞 01 53 01 82 00<br>Chaque jour, des visites, démonstrations et ateliers sont proposés.',
      liens: [{ t: 'Voir le programme', h: 'https://www.arts-et-metiers.net/agenda/recherche?f%5B0%5D=agenda_manifestation%3A132' }, { t: 'Hors les murs', h: 'hors-les-murs.html' }]
    },
    {
      id: 'evenement',
      fin: '2026-10-17',
      mots: ['fete de la science', 'abeille*', 'apiculture', 'apiculteur*', 'miel', '17 octobre', 'crepe*', 'barbecue', 'maquillage', 'peinture', 'stand*'],
      r: '<b>Animation apiculture, Fête de la Science</b> 🐝<br>📅 Samedi 17 octobre · ⏰ 14h à 18h<br>📍 Parvis de l\'espace Nelly Roussel et jardin Myosotis<br>Au programme : stands de maquillage et de peinture, pots de miel (distribution avec ticket), rencontre avec l\'apiculteur, crêpes et barbecue pour finir.',
      liens: [{ t: 'Tous les événements', h: 'hors-les-murs.html' }]
    },
    {
      id: 'association',
      mots: ['association', '92lab', 'c est quoi', 'qui etes', 'qui sommes', 'presentation', 'histoire', 'equipe', 'mamans', 'objectif*', 'vision', 'cree*', 'fondatrice*'],
      r: 'Le 92Lab est une association qui veut <b>démocratiser l\'accès aux sciences</b> pour les jeunes des quartiers. Elle a été créée par des mamans qui croient au potentiel de chaque jeune : <i>« Nos quartiers regorgent de génies. Nous sommes là pour les révéler. »</i>',
      liens: [{ t: 'Notre histoire', h: 'etincelle.html' }]
    },
    {
      id: 'antiseche',
      mots: ['antiseche*', 'cours', 'lien*', 'ressource*', 'revoir', 'rappel*', 'python', 'scratch', 'vscode', 'visual studio', 'telecharger', 'installer', 'tutoriel*', 'apprendre'],
      r: 'Tous les rappels de cours et les liens utiles (Python, Scratch, VS Code…) sont dans <b>Flash Lab → Antisèche</b> 📝',
      liens: [{ t: 'Ouvrir l\'Antisèche', h: 'flash-lab.html#antiseche' }]
    },
    {
      id: 'photos',
      mots: ['photo*', 'video*', 'flash lab', 'blog', 'images'],
      r: 'Les photos et vidéos de nos ateliers, sorties et événements sont dans <b>Flash Lab</b> 📸',
      liens: [{ t: 'Voir Flash Lab', h: 'flash-lab.html' }]
    }
  ];

  var CHIPS = [
    { t: 'Adhérer', q: 'adhérer' },
    { t: 'Horaires', q: 'horaires' },
    { t: 'Âge', q: 'à partir de quel âge ?' },
    { t: 'Quel matériel ?', q: 'faut-il apporter son ordinateur ?' },
    { t: 'Devenir bénévole', q: 'je veux devenir bénévole' },
    { t: 'Faire un don', q: 'faire un don' },
    { t: 'Mécénat', q: 'mécénat entreprise' },
    { t: 'Partenariat', q: 'partenariat professionnel' },
    { t: 'Idées de sortie', q: 'une idée de sortie ?' },
    { t: 'Où êtes-vous ?', q: 'où êtes-vous ?' },
    { t: 'Contact', q: 'contact' }
  ];

  var ACCUEIL = 'Bonjour ! 👋 Je suis l\'assistant du 92Lab. Je réponds aux questions les plus fréquentes : adhésion, horaires, matériel, bénévolat, dons… Choisis un sujet ou écris ta question.';
  var INCONNU = 'Je n\'ai pas la réponse à cette question 🤔 Mais l\'équipe sera ravie de te répondre directement :';

  /* ---------- Moteur de recherche (mots-clés) ---------- */
  function normaliser(s) {
    return ' ' + s.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[’']/g, ' ')
      .replace(/[^a-z0-9 ]+/g, ' ')
      .replace(/\s+/g, ' ').trim() + ' ';
  }

  function score(entree, texte, mots) {
    var total = 0;
    entree.mots.forEach(function (m) {
      if (m.indexOf(' ') !== -1) {
        if (texte.indexOf(' ' + m + ' ') !== -1) total += 4;
      } else if (m.charAt(m.length - 1) === '*') {
        var racine = m.slice(0, -1);
        if (mots.some(function (w) { return w.indexOf(racine) === 0; })) total += 2;
      } else if (mots.indexOf(m) !== -1) {
        total += 2;
      }
    });
    return total;
  }

  function chercher(question) {
    var texte = normaliser(question);
    var mots = texte.trim().split(' ');
    var meilleur = null, max = 0;
    FAQ.forEach(function (e) {
      var s = score(e, texte, mots);
      if (s > max) { max = s; meilleur = e; }
    });
    return meilleur;
  }

  /* ---------- Interface ---------- */
  var racine = document.createElement('div');
  racine.className = 'chat';
  racine.innerHTML =
    '<div class="chat-panneau" role="dialog" aria-label="Assistant du 92Lab" hidden>' +
      '<div class="chat-entete">' +
        '<div class="chat-titre"><span class="chat-avatar" aria-hidden="true">🔬</span>' +
          '<div><strong>Assistant du Lab</strong><small>Réponses aux questions fréquentes</small></div></div>' +
        '<button type="button" class="chat-fermer" aria-label="Fermer le chat">✕</button>' +
      '</div>' +
      '<div class="chat-messages" aria-live="polite"></div>' +
      '<div class="chat-chips" aria-label="Sujets suggérés"></div>' +
      '<form class="chat-form" autocomplete="off">' +
        '<input type="text" class="chat-champ" placeholder="Écris ta question…" aria-label="Ta question" maxlength="200">' +
        '<button type="submit" class="chat-envoyer" aria-label="Envoyer">➤</button>' +
      '</form>' +
    '</div>' +
    '<button type="button" class="chat-bulle" aria-label="Ouvrir le chat" aria-expanded="false">💬<span class="chat-bulle-texte">Une question ?</span></button>';
  document.body.appendChild(racine);

  var panneau = racine.querySelector('.chat-panneau');
  var bulle = racine.querySelector('.chat-bulle');
  var zone = racine.querySelector('.chat-messages');
  var zoneChips = racine.querySelector('.chat-chips');
  var form = racine.querySelector('.chat-form');
  var champ = racine.querySelector('.chat-champ');

  function basculer(ouvrir) {
    panneau.hidden = !ouvrir;
    racine.classList.toggle('ouvert', ouvrir);
    bulle.setAttribute('aria-expanded', ouvrir ? 'true' : 'false');
    bulle.setAttribute('aria-label', ouvrir ? 'Fermer le chat' : 'Ouvrir le chat');
    if (ouvrir) { defiler(); champ.focus(); }
  }

  function defiler() { zone.scrollTop = zone.scrollHeight; }

  function ajouter(type, contenu, liens) {
    var m = document.createElement('div');
    m.className = 'chat-msg chat-' + type;
    if (type === 'bot') m.innerHTML = contenu; else m.textContent = contenu;
    if (liens && liens.length) {
      var l = document.createElement('div');
      l.className = 'chat-liens';
      liens.forEach(function (x) {
        var a = document.createElement('a');
        a.href = x.h;
        a.textContent = x.t;
        if (/^https?:/.test(x.h)) { a.target = '_blank'; a.rel = 'noopener'; }
        l.appendChild(a);
      });
      m.appendChild(l);
    }
    zone.appendChild(m);
    defiler();
  }

  function aujourdhui() {
    try {
      return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
    } catch (err) {
      var d = new Date();
      return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    }
  }

  function repondre(question) {
    var e = chercher(question);
    setTimeout(function () {
      if (e && e.fin && aujourdhui() > e.fin) {
        ajouter('bot', '⏳ <b>Déjà passé !</b> Cet événement a déjà eu lieu. Voici ce qui était prévu :<br><br>' + e.r, e.liens);
      } else if (e) ajouter('bot', e.r, e.liens);
      else ajouter('bot', INCONNU, CONTACT_LIENS);
    }, 350);
  }

  function poser(question) {
    question = question.trim();
    if (!question) return;
    ajouter('user', question);
    repondre(question);
  }

  CHIPS.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chat-chip';
    b.textContent = c.t;
    b.addEventListener('click', function () { poser(c.q); });
    zoneChips.appendChild(b);
  });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    poser(champ.value);
    champ.value = '';
  });
  bulle.addEventListener('click', function () { basculer(panneau.hidden); });
  racine.querySelector('.chat-fermer').addEventListener('click', function () { basculer(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panneau.hidden) basculer(false);
  });

  ajouter('bot', ACCUEIL);
})();
