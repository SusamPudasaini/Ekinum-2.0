import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AuthShell({
  page, // "login" | "signup"
  title,
  subtitle,
  children,
}: {
  page: "login" | "signup";
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top Nav */}
      <header className="border-b border-slate-100">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-semibold">
              E
            </div>
            <span className="font-semibold tracking-tight">Ekinum</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
            <a className="hover:text-slate-900" href="#">
              Home
            </a>
            <a className="hover:text-slate-900" href="#">
              Products
            </a>
            <a className="hover:text-slate-900" href="#">
              How it works
            </a>
            <a className="hover:text-slate-900" href="#">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {page === "login" ? (
              <Link
                to="/signup"
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Sign up
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Log in
              </Link>
            )}

            <Link
              to="/"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
          {/* Left */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="mt-4 max-w-xl text-base leading-relaxed text-slate-600"
            >
              {subtitle}
            </motion.p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={page === "login" ? "/signup" : "/login"}
                className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                {page === "login" ? "Create account" : "I already have an account"}
              </Link>

              <a
                href="#why"
                className="rounded-md border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                How it works
              </a>
            </div>

            {/* Logos row mimic */}
            <div className="mt-10 border-t border-slate-100 pt-6">
              <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-slate-300">
                <span className="text-xs font-semibold tracking-widest">LOGOIPSUM</span>
                <span className="text-xs font-semibold tracking-widest">LOGOIPSUM</span>
                <span className="text-xs font-semibold tracking-widest">LOGOIPSUM</span>
                <span className="text-xs font-semibold tracking-widest">LOGOIPSUM</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            {/* Illustration card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_18px_60px_-45px_rgba(15,23,42,0.35)]">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <div className="ml-2 text-xs font-medium text-slate-400">Secure Portal</div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Fast & secure</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Verify email once, then manage purchases and digital codes instantly.
                    </div>

                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                      <li className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                        Role-based access (Admin / Customer)
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                        JWT token sessions
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                        Clean checkout-ready flow
                      </li>
                    </ul>
                  </div>

                  {/* Form slot */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                    {children}
                  </div>
                </div>
              </div>
            </div>

            {/* subtle decor */}
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-100 blur-2xl" />
            <div className="pointer-events-none absolute -left-6 -bottom-6 h-20 w-20 rounded-full bg-slate-100 blur-2xl" />
          </div>
        </div>

        {/* Why section mimic */}
        <section id="why" className="border-t border-slate-100 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Why users choose Ekinum?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
              Simple onboarding, secure auth, and a clean experience designed for digital goods.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Card title="Email verification" desc="Prevents fake accounts and keeps orders secure." />
            <Card title="Modern UI" desc="Clean, minimal, and optimized for conversion." />
            <Card title="RBAC ready" desc="Separate admin tools and customer experience from day one." />
          </div>
        </section>
      </main>
    </div>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{desc}</div>
    </div>
  );
}