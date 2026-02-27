import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import api from "../../api/axios";
import AuthShell from "../../components/auth/AuthShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const nav = useNavigate();

  const token = params.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function run() {
      if (!token) {
        setStatus("error");
        setMessage("Missing verification token.");
        return;
      }
      try {
        setStatus("loading");
        const res = await api.get(`/api/auth/verify?token=${encodeURIComponent(token)}`);
        setStatus("success");
        setMessage(res?.data?.message || "Verified!");
        toast.success("Email verified! You can log in now.");
        setTimeout(() => nav("/login", { replace: true }), 900);
      } catch (err: any) {
        setStatus("error");
        const msg = err?.response?.data?.message || "Verification failed.";
        setMessage(msg);
        toast.error(msg);
      }
    }
    run();
  }, [token, nav]);

  return (
    <AuthShell
      title="Verify your email"
      subtitle="One last step — confirm your email to unlock secure login and access your purchases."
    >
      <div className="mb-6">
        <div className="text-2xl font-semibold tracking-tight">Email verification</div>
        <div className="mt-1 text-sm text-white/60">
          This usually takes a second.
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        {status === "loading" ? (
          <div className="space-y-3">
            <div className="h-3 w-40 rounded bg-white/10" />
            <div className="h-3 w-64 rounded bg-white/10" />
            <div className="mt-3 h-10 w-full rounded-xl bg-white/10" />
            <div className="mt-2 text-sm text-white/60">Verifying…</div>
          </div>
        ) : status === "success" ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faCircleCheck} className="text-xl text-emerald-300" />
              <div className="text-lg font-semibold">Verified!</div>
            </div>
            <div className="text-white/70">{message}</div>
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-white/10 px-4 py-3 font-semibold text-white hover:bg-white/15 transition"
            >
              Continue to login
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-xl text-rose-300" />
              <div className="text-lg font-semibold">Verification failed</div>
            </div>
            <div className="text-white/70">{message || "Could not verify your email."}</div>
            <Link
              to="/signup"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-white/10 px-4 py-3 font-semibold text-white hover:bg-white/15 transition"
            >
              Back to signup
            </Link>
          </motion.div>
        )}
      </div>
    </AuthShell>
  );
}