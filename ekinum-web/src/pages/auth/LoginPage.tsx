import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import { ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export default function LoginPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!isEmail(email)) e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    return e;
  }, [email, password]);

  const canSubmit = Object.keys(errors).length === 0 && !loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!canSubmit) {
      toast.error("Please fix the errors first.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/auth/login", { email, password });
      const data = res?.data;

      if (!data?.token) {
        throw new Error("Missing token.");
      }

      login({
        token: data.token,
        role: data.role,
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
      });

      toast.success(`Welcome back, ${data.fullName || "User"}!`);

      const redirectTo = (location.state as any)?.from?.pathname || "/";
      nav(redirectTo, { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Login failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-4">
      <div className="absolute right-20 top-20 h-10 w-10 rounded-full bg-yellow-400 opacity-90" />
      <div className="absolute right-32 top-52 h-6 w-6 rounded-full bg-purple-900" />
      <div className="absolute right-16 bottom-32 h-24 w-24 rounded-full bg-yellow-500 opacity-90" />
      <div className="absolute right-10 bottom-10 h-32 w-32 rounded-full bg-purple-900 opacity-90" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md rounded-3xl bg-white p-10 shadow-[0_25px_70px_-20px_rgba(0,0,0,0.4)]"
      >
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-700 text-white shadow-md">
            <ShieldCheck size={22} />
          </div>
        </div>

        <h1 className="text-center text-3xl font-extrabold text-purple-900">
          Welcome Back
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          Login to continue to your account.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <FontAwesomeIcon icon={faUser} />
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                className={[
                  "w-full rounded-full bg-gray-100 py-3 pl-12 pr-4 text-sm outline-none transition",
                  errors.email
                    ? "ring-2 ring-red-300"
                    : "focus:ring-2 focus:ring-purple-400",
                ].join(" ")}
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <FontAwesomeIcon icon={faLock} />
              </div>

              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className={[
                  "w-full rounded-full bg-gray-100 py-3 pl-12 pr-10 text-sm outline-none transition",
                  errors.password
                    ? "ring-2 ring-red-300"
                    : "focus:ring-2 focus:ring-purple-400",
                ].join(" ")}
              />

              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember((r) => !r)}
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              Remember Password
            </label>

            <Link
              to="/signup"
              className="font-medium text-purple-700 hover:underline"
            >
              Create account
            </Link>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-full bg-purple-800 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-900 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}