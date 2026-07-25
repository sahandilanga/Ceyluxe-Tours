"use client";

import { FormEvent, useState } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success"; reference: string }
  | { status: "error"; message: string };

export function BookingForm() {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ status: "sending" });

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as {
        reference?: string;
        error?: string;
      };

      if (!response.ok || !result.reference) {
        throw new Error(result.error || "We could not send your request.");
      }

      form.reset();
      setSubmitState({ status: "success", reference: result.reference });
    } catch (error) {
      setSubmitState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
  }

  if (submitState.status === "success") {
    return (
      <div className="form-success" role="status">
        <span>✓</span>
        <p>Thank you — your journey is in motion.</p>
        <h3>We&apos;ll be in touch within one working day.</h3>
        <small>Journey reference: {submitState.reference}</small>
        <button type="button" onClick={() => setSubmitState({ status: "idle" })}>
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div className="field field-wide">
        <label htmlFor="name">Your name *</label>
        <input id="name" name="name" required placeholder="How should we address you?" />
      </div>
      <div className="field">
        <label htmlFor="email">Email address *</label>
        <input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>
      <div className="field">
        <label htmlFor="whatsapp">WhatsApp / phone</label>
        <input id="whatsapp" name="whatsapp" type="tel" placeholder="+44 7..." />
      </div>
      <div className="field">
        <label htmlFor="travelDate">When would you like to travel?</label>
        <input id="travelDate" name="travelDate" type="month" />
      </div>
      <div className="field">
        <label htmlFor="travellers">Travellers</label>
        <select id="travellers" name="travellers" defaultValue="2">
          <option value="1">1 traveller</option>
          <option value="2">2 travellers</option>
          <option value="3-4">3–4 travellers</option>
          <option value="5-8">5–8 travellers</option>
          <option value="9+">9+ travellers</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="journey">Journey idea</label>
        <select id="journey" name="journey" defaultValue="custom">
          <option value="custom">Create something custom</option>
          <option value="ceylon-signature">The Ceylon Signature</option>
          <option value="tea-trails">Tea Trails by Rail</option>
          <option value="wild-south">Wild South Escape</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="budget">Budget per person</label>
        <select id="budget" name="budget" defaultValue="">
          <option value="" disabled>Select a range</option>
          <option value="under-1500">Under US$1,500</option>
          <option value="1500-2500">US$1,500–2,500</option>
          <option value="2500-4000">US$2,500–4,000</option>
          <option value="4000+">US$4,000+</option>
        </select>
      </div>
      <div className="field field-wide">
        <label htmlFor="message">What would make this trip special?</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Wildlife, food, slow travel, a special celebration..."
        />
      </div>
      <input
        className="honeypot"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {submitState.status === "error" && (
        <p className="form-error" role="alert">{submitState.message}</p>
      )}
      <button
        className="form-submit"
        type="submit"
        disabled={submitState.status === "sending"}
      >
        {submitState.status === "sending" ? "Sending…" : "Design my journey"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="form-privacy">
        By sending this form, you agree that we may contact you about your trip.
      </p>
    </form>
  );
}
