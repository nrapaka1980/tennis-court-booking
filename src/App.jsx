import { useEffect, useState } from "react";
import { authClient } from "./authClient";
import { getNextDays } from "./utils/dates";
import { getCourts, getBookings, createBooking, cancelBooking } from "./api";
import AuthGate from "./components/AuthGate";
import Header from "./components/Header";
import DateStrip from "./components/DateStrip";
import CourtCard from "./components/CourtCard";
import BookingModal from "./components/BookingModal";
import MyBookings from "./components/MyBookings";
import "./App.css";

export default function App() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [courts, setCourts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState("book");
  const [selectedDateKey, setSelectedDateKey] = useState(getNextDays(1)[0].key);
  const [pending, setPending] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const [courtsData, bookingsData] = await Promise.all([getCourts(), getBookings()]);
        if (cancelled) return;
        setCourts(courtsData);
        setBookings(bookingsData);
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (sessionPending) {
    return <div className="empty-state">Loading…</div>;
  }

  if (!session) {
    return <AuthGate />;
  }

  function handleSlotClick(court, time, existingBooking) {
    setActionError(null);
    if (existingBooking) {
      if (existingBooking.userId !== userId) return;
      setPending({ mode: "cancel", court, dateKey: selectedDateKey, time, booking: existingBooking });
    } else {
      setPending({ mode: "book", court, dateKey: selectedDateKey, time });
    }
  }

  async function handleConfirm() {
    if (!pending) return;
    setActionError(null);
    try {
      if (pending.mode === "book") {
        const newBooking = await createBooking({
          courtId: pending.court.id,
          dateKey: pending.dateKey,
          time: pending.time,
        });
        setBookings((prev) => [...prev, newBooking]);
      } else if (pending.mode === "cancel") {
        await cancelBooking(pending.booking.id);
        setBookings((prev) => prev.filter((b) => b.id !== pending.booking.id));
      }
      setPending(null);
    } catch (err) {
      setActionError(err.message);
      setPending(null);
    }
  }

  function handleCancelBookingFromList(booking) {
    setActionError(null);
    const court = courts.find((c) => c.id === booking.courtId) ?? {
      name: "Court",
      venue: "",
    };
    setPending({
      mode: "cancel",
      court,
      dateKey: booking.dateKey,
      time: booking.time,
      booking,
    });
  }

  return (
    <div className="app">
      <Header
        userName={session.user.name}
        onSignOut={() => authClient.signOut()}
        view={view}
        onChangeView={setView}
      />

      <main className="app-main">
        {actionError && <div className="banner banner-error">{actionError}</div>}

        {loading ? (
          <div className="empty-state">Loading courts…</div>
        ) : loadError ? (
          <div className="empty-state">Couldn't reach the server: {loadError}</div>
        ) : view === "book" ? (
          <>
            <DateStrip selectedDateKey={selectedDateKey} onSelect={setSelectedDateKey} />
            <div className="court-list">
              {courts.map((court) => (
                <CourtCard
                  key={court.id}
                  court={court}
                  dateKey={selectedDateKey}
                  bookings={bookings}
                  currentUserId={userId}
                  onSlotClick={handleSlotClick}
                />
              ))}
            </div>
          </>
        ) : (
          <MyBookings
            bookings={bookings}
            courts={courts}
            currentUserId={userId}
            onCancel={handleCancelBookingFromList}
          />
        )}
      </main>

      <BookingModal
        pending={pending}
        onConfirm={handleConfirm}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
