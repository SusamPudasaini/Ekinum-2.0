import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";
import AuthShell from "../../components/auth/AuthShell";
import AuthField from "../../components/auth/AuthField";
import { Link, useNavigate } from "react-router-dom";
import {
  faUser,
  faPhone,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export default function SignupPage() {
  const nav = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required.";
    if (!phoneNumber.trim()) e.phoneNumber = "Phone number is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!isEmail(email)) e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 8) e.password = "Minimum 8 characters.";
    if (!confirmPassword) e.confirmPassword = "Confirm your password.";
    else if (confirmPassword !== password) e.confirmPassword = "Passwords do not match.";
    return e;
  }, [fullName, phoneNumber, email, password, confirmPassword]);

  const canSubmit = Object.keys(errors).length === 0 && !loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please fix the errors first.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/auth/signup", {
        fullName,
        phoneNumber,
        email,
        password,
        confirmPassword,
      });

      toast.success(res?.data?.message || "Signup successful. Verify your email.");
      nav("/login", { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Signup failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your Ekinum account"
      subtitle="Join in seconds. Verify your email, then start selling or buying topups, gift cards, and subscriptions."
    >
      <div className="mb-6">
        <div className="text-2xl font-semibold tracking-tight">Sign up</div>
        <div className="mt-1 text-sm text-white/60">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-200 hover:text-cyan-100 underline underline-offset-4">
            Log in
          </Link>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField
          label="Full name"
          icon={faUser}
          value={fullName}
          onChange={setFullName}
          placeholder="e.g., John Doe"
          error={errors.fullName}
          autoComplete="name"
        />

        <AuthField
          label="Phone number"
          icon={faPhone}
          value={phoneNumber}
          onChange={setPhoneNumber}
          placeholder="e.g., +9779812345678"
          error={errors.phoneNumber}
          autoComplete="tel"
        />

        <AuthField
          label="Email"
          icon={faEnvelope}
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          error={errors.email}
          autoComplete="email"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
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
                aria-pressed={showPass}
              >
                <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password ? <div className="text-xs text-rose-300">{errors.password}</div> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Confirm password</label>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45">
                <FontAwesomeIcon icon={faLock} />
              </div>

              <input
                type={showPass2 ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
                className={[
                  "w-full rounded-2xl border bg-white/5 px-11 py-3 text-white outline-none transition",
                  "placeholder:text-white/35",
                  errors.confirmPassword
                    ? "border-rose-400/60 ring-2 ring-rose-400/20"
                    : "border-white/10 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/15",
                ].join(" ")}
              />

              <button
                type="button"
                onClick={() => setShowPass2((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-2 text-white/60 hover:text-white transition"
                aria-label="Toggle password confirm"
                aria-pressed={showPass2}
              >
                <FontAwesomeIcon icon={showPass2 ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.confirmPassword ? (
              <div className="text-xs text-rose-300">{errors.confirmPassword}</div>
            ) : null}
          </div>
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
          {loading ? "Creating account..." : "Create account"}
        </motion.button>

        <div className="text-xs text-white/55">
          By continuing, you agree to our Terms and acknowledge our Privacy Policy.
        </div>
      </form>
    </AuthShell>
  );
}