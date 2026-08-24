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

  // Redirect already authenticated users
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

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
        // Save authentication token
        localStorage.setItem("token", response.token);

        // Save user role for role-based admin access
        localStorage.setItem("role", response.user.role);

        // Save the complete user object
        localStorage.setItem(
          "user",
          JSON.stringify(response.user)
        );

        toast.success("Login successful!");

        // Redirect to Admin Dashboard
        router.replace("/admin");
      }
    } catch (error: unknown) {
      let message = "Login failed.";

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ??
          "Login failed.";
      } else if (error instanceof Error) {
        message = error.message;
      }

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-100 lg:grid-cols-2">

      {/* =====================================
                LEFT SIDE
            ====================================== */}

      <section className="relative hidden overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-16 text-white lg:flex lg:flex-col lg:justify-center">

        {/* Decorative circles */}

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />

        <motion.div
          initial={{
            opacity: 0,
            x: -40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="relative z-10 max-w-xl"
        >
          {/* Back */}

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-green-100 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to home
          </Link>

          {/* Logo */}

          <h1 className="mt-10 text-6xl font-extrabold tracking-tight">
            QuickTxn
          </h1>

          <p className="mt-8 text-xl leading-9 text-green-50">
            Send money instantly, fund your
            wallet, purchase airtime, buy data,
            and manage your everyday financial
            transactions from one place.
          </p>

          {/* Benefits */}

          <div className="mt-14 space-y-4">

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  ⚡
                </span>

                <div>
                  <p className="font-bold">
                    Instant Wallet Funding
                  </p>

                  <p className="mt-1 text-sm text-green-100">
                    Fund your wallet and get
                    started quickly.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  🔒
                </span>

                <div>
                  <p className="font-bold">
                    Secure Transactions
                  </p>

                  <p className="mt-1 text-sm text-green-100">
                    Protected account and
                    transaction flows.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  📱
                </span>

                <div>
                  <p className="font-bold">
                    Airtime & Data
                  </p>

                  <p className="mt-1 text-sm text-green-100">
                    Buy airtime and data
                    directly from your wallet.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* =====================================
                RIGHT SIDE
            ====================================== */}

      <section className="flex min-h-screen items-center justify-center p-5 sm:p-8">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-10"
        >

          {/* Mobile Back */}

          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-green-600 lg:hidden"
          >
            <ArrowLeft size={17} />
            Back to home
          </Link>

          {/* Heading */}

          <div>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <Lock size={23} />
            </div>

            <h2 className="text-4xl font-extrabold text-slate-900">
              Welcome Back 👋
            </h2>

            <p className="mt-3 text-slate-500">
              Sign in to continue to QuickTxn
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login Form */}

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-6"
          >

            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-medium text-slate-700"
              >
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 py-4 pl-12 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  required
                />

              </div>
            </div>

            {/* PASSWORD */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">

                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 py-4 pl-12 pr-12 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  required
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-green-600"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>
            </div>

            {/* FORGOT PASSWORD */}

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-green-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-600 py-4 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading
                ? "Signing in..."
                : "Login"}
            </button>

          </form>

          {/* DIVIDER */}

          <div className="my-7 flex items-center gap-4">

            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs font-medium text-slate-400">
              OR
            </span>

            <div className="h-px flex-1 bg-slate-200" />

          </div>

          {/* CREATE ACCOUNT */}

          <Link
            href="/register"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-600 py-4 font-semibold text-green-600 transition hover:bg-green-50"
          >
            <UserPlus size={19} />
            Create Account
          </Link>

          {/* Bottom text */}

          <p className="mt-6 text-center text-sm text-slate-500">
            New to QuickTxn?

            <Link
              href="/register"
              className="ml-1 font-semibold text-green-600 hover:underline"
            >
              Sign up
            </Link>
          </p>

          {/* Security text */}

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Lock size={13} />
            Your connection is protected
          </div>

        </motion.div>
      </section>

    </main>
  );
}