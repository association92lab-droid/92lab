// Menu déroulant mobile
(function () {
  var bouton = document.querySelector('.burger');
  var nav = document.querySelector('.entete nav');
  if (!bouton || !nav) return;

  function basculer(ouvrir) {
    nav.classList.toggle('ouvert', ouvrir);
    bouton.classList.toggle('ouvert', ouvrir);
    bouton.setAttribute('aria-expanded', ouvrir ? 'true' : 'false');
    bouton.setAttribute('aria-label', ouvrir ? 'Fermer le menu' : 'Ouvrir le menu');
  }

  bouton.addEventListener('click', function () {
    basculer(!nav.classList.contains('ouvert'));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) basculer(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') basculer(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1000) basculer(false);
  });
})();

// Bouton son de la vidéo d'accueil
(function () {
  var son = document.querySelector('.bouton-son');
  var video = document.querySelector('.video-fond video');
  if (!son || !video) return;
  son.addEventListener('click', function () {
    video.muted = !video.muted;
    son.textContent = video.muted ? '🔇' : '🔊';
    son.setAttribute('aria-label', video.muted ? 'Activer le son' : 'Couper le son');
  });
})();

// Flash Lab : filtres + visionneuse photo
(function () {
  var galerie = document.querySelector('.galerie');
  if (!galerie) return;

  var photos = Array.prototype.slice.call(galerie.querySelectorAll('.photo'));
  var filtres = document.querySelectorAll('.filtre[data-filtre]');
  var vide = document.querySelector('.galerie-vide');
  var box = document.querySelector('.lightbox');
  var boxImg = box.querySelector('img');
  var boxVideo = box.querySelector('video');
  var boxLegende = box.querySelector('figcaption');
  var visibles = [];
  var courante = 0;
  var declencheur = null;

  var antiseche = document.querySelector('.antiseche');
  var radarBloc = document.querySelector('.radar');
  var billets = Array.prototype.slice.call(document.querySelectorAll('.billet'));

  var tetes = Array.prototype.slice.call(document.querySelectorAll('.rubrique-tete'));
  var bientots = Array.prototype.slice.call(document.querySelectorAll('.rubrique-bientot'));
  var APERCU = 3;

  function compter(rub) {
    if (rub === 'opportunites') return billets.length;
    if (rub === 'radar') return document.querySelectorAll('.radar-carte').length;
    if (rub === 'antiseche') return document.querySelectorAll('.antiseche-item').length;
    return photos.filter(function (p) { return p.getAttribute('data-categorie') === rub; }).length;
  }
  tetes.forEach(function (t) {
    var lien = t.querySelector('.rubrique-lien');
    var rub = t.getAttribute('data-rub');
    var total = compter(rub);
    if (total <= (rub === 'opportunites' ? 1 : APERCU)) lien.hidden = true;
    else lien.textContent = 'Voir tout (' + total + ')';
    lien.addEventListener('click', function () {
      filtrer(rub);
      window.scrollTo({ top: document.querySelector('.filtres').getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
    });
  });

  function filtrer(cat) {
    var n = 0;
    var tout = cat === 'tout';
    var modeAntiseche = cat === 'antiseche';
    if (antiseche) antiseche.hidden = !(modeAntiseche || tout);
    document.querySelectorAll('.antiseche-item').forEach(function (x, i) {
      x.classList.toggle('apercu-cache', tout && i >= APERCU);
    });
    var bn = 0;
    billets.forEach(function (b) {
      var ok = tout || b.getAttribute('data-categorie') === cat;
      b.hidden = !ok;
      if (ok) bn++;
    });
    var modeRadar = cat === 'radar';
    if (radarBloc) {
      radarBloc.hidden = !(modeRadar || tout);
      radarBloc.classList.toggle('radar-apercu', tout);
      if (tout) {
        if (window.radarReset) window.radarReset();
      }
      radarBloc.querySelectorAll('.radar-carte').forEach(function (x, i) {
        x.classList.toggle('apercu-cache', tout && i >= APERCU);
      });
    }
    var modeBillets = cat === 'opportunites' || modeRadar;
    galerie.hidden = modeAntiseche || modeBillets;
    var compteurs = {};
    photos.forEach(function (p) {
      var c = p.getAttribute('data-categorie');
      var ok = tout ? (compteurs[c] = (compteurs[c] || 0) + 1) <= APERCU : c === cat;
      p.hidden = !ok;
      if (ok) n++;
    });
    tetes.forEach(function (t) { t.hidden = !tout; });
    bientots.forEach(function (x) { x.hidden = !tout; });
    vide.hidden = modeAntiseche || modeBillets || n > 0 || bn > 0;
    filtres.forEach(function (f) {
      f.classList.toggle('actif', f.getAttribute('data-filtre') === cat);
    });
  }

  filtres.forEach(function (f) {
    f.addEventListener('click', function () {
      filtrer(f.getAttribute('data-filtre'));
    });
  });

  function afficher(i) {
    courante = (i + visibles.length) % visibles.length;
    var p = visibles[courante];
    var img = p.querySelector('img');
    var src = p.getAttribute('data-video');
    boxVideo.pause();
    if (src) {
      boxImg.hidden = true;
      boxVideo.hidden = false;
      boxVideo.src = src;
      boxVideo.poster = img.src;
      boxVideo.play().catch(function () {});
    } else {
      boxVideo.hidden = true;
      boxVideo.removeAttribute('src');
      boxVideo.load();
      boxImg.hidden = false;
      boxImg.src = img.src;
      boxImg.alt = img.alt;
    }
    boxLegende.textContent = p.querySelector('figcaption').textContent.replace(/\s+/g, ' ').trim();
  }

  function ouvrir(p) {
    visibles = photos.filter(function (x) { return !x.hidden; });
    declencheur = document.activeElement;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    afficher(visibles.indexOf(p));
    box.querySelector('.lightbox-fermer').focus();
  }

  function fermer() {
    boxVideo.pause();
    box.hidden = true;
    document.body.style.overflow = '';
    if (declencheur) declencheur.focus();
  }

  photos.forEach(function (p) {
    p.querySelector('.photo-bouton').addEventListener('click', function () { ouvrir(p); });
  });

  box.querySelector('.lightbox-fermer').addEventListener('click', fermer);
  box.querySelector('.lightbox-prec').addEventListener('click', function () { afficher(courante - 1); });
  box.querySelector('.lightbox-suiv').addEventListener('click', function () { afficher(courante + 1); });
  box.addEventListener('click', function (e) {
    if (e.target === box) fermer();
  });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') fermer();
    else if (e.key === 'ArrowLeft') afficher(courante - 1);
    else if (e.key === 'ArrowRight') afficher(courante + 1);
  });

  filtrer('tout');
  if (location.hash === '#antiseche') filtrer('antiseche');
  if (location.hash === '#opportunites') filtrer('opportunites');
  if (location.hash === '#radar') filtrer('radar');
})();

// Événements : mention « Déjà passé » automatique (attribut data-fin = AAAA-MM-JJ)
(function () {
  var evenements = document.querySelectorAll('.evenement[data-fin], .billet[data-fin]');
  if (!evenements.length) return;
  var aujourdhui;
  try {
    aujourdhui = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
  } catch (e) {
    var d = new Date();
    aujourdhui = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  evenements.forEach(function (ev) {
    if (aujourdhui <= ev.getAttribute('data-fin')) return;
    ev.classList.add('passe');
    var titre = ev.querySelector('h2');
    if (ev.classList.contains('billet')) { var meta = ev.querySelector('.billet-meta'); var bp = document.createElement('span'); bp.className = 'badge-passe'; bp.textContent = 'Terminé'; meta.appendChild(bp); return; }
    var badge = document.createElement('span');
    badge.className = 'badge-passe';
    badge.textContent = 'Déjà passé';
    titre.parentNode.insertBefore(badge, titre);
  });
})();

// Biblio'Lab : catalogue (filtres, recherche, statut, demande d'emprunt par mail)
(function () {
  var liste = document.querySelector('.biblio-liste');
  if (!liste) return;
  var MAIL = 'association92lab@gmail.com';
  var livres = Array.prototype.slice.call(liste.querySelectorAll('.livre'));
  var boutons = document.querySelectorAll('.filtre[data-type]');
  var champ = document.querySelector('.biblio-champ');
  var dispo = document.querySelector('.biblio-dispo input');
  var vide = document.querySelector('.biblio-vide');
  var typeActif = 'tout';
  var serieActive = 'tout';
  var boutonsSerie = document.querySelectorAll('.filtre[data-serie]');

  function normaliser(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function dateFr(iso) {
    var p = iso.split('-');
    var mois = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    return parseInt(p[2], 10) + ' ' + mois[parseInt(p[1], 10) - 1];
  }

  // Statut + bouton d'emprunt de chaque document
  livres.forEach(function (l) {
    var titre = l.querySelector('h3').textContent.trim();
    var auteur = l.querySelector('.livre-auteur').textContent.trim();
    var emprunte = l.getAttribute('data-statut') === 'emprunte';
    var retour = l.getAttribute('data-retour');
    var statut = l.querySelector('.livre-statut');
    var bouton = l.querySelector('.livre-emprunt');
    l.classList.toggle('livre-emprunte', emprunte);
    statut.textContent = emprunte
      ? 'Emprunté' + (retour ? ' · retour prévu le ' + dateFr(retour) : '')
      : 'Disponible';
    statut.classList.add(emprunte ? 'statut-non' : 'statut-oui');
    var sujet = (emprunte ? 'Réservation : ' : 'Emprunt : ') + titre;
    var corps = 'Bonjour,\n\nJe suis adhérent(e) du 92Lab et je souhaite ' +
      (emprunte ? 'réserver' : 'emprunter') + ' « ' + titre + ' » (' + auteur + ').\n\nNom et prénom :\n\nMerci !';
    bouton.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(corps);
    bouton.textContent = emprunte ? 'Me prévenir à son retour' : 'Je l\'emprunte';
  });

  function appliquer() {
    var q = normaliser(champ.value.trim());
    var n = 0;
    livres.forEach(function (l) {
      var ok = (typeActif === 'tout' || l.getAttribute('data-type') === typeActif) &&
        (serieActive === 'tout' || l.getAttribute('data-serie') === serieActive) &&
        (!dispo.checked || l.getAttribute('data-statut') !== 'emprunte') &&
        (!q || normaliser(l.textContent).indexOf(q) !== -1);
      l.hidden = !ok;
      if (ok) n++;
    });
    vide.hidden = n > 0;
  }

  boutons.forEach(function (b) {
    b.addEventListener('click', function () {
      typeActif = b.getAttribute('data-type');
      boutons.forEach(function (x) { x.classList.toggle('actif', x === b); });
      appliquer();
    });
  });
  boutonsSerie.forEach(function (b) {
    b.addEventListener('click', function () {
      serieActive = b.getAttribute('data-serie');
      boutonsSerie.forEach(function (x) { x.classList.toggle('actif', x === b); });
      appliquer();
    });
  });
  champ.addEventListener('input', appliquer);
  dispo.addEventListener('change', appliquer);
  appliquer();
})();

// Le Dojo : filtre par matière + quiz interactifs
(function () {
  var liste = document.querySelector('.quiz-liste');
  var data = document.getElementById('quiz-data');
  if (!liste || !data) return;
  var quiz = [];
  try { quiz = JSON.parse(data.textContent); } catch (e) { return; }
  var zone = document.querySelector('.quiz-zone');
  var NOMS = { maths: 'Maths', francais: 'Français', 'histoire-geo-emc': 'Histoire-Géo-EMC', technologie: 'Technologie', 'physique-chimie': 'Physique-Chimie', svt: 'SVT', anglais: 'Anglais' };

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }

  quiz.forEach(function (qz) {
    var c = el('article', 'quiz-carte');
    c.setAttribute('data-matiere', qz.matiere);
    var meta = el('div', 'fiche-meta');
    meta.appendChild(el('span', 'fiche-tag', NOMS[qz.matiere] || qz.matiere));
    meta.appendChild(el('span', 'fiche-niveau', qz.niveau));
    c.appendChild(meta);
    c.appendChild(el('h3', '', qz.titre));
    c.appendChild(el('p', '', qz.desc + ' (' + qz.questions.length + ' questions)'));
    var b = el('button', 'cta', 'Commencer le quiz');
    b.type = 'button';
    b.addEventListener('click', function () { demarrer(qz); });
    c.appendChild(b);
    liste.appendChild(c);
  });

  function demarrer(qz) {
    var i = 0, score = 0;
    liste.hidden = true;
    zone.hidden = false;
    zone.scrollIntoView({ behavior: 'smooth', block: 'center' });

    function question() {
      zone.innerHTML = '';
      var q = qz.questions[i];
      var haut = el('div', 'quiz-haut');
      haut.appendChild(el('span', '', qz.titre));
      haut.appendChild(el('span', '', 'Question ' + (i + 1) + ' / ' + qz.questions.length));
      zone.appendChild(haut);
      var barre = el('div', 'quiz-barre');
      var rempli = el('span');
      rempli.style.width = (i / qz.questions.length * 100) + '%';
      barre.appendChild(rempli);
      zone.appendChild(barre);
      zone.appendChild(el('h3', 'quiz-question', q.q));
      var choix = el('div', 'quiz-choix');
      var retour = el('p', 'quiz-retour');
      var actions = el('div', 'quiz-actions');
      var boutons = [];
      q.r.forEach(function (txt, k) {
        var b = el('button', '', txt);
        b.type = 'button';
        b.addEventListener('click', function () {
          boutons.forEach(function (x, j) {
            x.disabled = true;
            if (j === q.ok) x.classList.add('juste');
          });
          if (k === q.ok) { score++; retour.textContent = '✅ Bravo ! ' + q.expl; }
          else { b.classList.add('faux'); retour.textContent = '❌ Pas tout à fait. ' + q.expl; }
          var suite = el('button', 'cta', i + 1 < qz.questions.length ? 'Question suivante' : 'Voir mon score');
          suite.type = 'button';
          suite.addEventListener('click', function () {
            i++;
            if (i < qz.questions.length) question(); else fin();
          });
          actions.appendChild(suite);
          suite.focus();
        });
        boutons.push(b);
        choix.appendChild(b);
      });
      zone.appendChild(choix);
      zone.appendChild(retour);
      zone.appendChild(actions);
    }

    function fin() {
      zone.innerHTML = '';
      var n = qz.questions.length;
      zone.appendChild(el('h3', 'quiz-question', qz.titre));
      zone.appendChild(el('p', 'quiz-score', score + ' / ' + n));
      var msg = score === n ? 'Parfait, tu maîtrises ! 🏆' : score >= n / 2 ? 'Bien joué ! Encore un petit effort pour le sans-faute.' : 'Relis la fiche de révision et retente ta chance, tu vas y arriver !';
      zone.appendChild(el('p', '', msg));
      var actions = el('div', 'quiz-actions');
      var r = el('button', 'cta', 'Recommencer');
      r.type = 'button';
      r.addEventListener('click', function () { demarrer(qz); });
      var q2 = el('button', 'cta', 'Tous les quiz');
      q2.type = 'button';
      q2.addEventListener('click', function () { zone.hidden = true; liste.hidden = false; });
      actions.appendChild(r);
      actions.appendChild(q2);
      zone.appendChild(actions);
    }
    question();
  }

  var boutons = document.querySelectorAll('.filtre[data-matiere]');
  var vide = document.querySelector('.dojo-vide');
  var rangNiveau = document.querySelector('.filtres-niveau');
  var NIVEAUX = ['CE2', 'CM1', 'CM2', '6ème', '5ème', '4ème', '3ème'];
  var rangType = document.querySelector('.filtres-type');
  var indexTitres = document.querySelector('.index-titres');
  var matiere = 'tout', niveau = 'tous', type = 'tout', section = null;

  // Niveaux d'une carte : "3ème · Géométrie" -> ['3ème'] ; "CE2 – 6ème" -> tous les niveaux de CE2 à 6ème
  function niveauxDe(x) {
    var n = x.querySelector('.fiche-niveau');
    var t = n ? n.textContent : '';
    var trouves = NIVEAUX.filter(function (v) { return t.indexOf(v) !== -1; });
    if (trouves.length === 2 && /–|-/.test(t.split('·')[0])) {
      return NIVEAUX.slice(NIVEAUX.indexOf(trouves[0]), NIVEAUX.indexOf(trouves[1]) + 1);
    }
    return trouves;
  }
  function chapitreDe(x) {
    var n = x.querySelector('.fiche-niveau');
    var p = n ? n.textContent.split('·') : [];
    return p.length > 1 ? p[1].trim() : '';
  }
  function titreDe(x) {
    var h = x.querySelector('h3');
    return h ? h.textContent : '';
  }
  function correspond(x) {
    if (matiere === 'tout' || x.getAttribute('data-matiere') !== matiere) return false;
    if (niveau !== 'tous' && niveauxDe(x).indexOf(niveau) === -1) return false;
    return true;
  }

  function bouton(texte, attr, valeur, actif, clic) {
    var b = el('button', 'filtre' + (actif ? ' actif' : ''), texte);
    b.type = 'button';
    b.setAttribute(attr, valeur);
    b.addEventListener('click', clic);
    return b;
  }

  function construireNiveaux() {
    rangNiveau.innerHTML = '';
    if (matiere === 'tout') { rangNiveau.hidden = true; return; }
    var presents = {};
    document.querySelectorAll('.fiche[data-matiere="' + matiere + '"], .quiz-carte[data-matiere="' + matiere + '"]').forEach(function (x) {
      niveauxDe(x).forEach(function (v) { presents[v] = true; });
    });
    var liste = NIVEAUX.filter(function (v) { return presents[v]; });
    if (liste.length === 0) { rangNiveau.hidden = true; return; }
    ['tous'].concat(liste).forEach(function (v) {
      rangNiveau.appendChild(bouton(v === 'tous' ? 'Tous niveaux' : v, 'data-niveau', v, v === niveau, function () {
        niveau = v; section = null; afficher();
      }));
    });
    rangNiveau.hidden = false;
  }

  function construireType() {
    rangType.innerHTML = '';
    if (matiere === 'tout') { rangType.hidden = true; return; }
    [['tout', 'Fiches et quiz'], ['fiches', '📝 Fiches'], ['quiz', '🎯 Quiz']].forEach(function (t) {
      rangType.appendChild(bouton(t[1], 'data-type', t[0], t[0] === type, function () { type = t[0]; afficher(); }));
    });
    rangType.hidden = false;
  }

  // Index : d'abord les grandes parties, puis les chapitres de la partie choisie ; un clic sur un chapitre descend à sa carte
  function aller(t) {
    var genre = (type === 'quiz') ? 'quiz' : 'fiches';
    var bloc = document.querySelector('.dojo-bloc[data-bloc="' + genre + '"]');
    var cible = null;
    if (bloc) bloc.querySelectorAll('[data-matiere]').forEach(function (x) {
      if (!cible && !x.hidden && titreDe(x) === t) cible = x;
    });
    if (!cible) return;
    var haut = cible.getBoundingClientRect().top + window.pageYOffset - 110;
    window.scrollTo({ top: haut, behavior: 'smooth' });
    document.querySelectorAll('.carte-surlignee').forEach(function (c) { c.classList.remove('carte-surlignee'); });
    cible.classList.add('carte-surlignee');
    setTimeout(function () { cible.classList.remove('carte-surlignee'); }, 2600);
  }

  function construireIndex() {
    indexTitres.innerHTML = '';
    if (matiere === 'tout' || niveau === 'tous') { indexTitres.hidden = true; return; }
    var vus = {}, groupes = [], courant = null;
    document.querySelectorAll('.fiche[data-matiere="' + matiere + '"]').forEach(function (f) {
      if (!correspond(f)) return;
      var t = titreDe(f);
      if (vus[t]) return;
      vus[t] = true;
      var ch = chapitreDe(f) || 'Chapitres';
      if (!courant || courant.nom !== ch) { courant = { nom: ch, titres: [] }; groupes.push(courant); }
      courant.titres.push(t);
    });
    if (groupes.length === 0) { indexTitres.hidden = true; return; }
    indexTitres.appendChild(el('h2', 'dojo-titre', '🔎 Trouve ton chapitre'));
    var parties = el('div', 'index-liste index-parties');
    groupes.forEach(function (g) {
      parties.appendChild(bouton(g.nom + ' (' + g.titres.length + ')', 'data-section', g.nom, section === g.nom, function () {
        section = (section === g.nom ? null : g.nom);
        construireIndex();
      }));
    });
    indexTitres.appendChild(parties);
    groupes.forEach(function (g) {
      if (g.nom !== section) return;
      var ligne = el('div', 'index-liste index-chapitres');
      g.titres.forEach(function (t) {
        var b = el('button', 'filtre index-chapitre-bouton', t);
        b.type = 'button';
        b.addEventListener('click', function () { aller(t); });
        ligne.appendChild(b);
      });
      indexTitres.appendChild(ligne);
    });
    indexTitres.hidden = false;
  }

  function afficher() {
    var total = 0;
    document.querySelectorAll('.chapitre-titre').forEach(function (h) { h.remove(); });
    document.querySelectorAll('.dojo-bloc').forEach(function (bloc) {
      var n = 0, dernier = null;
      var genre = bloc.getAttribute('data-bloc');
      var blocOk = type === 'tout' || type === genre;
      bloc.querySelectorAll('[data-matiere]').forEach(function (x) {
        var ok = blocOk && (matiere === 'tout' ? true : correspond(x));
        x.hidden = !ok;
        if (ok) {
          n++;
          var ch = chapitreDe(x);
          if (matiere !== 'tout' && niveau !== 'tous' && ch && ch !== dernier) {
            x.parentNode.insertBefore(el('h3', 'chapitre-titre', ch), x);
          }
          dernier = ch;
        }
      });
      bloc.hidden = n === 0;
      total += n;
    });
    construireType();
    construireNiveaux();
    construireIndex();
    zone.hidden = true;
    liste.hidden = false;
    vide.hidden = total > 0;
    boutons.forEach(function (b) { b.classList.toggle('actif', b.getAttribute('data-matiere') === matiere); });
  }
  boutons.forEach(function (b) {
    b.addEventListener('click', function () {
      matiere = b.getAttribute('data-matiere');
      niveau = 'tous';
      section = null;
      afficher();
    });
  });
})();

// Le Radar : filtres par type et par thème
(function () {
  var cartes = document.querySelectorAll('.radar-carte');
  if (!cartes.length) return;
  var boutonsType = document.querySelectorAll('.radar-filtre[data-radar]');
  var boutonsTheme = document.querySelectorAll('.radar-theme[data-theme]');
  var vide = document.querySelector('.radar-vide');
  var type = 'tout', theme = 'tout';
  function afficher() {
    var n = 0;
    cartes.forEach(function (c) {
      var ok = (type === 'tout' || c.getAttribute('data-type') === type) &&
               (theme === 'tout' || c.getAttribute('data-theme') === theme);
      c.hidden = !ok;
      if (ok) n++;
    });
    vide.hidden = n > 0;
    boutonsType.forEach(function (x) { x.classList.toggle('actif', x.getAttribute('data-radar') === type); });
    boutonsTheme.forEach(function (x) { x.classList.toggle('actif', x.getAttribute('data-theme') === theme); });
  }
  boutonsType.forEach(function (b) {
    b.addEventListener('click', function () { type = b.getAttribute('data-radar'); afficher(); });
  });
  boutonsTheme.forEach(function (b) {
    b.addEventListener('click', function () { theme = b.getAttribute('data-theme'); afficher(); });
  });
  // Appelé par Flash Lab quand on revient sur « Tout »
  window.radarReset = function () { type = 'tout'; theme = 'tout'; afficher(); };
})();

// Radar : vignette automatique des vidéos YouTube (data-youtube = code de la vidéo)
(function () {
  document.querySelectorAll('.radar-image[data-youtube]').forEach(function (d) {
    var img = document.createElement('img');
    img.src = 'https://i.ytimg.com/vi/' + d.getAttribute('data-youtube') + '/hqdefault.jpg';
    img.alt = '';
    img.loading = 'lazy';
    d.appendChild(img);
    d.classList.add('radar-image-video');
  });
})();


// Antisèche : contenu verrouillé par mot de passe (image chiffrée AES-GCM, déchiffrée dans le navigateur)
(function () {
  var carte = document.querySelector('.antiseche-verrou');
  if (!carte || !window.crypto || !window.crypto.subtle) return;
  var form = carte.querySelector('.verrou-form');
  var champ = carte.querySelector('.verrou-champ');
  var msg = carte.querySelector('.verrou-message');
  var res = carte.querySelector('.verrou-resultat');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.hidden = false;
    msg.textContent = 'Vérification…';
    fetch(carte.getAttribute('data-fichier'))
      .then(function (r) { if (!r.ok) throw new Error('fichier'); return r.arrayBuffer(); })
      .then(function (buf) {
        var d = new Uint8Array(buf);
        var salt = d.slice(0, 16), iv = d.slice(16, 28), ct = d.slice(28);
        return crypto.subtle.importKey('raw', new TextEncoder().encode(champ.value), 'PBKDF2', false, ['deriveKey'])
          .then(function (base) {
            return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: 250000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
          })
          .then(function (cle) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, cle, ct); });
      })
      .then(function (clair) {
        var url = URL.createObjectURL(new Blob([clair], { type: 'image/png' }));
        res.innerHTML = '';
        var img = document.createElement('img');
        img.src = url;
        img.alt = 'Carte illustrée de Villeneuve-la-Garenne : le décor du projet final';
        img.className = 'verrou-image';
        var dl = document.createElement('a');
        dl.className = 'antiseche-lien';
        dl.href = url;
        dl.download = carte.getAttribute('data-nom');
        dl.textContent = '⬇ Télécharger l\'image';
        res.appendChild(img);
        res.appendChild(dl);
        res.hidden = false;
        form.hidden = true;
        msg.hidden = true;
        champ.value = '';
      })
      .catch(function () {
        msg.hidden = false;
        msg.textContent = 'Mot de passe incorrect.';
      });
  });
})();
