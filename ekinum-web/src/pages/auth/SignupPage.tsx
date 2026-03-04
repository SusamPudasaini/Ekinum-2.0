import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import { ShieldCheck } from "lucide-react";

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
    else if (confirmPassword !== password)
      e.confirmPassword = "Passwords do not match.";
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
      await api.post("/api/auth/signup", {
        fullName,
        phoneNumber,
        email,
        password,
        confirmPassword,
      });

      toast.success("Signup successful. Please verify your email.");
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4">
      
      {/* Decorative Circles */}
      <div className="absolute right-20 top-20 h-10 w-10 rounded-full bg-yellow-400 opacity-90" />
      <div className="absolute right-32 top-52 h-6 w-6 rounded-full bg-purple-900" />
      <div className="absolute right-16 bottom-32 h-24 w-24 rounded-full bg-yellow-500 opacity-90" />
      <div className="absolute right-10 bottom-10 h-32 w-32 rounded-full bg-purple-900 opacity-90" />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-10 shadow-[0_25px_70px_-20px_rgba(0,0,0,0.4)]"
      >
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-700 text-white shadow-md">
            <ShieldCheck size={22} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-3xl font-extrabold text-purple-900">
          Create Account
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-purple-700 hover:underline"
          >
            Login
          </Link>
        </p>

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          
          {/* Full Name */}
          <InputField
            icon={faUser}
            placeholder="Full Name"
            value={fullName}
            onChange={setFullName}
            error={errors.fullName}
          />

          {/* Phone */}
          <InputField
            icon={faPhone}
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={setPhoneNumber}
            error={errors.phoneNumber}
          />

          {/* Email */}
          <InputField
            icon={faEnvelope}
            placeholder="Email Address"
            value={email}
            onChange={setEmail}
            error={errors.email}
          />

          {/* Password */}
          <PasswordField
            icon={faLock}
            placeholder="Password"
            value={password}
            onChange={setPassword}
            show={showPass}
            setShow={setShowPass}
            error={errors.password}
          />

          {/* Confirm Password */}
          <PasswordField
            icon={faLock}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showPass2}
            setShow={setShowPass2}
            error={errors.confirmPassword}
          />

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-full bg-purple-800 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-900 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </motion.button>

          <p className="text-xs text-center text-gray-500">
            By continuing, you agree to our Terms & Privacy Policy.
          </p>
        </form>
      </motion.div>
    </div>
  );
}

/* Reusable Input */
function InputField({ icon, placeholder, value, onChange, error }: any) {
  return (
    <div>
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <FontAwesomeIcon icon={icon} />
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={[
            "w-full rounded-full bg-gray-100 py-3 pl-12 pr-4 text-sm outline-none transition",
            error ? "ring-2 ring-red-300" : "focus:ring-2 focus:ring-purple-400",
          ].join(" ")}
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* Reusable Password */
function PasswordField({
  icon,
  placeholder,
  value,
  onChange,
  show,
  setShow,
  error,
}: any) {
  return (
    <div>
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <FontAwesomeIcon icon={icon} />
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={[
            "w-full rounded-full bg-gray-100 py-3 pl-12 pr-10 text-sm outline-none transition",
            error ? "ring-2 ring-red-300" : "focus:ring-2 focus:ring-purple-400",
          ].join(" ")}
        />
        <button
          type="button"
          onClick={() => setShow((s: boolean) => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}