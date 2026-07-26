"use client";

import { useEffect, useState } from "react";

type Tour = {
  slug: string;
  category: string;
  title: string;
  duration: string;
  route: string;
  image: string;
  alt: string;
  summary: string;
  highlights: string[];
  days: string[][];
};

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
      <a className="brand" href="#top" aria-label="Ceyluxe Tours home">
        <span className="brand-mark">C</span>
        <span><strong>CEYLUXE</strong><small>TOURS · SRI LANKA</small></span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#top">Home</a><a href="#about">About</a><a href="#journeys">Packages</a><a href="#gallery">Gallery</a><a href="#contact">Contact</a>
      </nav>
      <a className="header-cta" href="#plan">Inquiries</a>
      <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <a onClick={() => setOpen(false)} href="#top">Home</a><a onClick={() => setOpen(false)} href="#about">About</a><a onClick={() => setOpen(false)} href="#journeys">Packages</a><a onClick={() => setOpen(false)} href="#gallery">Gallery</a><a onClick={() => setOpen(false)} href="#contact">Contact</a><a onClick={() => setOpen(false)} href="#plan">Make an inquiry</a>
      </div>
    </header>
  );
}

export function TourPackages({ tours }: { tours: Tour[] }) {
  const [activeTour, setActiveTour] = useState<Tour | null>(null);

  useEffect(() => {
    document.body.style.overflow = activeTour ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeTour]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveTour(null);
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
            <div className="tour-image"><img src={tour.image} alt={tour.alt} /><span>{tour.category}</span></div>
            <div className="tour-content">
              <p>{tour.summary}</p><h3>{tour.title}</h3>
              <div className="tour-meta"><span>⌖ {tour.route}</span><span>◷ {tour.duration}</span></div>
              <ul>{tour.highlights.slice(0, 2).map((highlight) => <li key={highlight}>✓ {highlight}</li>)}</ul>
              <button type="button" onClick={() => setActiveTour(tour)}>Explore package <span>→</span></button>
            </div>
          </article>
        ))}
      </div>

      {activeTour && (
        <div className="tour-modal" role="dialog" aria-modal="true" aria-labelledby="tour-dialog-title" onMouseDown={(event) => { if (event.currentTarget === event.target) setActiveTour(null); }}>
          <div className="tour-dialog">
            <button className="modal-close" type="button" aria-label="Close package details" onClick={() => setActiveTour(null)}>×</button>
            <div className="dialog-hero"><img src={activeTour.image} alt={activeTour.alt} /><div><span>{activeTour.category}</span><h2 id="tour-dialog-title">{activeTour.title}</h2><p>{activeTour.duration}</p></div></div>
            <div className="dialog-body">
              <p className="dialog-summary">{activeTour.summary}</p>
              <div className="dialog-facts"><span>Route</span><strong>{activeTour.route}</strong></div>
              <h3>Journey highlights</h3>
              <ul className="dialog-highlights">{activeTour.highlights.map((item) => <li key={item}>✓ {item}</li>)}</ul>
              <h3>Day-by-day plan</h3>
              <div className="itinerary">{activeTour.days.map(([day, detail]) => <details key={day}><summary>{day}<span>+</span></summary><p>{detail}</p></details>)}</div>
              <div className="dialog-actions"><a href="#plan" onClick={() => setActiveTour(null)}>Reserve this journey <span>→</span></a><button type="button" onClick={() => setActiveTour(null)}>Keep exploring</button></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
