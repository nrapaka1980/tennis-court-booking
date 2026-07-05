export default function Header({ userName, onSignOut, view, onChangeView }) {
  return (
    <header className="app-header">
      <div className="app-header-top">
        <h1>🎾 Court Booker</h1>
        <div className="user-badge">
          <span>Hi, {userName}</span>
          <button className="link-button" onClick={onSignOut}>
            sign out
          </button>
        </div>
      </div>
      <nav className="tabs">
        <button
          className={view === "book" ? "tab active" : "tab"}
          onClick={() => onChangeView("book")}
        >
          Book a Court
        </button>
        <button
          className={view === "my-bookings" ? "tab active" : "tab"}
          onClick={() => onChangeView("my-bookings")}
        >
          My Bookings
        </button>
      </nav>
    </header>
  );
}
