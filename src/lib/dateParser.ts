import {
  addDays,
  addMonths,
  addWeeks,
  nextDay,
  setDate,
  startOfDay,
  type Day,
} from "date-fns";

const WEEKDAYS: Record<string, Day> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const MONTHS: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

/** Best-effort natural-language date extraction, simulating an AI date parser. */
export function extractDate(text: string, from: Date = new Date()): { date: Date; matched: string } | null {
  const lower = text.toLowerCase();
  const today = startOfDay(from);

  if (/\btoday\b/.test(lower)) return { date: today, matched: "today" };
  if (/\btomorrow\b/.test(lower)) return { date: addDays(today, 1), matched: "tomorrow" };
  if (/\bnext week\b/.test(lower)) return { date: addWeeks(today, 1), matched: "next week" };
  if (/\bnext month\b/.test(lower)) return { date: addMonths(today, 1), matched: "next month" };

  const inDays = lower.match(/\bin (\d+) days?\b/);
  if (inDays) return { date: addDays(today, parseInt(inDays[1], 10)), matched: inDays[0] };

  const inWeeks = lower.match(/\bin (\d+) weeks?\b/);
  if (inWeeks) return { date: addWeeks(today, parseInt(inWeeks[1], 10)), matched: inWeeks[0] };

  const weekdayMatch = lower.match(
    /\b(next\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/
  );
  if (weekdayMatch) {
    const day = WEEKDAYS[weekdayMatch[2]];
    let date = nextDay(today, day);
    if (weekdayMatch[1]) date = addWeeks(date, 1);
    return { date, matched: weekdayMatch[0] };
  }

  // e.g. "oct 12", "october 12th", "12 oct", "oct 12 2026"
  const monthNames = Object.keys(MONTHS).join("|");
  const md = lower.match(
    new RegExp(`\\b(${monthNames})\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?\\b`)
  );
  if (md) {
    const month = MONTHS[md[1]];
    const day = parseInt(md[2], 10);
    const year = md[3] ? parseInt(md[3], 10) : today.getFullYear();
    let date = new Date(year, month, day);
    if (!md[3] && date < today) date = new Date(year + 1, month, day);
    return { date, matched: md[0] };
  }
  const dm = lower.match(
    new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${monthNames})(?:,?\\s+(\\d{4}))?\\b`)
  );
  if (dm) {
    const month = MONTHS[dm[2]];
    const day = parseInt(dm[1], 10);
    const year = dm[3] ? parseInt(dm[3], 10) : today.getFullYear();
    let date = new Date(year, month, day);
    if (!dm[3] && date < today) date = new Date(year + 1, month, day);
    return { date, matched: dm[0] };
  }

  // e.g. "on the 15th" / "the 5th" -> next occurrence of that day-of-month
  const nth = lower.match(/\b(?:on the|the|on)\s+(\d{1,2})(?:st|nd|rd|th)\b/);
  if (nth) {
    const day = parseInt(nth[1], 10);
    let date = setDate(today, day);
    if (date < today) date = setDate(addMonths(today, 1), day);
    return { date, matched: nth[0] };
  }

  // ISO or slash date
  const iso = lower.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (iso) {
    return {
      date: new Date(parseInt(iso[1], 10), parseInt(iso[2], 10) - 1, parseInt(iso[3], 10)),
      matched: iso[0],
    };
  }
  const slash = lower.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
  if (slash) {
    const month = parseInt(slash[1], 10) - 1;
    const day = parseInt(slash[2], 10);
    const year = slash[3]
      ? slash[3].length === 2
        ? 2000 + parseInt(slash[3], 10)
        : parseInt(slash[3], 10)
      : today.getFullYear();
    return { date: new Date(year, month, day), matched: slash[0] };
  }

  return null;
}
