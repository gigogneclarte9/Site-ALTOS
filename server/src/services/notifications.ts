import type { FastifyBaseLogger } from 'fastify';
import nodemailer from 'nodemailer';
import { config } from '../config.js';

type MicroAuditNotificationBody = {
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  score: {
    total: number;
    max?: number;
    topAxis?: string;
  };
  recommendations?: Array<Record<string, unknown>>;
  source?: string;
};

type SendMicroAuditNotificationInput = {
  auditId: string;
  leadId: string;
  pdfUrl: string;
  body: MicroAuditNotificationBody;
  logger: FastifyBaseLogger;
};

function isNotificationConfigured(): boolean {
  return Boolean(config.smtpHost && config.notificationTo);
}

function asText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function buildRecommendationLines(recommendations: Array<Record<string, unknown>> | undefined): string {
  if (!recommendations || recommendations.length === 0) return '- Aucune recommandation transmise';

  return recommendations
    .slice(0, 5)
    .map((recommendation, index) => {
      const title = asText(recommendation.title) || `Recommandation ${index + 1}`;
      const gain = asText(recommendation.gain);
      return `- ${title}${gain ? ` (${gain})` : ''}`;
    })
    .join('\n');
}

export async function sendMicroAuditNotification({
  auditId,
  leadId,
  pdfUrl,
  body,
  logger,
}: SendMicroAuditNotificationInput): Promise<void> {
  if (!isNotificationConfigured()) {
    logger.info({ auditId }, 'Micro-audit notification skipped: SMTP is not configured');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth:
      config.smtpUser && config.smtpPass
        ? {
            user: config.smtpUser,
            pass: config.smtpPass,
          }
        : undefined,
  });

  const contactName = `${body.contact.firstName} ${body.contact.lastName}`.trim();
  const subject = `[ALTOS] Nouveau micro-audit - ${contactName || body.contact.email}`;
  const text = [
    'Nouveau micro-audit soumis.',
    '',
    `Lead : ${leadId}`,
    `Audit : ${auditId}`,
    `Source : ${body.source || 'micro_audit'}`,
    '',
    'Contact',
    `Nom : ${contactName}`,
    `Email : ${body.contact.email}`,
    `Telephone : ${body.contact.phone || 'non renseigne'}`,
    '',
    'Score',
    `Total : ${body.score.total} / ${body.score.max || 30}`,
    `Axe prioritaire : ${body.score.topAxis || 'non renseigne'}`,
    '',
    'Quick wins',
    buildRecommendationLines(body.recommendations),
    '',
    `PDF : ${pdfUrl}`,
  ].join('\n');

  await transporter.sendMail({
    from: config.notificationFrom || config.smtpUser || config.notificationTo,
    to: config.notificationTo,
    subject,
    text,
  });

  logger.info({ auditId, leadId }, 'Micro-audit notification sent');
}
