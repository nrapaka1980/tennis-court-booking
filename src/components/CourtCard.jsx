import { getTimeSlots, formatTimeLabel } from "../utils/dates";

export default function CourtCard({ court, dateKey, bookings, currentUserId, onSlotClick }) {
  const slots = getTimeSlots();

  function getBookingFor(time) {
    return bookings.find(
      (b) => b.courtId === court.id && b.dateKey === dateKey && b.time === time
    );
  }

  return (
    <div className="court-card">
      <div className="court-card-header">
        <div>
          <h3>{court.name}</h3>
          <p className="court-meta">
            {court.venue} · {court.surface} · {court.indoor ? "Indoor" : "Outdoor"}
          </p>
        </div>
      </div>
      <div className="slot-grid">
        {slots.map((time) => {
          const booking = getBookingFor(time);
          const isMine = booking && booking.userId === currentUserId;
          const status = !booking ? "available" : isMine ? "mine" : "taken";
          return (
            <button
              key={time}
              className={`slot slot-${status}`}
              disabled={status === "taken"}
              onClick={() => onSlotClick(court, time, booking)}
              title={
                status === "taken"
                  ? `Booked by ${booking.bookedBy}`
                  : status === "mine"
                  ? "Your booking - click to cancel"
                  : "Available"
              }
            >
              {formatTimeLabel(time)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
