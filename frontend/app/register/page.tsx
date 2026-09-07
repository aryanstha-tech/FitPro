"use client";

import { FormEvent, useState, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Phone,
  MapPin,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Dumbbell,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/lib/api-client";

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
type Gender = "male" | "female";

interface FieldErrors {
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
  general?: string;
}

/* ─────────────────────────────────────────────────────────────
   Validation helpers
───────────────────────────────────────────────────────────── */
function validateForm(
  name: string,
  phone: string,
  address: string,
  email: string,
  password: string,
  confirmPassword: string,
  gender: Gender | ""
): FieldErrors {
  const errors: FieldErrors = {};

  if (!name.trim()) errors.name = "Full name is required.";
  else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters.";

  if (!phone.trim()) errors.phone = "Phone number is required.";
  else if (!/^\+?[\d\s\-().]{7,15}$/.test(phone.trim()))
    errors.phone = "Enter a valid phone number.";

  if (!address.trim()) errors.address = "Address is required.";

  if (!email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = "Enter a valid email address.";

  if (!password) errors.password = "Password is required.";
  else if (password.length < 6) errors.password = "At least 6 characters required.";
  else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
    errors.password = "Must include a letter and a number.";

  if (!confirmPassword) errors.confirmPassword = "Please confirm your password.";
  else if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match.";

  if (!gender) errors.gender = "Please select a gender.";

  return errors;
}

/* ─────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────── */

/** Small icon box that sits to the left of each input */
function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 22,
        height: 27,
        minWidth: 22,
        backgroundColor: "#B8B8B8",
        borderRadius: 7,
        color: "#555",
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}

interface TextFieldProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  icon: React.ReactNode;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  rightSlot?: React.ReactNode;
}

function TextField({
  label,
  id,
  name,
  type = "text",
  placeholder,
  autoComplete,
  icon,
  error,
  value,
  onChange,
  rightSlot,
}: TextFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <label
        htmlFor={id}
        style={{
          fontSize: 8,
          color: "#BDBDBD",
          fontWeight: 500,
          letterSpacing: "0.03em",
          lineHeight: 1,
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", gap: 3, alignItems: "center", position: "relative" }}>
        <IconBox>{icon}</IconBox>
        <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-err` : undefined}
            style={{
              display: "block",
              width: "100%",
              height: 27,
              backgroundColor: "#B8B8B8",
              borderRadius: 9,
              border: error ? "1.5px solid #ef4444" : "1px solid transparent",
              outline: "none",
              padding: rightSlot ? "0 24px 0 8px" : "0 8px",
              fontSize: 9,
              color: "#333333",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          {rightSlot && (
            <span
              style={{
                position: "absolute",
                right: 7,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                color: "#777",
                lineHeight: 0,
              }}
            >
              {rightSlot}
            </span>
          )}
        </div>
      </div>
      {error && (
        <span
          id={`${id}-err`}
          role="alert"
          style={{
            fontSize: 7,
            color: "#ef4444",
            lineHeight: 1.3,
            paddingLeft: 25,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function RegisterPage() {
  const router = useRouter();
  const uid = useId();

  // Form field values
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<Gender | "">("male");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errors = validateForm(name, phone, address, email, password, confirmPassword, gender);
    setFieldErrors(errors);
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      router.push("/membership");
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors?.email) {
        setFieldErrors((prev) => ({ ...prev, email: err.fieldErrors!.email[0] }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          general: err instanceof ApiError ? err.message : "Something went wrong. Try again.",
        }));
      }
    } finally {
      setLoading(false);
    }
  }

  /** Re-validate a single field after first submit attempt */
  function touch(partial: Partial<{
    n: string; ph: string; addr: string; em: string; pw: string; cpw: string; g: Gender | "";
  }>) {
    if (!submitted) return;
    const n   = partial.n   ?? name;
    const ph  = partial.ph  ?? phone;
    const addr= partial.addr?? address;
    const em  = partial.em  ?? email;
    const pw  = partial.pw  ?? password;
    const cpw = partial.cpw ?? confirmPassword;
    const g   = partial.g   ?? gender;
    const errors = validateForm(n, ph, addr, em, pw, cpw, g);
    // Merge: only update the fields we re-validated
    setFieldErrors((prev) => ({ ...prev, ...errors }));
  }

  return (
    <>
      {/* Page-level overrides */}
      <style>{`
        html, body { margin: 0; padding: 0; height: 100%; }
        .rp-root { width: 100vw; min-height: 100vh; position: relative; overflow-x: hidden; font-family: 'Inter', 'Poppins', Arial, sans-serif; }
        .rp-bg {
          position: fixed; inset: 0; z-index: 0;
          background-image: url('/register-bg.png');
          background-size: cover;
          background-position: left center;
          background-repeat: no-repeat;
        }
        .rp-logo { position: fixed; top: 15px; left: 50px; z-index: 10; }
        .rp-layout {
          position: relative; z-index: 1;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 84px;
          box-sizing: border-box;
        }
        .rp-card {
          width: 347px;
          flex-shrink: 0;
          background-color: #29292B;
          border: 1px solid #A8F52A;
          border-radius: 11px;
          padding: 16px 20px 14px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-top: 78px;
          margin-bottom: 20px;
        }
        .rp-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 26px;
          background-color: #A8F52A;
          color: #0d0d0d;
          border: none;
          border-radius: 8px;
          font-size: 9px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          letter-spacing: 0.02em;
          margin-top: 4px;
          transition: background-color 0.15s, box-shadow 0.15s, transform 0.1s;
        }
        .rp-btn:hover:not(:disabled) {
          background-color: #bfff35;
          box-shadow: 0 2px 10px rgba(168,245,42,0.3);
        }
        .rp-btn:active:not(:disabled) { transform: scale(0.98); }
        .rp-btn:disabled { background-color: #7ab81e; cursor: not-allowed; }
        .rp-eye-btn {
          background: none; border: none; padding: 0;
          cursor: pointer; display: flex; align-items: center;
          color: #888; line-height: 0;
        }
        .rp-eye-btn:hover { color: #555; }
        @media (max-width: 900px) {
          .rp-layout { padding: 0 40px; }
        }
        @media (max-width: 640px) {
          .rp-layout {
            justify-content: center;
            padding: 80px 16px 24px;
            align-items: flex-start;
          }
          .rp-card {
            width: 100%;
            max-width: 400px;
            margin-top: 0;
          }
          .rp-logo { left: 20px; }
        }
      `}</style>

      <div className="rp-root">
        {/* Background */}
        <div className="rp-bg" aria-hidden="true" />

        {/* FitPro logo */}
        <div className="rp-logo">
          <Image
            src="/fitpro-logo.png"
            alt="FitPro"
            width={85}
            height={38}
            style={{ objectFit: "contain", filter: "drop-shadow(0 1px 8px rgba(0,0,0,0.7))" }}
            priority
          />
        </div>

        {/* Layout wrapper */}
        <div className="rp-layout">
          {/* Registration card */}
          <main className="rp-card" aria-label="Registration form">

            {/* ── Header ────────────────────────────────────────── */}
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <div aria-hidden="true" style={{ color: "#A8F52A", marginBottom: 3, lineHeight: 0 }}>
                <Dumbbell size={18} strokeWidth={2} />
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  letterSpacing: "0.01em",
                  lineHeight: 1.2,
                  fontFamily: "'Inter', Arial, sans-serif",
                }}
              >
                Register Now
              </h1>
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: 8,
                  color: "#BDBDBD",
                  lineHeight: 1.4,
                  fontWeight: 400,
                }}
              >
                Create your account to get started
              </p>
            </div>

            {/* ── Form ──────────────────────────────────────────── */}
            <form
              onSubmit={handleSubmit}
              noValidate
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              {/* Full Name */}
              <TextField
                label="Full Name"
                id={`${uid}name`}
                name="name"
                autoComplete="name"
                icon={<User size={11} strokeWidth={2} />}
                error={fieldErrors.name}
                value={name}
                onChange={(v) => { setName(v); touch({ n: v }); }}
              />

              {/* Phone */}
              <TextField
                label="Phone"
                id={`${uid}phone`}
                name="phone"
                type="tel"
                autoComplete="tel"
                icon={<Phone size={11} strokeWidth={2} />}
                error={fieldErrors.phone}
                value={phone}
                onChange={(v) => { setPhone(v); touch({ ph: v }); }}
              />

              {/* Address */}
              <TextField
                label="Address"
                id={`${uid}address`}
                name="address"
                autoComplete="street-address"
                icon={<MapPin size={11} strokeWidth={2} />}
                error={fieldErrors.address}
                value={address}
                onChange={(v) => { setAddress(v); touch({ addr: v }); }}
              />

              {/* Email */}
              <TextField
                label="Email"
                id={`${uid}email`}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="sumeestha@gmail.com"
                icon={<Mail size={11} strokeWidth={2} />}
                error={fieldErrors.email}
                value={email}
                onChange={(v) => { setEmail(v); touch({ em: v }); }}
              />

              {/* Password */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <TextField
                  label="Password"
                  id={`${uid}password`}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  icon={<Lock size={11} strokeWidth={2} />}
                  error={fieldErrors.password}
                  value={password}
                  onChange={(v) => { setPassword(v); touch({ pw: v }); }}
                  rightSlot={
                    <button
                      type="button"
                      className="rp-eye-btn"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((p) => !p)}
                    >
                      {showPassword
                        ? <EyeOff size={10} strokeWidth={2} />
                        : <Eye size={10} strokeWidth={2} />
                      }
                    </button>
                  }
                />
                <span
                  style={{
                    fontSize: 7,
                    color: "#888",
                    lineHeight: 1.3,
                    marginTop: 2,
                    paddingLeft: 25,
                  }}
                >
                  At least 6 characters, with a letter and a number.
                </span>
              </div>

              {/* Confirm Password */}
              <TextField
                label="Confirm Password"
                id={`${uid}confirm`}
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                icon={<Lock size={11} strokeWidth={2} />}
                error={fieldErrors.confirmPassword}
                value={confirmPassword}
                onChange={(v) => { setConfirmPassword(v); touch({ cpw: v }); }}
                rightSlot={
                  <button
                    type="button"
                    className="rp-eye-btn"
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                    onClick={() => setShowConfirm((p) => !p)}
                  >
                    {showConfirm
                      ? <EyeOff size={10} strokeWidth={2} />
                      : <Eye size={10} strokeWidth={2} />
                    }
                  </button>
                }
              />

              {/* Gender */}
              <fieldset
                style={{ border: "none", margin: 0, padding: 0 }}
                aria-describedby={fieldErrors.gender ? `${uid}gender-err` : undefined}
              >
                <legend
                  style={{
                    fontSize: 8,
                    color: "#BDBDBD",
                    fontWeight: 500,
                    letterSpacing: "0.03em",
                    lineHeight: 1,
                    padding: 0,
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  Gender
                </legend>

                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  {(["male", "female"] as Gender[]).map((g) => {
                    const selected = gender === g;
                    return (
                      <label
                        key={g}
                        htmlFor={`${uid}gender-${g}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          cursor: "pointer",
                          fontSize: 9,
                          color: "#FFFFFF",
                          userSelect: "none",
                        }}
                      >
                        {/* Visually hidden native radio */}
                        <input
                          type="radio"
                          id={`${uid}gender-${g}`}
                          name="gender"
                          value={g}
                          checked={selected}
                          onChange={() => { setGender(g); touch({ g }); }}
                          style={{
                            position: "absolute",
                            opacity: 0,
                            width: 1,
                            height: 1,
                            margin: 0,
                          }}
                        />
                        {/* Custom radio ring */}
                        <span
                          aria-hidden="true"
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            border: selected ? "none" : "1.5px solid #A8F52A",
                            backgroundColor: selected ? "#A8F52A" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "background-color 0.15s",
                          }}
                        >
                          {selected && (
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                backgroundColor: "#1a1a1a",
                              }}
                            />
                          )}
                        </span>
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </label>
                    );
                  })}
                </div>

                {fieldErrors.gender && (
                  <span
                    id={`${uid}gender-err`}
                    role="alert"
                    style={{ fontSize: 7, color: "#ef4444", lineHeight: 1.3, display: "block", marginTop: 2 }}
                  >
                    {fieldErrors.gender}
                  </span>
                )}
              </fieldset>

              {/* General API error */}
              {fieldErrors.general && (
                <p
                  role="alert"
                  style={{
                    margin: 0,
                    fontSize: 8,
                    color: "#ef4444",
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}
                >
                  {fieldErrors.general}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="rp-btn"
              >
                {loading ? (
                  "Creating account…"
                ) : (
                  <>
                    <span style={{ flex: 1, textAlign: "center", paddingLeft: 20 }}>
                      Create member account
                    </span>
                    <span style={{ paddingRight: 8, lineHeight: 0 }}>
                      <ArrowRight size={11} strokeWidth={2.5} />
                    </span>
                  </>
                )}
              </button>

              {/* Login link */}
              <p
                style={{
                  margin: "4px 0 0",
                  textAlign: "center",
                  fontSize: 8,
                  color: "#BDBDBD",
                  lineHeight: 1.4,
                }}
              >
                Already have an account?{" "}
                <Link
                  href="/login"
                  style={{ color: "#A8F52A", textDecoration: "none", fontWeight: 500 }}
                >
                  Log in
                </Link>
              </p>
            </form>
          </main>
        </div>
      </div>
    </>
  );
}
