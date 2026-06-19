import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { config, isProduction } from '../config.js';

export type AdminSession = {
  adminId: string;
  email: string;
  role: string;
  csrf: string;
  exp: number;
};

const cookieName = 'altos_admin_session';
const maxAgeSeconds = 60 * 60 * 8;

function base64urlJson(value: unknown): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
}

function sign(payload: string): string {
  return createHmac('sha256', config.adminSessionSecret).update(payload).digest('base64url');
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=');
        if (index === -1) return [part, ''];
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

function readFormValue(body: unknown, key: string): string {
  if (!body || typeof body !== 'object') return '';
  const value = (body as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : '';
}

export function createAdminSession(input: Omit<AdminSession, 'csrf' | 'exp'>): string {
  const session: AdminSession = {
    ...input,
    csrf: randomBytes(18).toString('base64url'),
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };
  const payload = base64urlJson(session);
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expectedSignature = sign(payload);
  const expected = Buffer.from(expectedSignature);
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AdminSession;
    if (!session.adminId || !session.email || !session.role || !session.csrf || !session.exp) return null;
    if (session.exp < Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

export function readAdminSession(request: FastifyRequest): AdminSession | null {
  const cookies = parseCookies(request.headers.cookie);
  return verifyAdminSessionToken(cookies[cookieName]);
}

export function setAdminSessionCookie(reply: FastifyReply, token: string): void {
  const attributes = [
    `${cookieName}=${encodeURIComponent(token)}`,
    'Path=/admin',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (isProduction) attributes.push('Secure');
  reply.header('Set-Cookie', attributes.join('; '));
}

export function clearAdminSessionCookie(reply: FastifyReply): void {
  const attributes = [`${cookieName}=`, 'Path=/admin', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
  if (isProduction) attributes.push('Secure');
  reply.header('Set-Cookie', attributes.join('; '));
}

export function requireAdminSession(request: FastifyRequest, reply: FastifyReply): AdminSession | null {
  const session = readAdminSession(request);
  if (!session) {
    reply.redirect('/admin/login');
    return null;
  }
  return session;
}

export function verifyCsrf(request: FastifyRequest, session: AdminSession): boolean {
  return readFormValue(request.body, 'csrf') === session.csrf;
}
