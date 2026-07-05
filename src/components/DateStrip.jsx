import { getNextDays } from "../utils/dates";

export default function DateStrip({ selectedDateKey, onSelect }) {
  const days = getNextDays(7);

  return (
    <div className="date-strip">
      {days.map((day) => (
        <button
          key={day.key}
          className={
            day.key === selectedDateKey ? "date-pill active" : "date-pill"
          }
          onClick={() => onSelect(day.key)}
        >
          <span className="date-pill-label">{day.label}</span>
          <span className="date-pill-num">{day.dayOfMonth}</span>
          {day.isToday && <span className="date-pill-today">Today</span>}
        </button>
      ))}
    </div>
  );
}
