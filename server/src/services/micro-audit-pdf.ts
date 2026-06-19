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
  return {
    title: asText(value.title, `Quick win ${index + 1}`),
    desc: asText(value.desc || value.description),
    stack: asText(value.stack, 'À cadrer'),
    gain: asText(value.gain, 'Gain estimé'),
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
  const profileName = profiles[topAxis]?.name || topAxis;
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
  doc.text(profileName, 20, y + 50);

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
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setDrawColor(10, 10, 10);
    doc.setLineWidth(0.3);
    doc.rect(16, y, W - 32, 38);

    doc.setTextColor(255, 91, 20);
    doc.setFont('times', 'italic');
    doc.setFontSize(22);
    doc.text(`0${index + 1}`, 20, y + 14);

    doc.setTextColor(10, 10, 10);
    doc.setFont('times', 'normal');
    doc.setFontSize(13);
    doc.text(quickWin.title, 38, y + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);
    const descLines = doc.splitTextToSize(quickWin.desc, W - 60);
    doc.text(descLines, 38, y + 16);

    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(`STACK — ${quickWin.stack}`, 38, y + 33);

    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(10, 10, 10);
    const gainW = doc.getTextWidth(quickWin.gain);
    doc.text(quickWin.gain, W - 16 - gainW, y + 33);

    y += 44;
  });

  if (y > 250) {
    doc.addPage();
    y = 20;
  }
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
