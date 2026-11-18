export function maskEmail(email: string): string {
  const [local = '', domain = ''] = email.split('@');
  return `${local.slice(0, 1)}***@${domain}`;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 4 ? `***-***-${digits.slice(-4)}` : '***';
}

export function maskMemberId(id: string): string {
  if (id.length <= 4) return '****';
  return `${id.slice(0, 2)}${'*'.repeat(id.length - 4)}${id.slice(-2)}`;
}

export function initials(first: string, last: string): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export function fullName(p: { firstName: string; lastName: string }): string {
  return `${p.firstName} ${p.lastName}`;
}
