function escapeVCardValue(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function createVCard(input: {
  displayName: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  title?: string | null;
  note?: string | null;
  url?: string | null;
}) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCardValue(input.displayName)}`,
    `N:${escapeVCardValue(input.displayName)};;;;`,
  ];

  if (input.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(input.email)}`);
  }

  if (input.phone) {
    lines.push(`TEL;TYPE=CELL:${escapeVCardValue(input.phone)}`);
  }

  if (input.company) {
    lines.push(`ORG:${escapeVCardValue(input.company)}`);
  }

  if (input.title) {
    lines.push(`TITLE:${escapeVCardValue(input.title)}`);
  }

  if (input.url) {
    lines.push(`URL:${escapeVCardValue(input.url)}`);
  }

  if (input.note) {
    lines.push(`NOTE:${escapeVCardValue(input.note)}`);
  }

  lines.push("END:VCARD");

  return `${lines.join("\r\n")}\r\n`;
}

export function getVCardFilename(username: string) {
  return `${username.replace(/[^a-z0-9-]/gi, "-").toLowerCase() || "contact"}.vcf`;
}
