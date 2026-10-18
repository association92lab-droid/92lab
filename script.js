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
  var filtres = document.querySelectorAll('.filtre');
  var vide = document.querySelector('.galerie-vide');
  var box = document.querySelector('.lightbox');
  var boxImg = box.querySelector('img');
  var boxVideo = box.querySelector('video');
  var boxLegende = box.querySelector('figcaption');
  var visibles = [];
  var courante = 0;
  var declencheur = null;

  var antiseche = document.querySelector('.antiseche');

  function filtrer(cat) {
    var n = 0;
    var modeAntiseche = cat === 'antiseche';
    if (antiseche) antiseche.hidden = !modeAntiseche;
    galerie.hidden = modeAntiseche;
    photos.forEach(function (p) {
      var ok = cat === 'tout' || p.getAttribute('data-categorie') === cat;
      p.hidden = !ok;
      if (ok) n++;
    });
    vide.hidden = modeAntiseche || n > 0;
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

  if (location.hash === '#antiseche') filtrer('antiseche');
})();

// Événements : mention « Déjà passé » automatique (attribut data-fin = AAAA-MM-JJ)
(function () {
  var evenements = document.querySelectorAll('.evenement[data-fin]');
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
    var badge = document.createElement('span');
    badge.className = 'badge-passe';
    badge.textContent = 'Déjà passé';
    titre.parentNode.insertBefore(badge, titre);
  });
})();
