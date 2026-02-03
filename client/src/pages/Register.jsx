import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Create account</h1>

        {error && <div className="mb-3 p-3 border rounded bg-red-50">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border rounded p-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border rounded p-2"
            placeholder="Password (min 8 chars)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full border rounded p-2 font-semibold"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm">
          Already have an account? <Link className="underline" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
