/* ── Altos · audit express chatbot ──────────── */

(() => {
  const QUESTIONS = [
    {
      id: 'secteur',
      q: "Dans quel secteur évolue votre entreprise ?",
      hint: "ex. services à la personne, courtage, immobilier, conseil…",
      kind: 'text',
    },
    {
      id: 'taille',
      q: "Combien de collaborateurs ?",
      kind: 'choice',
      options: ["1-5", "6-20", "21-50", "51-200", "200+"],
    },
    {
      id: 'douleur',
      q: "Quelle est la tâche qui vous coûte le plus de temps aujourd'hui ?",
      hint: "ex. comptes rendus, prospection, reporting, devis, support client…",
      kind: 'text',
    },
    {
      id: 'volume',
      q: "À quelle fréquence cette tâche revient-elle ?",
      kind: 'choice',
      options: ["Quotidienne", "Plusieurs fois / semaine", "Hebdomadaire", "Mensuelle"],
    },
    {
      id: 'temps',
      q: "Combien d'heures par semaine y consacre votre équipe (total) ?",
      kind: 'choice',
      options: ["Moins de 5 h", "5 à 10 h", "10 à 20 h", "20 à 40 h", "Plus de 40 h"],
    },
    {
      id: 'outils',
      q: "Quels outils utilisez-vous déjà ?",
      hint: "ex. Excel, CRM, Notion, ChatGPT, n8n, aucun…",
      kind: 'text',
    },
    {
      id: 'maturite',
      q: "Quel est votre niveau de maturité IA / automatisation ?",
      kind: 'choice',
      options: [
        "Débutant — je découvre",
        "Curieux — j'expérimente seul·e",
        "Intermédiaire — usages réguliers d'IA générative",
        "Avancé — automatisations en production",
      ],
    },
    {
      id: 'contrainte',
      q: "Avez-vous des contraintes spécifiques ?",
      hint: "ex. données sensibles, RGPD strict, secteur régulé, budget limité…",
      kind: 'text',
    },
    {
      id: 'objectif',
      q: "Quel résultat espérez-vous obtenir dans les 3 mois ?",
      hint: "ex. -50 % de temps sur X, +30 leads qualifiés, autonomie d'une équipe…",
      kind: 'text',
    },
    {
      id: 'email',
      q: "Sur quel email envoyer votre rapport personnalisé ?",
      hint: "Vous le recevrez sous 24 h. Pas de spam, jamais.",
      kind: 'email',
    },
  ];

  const state = { step: 0, answers: {}, report: null };

  function $(sel, root=document) { return root.querySelector(sel); }

  function render() {
    const root = $('#audit-panel');
    if (!root) return;

    if (state.report) return renderReport();

    const q = QUESTIONS[state.step];
    const total = QUESTIONS.length;
    const pct = Math.round((state.step / total) * 100);

    root.innerHTML = `
      <div class="ap-progress"><div class="ap-progress-bar" style="width:${pct}%"></div></div>
      <div class="ap-step mono">Étape ${state.step + 1} / ${total}</div>
      <h3 class="ap-q">${q.q}</h3>
      ${q.hint ? `<p class="ap-hint">${q.hint}</p>` : ''}
      <div class="ap-input"></div>
      <div class="ap-controls">
        ${state.step > 0 ? '<button class="ap-back">← Précédent</button>' : '<span></span>'}
        <button class="ap-next btn btn-primary">Continuer →</button>
      </div>
    `;

    const inputWrap = $('.ap-input', root);
    if (q.kind === 'choice') {
      inputWrap.innerHTML = q.options.map((o, i) =>
        `<button class="ap-choice" data-val="${o.replace(/"/g, '&quot;')}">${o}</button>`
      ).join('');
      inputWrap.querySelectorAll('.ap-choice').forEach(btn => {
        if (state.answers[q.id] === btn.dataset.val) btn.classList.add('selected');
        btn.addEventListener('click', () => {
          inputWrap.querySelectorAll('.ap-choice').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          state.answers[q.id] = btn.dataset.val;
        });
      });
    } else {
      const type = q.kind === 'email' ? 'email' : 'text';
      const val = state.answers[q.id] || '';
      inputWrap.innerHTML = `<input type="${type}" class="ap-text" value="${val.replace(/"/g, '&quot;')}" placeholder="Votre réponse…" autofocus>`;
      const inp = $('.ap-text', inputWrap);
      inp.addEventListener('input', e => state.answers[q.id] = e.target.value);
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') next(); });
    }

    $('.ap-next', root).addEventListener('click', next);
    const back = $('.ap-back', root); if (back) back.addEventListener('click', prev);
  }

  function next() {
    const q = QUESTIONS[state.step];
    const v = state.answers[q.id];
    if (!v || (typeof v === 'string' && !v.trim())) {
      const inp = document.querySelector('#audit-panel .ap-text, #audit-panel .ap-choice');
      if (inp) inp.focus?.();
      flashError();
      return;
    }
    if (q.kind === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) { flashError(); return; }
    if (state.step < QUESTIONS.length - 1) { state.step++; render(); }
    else generate();
  }
  function prev() { if (state.step > 0) { state.step--; render(); } }
  function flashError() {
    const root = document.querySelector('#audit-panel .ap-q');
    if (!root) return;
    root.style.color = '#b34a1f';
    setTimeout(() => root.style.color = '', 700);
  }

  async function generate() {
    const root = $('#audit-panel');
    root.innerHTML = `
      <div class="ap-progress"><div class="ap-progress-bar" style="width:100%"></div></div>
      <div class="ap-step mono">Analyse en cours…</div>
      <h3 class="ap-q">Génération de votre rapport personnalisé</h3>
      <div class="ap-loading">
        <div class="ap-dot"></div><div class="ap-dot"></div><div class="ap-dot"></div>
      </div>
      <p class="ap-hint">Quelques secondes — nous analysons vos réponses et estimons votre ROI potentiel.</p>
    `;

    const a = state.answers;
    const prompt = `Tu es consultant IA senior chez ALTOS, agence digitale pluridisciplinaire spécialisée dans l'automatisation et l'IA pour PME. Tu réponds en français.

Voici les réponses d'un prospect à un audit express :
- Secteur : ${a.secteur}
- Taille : ${a.taille}
- Tâche la plus coûteuse : ${a.douleur}
- Fréquence : ${a.volume}
- Heures équipe / semaine sur cette tâche : ${a.temps}
- Outils actuels : ${a.outils}
- Maturité IA : ${a.maturite}
- Contraintes : ${a.contrainte}
- Objectif 3 mois : ${a.objectif}

Génère un rapport STRICTEMENT au format JSON suivant (pas de markdown, pas de \`\`\`, juste le JSON brut) :
{
  "diagnostic": "2-3 phrases qui synthétisent la situation et l'opportunité.",
  "gain_heures_an": <nombre estimé d'heures économisables sur 12 mois, entier>,
  "gain_euros_an": <valorisation en euros à 50€/h, entier>,
  "recommandations": [
    {"titre": "Recommandation 1 (max 8 mots)", "detail": "1-2 phrases concrètes."},
    {"titre": "Recommandation 2 (max 8 mots)", "detail": "1-2 phrases concrètes."},
    {"titre": "Recommandation 3 (max 8 mots)", "detail": "1-2 phrases concrètes."}
  ],
  "stack_proposee": ["outil 1", "outil 2", "outil 3"],
  "next_step": "1 phrase d'appel à l'action vers une mission ALTOS de 5 jours à 1 900€."
}

Sois précis, chiffré, jamais générique. Adapte au secteur et à la contrainte. Pas de remplissage.`;

    try {
      const text = await window.claude.complete(prompt);
      const json = JSON.parse(text.replace(/```json|```/g, '').trim());
      state.report = json;
      renderReport();
    } catch (e) {
      console.error(e);
      state.report = {
        diagnostic: "Nous avons bien reçu vos réponses. Un consultant ALTOS revient vers vous sous 24 h avec un rapport personnalisé.",
        gain_heures_an: null,
        gain_euros_an: null,
        recommandations: [],
        stack_proposee: [],
        next_step: "Réservez un créneau de 30 minutes pour échanger sur votre projet.",
        fallback: true,
      };
      renderReport();
    }
  }

  function renderReport() {
    const root = $('#audit-panel');
    const r = state.report;
    const hasNumbers = r.gain_heures_an && r.gain_euros_an;

    root.innerHTML = `
      <div class="ap-progress"><div class="ap-progress-bar" style="width:100%;background:#1a7a4a"></div></div>
      <div class="ap-step mono">Rapport prêt</div>
      <h3 class="ap-q">Votre audit express ALTOS</h3>
      <p class="ap-hint">Une version complète vous est envoyée à <b>${state.answers.email}</b> sous 24 h.</p>

      <div class="ap-report">
        <div class="ap-diag">${r.diagnostic}</div>

        ${hasNumbers ? `
          <div class="ap-stats">
            <div class="ap-stat">
              <div class="v">${r.gain_heures_an} <small>h/an</small></div>
              <div class="l">Gain de temps estimé</div>
            </div>
            <div class="ap-stat">
              <div class="v">${r.gain_euros_an.toLocaleString('fr-FR')} <small>€</small></div>
              <div class="l">Valorisation à 50 €/h</div>
            </div>
          </div>
        ` : ''}

        ${r.recommandations?.length ? `
          <h4 class="ap-h4">Recommandations prioritaires</h4>
          <ol class="ap-recos">
            ${r.recommandations.map(reco => `
              <li><b>${reco.titre}</b><span>${reco.detail}</span></li>
            `).join('')}
          </ol>
        ` : ''}

        ${r.stack_proposee?.length ? `
          <h4 class="ap-h4">Stack envisagée</h4>
          <div class="pill-row">
            ${r.stack_proposee.map(s => `<span class="pill">${s}</span>`).join('')}
          </div>
        ` : ''}

        <div class="ap-cta">
          <p>${r.next_step}</p>
          <a class="btn btn-primary" href="#contact">Réserver un échange →</a>
          <button class="ap-restart">Recommencer un audit</button>
        </div>
      </div>
    `;

    root.querySelector('.ap-restart').addEventListener('click', () => {
      state.step = 0; state.answers = {}; state.report = null; render();
    });
  }

  // ── boot
  function boot() {
    const trigger = document.querySelector('[data-audit-start]');
    if (!trigger) return;
    trigger.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector('#audit').scrollIntoView({behavior:'smooth', block:'start'});
      // we don't actually use scrollIntoView; using anchor instead
    });
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
