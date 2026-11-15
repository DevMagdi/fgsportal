export type Guest = { key: string; name: string; email: string };
export type GuestIssue = { key: string; field: 'name' | 'email'; code: 'requiredField' | 'invalidEmail' | 'duplicateGuest' };

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Laravel's attendee sync keys external guests by email, including null. */
export function validateGuests(guests: readonly Guest[]): GuestIssue[] {
  const issues: GuestIssue[] = [];
  const emails = new Set<string>();
  for (const guest of guests) {
    const name = guest.name.trim();
    const email = guest.email.trim().toLowerCase();
    if (!name && !email) issues.push({ key: guest.key, field: 'name', code: 'requiredField' });
    if (email && !emailPattern.test(email)) issues.push({ key: guest.key, field: 'email', code: 'invalidEmail' });
    else if ((email || name) && emails.has(email)) issues.push({ key: guest.key, field: 'email', code: 'duplicateGuest' });
    if (email || name) emails.add(email);
  }
  return issues;
}
