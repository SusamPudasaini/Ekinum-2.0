import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core"; // <–– import the correct type
import { faGamepad, faShieldHalved, faBolt } from "@fortawesome/free-solid-svg-icons";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const bgX = useTransform(mx, [0, 1], ["-20px", "20px"]);
  const bgY = useTransform(my, [0, 1], ["-18px", "18px"]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mx.set(x);
      my.set(y);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Parallax background */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="pointer-events-none absolute inset-0 opacity-90"
      >
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        {/* subtle grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:28px_28px] opacity-40" />
      </motion.div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_20px_80px_-35px_rgba(34,211,238,0.35)] backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: marketing */}
            <div className="relative hidden lg:block p-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                  <FontAwesomeIcon icon={faGamepad as IconProp} className="text-xl text-cyan-200" />
                </div>
                <div>
                  <div className="text-xl font-semibold tracking-tight">Ekinum</div>
                  <div className="text-sm text-white/60">Topups • Gift Cards • Subscriptions</div>
                </div>
              </div>

              <h1 className="text-3xl font-semibold leading-tight tracking-tight">
                {title}
              </h1>
              <p className="mt-3 max-w-md text-white/70">
                {subtitle}
              </p>

              <div className="mt-10 grid gap-4">
                <Feature
                  icon={faShieldHalved as IconProp}
                  title="Secure by design"
                  desc="JWT auth + role-based access (Admin / Customer)."
                />
                <Feature
                  icon={faBolt as IconProp}
                  title="Fast checkout-ready"
                  desc="Built for smooth topups & digital delivery flows."
                />
              </div>

              <div className="mt-10 rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="text-sm text-white/70">
                  Pro tip: keep your UI snappy — verify email once and you’re in.
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="p-6 sm:p-10">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: IconProp;    // <–– use IconProp here
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
        <FontAwesomeIcon icon={icon} className="text-lg text-white/80" />
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-white/60">{desc}</div>
      </div>
    </div>
  );
}