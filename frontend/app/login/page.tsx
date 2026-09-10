"use client";

import { FormEvent, useState, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const uid = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      await authService.login({
        email: email.trim(),
        password,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0d0f11] font-sans">
      {/* ── Background Gym Image with Moody Lighting ── */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/login-bg.jpg"
          alt="Gym Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-left-center md:object-center"
        />
        {/* Dark Vignette and Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/70 to-[#0e1012]/95 md:from-black/40 md:via-black/60 md:to-[#0e1012]/95"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-black/30 backdrop-brightness-95"
          aria-hidden="true"
        />
      </div>

      {/* ── Top Left FitPro Logo ── */}
      <div className="absolute left-6 top-6 z-20 md:left-12 md:top-8">
        <Link
          href="/"
          className="inline-flex items-center transition-transform hover:scale-105"
          aria-label="Go to FitPro home"
        >
          <Image
            src="/fitpro-logo.png"
            alt="FitPro"
            width={120}
            height={50}
            priority
            className="h-10 w-auto object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
          />
        </Link>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col items-center justify-center px-5 py-24 lg:flex-row lg:items-center lg:justify-between lg:px-16">
        {/* ── Left Side: Hero Statement ── */}
        <div className="mb-12 flex w-full flex-col justify-center text-left lg:mb-0 lg:w-1/2 lg:pr-10">
          <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
            Push Your <br />
            <span className="text-[#BAF336]">Limits.</span> <br />
            Own Your <br />
            <span className="text-[#BAF336]">Progress.</span>
          </h1>
        </div>

        {/* ── Right Side: Sleek Login Card ── */}
        <div className="flex w-full justify-center lg:w-500 lg:justify-end">
          <main
            className="w-full max-w-[460px] rounded-[26px] border-[1.5px] border-[#BAF336] bg-[#141618]/95 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(186,243,54,0.06)] backdrop-blur-md sm:p-10"
            aria-label="Login form"
          >
            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Welcome Back
              </h2>
              <p className="mt-1.5 text-xs text-gray-400 sm:text-sm">
                Log in to continue to FitPro
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-red-500/40 bg-red-950/40 px-3.5 py-2.5 text-center text-xs text-red-300"
              >
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`${uid}email`}
                  className="text-xs font-medium text-gray-300"
                >
                  Email
                </label>
                <div className="relative flex items-center">
                  <span className="pointer-events-none absolute left-3.5 text-gray-700">
                    <Mail size={17} strokeWidth={2.2} />
                  </span>
                  <input
                    id={`${uid}email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sumeestha@gmail.com"
                    className="h-11 w-full rounded-xl bg-[#8e98a5] pl-10 pr-4 text-xs font-medium text-gray-900 placeholder:text-gray-600 focus:bg-[#9ca7b5] focus:outline-none focus:ring-2 focus:ring-[#BAF336] sm:text-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`${uid}password`}
                  className="text-xs font-medium text-gray-300"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <span className="pointer-events-none absolute left-3.5 text-gray-700">
                    <Lock size={17} strokeWidth={2.2} />
                  </span>
                  <input
                    id={`${uid}password`}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl bg-[#8e98a5] pl-10 pr-11 text-xs font-medium text-gray-900 placeholder:text-gray-600 focus:bg-[#9ca7b5] focus:outline-none focus:ring-2 focus:ring-[#BAF336] sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 flex items-center text-gray-700 transition-colors hover:text-gray-900"
                  >
                    {showPassword ? (
                      <EyeOff size={17} strokeWidth={2.2} />
                    ) : (
                      <Eye size={17} strokeWidth={2.2} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="mt-1 flex items-center justify-between text-xs">
                <label className="flex cursor-pointer select-none items-center gap-2 text-gray-300 hover:text-white">
                  <div
                    onClick={() => setRememberMe((v) => !v)}
                    className={`flex h-4 w-4 items-center justify-center rounded transition-colors ${
                      rememberMe
                        ? "bg-[#BAF336] text-[#0d0f11]"
                        : "border border-gray-500 bg-transparent"
                    }`}
                  >
                    {rememberMe && <Check size={12} strokeWidth={3} />}
                  </div>
                  <span>Remember me</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="font-medium text-[#BAF336] transition-colors hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Log in Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-[#BAF336] text-sm font-bold text-[#0d0f11] transition-all duration-150 hover:bg-[#C7FA1F] hover:shadow-[0_4px_20px_rgba(186,243,54,0.3)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>

              {/* Divider */}
              <div className="relative my-2 flex items-center justify-center">
                <div className="w-full border-t border-[#26292d]" />
                <span className="absolute bg-[#141618] px-3 text-[11px] text-gray-500">
                  or
                </span>
              </div>

              {/* Continue with Google */}
              <button
                type="button"
                onClick={() => {
                  // If social login endpoint is connected in future
                  setError("Google sign-in is not configured yet. Please log in with your email and password.");
                }}
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-[#2d3139] bg-[#1a1c1f]/80 text-xs font-medium text-gray-200 transition-colors hover:bg-[#22252a] hover:text-white sm:text-sm"
              >
                {/* Google Multi-Color SVG Icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="flex-shrink-0"
                >
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9c-.2-.7-.4-1.5-.4-2.4z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Bottom Register Link */}
              <p className="mt-2 text-center text-xs text-gray-400">
                New here?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-white transition-colors hover:text-[#BAF336] hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
