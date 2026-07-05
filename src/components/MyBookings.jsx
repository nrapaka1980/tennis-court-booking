import { formatDateKeyLong, formatTimeLabel } from "../utils/dates";

export default function MyBookings({ bookings, courts, currentUserId, onCancel }) {
  const mine = bookings
    .filter((b) => b.userId === currentUserId)
    .sort((a, b) => (a.dateKey + a.time).localeCompare(b.dateKey + b.time));

  if (mine.length === 0) {
    return (
      <div className="empty-state">
        <p>You don't have any bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="booking-list">
      {mine.map((booking) => {
        const court = courts.find((c) => c.id === booking.courtId);
        return (
          <div key={booking.id} className="booking-item">
            <div>
              <h3>{court ? court.name : "Unknown court"}</h3>
              <p className="court-meta">{court ? court.venue : ""}</p>
              <p>
                {formatDateKeyLong(booking.dateKey)} &middot;{" "}
                {formatTimeLabel(booking.time)}
              </p>
            </div>
            <button className="danger" onClick={() => onCancel(booking)}>
              Cancel
            </button>
          </div>
        );
      })}
    </div>
  );
}
