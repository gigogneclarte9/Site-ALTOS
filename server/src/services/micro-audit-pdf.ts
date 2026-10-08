import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { jsPDF } from 'jspdf';

type MicroAuditPdfBody = {
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  answers: Array<{
    questionId: string;
    score: number;
    label?: string;
    axis?: string;
  }>;
  score: {
    total: number;
    max?: number;
    axes?: Record<string, number>;
    topAxis?: string;
    level?: string;
    profileName?: string;
    scoringVersion?: string;
  };
  recommendations?: Array<Record<string, unknown>>;
  roi?: Record<string, unknown>;
};

type GeneratedPdf = {
  filename: string;
  storagePath: string;
  mimeType: 'application/pdf';
  sizeBytes: number;
  checksumSha256: string;
};

type GenerateMicroAuditPdfInput = {
  auditId: string;
  body: MicroAuditPdfBody;
  outputDir: string;
};

type QuickWin = {
  title: string;
  desc: string;
  stack: string;
  gain: string;
};

const profiles: Record<string, { name: string }> = {
  admin: { name: "Écrasé par l'administratif" },
  data: { name: "Pilotage à l'aveugle" },
  commercial: { name: 'Moteur commercial à friction' },
  documents: { name: 'Surcharge documentaire' },
};

function asText(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
}

function toQuickWin(value: Record<string, unknown>, index: number): QuickWin {
  // Core PDF fonts do not contain Unicode arrows or the mathematical minus.
  const pdfText = (text: string) => text.replace(/[−–‑]/g, '-').replace(/→/g, '=>');
  return {
    title: pdfText(asText(value.title, `Quick win ${index + 1}`)),
    desc: pdfText(asText(value.desc || value.description)),
    stack: pdfText(asText(value.stack, 'À cadrer')),
    gain: pdfText(asText(value.gain, 'Gain estimé')),
  };
}

function safeFilenamePart(value: string): string {
  return value.replace(/[^a-z0-9-]/gi, '').toLowerCase();
}

export async function generateMicroAuditPdf({
  auditId,
  body,
  outputDir,
}: GenerateMicroAuditPdfInput): Promise<GeneratedPdf> {
  const createdAt = new Date();
  const subDir = path.join(
    'micro-audits',
    String(createdAt.getFullYear()),
    String(createdAt.getMonth() + 1).padStart(2, '0'),
  );
  const absoluteDir = path.resolve(outputDir, subDir);
  await mkdir(absoluteDir, { recursive: true });

  const safeName =
    safeFilenamePart(`${body.contact.lastName}-${body.contact.firstName}`) || auditId;
  const filename = `altos-bilan-${safeName}.pdf`;
  const storagePath = path.join(absoluteDir, filename);

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210;
  const H = 297;
  let y = 0;

  const topAxis = body.score.topAxis || 'admin';
  const profileName = asText(body.score.profileName, profiles[topAxis]?.name || topAxis);
  const hoursPerWeek = asText(body.roi?.hoursPerWeek, '?');
  const roi = asText(body.roi?.label, 'À qualifier');
  const picks = (body.recommendations || []).slice(0, 3).map(toQuickWin);
  const dateStr = createdAt.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, W, 95, 'F');

  doc.setTextColor(255, 91, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('ALTOS · MICRO-AUDIT 3 MIN · BILAN EXPRESS', 16, 16);

  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'normal');
  doc.setFontSize(34);
  const titleLines = doc.splitTextToSize("Vos gisements d’automatisation identifiés.", W - 32);
  doc.text(titleLines, 16, 38);

  doc.setFontSize(10);
  doc.setTextColor(217, 255, 60);
  doc.text(`Établi pour ${body.contact.firstName} ${body.contact.lastName}`, 16, 78);
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(8);
  doc.text(
    `${dateStr}  ·  ${body.contact.email}  ·  ${body.contact.phone || ''}`,
    16,
    86,
  );

  y = 110;

  doc.setDrawColor(10, 10, 10);
  doc.setLineWidth(0.4);
  doc.rect(16, y, 80, 56);

  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('SCORE D’OPPORTUNITÉ', 20, y + 7);

  doc.setTextColor(255, 91, 20);
  doc.setFont('times', 'italic');
  doc.setFontSize(58);
  doc.text(String(body.score.total), 20, y + 38);
  doc.setFontSize(14);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.text(` / ${body.score.max || 30}`, 60, y + 38);

  doc.setTextColor(10, 10, 10);
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.text(doc.splitTextToSize(profileName, 72), 20, y + 47);

  doc.rect(100, y, 94, 56);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('GAIN POTENTIEL ESTIMÉ', 104, y + 7);

  doc.setTextColor(10, 10, 10);
  doc.setFont('times', 'italic');
  doc.setFontSize(20);
  doc.text(`~${hoursPerWeek} h / semaine`, 104, y + 22);
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
  doc.text(roi, 104, y + 52);

  y += 70;

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

  heatRows.forEach((row) => {
    const value = body.score.axes?.[row.axis] || 0;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text(row.label, 16, y + 4);

    const startX = 110;
    const cellW = 11;
    const cellH = 5;
    const gap = 1.5;
    for (let i = 0; i < row.max; i += 1) {
      const filled = i < value;
      let color: [number, number, number] = [226, 226, 226];
      if (filled) {
        const pct = (i + 1) / row.max;
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

  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  doc.setTextColor(255, 91, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('§ 02 — RECOMMANDATIONS', 16, y);
  doc.setTextColor(10, 10, 10);
  doc.setFont('times', 'normal');
  doc.setFontSize(16);
  doc.text('Trois quick wins prioritaires.', 16, y + 8);
  y += 16;

  picks.forEach((quickWin, index) => {
    const textX = 38;
    const right = W - 22;
    const textWidth = right - textX;
    doc.setFont('times', 'normal');
    doc.setFontSize(13);
    const titleLines = doc.splitTextToSize(quickWin.title, textWidth);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const descLines = doc.splitTextToSize(quickWin.desc, textWidth);
    doc.setFontSize(7);
    const stackLines = doc.splitTextToSize(`STACK — ${quickWin.stack}`, 88);
    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    const gainLines = doc.splitTextToSize(quickWin.gain, textWidth - 94);
    const descOffset = 9 + titleLines.length * 5.3 + 2;
    const metaOffset = descOffset + descLines.length * 3.8 + 5;
    const cardHeight = Math.max(38, metaOffset + Math.max(stackLines.length * 3.2, gainLines.length * 4.2) + 5);
    if (y + cardHeight > H - 20) {
      doc.addPage();
      y = 20;
    }
    doc.setDrawColor(10, 10, 10);
    doc.setLineWidth(0.3);
    doc.rect(16, y, W - 32, cardHeight);

    doc.setTextColor(255, 91, 20);
    doc.setFont('times', 'italic');
    doc.setFontSize(22);
    doc.text(`0${index + 1}`, 20, y + 14);

    doc.setTextColor(10, 10, 10);
    doc.setFont('times', 'normal');
    doc.setFontSize(13);
    doc.text(titleLines, textX, y + 9, { lineHeightFactor: 1.15 });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);
    doc.text(descLines, textX, y + descOffset, { lineHeightFactor: 1.25 });

    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(stackLines, textX, y + metaOffset, { lineHeightFactor: 1.25 });

    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(10, 10, 10);
    doc.text(gainLines, right, y + metaOffset, { align: 'right', lineHeightFactor: 1.15 });

    y += cardHeight + 6;
  });

  if (y + 44 > H - 20) {
    doc.addPage();
    y = 20;
  }
  y += 4;
  doc.setFillColor(10, 10, 10);
  doc.rect(16, y, W - 32, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'normal');
  doc.setFontSize(14);
  doc.text('Discutons trente minutes.', 22, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(200, 200, 200);
  doc.text('Diagnostic offert, sans engagement.', 22, y + 22);
  doc.setFontSize(8);
  doc.textWithLink('cal.com/nicolas-darcos-uldxct/30min', 22, y + 32, {
    url: 'https://cal.com/nicolas-darcos-uldxct/30min',
  });
  doc.setTextColor(217, 255, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  const contactEmail = 'hello@altos-experts.fr';
  doc.textWithLink(contactEmail, W - 22 - doc.getTextWidth(contactEmail), y + 32, {
    url: `mailto:${contactEmail}`,
  });

  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p += 1) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'normal');
    doc.text(`ALTOS · Groupement d’experts — Bilan généré le ${dateStr}`, 16, H - 8);
    doc.text(`${p} / ${pages}`, W - 16 - doc.getTextWidth(`${p} / ${pages}`), H - 8);
  }

  const pdfBytes = Buffer.from(doc.output('arraybuffer'));
  await writeFile(storagePath, pdfBytes);

  const fileStats = await stat(storagePath);
  const fileBytes = await readFile(storagePath);
  const checksumSha256 = createHash('sha256').update(fileBytes).digest('hex');

  return {
    filename,
    storagePath,
    mimeType: 'application/pdf',
    sizeBytes: fileStats.size,
    checksumSha256,
  };
}
