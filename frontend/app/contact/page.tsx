"use client";

import { FormEvent, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO(Phase 7): replace with contact.service.ts POST to /api/v1/contact/
    setSubmitted(true);
  }

  return (
    <div className="pb-24 pt-36">
      <Container className="max-w-lg">
        <h1 className="text-display-md md:text-display-lg text-ink">Contact us</h1>
        <p className="mt-4 text-ink-muted">
          Questions about membership, classes or an order — we usually reply
          within a business day.
        </p>

        {submitted ? (
          <p className="mt-10 rounded-card border border-accent/40 bg-accent-muted px-5 py-4 text-sm text-ink">
            Thanks — your message is in. We'll get back to you shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
            <Input label="Name" name="name" required />
            <Input label="Email" name="email" type="email" required />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm text-ink-muted">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="rounded-control border border-base-border bg-base-raised px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
              />
            </div>
            <Button type="submit" size="lg" className="self-start">
              Send message
            </Button>
          </form>
        )}
      </Container>
    </div>
  );
}
