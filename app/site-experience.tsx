"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Tour } from "@/lib/tours";
import { BookingForm } from "./booking-form";

export function ScrollReveal() {
  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-revealed"));
      return () => document.documentElement.classList.remove("reveal-ready");
    }

    elements.forEach((element) => {
      const delay = element.dataset.revealDelay;
      if (delay) element.style.setProperty("--reveal-delay", `${delay}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <Link className="brand" href="/#top" aria-label="Ceyluxe Tours home">
        <span className="brand-mark">C</span>
        <span><strong>CEYLUXE</strong><small>TOURS · SRI LANKA</small></span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <Link href="/#top">Home</Link><Link href="/#about">About</Link><Link href="/#journeys">Packages</Link><Link href="/#gallery">Gallery</Link><Link href="/#contact">Contact</Link>
      </nav>
      <Link className="header-cta" href="/#plan">Inquiries</Link>
      <button className="menu-button" type="button" aria-label="Toggle navigation" aria-controls="mobile-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
      <div id="mobile-navigation" className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open} inert={!open}>
        <Link onClick={() => setOpen(false)} href="/#top">Home</Link><Link onClick={() => setOpen(false)} href="/#about">About</Link><Link onClick={() => setOpen(false)} href="/#journeys">Packages</Link><Link onClick={() => setOpen(false)} href="/#gallery">Gallery</Link><Link onClick={() => setOpen(false)} href="/#contact">Contact</Link><Link onClick={() => setOpen(false)} href="/#plan">Make an inquiry</Link>
      </div>
    </header>
  );
}

export function TourPackages({ tours }: { tours: Tour[] }) {
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  function openTour(tour: Tour) {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setShowBooking(false);
    setActiveTour(tour);
  }

  function closeTour() {
    setShowBooking(false);
    setActiveTour(null);
    window.setTimeout(() => previousFocusRef.current?.focus(), 0);
  }

  useEffect(() => {
    document.body.style.overflow = activeTour ? "hidden" : "";
    if (activeTour) window.setTimeout(() => closeButtonRef.current?.focus(), 0);
    return () => { document.body.style.overflow = ""; };
  }, [activeTour]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeTour();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <section className="journeys section-shell" id="journeys">
      <div className="section-title centered" data-reveal="up">
        <p>Curated experiences</p>
        <h2>Signature journeys</h2>
        <span>Choose a considered starting point. Every detail can be changed around you.</span>
      </div>
      <div className="tour-grid">
        {tours.map((tour, index) => (
          <article
            className="tour-card"
            key={tour.slug}
            data-reveal="up"
            data-reveal-delay={String(index * 110)}
          >
            <div className="tour-image"><Image src={tour.image} alt={tour.alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" /><span>{tour.category}</span></div>
            <div className="tour-content">
              <p>{tour.summary}</p><h3>{tour.title}</h3>
              <div className="tour-meta"><span>⌖ {tour.route}</span><span>◷ {tour.duration} / {tour.nights}</span></div>
              <ul>{tour.highlights.slice(0, 2).map((highlight) => <li key={highlight}>✓ {highlight}</li>)}</ul>
              <button type="button" onClick={() => openTour(tour)}>Explore package <span>→</span></button>
            </div>
          </article>
        ))}
      </div>

      {activeTour && (
        <div className="tour-modal" role="dialog" aria-modal="true" aria-labelledby="tour-dialog-title" onMouseDown={(event) => { if (event.currentTarget === event.target) closeTour(); }}>
          <div className="tour-dialog">
            <button ref={closeButtonRef} className="modal-close" type="button" aria-label="Close package details" onClick={closeTour}>×</button>
            {!showBooking && (
              <div className="dialog-hero"><Image src={activeTour.image} alt={activeTour.alt} fill sizes="(max-width: 1000px) 100vw, 1000px" /><div><span>{activeTour.category}</span><h2 id="tour-dialog-title">{activeTour.title}</h2><p>{activeTour.duration} / {activeTour.nights}</p></div></div>
            )}
            {showBooking ? (
              <div className="modal-booking">
                <button className="modal-back" type="button" onClick={() => setShowBooking(false)}>← Package details</button>
                <div className="modal-booking-heading">
                  <p>Booking form</p>
                  <h3 id="tour-dialog-title">Reserve {activeTour.title}</h3>
                </div>
                <BookingForm
                  detailed
                  idPrefix={`modal-${activeTour.slug}`}
                  packageName={activeTour.title}
                  packageSlug={activeTour.slug}
                />
              </div>
            ) : (
              <div className="dialog-body">
                <p className="dialog-summary">{activeTour.summary}</p>
                <div className="dialog-facts"><span>Route</span><strong>{activeTour.route}</strong></div>
                <h3>Journey highlights</h3>
                <ul className="dialog-highlights">{activeTour.highlights.map((item) => <li key={item}>✓ {item}</li>)}</ul>
                <h3>Day-by-day plan</h3>
                <div className="itinerary">{activeTour.days.slice(0, 4).map((day) => <details key={day.title}><summary>{day.title} · {day.route}<span>+</span></summary><p>{day.description}</p></details>)}</div>
                <div className="dialog-actions"><button className="dialog-book-button" type="button" onClick={() => setShowBooking(true)}>Book this journey <span>→</span></button><button type="button" onClick={closeTour}>Keep exploring</button></div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
