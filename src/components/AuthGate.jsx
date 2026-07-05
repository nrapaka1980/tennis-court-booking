import { useState } from "react";
import { authClient } from "../authClient";

export default function AuthGate() {
  const [mode, setMode] = useState("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error: authError } =
        mode === "sign-in"
          ? await authClient.signIn.email({ email, password })
          : await authClient.signUp.email({ name, email, password });
      if (authError) {
        setError(authError.message || "Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="name-gate">
      <div className="name-gate-card">
        <h1>🎾 Court Booker</h1>
        <p>{mode === "sign-in" ? "Sign in to book a court." : "Create an account to get started."}</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "sign-up" && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              autoComplete="name"
              required
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            minLength={8}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? "Please wait…" : mode === "sign-in" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <button
          type="button"
          className="link-button"
          onClick={() => {
            setError(null);
            setMode(mode === "sign-in" ? "sign-up" : "sign-in");
          }}
        >
          {mode === "sign-in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
