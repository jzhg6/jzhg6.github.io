import { t, type Locale } from "@/config/i18n";

interface YearNavProps {
  years: number[];
  activeYear: number | null;
  onChange: (year: number | null) => void;
  locale: Locale;
}

export function YearNav({ years, activeYear, onChange, locale }: YearNavProps) {
  return (
    <div className="year-nav" aria-label={t(locale).blog.year}>
      <button type="button" aria-pressed={activeYear === null} onClick={() => onChange(null)}>
        {t(locale).blog.allYears}
      </button>
      {years.map((year) => (
        <button key={year} type="button" aria-pressed={activeYear === year} onClick={() => onChange(year)}>
          {year}
        </button>
      ))}
    </div>
  );
}
