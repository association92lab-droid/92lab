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
        var reset = radarBloc.querySelector('.radar-filtre[data-radar="tout"]');
        if (reset) reset.click();
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
  function filtrer(m) {
    var total = 0;
    document.querySelectorAll('.dojo-bloc').forEach(function (bloc) {
      var n = 0;
      bloc.querySelectorAll('[data-matiere]').forEach(function (x) {
        var ok = m === 'tout' || x.getAttribute('data-matiere') === m;
        x.hidden = !ok;
        if (ok) n++;
      });
      bloc.hidden = n === 0;
      total += n;
    });
    zone.hidden = true;
    liste.hidden = false;
    vide.hidden = total > 0;
    boutons.forEach(function (b) { b.classList.toggle('actif', b.getAttribute('data-matiere') === m); });
  }
  boutons.forEach(function (b) {
    b.addEventListener('click', function () { filtrer(b.getAttribute('data-matiere')); });
  });
})();

// Le Radar : filtre par type
(function () {
  var cartes = document.querySelectorAll('.radar-carte');
  if (!cartes.length) return;
  var boutons = document.querySelectorAll('.radar-filtre[data-radar]');
  var vide = document.querySelector('.radar-vide');
  boutons.forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-radar'), n = 0;
      cartes.forEach(function (c) {
        var ok = t === 'tout' || c.getAttribute('data-type') === t;
        c.hidden = !ok;
        if (ok) n++;
      });
      vide.hidden = n > 0;
      boutons.forEach(function (x) { x.classList.toggle('actif', x === b); });
    });
  });
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
