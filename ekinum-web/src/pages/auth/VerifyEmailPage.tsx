import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import api from "../../api/axios";
import AuthShell from "../../components/auth/AuthShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faTriangleExclamation,
  faSpinner,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const nav = useNavigate();

  const token = params.get("token");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);

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

        const res = await api.get(
          `/api/auth/verify?token=${encodeURIComponent(token)}`
        );

        if (!mounted) return;

        setStatus("success");
        setMessage(res?.data?.message || "Your email has been verified!");
        toast.success("Email verified successfully 🎉");

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
    try {
      setResending(true);

      await api.post("/api/auth/resend-verification");

      toast.success("Verification email sent again 📩");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to resend verification email."
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthShell
      title="Verify your email"
      subtitle="Confirm your email address to activate your account and access your purchases securely."
    >
      <div className="mb-6">
        <div className="text-2xl font-semibold tracking-tight">
          Email Verification
        </div>
        <div className="mt-1 text-sm text-white/60">
          This usually takes just a moment.
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-8 space-y-4"
          >
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-3xl text-white/70"
            />
            <div className="text-sm text-white/60">
              Verifying your email...
            </div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-2xl text-emerald-400"
              />
              <div className="text-lg font-semibold">
                Email Verified Successfully!
              </div>
            </div>

            <div className="text-white/70">{message}</div>

            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500/20 px-4 py-3 font-semibold text-emerald-300 hover:bg-emerald-500/30 transition"
            >
              Continue to Login
            </Link>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="text-2xl text-rose-400"
              />
              <div className="text-lg font-semibold">
                Verification Failed
              </div>
            </div>

            <div className="text-white/70">
              {message || "We couldn’t verify your email."}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 font-semibold text-white hover:bg-white/15 transition disabled:opacity-50"
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
                className="inline-flex w-full items-center justify-center rounded-2xl bg-white/5 px-4 py-3 font-semibold text-white/80 hover:bg-white/10 transition"
              >
                Back to Signup
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </AuthShell>
  );
}