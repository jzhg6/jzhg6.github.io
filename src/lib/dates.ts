const longDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const monthFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "long",
  timeZone: "UTC",
});

export function parseDate(value: string) {
  return new Date(`${value}T12:00:00.000Z`);
}

export function formatDate(value: string) {
  return longDateFormatter.format(parseDate(value));
}

export function formatShortDate(value: string) {
  const [, month, day] = value.split("-");
  return `${month}.${day}`;
}

export function formatMonth(month: number) {
  return monthFormatter.format(new Date(Date.UTC(2024, month - 1, 1)));
}

export function isFutureDate(value: string, now = new Date()) {
  return value > now.toISOString().slice(0, 10);
}
