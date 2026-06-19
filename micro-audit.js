/* ─────────────────────────────────────────────
   ALTOS · Micro-audit 3 minutes
   10 questions → bilan express + PDF
   ───────────────────────────────────────────── */

const API_BASE_URL = window.ALTOS_API_BASE_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://127.0.0.1:3001/api'
    : '/api'
);

const CONSENT_TEXT = "En soumettant ce formulaire, vous acceptez d'etre recontacte par Altos sous 48h ouvrees. Donnees conservees 12 mois, non revendues. Droit a l'effacement sur demande a hello@altos-experts.fr.";

const QUESTIONS = [
  {
    id: 'admin_hours',
    cat: 'Temps & opérations',
    title: "Combien d'heures par semaine votre équipe passe-t-elle sur des <i>tâches administratives répétitives</i> ?",
    hint: "Relances, ressaisies, exports, mises à jour de tableurs, reporting manuel. Comptez large : ce qui revient chaque semaine.",
    options: [
      { label: "Moins de 5 h" },
      { label: "Entre 5 et 15 h" },
      { label: "Entre 15 et 30 h" },
      { label: "Plus de 30 h", small: "(le sujet vous étouffe)" },
    ],
    axis: 'admin',
  },
  {
    id: 'data_resaisie',
    cat: 'Données & doubles saisies',
    title: "À quelle fréquence votre équipe doit-elle <i>ressaisir les mêmes données</i> dans plusieurs outils ?",
    hint: "Devis dans un outil, facture dans un autre, CRM à mettre à jour à la main, exports Excel pour la compta...",
    options: [
      { label: "Jamais ou presque" },
      { label: "Occasionnellement" },
      { label: "Toutes les semaines" },
      { label: "Tous les jours", small: "(plusieurs fois par jour)" },
    ],
    axis: 'admin',
  },
  {
    id: 'data_central',
    cat: 'Données & visibilité',
    title: "Vos données <i>clients & commerciales</i> sont-elles centralisées dans un outil unique ?",
    hint: "Un seul endroit qui fait foi pour les contacts, l'historique, les opportunités, le pipeline...",
    options: [
      { label: "Oui, tout est dans un CRM unique" },
      { label: "Réparties entre 2-3 outils connectés" },
      { label: "Surtout Excel et boîtes mail" },
      { label: "Aucun outil dédié", small: "(la mémoire, les fichiers, le téléphone)" },
    ],
    axis: 'data',
  },
  {
    id: 'dashboard',
    cat: 'Pilotage & visibilité',
    title: "Disposez-vous d'un <i>tableau de bord temps réel</i> (CA, marge, trésorerie, KPI métier) ?",
    hint: "Un dashboard que vous consultez quand vous voulez, et qui se met à jour sans intervention humaine.",
    options: [
      { label: "Oui, à jour en continu" },
      { label: "Construit à la main chaque mois" },
      { label: "Reporting ponctuel à la demande" },
      { label: "Aucun — je pilote au feeling" },
    ],
    axis: 'data',
  },
  {
    id: 'prospect',
    cat: 'Commercial & croissance',
    title: "Comment <i>qualifiez-vous vos prospects</i> aujourd'hui ?",
    hint: "Sourcing, scoring, premier contact, relances. À quel point ces étapes sont-elles automatisées ?",
    options: [
      { label: "Sourcing & qualification 100 % manuels" },
      { label: "Un mix manuel + quelques outils" },
      { label: "Une partie est automatisée" },
      { label: "Pipeline largement automatisé", small: "(scoring, relances, enrichissement)" },
    ],
    axis: 'commercial',
  },
  {
    id: 'content',
    cat: 'Production & visibilité',
    title: "Sur la <i>production de contenus</i> (réseaux sociaux, newsletter, site)...",
    hint: "Régularité, organisation, autonomie de l'équipe à produire et publier.",
    options: [
      { label: "On publie régulièrement, process huilé" },
      { label: "Quand on a le temps — irrégulier" },
      { label: "Un freelance ou une agence s'en occupe" },
      { label: "On ne publie pas / plus", small: "(faute de temps ou de ligne éditoriale)" },
    ],
    axis: 'commercial',
  },
  {
    id: 'docs',
    cat: 'Documentaire & synthèse',
    title: "Vos comptes rendus, courriers et <i>synthèses de documents</i> sont produits...",
    hint: "Réunions, mails clients, analyses de devis, lecture de PLU ou de contrats, rédaction de notes internes...",
    options: [
      { label: "À la main par les équipes" },
      { label: "Avec quelques modèles Word" },
      { label: "Avec une transcription IA ou Notion AI" },
      { label: "Workflow IA dédié déjà en place" },
    ],
    axis: 'documents',
  },
  {
    id: 'ia_maturity',
    cat: 'Maturité IA',
    title: "Où en êtes-vous avec l'<i>IA</i> (ChatGPT, Copilot, agents...) ?",
    hint: "Usage réel en production, pas juste curiosité personnelle.",
    options: [
      { label: "Jamais testé" },
      { label: "Quelques essais individuels" },
      { label: "Déployé sur un cas précis" },
      { label: "Plusieurs cas d'usage en production" },
    ],
    axis: 'ia',
  },
  {
    id: 'blocker',
    cat: 'Freins perçus',
    title: "Quel est le <i>frein principal</i> à l'automatisation chez vous ?",
    hint: "Soyez honnête — ce qui bloque vraiment dans la pratique.",
    options: [
      { label: "Le temps : on n'arrive pas à s'y mettre" },
      { label: "La compétence : personne en interne" },
      { label: "Le coût : on hésite à investir" },
      { label: "L'utilité : pas sûr du ROI" },
      { label: "Le RGPD / la sécurité des données" },
    ],
    axis: 'blocker',
  },
  {
    id: 'pain',
    cat: 'Pression dirigeant',
    title: "À quel point votre <i>dirigeant·e</i> ressent un goulot d'étranglement opérationnel ?",
    hint: "Sentiment quotidien : journée fragmentée, sujets repoussés, fatigue décisionnelle.",
    options: [
      { label: "Faible — on tient bien" },
      { label: "Modéré — gérable" },
      { label: "Important — ça pèse" },
      { label: "Critique — étouffement quotidien" },
    ],
    axis: 'pain',
  },
];

const TOTAL_QUESTIONS = QUESTIONS.length;
const TOTAL_STEPS = TOTAL_QUESTIONS + 1; // + contact form

const state = {
  answers: new Array(TOTAL_QUESTIONS).fill(null),
  current: 0,
  contact: { firstName: '', lastName: '', email: '', phone: '' },
};

/* ─── RENDER STEPS ──────────────────────────── */
const stepsEl = document.getElementById('steps');

QUESTIONS.forEach((q, i) => {
  const step = document.createElement('div');
  step.className = 'step';
  step.dataset.idx = i;
  step.innerHTML = `
    <span class="q-cat">§ ${String(i + 1).padStart(2, '0')} — ${q.cat}</span><span class="q-num">question ${i + 1} / ${TOTAL_QUESTIONS}</span>
    <h2 class="q-title">${q.title}</h2>
    <p class="q-hint">${q.hint}</p>
    <div class="opts" role="radiogroup"></div>
    <div class="step__nav">
      <button class="nav-btn" data-action="prev" ${i === 0 ? 'disabled' : ''}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 7H2M6 3L2 7l4 4"/></svg>
        Précédent
      </button>
      <button class="nav-btn nav-btn--primary" data-action="next" disabled>
        ${i === TOTAL_QUESTIONS - 1 ? 'Voir le bilan' : 'Suivant'}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
      </button>
    </div>
  `;
  const optsHost = step.querySelector('.opts');
  q.options.forEach((opt, oi) => {
    const btn = document.createElement('button');
    btn.className = 'opt';
    btn.type = 'button';
    btn.dataset.optIdx = oi;
    btn.innerHTML = `
      <span class="opt__num">${String.fromCharCode(65 + oi)}</span>
      <span class="opt__label">${opt.label}${opt.small ? `<small>${opt.small}</small>` : ''}</span>
      <svg class="opt__arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
    `;
    btn.addEventListener('click', () => selectOption(i, oi));
    optsHost.appendChild(btn);
  });
  step.querySelector('[data-action="prev"]').addEventListener('click', () => go(i - 1));
  step.querySelector('[data-action="next"]').addEventListener('click', () => go(i + 1));
  stepsEl.appendChild(step);
});

/* Contact step */
const contactStep = document.createElement('div');
contactStep.className = 'step contact-step';
contactStep.dataset.idx = TOTAL_QUESTIONS;
contactStep.innerHTML = `
  <span class="q-cat">§ Coordonnées</span><span class="q-num">étape finale</span>
  <h2 class="q-title">Vos coordonnées pour <i>recevoir le bilan</i>.</h2>
  <p class="q-hint">Vos réponses sont enregistrées de façon sécurisée pour permettre à Altos de vous recontacter avec un diagnostic utile. Le bilan reste téléchargeable immédiatement.</p>
  <div class="form-grid">
    <div class="field">
      <label for="firstName">Prénom</label>
      <input id="firstName" type="text" autocomplete="given-name" required />
    </div>
    <div class="field">
      <label for="lastName">Nom</label>
      <input id="lastName" type="text" autocomplete="family-name" required />
    </div>
    <div class="field field--full">
      <label for="email">Email professionnel</label>
      <input id="email" type="email" autocomplete="email" required />
    </div>
    <div class="field field--full">
      <label for="phone">Téléphone</label>
      <input id="phone" type="tel" autocomplete="tel" required />
    </div>
  </div>
  <p class="consent">${CONSENT_TEXT}</p>
  <div class="step__nav">
    <button class="nav-btn" data-action="prev">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 7H2M6 3L2 7l4 4"/></svg>
      Précédent
    </button>
    <button class="nav-btn nav-btn--primary" data-action="submit">
      Générer mon bilan
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
    </button>
  </div>
`;
contactStep.querySelector('[data-action="prev"]').addEventListener('click', () => go(TOTAL_QUESTIONS - 1));
contactStep.querySelector('[data-action="submit"]').addEventListener('click', submitContact);
stepsEl.appendChild(contactStep);

/* ─── INTERACTIONS ─────────────────────────── */
function selectOption(qIdx, oIdx) {
  state.answers[qIdx] = { optIdx: oIdx };
  const stepEl = document.querySelector(`.step[data-idx="${qIdx}"]`);
  stepEl.querySelectorAll('.opt').forEach(b => b.classList.remove('selected'));
  stepEl.querySelectorAll('.opt')[oIdx].classList.add('selected');
  stepEl.querySelector('[data-action="next"]').disabled = false;
}

function go(idx) {
  if (idx < 0 || idx > TOTAL_QUESTIONS) return;
  state.current = idx;
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const next = document.querySelector(`.step[data-idx="${idx}"]`);
  next.classList.add('active');
  updateProgress();
  // Scroll to top of quiz area (without scrollIntoView)
  const quizTop = document.getElementById('quiz').offsetTop - 100;
  window.scrollTo({ top: quizTop, behavior: 'smooth' });
}

function updateProgress() {
  const step = state.current + 1;
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  document.getElementById('qCurrent').textContent = step;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressPct').textContent = pct + ' %';
}

async function submitContact() {
  const fn = document.getElementById('firstName');
  const ln = document.getElementById('lastName');
  const em = document.getElementById('email');
  const ph = document.getElementById('phone');
  const submitBtn = document.querySelector('.contact-step [data-action="submit"]');
  let ok = true;
  [fn, ln, em, ph].forEach(input => {
    input.classList.remove('invalid');
    if (!input.value.trim()) { input.classList.add('invalid'); ok = false; }
  });
  if (em.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) {
    em.classList.add('invalid'); ok = false;
  }
  if (!ok) return;
  state.contact = {
    firstName: fn.value.trim(),
    lastName: ln.value.trim(),
    email: em.value.trim(),
    phone: ph.value.trim(),
  };

  const payload = buildAuditPayload();

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enregistrement...';
    }

    state.auditSubmission = await submitMicroAudit(payload);
    state.bilan = buildBilanFromApiResult(state.auditSubmission.result);
  } catch (error) {
    console.error(error);
    alert("Impossible d'enregistrer le micro-audit pour le moment. Veuillez reessayer dans quelques instants.");
    return;
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.originalText || 'Generer mon bilan';
    }
  }

  revealBilan();
}

function buildAuditPayload() {
  return {
    contact: state.contact,
    consentAccepted: true,
    consentText: CONSENT_TEXT,
    answers: state.answers.map((answer, index) => {
      const question = QUESTIONS[index];
      return {
        questionId: question.id,
        optionIndex: answer.optIdx,
      };
    }),
    source: 'micro_audit_web',
  };
}

function buildBilanFromApiResult(result) {
  if (!result || !Array.isArray(result.picks)) {
    throw new Error('Micro-audit API response is missing computed result.');
  }

  return {
    total: Number.isFinite(result.total) ? result.total : 0,
    axes: result.axes || {},
    topAxis: result.topAxis || 'admin',
    profileName: result.profileName || result.topAxis || 'Profil à qualifier',
    picks: result.picks.map((pick) => ({
      title: pick.title,
      desc: pick.desc || pick.description || '',
      stack: pick.stack || 'À cadrer',
      gain: pick.gain || 'Gain estimé',
    })),
    hoursPerWeek: Number.isFinite(result.hoursPerWeek)
      ? result.hoursPerWeek
      : 0,
    roi: result.roi || 'À qualifier',
    level: result.level,
    scoringVersion: result.scoringVersion,
  };
}

async function submitMicroAudit(payload) {
  const response = await fetch(`${API_BASE_URL}/micro-audits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Micro-audit API failed with ${response.status}: ${details}`);
  }

  return response.json();
}

function resolveApiUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/api') && API_BASE_URL.endsWith('/api')) {
    return `${API_BASE_URL}${path.slice('/api'.length)}`;
  }
  return path;
}

/* ─── REVEAL BILAN ─────────────────────────── */
function revealBilan() {
  const summary = state.bilan;
  if (!summary) return;
  const { total, axes, topAxis, picks, hoursPerWeek, roi } = summary;
  state.bilan = summary;

  document.getElementById('audit-app').classList.add('hidden');
  document.getElementById('progressWrap').classList.add('hidden');
  document.getElementById('quiz').classList.add('hidden');
  const bilan = document.getElementById('bilan');
  bilan.classList.remove('hidden');

  // Score & profile
  document.getElementById('scoreVal').textContent = total;
  document.getElementById('profileName').textContent = summary.profileName || topAxis;
  document.getElementById('bilanName').textContent = `${state.contact.firstName} ${state.contact.lastName}`;

  // Estimate
  document.getElementById('estimateHours').textContent = `~${hoursPerWeek} h / semaine sur 12 mois`;
  document.getElementById('estimateRoi').textContent = roi;

  // Heatmap
  const heatmapHost = document.getElementById('heatmap');
  heatmapHost.innerHTML = '';
  const heatRows = [
    { axis: 'admin', label: 'Tâches admin & doubles saisies', max: 6 },
    { axis: 'data', label: 'Centralisation & pilotage données', max: 6 },
    { axis: 'commercial', label: 'Commercial & production de contenus', max: 6 },
    { axis: 'documents', label: 'Synthèses documentaires', max: 3 },
    { axis: 'ia', label: 'Maturité IA actuelle', max: 3 },
    { axis: 'pain', label: 'Pression ressentie par le dirigeant', max: 3 },
  ];
  heatRows.forEach(r => {
    const val = axes[r.axis] || 0;
    const intensity = val / r.max; // 0..1
    const cellCount = r.max;
    let cells = '';
    for (let i = 0; i < cellCount; i++) {
      const filled = i < val;
      let lvl = 0;
      if (filled) {
        const pct = (i + 1) / cellCount;
        lvl = pct <= 0.34 ? 1 : pct <= 0.67 ? 2 : 3;
      }
      cells += `<div class="heat-row__cell ${filled ? 'on-' + lvl : ''}"></div>`;
    }
    heatmapHost.insertAdjacentHTML('beforeend', `
      <div class="heat-row">
        <div class="heat-row__label">${r.label}</div>
        <div class="heat-row__bar">${cells}</div>
      </div>
    `);
  });

  const qwHost = document.getElementById('quickwins');
  qwHost.innerHTML = '';
  picks.forEach((q, i) => {
    qwHost.insertAdjacentHTML('beforeend', `
      <div class="qw">
        <div class="qw__num">0${i + 1}</div>
        <div class="qw__body">
          <h4>${q.title}</h4>
          <p>${q.desc}</p>
          <div class="qw__stack">Stack typique — ${q.stack}</div>
        </div>
        <div class="qw__gain">${q.gain.split('/')[0]}<small>${q.gain.includes('/') ? q.gain.split('/').slice(1).join('/') : 'gain estimé'}</small></div>
      </div>
    `);
  });

  // Scroll to bilan
  window.scrollTo({ top: bilan.offsetTop - 70, behavior: 'smooth' });
}

/* ─── PDF EXPORT ───────────────────────────── */
document.getElementById('downloadPdf').addEventListener('click', downloadPdf);

function downloadPdf() {
  const pdfUrl = state.auditSubmission && state.auditSubmission.pdfUrl;
  if (pdfUrl) {
    window.location.href = resolveApiUrl(pdfUrl);
    return;
  }

  alert("Le PDF serveur n'est pas encore disponible. Veuillez reessayer dans quelques instants.");
}

/* ─── INIT ─────────────────────────────────── */
go(0);
updateProgress();

// Live clock in nav
const clock = document.getElementById('now');
function tick() {
  const d = new Date();
  const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (clock) clock.textContent = `FR · ${time}`;
}
tick(); setInterval(tick, 30000);
