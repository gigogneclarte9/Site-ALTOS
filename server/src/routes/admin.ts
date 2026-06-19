import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import type { FastifyInstance, FastifyReply } from 'fastify';
import { getPool, hasDatabase } from '../db/pool.js';
import {
  clearAdminSessionCookie,
  createAdminSession,
  requireAdminSession,
  setAdminSessionCookie,
  verifyCsrf,
} from '../services/admin-session.js';
import { verifyPassword } from '../services/passwords.js';
import { appVersion } from '../version.js';

const statuses = [
  ['new', 'Nouveau'],
  ['to_contact', 'À contacter'],
  ['contacted', 'Contacté'],
  ['meeting_booked', 'RDV pris'],
  ['won', 'Gagné'],
  ['lost', 'Perdu'],
] as const;

type AdminUserRow = {
  id: string;
  email: string;
  password_hash: string;
  role: string;
};

type LeadListRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  source: string;
  status: string;
  created_at: Date;
  score_total: number | null;
  top_axis: string | null;
  document_id: string | null;
  note_count: string;
};

type LeadListFilters = {
  q: string;
  status: string;
  source: string;
  page: number;
  pageSize: number;
};

type LeadListResult = {
  rows: LeadListRow[];
  total: number;
  sources: string[];
};

type LeadRow = LeadListRow & {
  consent_at: Date | null;
  consent_text: string | null;
};

type AuditRow = {
  id: string;
  answers: unknown;
  score_total: number;
  score_max: number;
  axes: unknown;
  top_axis: string | null;
  recommendations: unknown;
  roi: unknown;
  created_at: Date;
};

type DocumentRow = {
  id: string;
  original_filename: string | null;
  storage_path: string;
  mime_type: string;
  size_bytes: string | null;
  created_at: Date;
};

type LeadNoteRow = {
  body: string;
  created_at: Date;
  admin_email: string | null;
};

type LeadEventRow = {
  event_type: string;
  payload: unknown;
  created_at: Date;
};

type FormBody = Record<string, string | undefined>;

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formValue(body: unknown, key: string): string {
  if (!body || typeof body !== 'object') return '';
  const value = (body as FormBody)[key];
  return typeof value === 'string' ? value.trim() : '';
}

function formatDate(value: Date | string | null): string {
  if (!value) return 'Non renseigné';
  return new Date(value).toLocaleString('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function labelForStatus(status: string): string {
  return statuses.find(([value]) => value === status)?.[1] || status;
}

function leadListParams(filters: LeadListFilters, overrides: Partial<LeadListFilters> = {}): string {
  const next = { ...filters, ...overrides };
  const params = new URLSearchParams();
  if (next.q) params.set('q', next.q);
  if (next.status) params.set('status', next.status);
  if (next.source) params.set('source', next.source);
  if (next.page > 1) params.set('page', String(next.page));
  const query = params.toString();
  return query ? `?${query}` : '';
}

function csvValue(value: unknown): string {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function leadsToCsv(leads: LeadListRow[]): string {
  const headers = [
    'id',
    'prénom',
    'nom',
    'email',
    'téléphone',
    'source',
    'statut',
    'score',
    'axe_prioritaire',
    'document_id',
    'notes',
    'date_création',
  ];
  const rows = leads.map((lead) =>
    [
      lead.id,
      lead.first_name,
      lead.last_name,
      lead.email,
      lead.phone || '',
      lead.source,
      lead.status,
      lead.score_total ?? '',
      lead.top_axis || '',
      lead.document_id || '',
      lead.note_count,
      new Date(lead.created_at).toISOString(),
    ]
      .map(csvValue)
      .join(','),
  );

  return `${headers.map(csvValue).join(',')}\r\n${rows.join('\r\n')}\r\n`;
}

function jsonArray(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? (value as Array<Record<string, unknown>>) : [];
}

function jsonRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function adminLayout(title: string, body: string, sessionEmail?: string): string {
  const versionLabel = `Site v${appVersion.siteVersion} - Admin v${appVersion.adminVersion}`;

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} - ALTOS Admin</title>
  <style>
    :root { color-scheme: light; --ink:#151515; --muted:#6b6b6b; --line:#dedbd4; --paper:#fbfaf7; --accent:#ff5b14; --ok:#345c2c; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: var(--ink); background: var(--paper); }
    a { color: inherit; }
    .topbar { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px 24px; border-bottom:1px solid var(--line); background:#fff; position:sticky; top:0; z-index:1; }
    .brand { font-weight:700; letter-spacing:.04em; }
    .brand-block { display:grid; gap:3px; }
    .version-line { color:var(--muted); font-size:12px; }
    .topbar nav { display:flex; align-items:center; gap:12px; font-size:14px; }
    .topbar button, .button { border:1px solid var(--ink); background:#fff; color:var(--ink); padding:8px 11px; border-radius:6px; text-decoration:none; cursor:pointer; font:inherit; }
    .button--primary { background:var(--ink); color:#fff; }
    main { width:min(1180px, calc(100vw - 32px)); margin:28px auto 56px; }
    h1 { font-size:28px; margin:0 0 8px; }
    h2 { font-size:19px; margin:28px 0 12px; }
    p { color:var(--muted); line-height:1.5; }
    table { width:100%; border-collapse:collapse; background:#fff; border:1px solid var(--line); }
    th, td { padding:12px; border-bottom:1px solid var(--line); text-align:left; vertical-align:top; font-size:14px; }
    th { color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:.04em; background:#f4f1eb; }
    tr:last-child td { border-bottom:0; }
    .panel { background:#fff; border:1px solid var(--line); border-radius:8px; padding:18px; }
    .grid { display:grid; grid-template-columns: 1.1fr .9fr; gap:18px; align-items:start; }
    .meta { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:10px; }
    .meta div { padding:10px; background:#f6f3ed; border-radius:6px; }
    .meta b { display:block; font-size:12px; text-transform:uppercase; color:var(--muted); margin-bottom:4px; }
    .badge { display:inline-flex; align-items:center; padding:4px 8px; border-radius:999px; background:#eee8dc; font-size:12px; }
    .score { font-weight:700; color:var(--accent); }
    label { display:block; font-size:13px; font-weight:700; margin:12px 0 6px; }
    input, select, textarea { width:100%; padding:10px; border:1px solid var(--line); border-radius:6px; font:inherit; background:#fff; }
    textarea { min-height:100px; resize:vertical; }
    .actions { display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-top:12px; }
    .filters { display:grid; grid-template-columns: minmax(220px, 1fr) 180px 180px auto auto; gap:10px; align-items:end; margin:18px 0; }
    .filters label { margin-top:0; }
    .pagination { display:flex; justify-content:space-between; gap:12px; align-items:center; margin-top:14px; color:var(--muted); }
    .login { width:min(420px, calc(100vw - 32px)); margin:9vh auto; }
    .error { color:#8a1f11; background:#fff3ef; border:1px solid #ffd2c3; padding:10px; border-radius:6px; }
    .list { display:grid; gap:10px; }
    .item { border:1px solid var(--line); border-radius:8px; padding:12px; background:#fff; }
    .item small { color:var(--muted); }
    pre { white-space:pre-wrap; word-break:break-word; background:#f6f3ed; padding:12px; border-radius:6px; }
    @media (max-width: 850px) { .grid, .meta, .filters { grid-template-columns:1fr; } .topbar { align-items:flex-start; flex-direction:column; } }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="brand-block">
      <div class="brand">ALTOS Admin</div>
      <div class="version-line">${escapeHtml(versionLabel)}</div>
    </div>
    ${
      sessionEmail
        ? `<nav><a href="/admin/leads">Leads</a><span>${escapeHtml(sessionEmail)}</span><form method="post" action="/admin/logout"><button type="submit">Déconnexion</button></form></nav>`
        : ''
    }
  </header>
  <main>${body}</main>
</body>
</html>`;
}

function redirect(reply: FastifyReply, location: string): FastifyReply {
  return reply.code(303).header('Location', location).send();
}

function readQueryValue(query: unknown, key: string): string {
  if (!query || typeof query !== 'object') return '';
  const value = (query as Record<string, unknown>)[key];
  return typeof value === 'string' ? value.trim() : '';
}

function parsePage(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parseLeadListFilters(query: unknown): LeadListFilters {
  return {
    q: readQueryValue(query, 'q'),
    status: readQueryValue(query, 'status'),
    source: readQueryValue(query, 'source'),
    page: parsePage(readQueryValue(query, 'page')),
    pageSize: 50,
  };
}

function buildLeadListSearchParams(filters: LeadListFilters, includePagination: boolean): {
  whereSql: string;
  params: unknown[];
  limitOffsetSql: string;
} {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters.q) {
    params.push(`%${filters.q.toLowerCase()}%`);
    clauses.push(`(
      lower(l.first_name) like $${params.length}
      or lower(l.last_name) like $${params.length}
      or lower(l.email) like $${params.length}
      or coalesce(l.phone, '') like $${params.length}
    )`);
  }

  if (filters.status) {
    params.push(filters.status);
    clauses.push(`l.status = $${params.length}`);
  }

  if (filters.source) {
    params.push(filters.source);
    clauses.push(`l.source = $${params.length}`);
  }

  let limitOffsetSql = '';
  if (includePagination) {
    params.push(filters.pageSize);
    const limitIndex = params.length;
    params.push((filters.page - 1) * filters.pageSize);
    const offsetIndex = params.length;
    limitOffsetSql = `limit $${limitIndex} offset $${offsetIndex}`;
  }

  return {
    whereSql: clauses.length > 0 ? `where ${clauses.join(' and ')}` : '',
    params,
    limitOffsetSql,
  };
}

async function readLeadSources(): Promise<string[]> {
  const result = await getPool().query<{ source: string }>('select distinct source from leads order by source');
  return result.rows.map((row) => row.source);
}

async function renderLeadList(filters: LeadListFilters): Promise<LeadListResult> {
  const { whereSql, params, limitOffsetSql } = buildLeadListSearchParams(filters, true);
  const countParams = params.slice(0, params.length - 2);

  const [result, countResult, sources] = await Promise.all([
    getPool().query<LeadListRow>(
      `
    select
      l.id, l.first_name, l.last_name, l.email, l.phone, l.source, l.status, l.created_at,
      ma.score_total, ma.top_axis,
      d.id as document_id,
      (select count(*) from lead_notes n where n.lead_id = l.id) as note_count
    from leads l
    left join lateral (
      select id, score_total, top_axis
      from micro_audits
      where lead_id = l.id
      order by created_at desc
      limit 1
    ) ma on true
    left join documents d on d.micro_audit_id = ma.id and d.kind = 'micro_audit_pdf'
    ${whereSql}
    order by l.created_at desc
    ${limitOffsetSql}
    `,
      params,
    ),
    getPool().query<{ count: string }>(`select count(*) as count from leads l ${whereSql}`, countParams),
    readLeadSources(),
  ]);

  return {
    rows: result.rows,
    total: Number.parseInt(countResult.rows[0]?.count || '0', 10),
    sources,
  };
}

async function readLeadsForExport(filters: LeadListFilters): Promise<LeadListRow[]> {
  const { whereSql, params } = buildLeadListSearchParams(filters, false);
  const result = await getPool().query<LeadListRow>(
    `
    select
      l.id, l.first_name, l.last_name, l.email, l.phone, l.source, l.status, l.created_at,
      ma.score_total, ma.top_axis,
      d.id as document_id,
      (select count(*) from lead_notes n where n.lead_id = l.id) as note_count
    from leads l
    left join lateral (
      select id, score_total, top_axis
      from micro_audits
      where lead_id = l.id
      order by created_at desc
      limit 1
    ) ma on true
    left join documents d on d.micro_audit_id = ma.id and d.kind = 'micro_audit_pdf'
    ${whereSql}
    order by l.created_at desc
    limit 10000
    `,
    params,
  );
  return result.rows;
}

async function readLead(leadId: string): Promise<{
  lead: LeadRow | null;
  audit: AuditRow | null;
  documents: DocumentRow[];
  notes: LeadNoteRow[];
  events: LeadEventRow[];
}> {
  const [leadResult, auditResult, documentsResult, notesResult, eventsResult] = await Promise.all([
    getPool().query<LeadRow>('select * from leads where id = $1 limit 1', [leadId]),
    getPool().query<AuditRow>('select * from micro_audits where lead_id = $1 order by created_at desc limit 1', [
      leadId,
    ]),
    getPool().query<DocumentRow>(
      'select * from documents where lead_id = $1 order by created_at desc',
      [leadId],
    ),
    getPool().query<LeadNoteRow>(
      `
      select n.body, n.created_at, u.email as admin_email
      from lead_notes n
      left join admin_users u on u.id = n.admin_user_id
      where n.lead_id = $1
      order by n.created_at desc
      `,
      [leadId],
    ),
    getPool().query<LeadEventRow>(
      'select event_type, payload, created_at from lead_events where lead_id = $1 order by created_at desc limit 50',
      [leadId],
    ),
  ]);

  return {
    lead: leadResult.rows[0] || null,
    audit: auditResult.rows[0] || null,
    documents: documentsResult.rows,
    notes: notesResult.rows,
    events: eventsResult.rows,
  };
}

function renderRecommendations(audit: AuditRow | null): string {
  if (!audit) return '<p>Aucun micro-audit rattaché.</p>';
  const recommendations = jsonArray(audit.recommendations);
  if (recommendations.length === 0) return '<p>Aucune recommandation enregistrée.</p>';

  return `<div class="list">${recommendations
    .map(
      (recommendation) => `
        <div class="item">
          <strong>${escapeHtml(recommendation.title)}</strong>
          <p>${escapeHtml(recommendation.desc)}</p>
          <small>${escapeHtml(recommendation.stack)} ${recommendation.gain ? `- ${escapeHtml(recommendation.gain)}` : ''}</small>
        </div>
      `,
    )
    .join('')}</div>`;
}

function renderAnswers(audit: AuditRow | null): string {
  if (!audit) return '<p>Aucune réponse.</p>';
  const answers = jsonArray(audit.answers);
  if (answers.length === 0) return '<p>Aucune réponse enregistrée.</p>';

  return `<table>
    <thead><tr><th>Question</th><th>Réponse</th><th>Axe</th><th>Score</th></tr></thead>
    <tbody>
      ${answers
        .map(
          (answer) => `
          <tr>
            <td>${escapeHtml(answer.questionId)}</td>
            <td>${escapeHtml(answer.label)}</td>
            <td>${escapeHtml(answer.axis)}</td>
            <td class="score">${escapeHtml(answer.score)}</td>
          </tr>
        `,
        )
        .join('')}
    </tbody>
  </table>`;
}

function renderAxes(audit: AuditRow | null): string {
  if (!audit) return '<p>Aucun score.</p>';
  const axes = jsonRecord(audit.axes);
  return `<div class="meta">${Object.entries(axes)
    .map(([axis, value]) => `<div><b>${escapeHtml(axis)}</b>${escapeHtml(value)}</div>`)
    .join('')}</div>`;
}

export async function registerAdminRoutes(app: FastifyInstance): Promise<void> {
  app.get('/admin', async (_request, reply) => redirect(reply, '/admin/leads'));

  app.get('/admin/login', async (request, reply) => {
    const hasError = request.query && typeof request.query === 'object' && 'error' in request.query;
    return reply.type('text/html').send(
      adminLayout(
        'Connexion',
        `<section class="login panel">
          <h1>Connexion admin</h1>
          <p>Accès réservé à l'exploitation commerciale ALTOS.</p>
          ${hasError ? '<div class="error">Identifiants invalides.</div>' : ''}
          <form method="post" action="/admin/login">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" autocomplete="username" required />
            <label for="password">Mot de passe</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required />
            <div class="actions"><button class="button button--primary" type="submit">Se connecter</button></div>
          </form>
        </section>`,
      ),
    );
  });

  app.post('/admin/login', async (request, reply) => {
    if (!hasDatabase()) return reply.code(503).send('Database not configured');

    const email = formValue(request.body, 'email').toLowerCase();
    const password = formValue(request.body, 'password');
    const result = await getPool().query<AdminUserRow>(
      'select id, email, password_hash, role from admin_users where lower(email) = lower($1) limit 1',
      [email],
    );
    const user = result.rows[0];
    const ok = user ? await verifyPassword(password, user.password_hash) : false;
    if (!ok || !user) return redirect(reply, '/admin/login?error=1');

    const token = createAdminSession({
      adminId: user.id,
      email: user.email,
      role: user.role,
    });
    setAdminSessionCookie(reply, token);
    return redirect(reply, '/admin/leads');
  });

  app.post('/admin/logout', async (_request, reply) => {
    clearAdminSessionCookie(reply);
    return redirect(reply, '/admin/login');
  });

  app.get('/admin/leads', async (request, reply) => {
    const session = requireAdminSession(request, reply);
    if (!session) return reply;
    if (!hasDatabase()) return reply.code(503).send('Database not configured');

    const filters = parseLeadListFilters(request.query);
    const leadList = await renderLeadList(filters);
    const totalPages = Math.max(1, Math.ceil(leadList.total / filters.pageSize));
    const rows = leadList.rows
      .map(
        (lead) => `
        <tr>
          <td><a href="/admin/leads/${lead.id}">${escapeHtml(lead.first_name)} ${escapeHtml(lead.last_name)}</a><br><small>${escapeHtml(lead.email)}</small></td>
          <td><span class="badge">${escapeHtml(labelForStatus(lead.status))}</span></td>
          <td class="score">${lead.score_total ?? '-'}${lead.score_total !== null ? ' / 30' : ''}<br><small>${escapeHtml(lead.top_axis || '')}</small></td>
          <td>${escapeHtml(lead.source)}<br><small>${formatDate(lead.created_at)}</small></td>
          <td>${escapeHtml(lead.note_count)}</td>
          <td>${lead.document_id ? `<a href="/admin/documents/${lead.document_id}/download">PDF</a>` : '-'}</td>
        </tr>
      `,
      )
      .join('');

    const statusOptions = statuses
      .map(([value, label]) => `<option value="${value}" ${filters.status === value ? 'selected' : ''}>${label}</option>`)
      .join('');
    const sourceOptions = leadList.sources
      .map((source) => `<option value="${escapeHtml(source)}" ${filters.source === source ? 'selected' : ''}>${escapeHtml(source)}</option>`)
      .join('');
    const pagination =
      leadList.total > 0
        ? `
        <div class="pagination">
          <span>Page ${filters.page} / ${totalPages}</span>
          <div class="actions">
            ${filters.page > 1 ? `<a class="button" href="/admin/leads${leadListParams(filters, { page: filters.page - 1 })}">Précédent</a>` : ''}
            ${filters.page < totalPages ? `<a class="button" href="/admin/leads${leadListParams(filters, { page: filters.page + 1 })}">Suivant</a>` : ''}
          </div>
        </div>`
        : '';

    return reply.type('text/html').send(
      adminLayout(
        'Leads',
        `<h1>Leads micro-audit</h1>
        <p>${leadList.total} lead${leadList.total > 1 ? 's' : ''} correspondant${leadList.total > 1 ? 's' : ''}.</p>
        <form class="filters" method="get" action="/admin/leads">
          <div>
            <label for="q">Recherche</label>
            <input id="q" name="q" value="${escapeHtml(filters.q)}" placeholder="Nom, email, téléphone" />
          </div>
          <div>
            <label for="status">Statut</label>
            <select id="status" name="status">
              <option value="">Tous</option>
              ${statusOptions}
            </select>
          </div>
          <div>
            <label for="source">Source</label>
            <select id="source" name="source">
              <option value="">Toutes</option>
              ${sourceOptions}
            </select>
          </div>
          <button class="button button--primary" type="submit">Filtrer</button>
          <a class="button" href="/admin/leads">Réinitialiser</a>
        </form>
        <div class="actions">
          <a class="button" href="/admin/leads/export.csv${leadListParams(filters, { page: 1 })}">Exporter CSV</a>
        </div>
        <table>
          <thead><tr><th>Contact</th><th>Statut</th><th>Score</th><th>Source</th><th>Notes</th><th>PDF</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="6">Aucun lead pour le moment.</td></tr>'}</tbody>
        </table>
        ${pagination}`,
        session.email,
      ),
    );
  });

  app.get('/admin/leads/export.csv', async (request, reply) => {
    const session = requireAdminSession(request, reply);
    if (!session) return reply;
    if (!hasDatabase()) return reply.code(503).send('Database not configured');

    const filters = parseLeadListFilters(request.query);
    const leads = await readLeadsForExport(filters);
    const csv = leadsToCsv(leads);
    const filename = `altos-leads-${new Date().toISOString().slice(0, 10)}.csv`;

    return reply
      .type('text/csv; charset=utf-8')
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .send(csv);
  });

  app.get<{ Params: { id: string } }>('/admin/leads/:id', async (request, reply) => {
    const session = requireAdminSession(request, reply);
    if (!session) return reply;
    if (!hasDatabase()) return reply.code(503).send('Database not configured');

    const { lead, audit, documents, notes, events } = await readLead(request.params.id);
    if (!lead) return reply.code(404).type('text/html').send(adminLayout('Lead introuvable', '<h1>Lead introuvable</h1>', session.email));

    const documentLinks = documents
      .map(
        (document) => `
        <div class="item">
          <strong>${escapeHtml(document.original_filename || document.id)}</strong><br>
          <small>${escapeHtml(document.mime_type)} - ${escapeHtml(document.size_bytes || '?')} octets - ${formatDate(document.created_at)}</small>
          <div class="actions"><a class="button" href="/admin/documents/${document.id}/download">Télécharger</a></div>
        </div>
      `,
      )
      .join('');

    const noteList = notes
      .map(
        (note) => `
        <div class="item">
          <small>${formatDate(note.created_at)} - ${escapeHtml(note.admin_email || 'admin')}</small>
          <div>${escapeHtml(note.body)}</div>
        </div>
      `,
      )
      .join('');

    const eventList = events
      .map(
        (event) => `
        <div class="item">
          <strong>${escapeHtml(event.event_type)}</strong><br>
          <small>${formatDate(event.created_at)}</small>
          <pre>${escapeHtml(JSON.stringify(event.payload, null, 2))}</pre>
        </div>
      `,
      )
      .join('');

    return reply.type('text/html').send(
      adminLayout(
        `${lead.first_name} ${lead.last_name}`,
        `<div class="grid">
          <section class="panel">
            <h1>${escapeHtml(lead.first_name)} ${escapeHtml(lead.last_name)}</h1>
            <p>${escapeHtml(lead.email)}${lead.phone ? ` - ${escapeHtml(lead.phone)}` : ''}</p>
            <div class="meta">
              <div><b>Statut</b>${escapeHtml(labelForStatus(lead.status))}</div>
              <div><b>Source</b>${escapeHtml(lead.source)}</div>
              <div><b>Création</b>${formatDate(lead.created_at)}</div>
              <div><b>Consentement</b>${formatDate(lead.consent_at)}</div>
            </div>

            <h2>Changer le statut</h2>
            <form method="post" action="/admin/leads/${lead.id}/status">
              <input type="hidden" name="csrf" value="${escapeHtml(session.csrf)}" />
              <select name="status">
                ${statuses.map(([value, label]) => `<option value="${value}" ${value === lead.status ? 'selected' : ''}>${label}</option>`).join('')}
              </select>
              <div class="actions"><button class="button button--primary" type="submit">Mettre à jour</button></div>
            </form>

            <h2>Ajouter une note</h2>
            <form method="post" action="/admin/leads/${lead.id}/notes">
              <input type="hidden" name="csrf" value="${escapeHtml(session.csrf)}" />
              <textarea name="body" required></textarea>
              <div class="actions"><button class="button button--primary" type="submit">Ajouter</button></div>
            </form>
          </section>

          <aside class="panel">
            <h2>Micro-audit</h2>
            ${
              audit
                ? `<div class="meta">
                    <div><b>Score</b><span class="score">${audit.score_total} / ${audit.score_max}</span></div>
                    <div><b>Axe prioritaire</b>${escapeHtml(audit.top_axis || 'Non renseigné')}</div>
                    <div><b>Date</b>${formatDate(audit.created_at)}</div>
                  </div>`
                : '<p>Aucun audit.</p>'
            }
            <h2>PDF</h2>
            <div class="list">${documentLinks || '<p>Aucun document.</p>'}</div>
          </aside>
        </div>

        <section class="panel">
          <h2>Axes</h2>
          ${renderAxes(audit)}
          <h2>Quick wins</h2>
          ${renderRecommendations(audit)}
          <h2>Réponses</h2>
          ${renderAnswers(audit)}
        </section>

        <div class="grid">
          <section class="panel">
            <h2>Notes internes</h2>
            <div class="list">${noteList || '<p>Aucune note.</p>'}</div>
          </section>
          <section class="panel">
            <h2>Journal</h2>
            <div class="list">${eventList || '<p>Aucun événement.</p>'}</div>
          </section>
        </div>`,
        session.email,
      ),
    );
  });

  app.post<{ Params: { id: string } }>('/admin/leads/:id/status', async (request, reply) => {
    const session = requireAdminSession(request, reply);
    if (!session) return reply;
    if (!verifyCsrf(request, session)) return reply.code(403).send('Invalid CSRF token');

    const status = formValue(request.body, 'status');
    if (!statuses.some(([value]) => value === status)) return reply.code(400).send('Invalid status');

    const client = await getPool().connect();
    try {
      await client.query('begin');
      const before = await client.query<{ status: string }>('select status from leads where id = $1 for update', [
        request.params.id,
      ]);
      if (!before.rows[0]) {
        await client.query('rollback');
        return reply.code(404).send('Lead not found');
      }
      await client.query('update leads set status = $1, updated_at = now() where id = $2', [status, request.params.id]);
      await client.query('insert into lead_events (id, lead_id, event_type, payload) values ($1, $2, $3, $4::jsonb)', [
        randomUUID(),
        request.params.id,
        'status_changed',
        JSON.stringify({ from: before.rows[0].status, to: status, adminUserId: session.adminId }),
      ]);
      await client.query('commit');
      return redirect(reply, `/admin/leads/${request.params.id}`);
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }
  });

  app.post<{ Params: { id: string } }>('/admin/leads/:id/notes', async (request, reply) => {
    const session = requireAdminSession(request, reply);
    if (!session) return reply;
    if (!verifyCsrf(request, session)) return reply.code(403).send('Invalid CSRF token');

    const body = formValue(request.body, 'body');
    if (!body) return reply.code(400).send('Note body is required');

    const client = await getPool().connect();
    try {
      await client.query('begin');
      await client.query('insert into lead_notes (id, lead_id, admin_user_id, body) values ($1, $2, $3, $4)', [
        randomUUID(),
        request.params.id,
        session.adminId,
        body,
      ]);
      await client.query('insert into lead_events (id, lead_id, event_type, payload) values ($1, $2, $3, $4::jsonb)', [
        randomUUID(),
        request.params.id,
        'note_added',
        JSON.stringify({ adminUserId: session.adminId }),
      ]);
      await client.query('commit');
      return redirect(reply, `/admin/leads/${request.params.id}`);
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }
  });

  app.get<{ Params: { id: string } }>('/admin/documents/:id/download', async (request, reply) => {
    const session = requireAdminSession(request, reply);
    if (!session) return reply;

    const result = await getPool().query<DocumentRow & { lead_id: string | null }>(
      `
      select id, lead_id, original_filename, storage_path, mime_type, size_bytes, created_at
      from documents
      where id = $1 and kind = 'micro_audit_pdf' and is_public = false
      limit 1
      `,
      [request.params.id],
    );
    const document = result.rows[0];
    if (!document) return reply.code(404).send('Document not found');

    try {
      await access(document.storage_path);
      const fileStats = await stat(document.storage_path);
      if (document.lead_id) {
        await getPool().query('insert into lead_events (id, lead_id, event_type, payload) values ($1, $2, $3, $4::jsonb)', [
          randomUUID(),
          document.lead_id,
          'document_downloaded_admin',
          JSON.stringify({ documentId: document.id, adminUserId: session.adminId }),
        ]);
      }

      reply
        .type(document.mime_type)
        .header('Content-Length', String(fileStats.size))
        .header('Content-Disposition', `attachment; filename="${escapeHtml(document.original_filename || 'document.pdf')}"`);
      return reply.send(createReadStream(document.storage_path));
    } catch {
      return reply.code(404).send('Document file not found');
    }
  });
}
