import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";
import Navbar from "./components/Navbar";
import { useAuth } from "./hooks/useAuth";

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 px-4 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center py-24">
        <div className="text-center">
          <div className="text-4xl font-semibold">Ekinum</div>
          <div className="mt-3 text-white/60">
            Auth is ready. Next: store + products.
          </div>

          {isAuthenticated && (
            <div className="mt-4 text-sm text-white/70">
              Welcome back, {user?.fullName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 px-4 text-white">
      <div className="mx-auto max-w-6xl py-24">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-3 text-white/60">Welcome, {user?.fullName}</p>
      </div>
    </div>
  );
}

function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 px-4 text-white">
      <div className="mx-auto max-w-6xl py-24">
        <h1 className="text-3xl font-semibold">Admin Panel</h1>
        <p className="mt-3 text-white/60">Hello Admin, {user?.fullName}</p>
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

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <SignupPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

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