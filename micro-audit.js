/* ─────────────────────────────────────────────
   ALTOS · Micro-audit 3 minutes
   10 questions → bilan express + PDF
   ───────────────────────────────────────────── */

const API_BASE_URL = window.ALTOS_API_BASE_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://127.0.0.1:3001/api'
    : '/api'
);

const CONSENT_TEXT = "En soumettant ce formulaire, vous acceptez d'etre recontacte par Altos sous 48h ouvrees. Donnees conservees 12 mois, non revendues. Droit a l'effacement sur demande a bonjour@altos.fr.";

const QUESTIONS = [
  {
    id: 'admin_hours',
    cat: 'Temps & opérations',
    title: "Combien d'heures par semaine votre équipe passe-t-elle sur des <i>tâches administratives répétitives</i> ?",
    hint: "Relances, ressaisies, exports, mises à jour de tableurs, reporting manuel. Comptez large : ce qui revient chaque semaine.",
    options: [
      { label: "Moins de 5 h", score: 0 },
      { label: "Entre 5 et 15 h", score: 1 },
      { label: "Entre 15 et 30 h", score: 2 },
      { label: "Plus de 30 h", small: "(le sujet vous étouffe)", score: 3 },
    ],
    axis: 'admin',
  },
  {
    id: 'data_resaisie',
    cat: 'Données & doubles saisies',
    title: "À quelle fréquence votre équipe doit-elle <i>ressaisir les mêmes données</i> dans plusieurs outils ?",
    hint: "Devis dans un outil, facture dans un autre, CRM à mettre à jour à la main, exports Excel pour la compta...",
    options: [
      { label: "Jamais ou presque", score: 0 },
      { label: "Occasionnellement", score: 1 },
      { label: "Toutes les semaines", score: 2 },
      { label: "Tous les jours", small: "(plusieurs fois par jour)", score: 3 },
    ],
    axis: 'admin',
  },
  {
    id: 'data_central',
    cat: 'Données & visibilité',
    title: "Vos données <i>clients & commerciales</i> sont-elles centralisées dans un outil unique ?",
    hint: "Un seul endroit qui fait foi pour les contacts, l'historique, les opportunités, le pipeline...",
    options: [
      { label: "Oui, tout est dans un CRM unique", score: 0 },
      { label: "Réparties entre 2-3 outils connectés", score: 1 },
      { label: "Surtout Excel et boîtes mail", score: 2 },
      { label: "Aucun outil dédié", small: "(la mémoire, les fichiers, le téléphone)", score: 3 },
    ],
    axis: 'data',
  },
  {
    id: 'dashboard',
    cat: 'Pilotage & visibilité',
    title: "Disposez-vous d'un <i>tableau de bord temps réel</i> (CA, marge, trésorerie, KPI métier) ?",
    hint: "Un dashboard que vous consultez quand vous voulez, et qui se met à jour sans intervention humaine.",
    options: [
      { label: "Oui, à jour en continu", score: 0 },
      { label: "Construit à la main chaque mois", score: 1 },
      { label: "Reporting ponctuel à la demande", score: 2 },
      { label: "Aucun — je pilote au feeling", score: 3 },
    ],
    axis: 'data',
  },
  {
    id: 'prospect',
    cat: 'Commercial & croissance',
    title: "Comment <i>qualifiez-vous vos prospects</i> aujourd'hui ?",
    hint: "Sourcing, scoring, premier contact, relances. À quel point ces étapes sont-elles automatisées ?",
    options: [
      { label: "Sourcing & qualification 100 % manuels", score: 3 },
      { label: "Un mix manuel + quelques outils", score: 2 },
      { label: "Une partie est automatisée", score: 1 },
      { label: "Pipeline largement automatisé", small: "(scoring, relances, enrichissement)", score: 0 },
    ],
    axis: 'commercial',
  },
  {
    id: 'content',
    cat: 'Production & visibilité',
    title: "Sur la <i>production de contenus</i> (réseaux sociaux, newsletter, site)...",
    hint: "Régularité, organisation, autonomie de l'équipe à produire et publier.",
    options: [
      { label: "On publie régulièrement, process huilé", score: 0 },
      { label: "Quand on a le temps — irrégulier", score: 2 },
      { label: "Un freelance ou une agence s'en occupe", score: 1 },
      { label: "On ne publie pas / plus", small: "(faute de temps ou de ligne éditoriale)", score: 3 },
    ],
    axis: 'commercial',
  },
  {
    id: 'docs',
    cat: 'Documentaire & synthèse',
    title: "Vos comptes rendus, courriers et <i>synthèses de documents</i> sont produits...",
    hint: "Réunions, mails clients, analyses de devis, lecture de PLU ou de contrats, rédaction de notes internes...",
    options: [
      { label: "À la main par les équipes", score: 3 },
      { label: "Avec quelques modèles Word", score: 2 },
      { label: "Avec une transcription IA ou Notion AI", score: 1 },
      { label: "Workflow IA dédié déjà en place", score: 0 },
    ],
    axis: 'documents',
  },
  {
    id: 'ia_maturity',
    cat: 'Maturité IA',
    title: "Où en êtes-vous avec l'<i>IA</i> (ChatGPT, Copilot, agents...) ?",
    hint: "Usage réel en production, pas juste curiosité personnelle.",
    options: [
      { label: "Jamais testé", score: 3 },
      { label: "Quelques essais individuels", score: 2 },
      { label: "Déployé sur un cas précis", score: 1 },
      { label: "Plusieurs cas d'usage en production", score: 0 },
    ],
    axis: 'ia',
  },
  {
    id: 'blocker',
    cat: 'Freins perçus',
    title: "Quel est le <i>frein principal</i> à l'automatisation chez vous ?",
    hint: "Soyez honnête — ce qui bloque vraiment dans la pratique.",
    options: [
      { label: "Le temps : on n'arrive pas à s'y mettre", score: 3 },
      { label: "La compétence : personne en interne", score: 3 },
      { label: "Le coût : on hésite à investir", score: 2 },
      { label: "L'utilité : pas sûr du ROI", score: 2 },
      { label: "Le RGPD / la sécurité des données", score: 1 },
    ],
    axis: 'blocker',
  },
  {
    id: 'pain',
    cat: 'Pression dirigeant',
    title: "À quel point votre <i>dirigeant·e</i> ressent un goulot d'étranglement opérationnel ?",
    hint: "Sentiment quotidien : journée fragmentée, sujets repoussés, fatigue décisionnelle.",
    options: [
      { label: "Faible — on tient bien", score: 0 },
      { label: "Modéré — gérable", score: 1 },
      { label: "Important — ça pèse", score: 2 },
      { label: "Critique — étouffement quotidien", score: 3 },
    ],
    axis: 'pain',
  },
];

const TOTAL_QUESTIONS = QUESTIONS.length;
const TOTAL_STEPS = TOTAL_QUESTIONS + 1; // + contact form

const state = {
  answers: new Array(TOTAL_QUESTIONS).fill(null), // store score per question
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
    btn.dataset.score = opt.score;
    btn.dataset.optIdx = oi;
    btn.innerHTML = `
      <span class="opt__num">${String.fromCharCode(65 + oi)}</span>
      <span class="opt__label">${opt.label}${opt.small ? `<small>${opt.small}</small>` : ''}</span>
      <svg class="opt__arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
    `;
    btn.addEventListener('click', () => selectOption(i, oi, opt.score));
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
function selectOption(qIdx, oIdx, score) {
  state.answers[qIdx] = { optIdx: oIdx, score };
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

  const summary = buildBilanSummary();
  const payload = buildAuditPayload(summary);

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enregistrement...';
    }

    state.auditSubmission = await submitMicroAudit(payload);
    state.bilan = summary;
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

/* ─── SCORING ─────────────────────────────── */
function computeScore() {
  const axes = { admin: 0, data: 0, commercial: 0, documents: 0, ia: 0, pain: 0, blocker: 0 };
  let total = 0;
  state.answers.forEach((a, i) => {
    if (!a) return;
    total += a.score;
    const axis = QUESTIONS[i].axis;
    axes[axis] = (axes[axis] || 0) + a.score;
  });
  // Profile: highest axis among actionable ones
  const actionable = ['admin', 'data', 'commercial', 'documents'];
  let topAxis = actionable[0], topVal = -1;
  actionable.forEach(k => { if (axes[k] > topVal) { topAxis = k; topVal = axes[k]; } });
  return { total, axes, topAxis };
}

const PROFILES = {
  admin:      { name: "Écrasé par l'administratif",       short: "Profil Admin" },
  data:       { name: "Pilotage à l'aveugle",             short: "Profil Données" },
  commercial: { name: "Moteur commercial à friction",     short: "Profil Commercial" },
  documents:  { name: "Surcharge documentaire",           short: "Profil Documents" },
};

const QUICKWIN_LIB = {
  admin: {
    title: "Automatiser les tâches admin & doubles saisies",
    desc: "Connecter vos outils (CRM, compta, planning) via n8n pour supprimer les ressaisies. Cible : relances devis, exports comptables, suivi de planning, rapprochement bancaire.",
    stack: "n8n · Airtable · Looker Studio",
    gain: "8–12 h / mois récupérées",
  },
  data: {
    title: "Centraliser & visualiser les données clés",
    desc: "Mise en place d'un hub de données (Supabase, Airtable ou Sheets connecté) et d'un tableau de bord temps réel sur CA, marge, trésorerie et indicateurs métier critiques.",
    stack: "Airtable / Supabase · Looker Studio · n8n",
    gain: "Décisions x2 plus rapides",
  },
  commercial: {
    title: "Agent IA de qualification commerciale",
    desc: "Scraping ciblé + scoring sémantique des prospects, enrichissement automatique, alertes Telegram / Slack. Le commercial reçoit des opportunités qualifiées, plus du sourcing à faire.",
    stack: "Apify · n8n · ChatGPT · Airtable",
    gain: "−60 à −70 % temps sourcing",
  },
  documents: {
    title: "Studio IA pour comptes rendus & synthèses",
    desc: "Transcription automatique des réunions, génération de comptes rendus structurés, analyse rapide de documents complexes (devis, contrats, PLU, RGPD).",
    stack: "Noota · Gemini Gems · n8n · OpenAI",
    gain: "1h → 15 min par CR",
  },
  ia: {
    title: "Acculturation IA + premier cas d'usage",
    desc: "Atelier de cadrage 1 jour + déploiement d'un premier assistant IA métier (mails, rédaction, recherche interne). Transfert d'autonomie complet à l'équipe.",
    stack: "ChatGPT Team · Claude · Gems · prompts métier",
    gain: "Maturité IA en 4 semaines",
  },
  content: {
    title: "Studio social no-code (multi-canal)",
    desc: "Interface de génération + planification de contenus Meta / LinkedIn / Newsletter. Une personne non technique pilote toute la production hebdomadaire.",
    stack: "Lovable · Claude / GPT · Buffer / Meta API",
    gain: "30 min → 3 min par publication",
  },
};

function buildBilanSummary() {
  const { total, axes, topAxis } = computeScore();
  const hoursPerWeek = Math.round(total * 0.8);
  let roi = "+150 à +300 %";
  if (total >= 18) roi = "+400 à +700 %";
  else if (total >= 12) roi = "+250 à +450 %";

  const picks = [];
  picks.push(QUICKWIN_LIB[topAxis]);

  if (state.answers[5] && state.answers[5].score >= 2 && topAxis !== 'commercial') {
    picks.push(QUICKWIN_LIB.content);
  } else {
    const ordered = ['admin', 'data', 'commercial', 'documents']
      .filter(k => k !== topAxis)
      .sort((a, b) => (axes[b] || 0) - (axes[a] || 0));
    picks.push(QUICKWIN_LIB[ordered[0]]);
  }

  if (state.answers[7] && state.answers[7].score >= 2) {
    picks.push(QUICKWIN_LIB.ia);
  } else {
    const remaining = ['admin', 'data', 'commercial', 'documents']
      .filter(k => !picks.some(p => p === QUICKWIN_LIB[k]))
      .sort((a, b) => (axes[b] || 0) - (axes[a] || 0));
    if (remaining[0]) picks.push(QUICKWIN_LIB[remaining[0]]);
  }

  return { total, axes, topAxis, picks: picks.slice(0, 3), hoursPerWeek, roi };
}

function buildAuditPayload(summary) {
  return {
    contact: state.contact,
    consentAccepted: true,
    consentText: CONSENT_TEXT,
    answers: state.answers.map((answer, index) => {
      const question = QUESTIONS[index];
      const option = question.options[answer.optIdx];
      return {
        questionId: question.id,
        optionIndex: answer.optIdx,
        score: answer.score,
        label: option.label,
        axis: question.axis,
      };
    }),
    score: {
      total: summary.total,
      max: 30,
      axes: summary.axes,
      topAxis: summary.topAxis,
    },
    recommendations: summary.picks.map((pick) => ({
      title: pick.title,
      desc: pick.desc,
      stack: pick.stack,
      gain: pick.gain,
    })),
    roi: {
      label: summary.roi,
      hoursPerWeek: summary.hoursPerWeek,
    },
    source: 'micro_audit_web',
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
  const summary = state.bilan || buildBilanSummary();
  const { total, axes, topAxis, picks, hoursPerWeek, roi } = summary;
  state.bilan = summary;

  document.getElementById('audit-app').classList.add('hidden');
  document.getElementById('progressWrap').classList.add('hidden');
  document.getElementById('quiz').classList.add('hidden');
  const bilan = document.getElementById('bilan');
  bilan.classList.remove('hidden');

  // Score & profile
  document.getElementById('scoreVal').textContent = total;
  document.getElementById('profileName').textContent = PROFILES[topAxis].name;
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

  generatePdf();
}

function generatePdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, H = 297;
  let y = 0;

  // ── COVER STRIP ──
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, W, 95, 'F');

  doc.setTextColor(255, 91, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('ALTOS · MICRO-AUDIT 3 MIN · BILAN EXPRESS', 16, 16);

  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'normal');
  doc.setFontSize(34);
  const titleLines = doc.splitTextToSize('Vos gisements d\u2019automatisation identifiés.', W - 32);
  doc.text(titleLines, 16, 38);

  doc.setFontSize(10);
  doc.setTextColor(217, 255, 60);
  doc.text(`Établi pour ${state.contact.firstName} ${state.contact.lastName}`, 16, 78);
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(8);
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`${dateStr}  ·  ${state.contact.email}  ·  ${state.contact.phone}`, 16, 86);

  y = 110;

  // ── SCORE CARD ──
  doc.setDrawColor(10, 10, 10);
  doc.setLineWidth(0.4);
  doc.rect(16, y, 80, 56);

  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('SCORE D\u2019OPPORTUNITÉ', 20, y + 7);

  doc.setTextColor(255, 91, 20);
  doc.setFont('times', 'italic');
  doc.setFontSize(58);
  doc.text(String(state.bilan.total), 20, y + 38);
  doc.setFontSize(14);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.text(' / 30', 60, y + 38);

  doc.setTextColor(10, 10, 10);
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.text(PROFILES[state.bilan.topAxis].name, 20, y + 50);

  // ── ESTIMATE BOX ──
  doc.rect(100, y, 94, 56);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('GAIN POTENTIEL ESTIMÉ', 104, y + 7);

  doc.setTextColor(10, 10, 10);
  doc.setFont('times', 'italic');
  doc.setFontSize(20);
  doc.text(`~${state.bilan.hoursPerWeek} h / semaine`, 104, y + 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('récupérables sur les 12 prochains mois', 104, y + 30);

  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('ROI TYPIQUE (MISSIONS ÉQUIVALENTES)', 104, y + 42);
  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(255, 91, 20);
  doc.text(state.bilan.roi, 104, y + 52);

  y += 70;

  // ── HEATMAP ──
  doc.setTextColor(255, 91, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('§ 01 — CARTOGRAPHIE DES FRICTIONS', 16, y);
  doc.setTextColor(10, 10, 10);
  doc.setFont('times', 'normal');
  doc.setFontSize(16);
  doc.text('Vos zones de friction.', 16, y + 8);

  y += 16;
  const heatRows = [
    { axis: 'admin', label: 'Tâches admin & doubles saisies', max: 6 },
    { axis: 'data', label: 'Centralisation & pilotage', max: 6 },
    { axis: 'commercial', label: 'Commercial & contenus', max: 6 },
    { axis: 'documents', label: 'Synthèses documentaires', max: 3 },
    { axis: 'ia', label: 'Maturité IA actuelle', max: 3 },
    { axis: 'pain', label: 'Pression dirigeant', max: 3 },
  ];
  heatRows.forEach(r => {
    const val = state.bilan.axes[r.axis] || 0;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text(r.label, 16, y + 4);

    const startX = 110, cellW = 11, cellH = 5, gap = 1.5;
    for (let i = 0; i < r.max; i++) {
      const filled = i < val;
      let color = [226, 226, 226];
      if (filled) {
        const pct = (i + 1) / r.max;
        if (pct <= 0.34) color = [217, 255, 60];
        else if (pct <= 0.67) color = [255, 206, 71];
        else color = [255, 91, 20];
      }
      doc.setFillColor(...color);
      doc.rect(startX + i * (cellW + gap), y, cellW, cellH, 'F');
    }
    y += 8;
  });

  y += 6;

  // ── QUICK WINS ──
  if (y > 240) { doc.addPage(); y = 20; }
  doc.setTextColor(255, 91, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('§ 02 — RECOMMANDATIONS', 16, y);
  doc.setTextColor(10, 10, 10);
  doc.setFont('times', 'normal');
  doc.setFontSize(16);
  doc.text('Trois quick wins prioritaires.', 16, y + 8);
  y += 16;

  state.bilan.picks.forEach((q, i) => {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setDrawColor(10, 10, 10);
    doc.setLineWidth(0.3);
    doc.rect(16, y, W - 32, 38);

    doc.setTextColor(255, 91, 20);
    doc.setFont('times', 'italic');
    doc.setFontSize(22);
    doc.text(`0${i + 1}`, 20, y + 14);

    doc.setTextColor(10, 10, 10);
    doc.setFont('times', 'normal');
    doc.setFontSize(13);
    doc.text(q.title, 38, y + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);
    const descLines = doc.splitTextToSize(q.desc, W - 60);
    doc.text(descLines, 38, y + 16);

    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(`STACK — ${q.stack}`, 38, y + 33);

    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(10, 10, 10);
    const gainText = q.gain;
    const gainW = doc.getTextWidth(gainText);
    doc.text(gainText, W - 16 - gainW, y + 33);

    y += 44;
  });

  // ── CTA FOOTER ──
  if (y > 250) { doc.addPage(); y = 20; }
  y += 4;
  doc.setFillColor(10, 10, 10);
  doc.rect(16, y, W - 32, 32, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'normal');
  doc.setFontSize(14);
  doc.text('Discutons trente minutes.', 22, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(200, 200, 200);
  doc.text('Diagnostic offert, sans engagement. cal.com/nicolas-darcos-uldxct/30min', 22, y + 22);
  doc.setTextColor(217, 255, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('BONJOUR@ALTOS.FR', W - 22 - doc.getTextWidth('BONJOUR@ALTOS.FR'), y + 22);

  // ── PAGE FOOTER ──
  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'normal');
    doc.text(`ALTOS · Groupement d\u2019experts \u2014 Bilan généré le ${dateStr}`, 16, H - 8);
    doc.text(`${p} / ${pages}`, W - 16 - doc.getTextWidth(`${p} / ${pages}`), H - 8);
  }

  const safeName = `${state.contact.lastName}-${state.contact.firstName}`.replace(/[^a-z0-9\-]/gi, '').toLowerCase();
  doc.save(`altos-bilan-${safeName || 'audit'}.pdf`);
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
