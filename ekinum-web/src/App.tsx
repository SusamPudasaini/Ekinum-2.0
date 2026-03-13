import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

function Home() {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const nav = useNavigate();

  function handleLogout() {
    logout();
    nav("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-3xl font-semibold">Ekinum</div>
        <div className="mt-2 text-white/60">
          Auth is ready. Next: store + products.
        </div>

        {isAuthenticated ? (
          <div className="mt-6 space-y-3">
            <div className="text-sm text-white/70">
              Logged in as <span className="font-semibold">{user?.fullName}</span> ({user?.role})
            </div>

            <div className="flex justify-center gap-3">
              <Link
                to="/dashboard"
                className="rounded-full bg-purple-700 px-4 py-2 text-sm font-semibold hover:bg-purple-800"
              >
                Dashboard
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold hover:bg-blue-800"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="rounded-full bg-rose-700 px-4 py-2 text-sm font-semibold hover:bg-rose-800"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/login"
              className="rounded-full bg-purple-700 px-4 py-2 text-sm font-semibold hover:bg-purple-800"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold hover:bg-blue-800"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-3xl font-semibold">Dashboard</div>
        <div className="mt-2 text-white/60">
          Welcome, {user?.fullName}
        </div>
      </div>
    </div>
  );
}

function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-3xl font-semibold">Admin Panel</div>
        <div className="mt-2 text-white/60">
          Hello Admin, {user?.fullName}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(15, 23, 42, 0.95)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.10)",
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}