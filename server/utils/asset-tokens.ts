import crypto from 'crypto';

export function generateAssetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateSignedAssetUrl(savedItemId: string, token: string, baseUrl: string): string {
  return `${baseUrl}/api/assets/${savedItemId}?token=${token}`;
}

export function getAssetExpiryDate(daysFromNow: number = 90): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + daysFromNow);
  return expiry;
}
