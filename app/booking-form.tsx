"use client";

import { FormEvent, useState } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success"; reference: string }
  | { status: "error"; message: string };

type BookingFormProps = {
  detailed?: boolean;
  idPrefix?: string;
  packageName?: string;
  packageSlug?: string;
};

export function BookingForm({
  detailed = false,
  idPrefix = "booking",
  packageName = "",
  packageSlug = "",
}: BookingFormProps = {}) {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const fieldId = (name: string) => `${idPrefix}-${name}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ status: "sending" });

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (
      detailed &&
      typeof data.arrivalDate === "string" &&
      typeof data.departureDate === "string" &&
      data.arrivalDate &&
      data.departureDate &&
      data.departureDate <= data.arrivalDate
    ) {
      setSubmitState({
        status: "error",
        message: "Departure must be after your arrival date.",
      });
      return;
    }

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
        {packageName && <p className="success-package">{packageName}</p>}
        <small>Journey reference: {submitState.reference}</small>
        <button type="button" onClick={() => setSubmitState({ status: "idle" })}>
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form className={`booking-form ${detailed ? "booking-form-detailed" : ""}`} onSubmit={handleSubmit}>
      <input type="hidden" name="inquiryType" value={detailed ? "package_booking" : "custom_inquiry"} />
      <input type="hidden" name="packageName" value={packageName} />
      <input type="hidden" name="packageSlug" value={packageSlug} />
      <div className="field field-wide">
        <label htmlFor={fieldId("name")}>Your name *</label>
        <input id={fieldId("name")} name="name" required maxLength={120} autoComplete="name" placeholder="Your full name" />
      </div>
      <div className="field">
        <label htmlFor={fieldId("email")}>Email address *</label>
        <input id={fieldId("email")} name="email" type="email" required maxLength={180} autoComplete="email" placeholder="you@example.com" />
      </div>
      <div className="field">
        <label htmlFor={fieldId("whatsapp")}>Mobile phone</label>
        <input id={fieldId("whatsapp")} name="whatsapp" type="tel" maxLength={60} autoComplete="tel" placeholder="Your phone number" />
      </div>
      {detailed ? (
        <>
          <div className="field">
            <label htmlFor={fieldId("arrivalDate")}>Arrival date *</label>
            <input id={fieldId("arrivalDate")} name="arrivalDate" type="date" required />
          </div>
          <div className="field">
            <label htmlFor={fieldId("departureDate")}>Departure date *</label>
            <input id={fieldId("departureDate")} name="departureDate" type="date" required />
          </div>
          <div className="field field-third">
            <label htmlFor={fieldId("travellers")}>No. of pax *</label>
            <input id={fieldId("travellers")} name="travellers" type="number" min="1" max="30" defaultValue="2" required />
          </div>
          <div className="field field-third">
            <label htmlFor={fieldId("rooms")}>No. of rooms *</label>
            <input id={fieldId("rooms")} name="rooms" type="number" min="1" max="15" defaultValue="1" required />
          </div>
          <div className="field field-third">
            <label htmlFor={fieldId("mealPlan")}>Meal plan</label>
            <select id={fieldId("mealPlan")} name="mealPlan" defaultValue="bed-and-breakfast">
              <option value="bed-and-breakfast">Bed and breakfast</option>
              <option value="half-board">Half board</option>
              <option value="full-board">Full board</option>
            </select>
          </div>
        </>
      ) : (
        <>
          <div className="field">
            <label htmlFor={fieldId("travelDate")}>When would you like to travel?</label>
            <input id={fieldId("travelDate")} name="travelDate" type="month" />
          </div>
          <div className="field">
            <label htmlFor={fieldId("travellers")}>Travellers</label>
            <select id={fieldId("travellers")} name="travellers" defaultValue="2">
              <option value="1">1 traveller</option>
              <option value="2">2 travellers</option>
              <option value="3-4">3–4 travellers</option>
              <option value="5-8">5–8 travellers</option>
              <option value="9+">9+ travellers</option>
            </select>
          </div>
        </>
      )}
      {detailed ? (
        <input type="hidden" name="journey" value={packageSlug} />
      ) : (
        <div className="field">
          <label htmlFor={fieldId("journey")}>Journey idea</label>
          <select id={fieldId("journey")} name="journey" defaultValue="custom">
            <option value="custom">Create something custom</option>
            <option value="ceylon-signature">The Ceylon Signature</option>
            <option value="tea-trails">Tea Trails by Rail</option>
            <option value="wild-south">Wild South Escape</option>
          </select>
        </div>
      )}
      {!detailed && (
        <>
          <div className="field">
            <label htmlFor={fieldId("budget")}>Budget per person</label>
            <select id={fieldId("budget")} name="budget" defaultValue="">
              <option value="" disabled>Select a range</option>
              <option value="under-1500">Under US$1,500</option>
              <option value="1500-2500">US$1,500–2,500</option>
              <option value="2500-4000">US$2,500–4,000</option>
              <option value="4000+">US$4,000+</option>
            </select>
          </div>
          <div className="field field-wide">
            <label htmlFor={fieldId("message")}>What would make this trip special?</label>
            <textarea
              id={fieldId("message")}
              name="message"
              rows={4}
              maxLength={2000}
              placeholder="Wildlife, food, slow travel, a special celebration..."
            />
          </div>
        </>
      )}
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
        {submitState.status === "sending"
          ? "Sending…"
          : detailed
            ? "Confirm booking"
            : "Design my journey"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="form-privacy">
        By sending this form, you agree that we may contact you about your trip.
      </p>
    </form>
  );
}
