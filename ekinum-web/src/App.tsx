import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./auth/Signup";

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={<Signup />} />


          {/* Fallback */}
          <Route
            path="*"
            element={<div className="p-6 text-center">404 – Page not found</div>}
          />
        </Routes>

    </BrowserRouter>
  );
}
