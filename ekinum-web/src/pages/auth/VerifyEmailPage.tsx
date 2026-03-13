import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import api from "../../api/axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faTriangleExclamation,
  faSpinner,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

import { ShieldCheck } from "lucide-react";

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const nav = useNavigate();

  const token = params.get("token");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState("");

  const emailError = useMemo(() => {
    if (!email.trim()) return "Email is required.";
    if (!isEmail(email)) return "Enter a valid email.";
    return "";
  }, [email]);

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!token) {
        setStatus("error");
        setMessage("Missing or invalid verification token.");
        return;
      }

      try {
        setStatus("loading");

        const res = await api.get(`/api/auth/verify?token=${encodeURIComponent(token)}`);

        if (!mounted) return;

        setStatus("success");
        setMessage(res?.data?.message || "Your email has been verified.");
        toast.success("Email verified successfully.");

        setTimeout(() => {
          nav("/login", { replace: true });
        }, 1200);
      } catch (err: any) {
        if (!mounted) return;

        const msg =
          err?.response?.data?.message ||
          "Verification link is invalid or expired.";

        setStatus("error");
        setMessage(msg);
        toast.error(msg);
      }
    }

    run();

    return () => {
      mounted = false;
    };
  }, [token, nav]);

  async function handleResend() {
    if (emailError) {
      toast.error(emailError);
      return;
    }

    try {
      setResending(true);

      const res = await api.post("/api/auth/resend-verification", {
        email,
      });

      toast.success(
        res?.data?.message || "Verification email sent again."
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to resend verification email."
      );
    } finally {
      setResending(false);
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
          Verify Email
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Confirm your email address to activate your account.
        </p>

        <div className="mt-8">
          {status === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center space-y-4 rounded-3xl bg-gray-50 px-6 py-10 text-center"
            >
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="text-3xl text-purple-700"
              />
              <div className="text-sm font-medium text-gray-600">
                Verifying your email...
              </div>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 rounded-3xl bg-gray-50 p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-xl text-emerald-600"
                  />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    Verified Successfully
                  </div>
                  <div className="text-sm text-gray-500">
                    Your account is now ready.
                  </div>
                </div>
              </div>

              <div className="text-sm leading-relaxed text-gray-600">
                {message}
              </div>

              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-full bg-purple-800 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-900"
              >
                Continue to Login
              </Link>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 rounded-3xl bg-gray-50 p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100">
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    className="text-xl text-rose-600"
                  />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    Verification Failed
                  </div>
                  <div className="text-sm text-gray-500">
                    We could not verify your email.
                  </div>
                </div>
              </div>

              <div className="text-sm leading-relaxed text-gray-600">
                {message || "Verification link is invalid or expired."}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to resend"
                    className={[
                      "w-full rounded-full bg-white py-3 pl-12 pr-4 text-sm outline-none transition border",
                      emailError
                        ? "border-rose-300 ring-2 ring-rose-100"
                        : "border-gray-200 focus:ring-2 focus:ring-purple-400",
                    ].join(" ")}
                  />
                </div>
                {email && emailError ? (
                  <div className="text-xs text-rose-500">{emailError}</div>
                ) : null}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-semibold text-purple-800 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resending ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      Resending...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faEnvelope} />
                      Resend verification email
                    </>
                  )}
                </button>

                <Link
                  to="/signup"
                  className="inline-flex w-full items-center justify-center rounded-full bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
                >
                  Back to Signup
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}