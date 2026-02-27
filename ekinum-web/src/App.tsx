import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignupPage from "./pages/auth/Signuppage";
import LoginPage from "./pages/auth/LoginPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-3xl font-semibold">Ekinum</div>
        <div className="mt-2 text-white/60">Auth is ready. Next: store + products.</div>
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
      </Routes>
    </>
  );
}