import type { Locale } from "@/config/i18n";

export function parseDate(value: string) {
  return new Date(`${value}T12:00:00.000Z`);
}

export function formatDate(value: string, locale: Locale = "zh") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parseDate(value));
}

export function formatShortDate(value: string) {
  const [, month, day] = value.split("-");
  return `${month}.${day}`;
}

export function formatMonth(month: number, locale: Locale = "zh") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", {
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2024, month - 1, 1)));
}

export function isFutureDate(value: string, now = new Date()) {
  return value > now.toISOString().slice(0, 10);
}
