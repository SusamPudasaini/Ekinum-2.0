import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";
import AuthShell from "../../components/auth/AuthShell";
import AuthField from "../../components/auth/AuthField";
import { Link, useNavigate } from "react-router-dom";
import { faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export default function LoginPage() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
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

      const token = res?.data?.token;
      const role = res?.data?.role;

      if (!token) throw new Error("Missing token.");

      localStorage.setItem("token", token);
      localStorage.setItem("me", JSON.stringify(res.data));

      toast.success(`Welcome back! (${role})`);

      // for now go home; later we’ll redirect based on role
      nav("/", { replace: true });
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
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage purchases, view codes, and access your account securely."
    >
      <div className="mb-6">
        <div className="text-2xl font-semibold tracking-tight">Log in</div>
        <div className="mt-1 text-sm text-white/60">
          New here?{" "}
          <Link to="/signup" className="text-cyan-200 hover:text-cyan-100 underline underline-offset-4">
            Create an account
          </Link>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField
          label="Email"
          icon={faEnvelope}
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          error={errors.email}
          autoComplete="email"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Password</label>
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45">
              <FontAwesomeIcon icon={faLock} />
            </div>

            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              className={[
                "w-full rounded-2xl border bg-white/5 px-11 py-3 text-white outline-none transition",
                "placeholder:text-white/35",
                errors.password
                  ? "border-rose-400/60 ring-2 ring-rose-400/20"
                  : "border-white/10 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/15",
              ].join(" ")}
            />

            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-2 text-white/60 hover:text-white transition"
              aria-label="Toggle password"
            >
              <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} />
            </button>
          </div>
          {errors.password ? <div className="text-xs text-rose-300">{errors.password}</div> : null}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ y: -1 }}
          type="submit"
          disabled={!canSubmit}
          className={[
            "mt-2 w-full rounded-2xl px-4 py-3 font-semibold transition",
            "bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950",
            "shadow-[0_18px_50px_-25px_rgba(34,211,238,0.55)]",
            !canSubmit ? "opacity-60 cursor-not-allowed" : "hover:brightness-110",
          ].join(" ")}
        >
          {loading ? "Signing in..." : "Log in"}
        </motion.button>

        <div className="flex items-center justify-between text-sm text-white/60">
          <span>Use your verified email.</span>
          <button
            type="button"
            className="text-cyan-200 hover:text-cyan-100 underline underline-offset-4"
            onClick={() => toast("Resend verification endpoint can be added next.")}
          >
            Resend verification
          </button>
        </div>
      </form>
    </AuthShell>
  );
}