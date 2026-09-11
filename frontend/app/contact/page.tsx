"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  User,
  FileText,
  Send,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Container } from "@/components/layout/Container";

const MAP_URL =
  "https://www.google.com/maps/place/Phoenix+fitshala/@26.6645026,87.6280086,17z/data=!3m1!4b1!4m6!3m5!1s0x39e58f2d87792859:0x8c2a5e6c57279bb6!8m2!3d26.6644978!4d87.6305835!16s%2Fg%2F11fl7k8z8y?entry=ttu&g_ep=EgoyMDI2MDkwOC4wIKXMDSoASAFQAw%3D%3D";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <div className="relative min-h-screen bg-base text-ink pt-20">
      {/* ── Top Interactive Dark Map Hero Section ── */}
      <div className="relative w-full h-[400px] md:h-[460px] overflow-hidden select-none">
        {/* Clickable Map Link */}
        <a
          href={MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Click to open location in Google Maps"
          aria-label="Open FitPro location in Google Maps"
          className="group relative block w-full h-full cursor-pointer overflow-hidden"
        >
          {/* Map Image Background */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              backgroundImage: "url('/map-bg.jpg')",
              filter: "brightness(1.08) contrast(1.08)",
            }}
          />

          {/* Dark gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

          {/* Glowing Center Map Location Highlight */}
          <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            {/* Illuminated square zone on map */}
            <div className="relative flex items-center justify-center">
              {/* Highlight diamond/square */}
              <div
                className="w-24 h-24 md:w-32 md:h-32 rounded-lg transition-all duration-300 group-hover:scale-110"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(182,229,9,0.35) 0%, rgba(182,229,9,0.12) 100%)",
                  border: "1.5px solid rgba(182,229,9,0.6)",
                  boxShadow:
                    "0 0 35px rgba(182,229,9,0.4), inset 0 0 20px rgba(182,229,9,0.2)",
                  transform: "rotate(15deg)",
                }}
              />

              {/* Pulsing Radar Ring */}
              <div
                aria-hidden="true"
                className="absolute w-14 h-14 rounded-full border border-accent/60 animate-ping opacity-60 pointer-events-none"
              />

              {/* Center Map Pin Icon */}
              <div className="absolute flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg"
                    style={{
                      background: "#B6E509",
                      boxShadow: "0 0 24px rgba(182,229,9,0.85)",
                    }}
                  >
                    <MapPin className="w-6 h-6 md:w-7 md:h-7 text-black fill-black" />
                  </div>
                  {/* Pin Point shadow */}
                  <div className="absolute -bottom-1 w-3 h-1 bg-black/60 rounded-full blur-[1px]" />
                </div>
              </div>
            </div>

            {/* Hover tooltip badge */}
            <div className="mt-3 px-3.5 py-1.5 rounded-full bg-[#15170F]/90 border border-accent/40 text-xs font-semibold text-accent flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:border-accent transition-all duration-200 shadow-md">
              <span>FitPro Location</span>
              <ExternalLink className="w-3 h-3 text-accent" />
            </div>
          </div>
        </a>
      </div>

      {/* ── Main Overlapping Contact Card ── */}
      <Container className="relative -mt-28 md:-mt-36 z-20 pb-24 max-w-6xl">
        {/* Red Center Indicator Dot at top of card */}
        <div className="flex justify-center -mb-2 relative z-30 pointer-events-none">
          <div
            className="w-3.5 h-3.5 rounded-full bg-[#E53E3E] border-2 border-[#12140E] shadow-[0_0_12px_#E53E3E]"
            title="FitPro Location Pinpoint"
          />
        </div>

        {/* Card Container */}
        <div
          className="relative rounded-[24px] md:rounded-[30px] border border-[#272B1E] bg-[#12140D]/95 backdrop-blur-xl p-6 sm:p-10 md:p-14 shadow-[0_30px_70px_rgba(0,0,0,0.8)]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 15%, rgba(182,229,9,0.03) 0%, transparent 60%)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* ── Left Column: Contact Details ── */}
            <div className="lg:col-span-5 flex flex-col gap-7">
              <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-wide text-white">
                Contact Us
              </h1>

              <div className="flex flex-col gap-6 pt-1">
                {/* Visit Address */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Visit Address
                    </h3>
                    <p className="mt-0.5 text-sm text-ink-muted leading-relaxed">
                      Urlabari, Morang
                      <br />
                      FitPro Center, NP 56600
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Phone className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <a
                      href="tel:+0112003655"
                      className="text-sm font-medium text-white hover:text-accent transition-colors"
                    >
                      +01 120036
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <a
                      href="mailto:fitprocontact@gmail.com"
                      className="text-sm font-medium text-white hover:text-accent transition-colors"
                    >
                      fitprocontact@gmail.com
                    </a>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-ink-muted">
                      Average response time:{" "}
                      <span className="text-white font-medium">&lt; 2 hours</span>
                    </p>
                  </div>
                </div>

                {/* Go to FAQ */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <HelpCircle className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <Link
                      href="/about#faq"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-accent transition-colors group"
                    >
                      <span>Go to FAQ</span>
                      <span className="transition-transform group-hover:translate-x-0.5">
                        &rarr;
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Column: Form ── */}
            <div className="lg:col-span-7 flex flex-col">
              <div>
                <h2 className="text-3xl sm:text-4xl font-display uppercase tracking-wide text-white">
                  Ready to connect?
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Tell us your goals.
                </p>
              </div>

              {submitted ? (
                <div className="mt-8 rounded-2xl border border-accent/40 bg-accent/10 p-8 text-center flex flex-col items-center gap-3">
                  <CheckCircle2 className="h-12 w-12 text-accent" />
                  <h3 className="text-xl font-bold text-white">
                    Message Sent Successfully!
                  </h3>
                  <p className="max-w-md text-sm text-ink-muted leading-relaxed">
                    Thank you for reaching out to FitPro. A member of our team
                    will review your message and get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider transition-all hover:bg-accent-hover hover:scale-105 active:scale-95"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                  {/* Row 1: Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-ink-faint">
                        <User className="h-4 w-4 text-accent/80" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="contact-name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Name"
                        className="w-full rounded-full sm:rounded-pill bg-[#202319] border border-[#2F3423] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-ink-faint outline-none transition-all duration-200 focus:border-accent focus:bg-[#252a1d] focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-ink-faint">
                        <Mail className="h-4 w-4 text-accent/80" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="contact-email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Email"
                        className="w-full rounded-full sm:rounded-pill bg-[#202319] border border-[#2F3423] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-ink-faint outline-none transition-all duration-200 focus:border-accent focus:bg-[#252a1d] focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>

                  {/* Row 2: Subject */}
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-ink-faint">
                      <FileText className="h-4 w-4 text-accent/80" />
                    </div>
                    <input
                      type="text"
                      name="subject"
                      id="contact-subject"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="Subject"
                      className="w-full rounded-full sm:rounded-pill bg-[#202319] border border-[#2F3423] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-ink-faint outline-none transition-all duration-200 focus:border-accent focus:bg-[#252a1d] focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  {/* Row 3: Message */}
                  <div className="relative">
                    <textarea
                      name="message"
                      id="contact-message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Message"
                      className="w-full rounded-[18px] bg-[#202319] border border-[#2F3423] p-4 text-sm text-white placeholder:text-ink-faint outline-none transition-all duration-200 focus:border-accent focus:bg-[#252a1d] focus:ring-1 focus:ring-accent resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="mt-2 flex justify-start sm:justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent px-9 py-3.5 text-sm font-bold text-black uppercase tracking-wider transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_0_20px_rgba(182,229,9,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isSubmitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="h-4 w-4 text-black" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
