import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function isEmailValid(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    const name = fullName.trim();
    const phone = phoneNumber.trim();
    const mail = email.trim().toLowerCase();

    if (!name) return setErr("Full name is required.");
    if (!phone) return setErr("Phone number is required.");
    if (!mail) return setErr("Email is required.");
    if (!isEmailValid(mail)) return setErr("Please enter a valid email address.");
    if (!password) return setErr("Password is required.");
    if (password.length < 8) return setErr("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setErr("Passwords do not match.");

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/api/auth/signup`, {
        fullName: name,
        phoneNumber: phone,
        email: mail,
        password,
        confirmPassword,
      });

      setMsg("Signup successful! Please check your email to verify your account.");
      // Optional: route to a “Check your email” page
      // navigate("/check-email");
    } catch (error: any) {
      const data = error?.response?.data;
      if (typeof data === "string") setErr(data);
      else if (data?.message) setErr(data.message);
      else setErr("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)] overflow-hidden">
        <div className="px-7 pt-7 pb-5 border-b border-slate-100">
          <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign up to buy game topups, gift cards, and subscriptions.
          </p>
        </div>

        <form onSubmit={onSubmit} className="px-7 py-6 space-y-4">
          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}
          {msg && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {msg}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Full name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-slate-100"
              placeholder="e.g., Usam Pudasaini"
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Phone number</label>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-slate-100"
              placeholder="e.g., +977 98XXXXXXXX"
              autoComplete="tel"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-slate-100"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-slate-100"
                placeholder="********"
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-slate-100"
                placeholder="********"
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 text-white py-3 font-medium hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

          <div className="text-sm text-slate-600 text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium text-slate-900 hover:underline"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}