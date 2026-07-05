import { formatDateKeyLong, formatTimeLabel } from "../utils/dates";

export default function BookingModal({ pending, onConfirm, onCancel }) {
  if (!pending) return null;
  const { court, dateKey, time, mode } = pending;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {mode === "book" ? (
          <>
            <h2>Confirm booking</h2>
            <p>
              <strong>{court.name}</strong> at {court.venue}
            </p>
            <p>
              {formatDateKeyLong(dateKey)} &middot; {formatTimeLabel(time)}
            </p>
            <div className="modal-actions">
              <button className="secondary" onClick={onCancel}>
                Cancel
              </button>
              <button className="primary" onClick={onConfirm}>
                Book Court
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Cancel booking?</h2>
            <p>
              <strong>{court.name}</strong> at {court.venue}
            </p>
            <p>
              {formatDateKeyLong(dateKey)} &middot; {formatTimeLabel(time)}
            </p>
            <div className="modal-actions">
              <button className="secondary" onClick={onCancel}>
                Keep booking
              </button>
              <button className="danger" onClick={onConfirm}>
                Cancel Booking
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
