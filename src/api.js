async function handleResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export function getCourts() {
  return fetch("/api/courts").then(handleResponse);
}

export function getBookings() {
  return fetch("/api/bookings").then(handleResponse);
}

export function createBooking({ courtId, dateKey, time }) {
  return fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courtId, dateKey, time }),
  }).then(handleResponse);
}

export function cancelBooking(id) {
  return fetch(`/api/bookings/${id}`, { method: "DELETE" }).then(handleResponse);
}
