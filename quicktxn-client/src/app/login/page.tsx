"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  UserPlus,
  Fingerprint,
} from "lucide-react";
import { motion } from "framer-motion";
import { login } from "@/services/auth.service";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Prefetch pages
  useEffect(() => {
    router.prefetch("/dashboard");
    router.prefetch("/admin");
  }, [router]);

  // Load biometric setting
  useEffect(() => {
    const enabled = localStorage.getItem("biometric") === "true";
    setBiometricEnabled(enabled);
  }, []);

  // Redirect already authenticated users
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        const role = localStorage.getItem("role");

        if (role === "ADMIN") {
          router.replace("/admin");
        } else {
          router.replace("/dashboard");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      });
  }, [router]);

  // Password Login
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await login({
        email: email.trim(),
        password,
      });

      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.user.role);
        localStorage.setItem(
          "user",
          JSON.stringify(response.user)
        );

        toast.success("Login successful!");

        if (response.user.role === "ADMIN") {
          router.replace("/admin");
        } else {
          router.replace("/dashboard");
        }
      }
    } catch (error: unknown) {
      let message = "Login failed.";

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message || "Login failed.";
      } else if (error instanceof Error) {
        message = error.message;
      }

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Fingerprint / Face ID Login
  const biometricLogin = async () => {
    if (!window.PublicKeyCredential) {
      toast.error("Biometric authentication is not supported.");
      return;
    }

    try {
      await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          userVerification: "required",
          timeout: 60000,
        },
      });

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error(
          "Please login once using your password."
        );
        return;
      }

      toast.success("Biometric verified");

      const role = localStorage.getItem("role");

      if (role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } catch {
      toast.error("Fingerprint / Face ID verification failed.");
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-100 lg:grid-cols-2">
      {/* LEFT SIDE */}
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-16 text-white lg:flex lg:flex-col lg:justify-center">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-xl"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-green-100 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to home
          </Link>

          <h1 className="mt-10 text-6xl font-extrabold">
            QuickTxn
          </h1>

          <p className="mt-8 text-xl leading-9 text-green-50">
            Send money instantly, fund your wallet,
            purchase airtime, buy data and manage
            your financial life from one secure app.
          </p>

          <div className="mt-14 space-y-4">
            {[
              [
                "⚡",
                "Instant Wallet Funding",
                "Fund your wallet in seconds.",
              ],
              [
                "🔒",
                "Secure Transactions",
                "Protected with PIN & biometrics.",
              ],
              [
                "📱",
                "Airtime & Data",
                "Purchase directly from your wallet.",
              ],
            ].map(([emoji, title, desc]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <p className="font-bold">{title}</p>
                    <p className="text-sm text-green-100">
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* RIGHT SIDE */}
      <section className="flex min-h-screen items-center justify-center px-4 py-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
        >
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-600 lg:hidden"
          >
            <ArrowLeft size={17} />
            Back to home
          </Link>

          <div>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <Lock size={23} />
            </div>

            <h2 className="text-3xl font-bold">
              Welcome Back 👋
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sign in to continue to QuickTxn
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-6"
          >
            {/* Email */}
            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-11 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-green-600"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-green-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-green-600 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            {/* Fingerprint / Face ID */}
            {biometricEnabled && (
              <button
                type="button"
                onClick={biometricLogin}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-green-600 font-semibold text-green-600 transition hover:bg-green-50"
              >
                <Fingerprint size={20} />
                Continue with Fingerprint
              </button>
            )}
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">
              OR
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <Link
            href="/register"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-green-600 font-semibold text-green-600 transition hover:bg-green-50"
          >
            <UserPlus size={19} />
            Create Account
          </Link>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to QuickTxn?
            <Link
              href="/register"
              className="ml-1 font-semibold text-green-600 hover:underline"
            >
              Sign up
            </Link>
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Lock size={13} />
            Your connection is protected
          </div>
        </motion.div>
      </section>
    </main>
  );
}