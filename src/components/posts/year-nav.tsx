interface YearNavProps {
  years: number[];
  activeYear: number | null;
  onChange: (year: number | null) => void;
}

export function YearNav({ years, activeYear, onChange }: YearNavProps) {
  return (
    <div className="year-nav" aria-label="按年份筛选">
      <button
        type="button"
        aria-pressed={activeYear === null}
        onClick={() => onChange(null)}
      >
        全部年份
      </button>
      {years.map((year) => (
        <button
          key={year}
          type="button"
          aria-pressed={activeYear === year}
          onClick={() => onChange(year)}
        >
          {year}
        </button>
      ))}
    </div>
  );
}
