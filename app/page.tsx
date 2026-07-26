import type { Metadata } from "next";
import Image from "next/image";
import { tours } from "@/lib/tours";
import { BookingForm } from "./booking-form";
import { ScrollReveal, SiteHeader, TourPackages } from "./site-experience";

export const metadata: Metadata = {
  title: { absolute: "Ceyluxe Tours | Private Sri Lanka Journeys" },
  description:
    "Private, tailor-made Sri Lanka journeys crafted by local travel specialists. Explore culture, wildlife, hill country and the coast.",
};

const whatsappHref =
  "https://wa.me/?text=Hello%20Ceyluxe%20Tours%2C%20I%27d%20like%20to%20plan%20a%20Sri%20Lanka%20journey.";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <ScrollReveal />

      <section className="hero" id="top">
        <Image
          className="hero-background"
          src="/images/sigiriya.jpg"
          alt="Sigiriya rock fortress surrounded by Sri Lankan forest"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">Private journeys · Sri Lanka</p>
          <h1>
            Not just a holiday.
            <em>Sri Lanka, shaped around you.</em>
          </h1>
          <p>
            Ancient stories, misty railways and untamed shores—woven into one
            seamless private journey by people who call the island home.
          </p>
          <div className="hero-actions">
            <a className="button button-gold" href="#journeys">
              Explore the island <span>↓</span>
            </a>
            <a className="ghost-link" href="#plan">
              Create my journey <span>↗</span>
            </a>
          </div>
        </div>
        <div className="hero-side-note">
          <span>07°57&apos;N · 80°45&apos;E</span>
          <strong>Sigiriya</strong>
          <small>The Cultural Triangle</small>
        </div>
        <div className="scroll-cue"><span>Scroll to discover</span><i /></div>
      </section>

      <a
        className="whatsapp-float"
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Ceyluxe Tours on WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.1 4.9A9.85 9.85 0 0 0 3.6 16.8L2.2 22l5.3-1.4A9.8 9.8 0 0 0 12 21.7h.01A9.85 9.85 0 0 0 19.1 4.9Zm-7.09 15.14a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.14.82.84-3.06-.2-.31a8.17 8.17 0 1 1 6.93 3.86Zm4.49-6.06c-.25-.12-1.45-.72-1.68-.8-.22-.08-.38-.12-.55.12-.16.25-.63.8-.77.96-.14.17-.29.19-.53.07-1.43-.72-2.37-1.28-3.32-2.91-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.43-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.04s.88 2.36 1 2.53c.12.16 1.72 2.63 4.17 3.69 1.55.67 2.16.73 2.94.62.47-.07 1.45-.6 1.66-1.17.2-.57.2-1.06.14-1.16-.06-.1-.23-.16-.47-.29Z" />
        </svg>
        <span>WhatsApp</span>
      </a>

      <section className="pillars section-shell" id="about">
        <span className="giant-word" aria-hidden="true">Explore</span>
        <div className="section-title centered" data-reveal="up">
          <p>Discover the island</p>
          <h2>The three pillars of Ceyluxe</h2>
          <span>Every itinerary is grounded in nature, culture and the freedom to travel at your own pace.</span>
        </div>
        <div className="pillar-grid">
          <article className="pillar pillar-tall" data-reveal="left">
            <Image src="/images/elephants.jpg" alt="Elephants in Sri Lankan wilderness" fill sizes="(max-width: 700px) 100vw, 50vw" />
            <div><small>The wild</small><h3>Wilderness</h3><p>Private safaris, thoughtful naturalists and beautiful stays at the edge of the wild.</p></div>
          </article>
          <article className="pillar" data-reveal="up" data-reveal-delay="100">
            <Image src="/images/ella-train.jpg" alt="Scenic train in the Sri Lankan highlands" fill sizes="(max-width: 700px) 100vw, 50vw" />
            <div><small>The soul</small><h3>Serenity</h3><p>Slow railways, tea-country mornings and room for the unexpected.</p></div>
          </article>
          <blockquote data-reveal="right" data-reveal-delay="180">
            “We design each route around you—connecting you to the soul of the island with local insight and complete care.”
          </blockquote>
          <article className="pillar pillar-wide" data-reveal="up" data-reveal-delay="120">
            <Image src="/images/sigiriya.jpg" alt="Ancient Sigiriya rock fortress" fill sizes="(max-width: 700px) 100vw, 60vw" />
            <div><small>The story</small><h3>Heritage</h3><p>Ancient kingdoms, living traditions and local voices that bring every place to life.</p></div>
          </article>
        </div>
      </section>

      <div aria-label="Signature journeys">
        <TourPackages tours={tours} />
      </div>

      <section className="story" id="why-us">
        <div className="story-image" data-reveal="image">
          <Image src="/images/south-coast.jpg" alt="Palm-fringed beach on Sri Lanka's south coast" fill sizes="(max-width: 1050px) 100vw, 50vw" />
          <span>South Coast · Sri Lanka</span>
        </div>
        <div className="story-copy" data-reveal="right">
          <p className="eyebrow">Why travel with us</p>
          <h2>Luxury is having the right things taken care of.</h2>
          <p>
            Your route, chauffeur-guide, handpicked stays and daily rhythm are
            chosen around how you want to experience Sri Lanka—not around a coach timetable.
          </p>
          <ul>
            <li><span>01</span>100% private and tailor-made</li>
            <li><span>02</span>Local specialists, island-wide support</li>
            <li><span>03</span>Carefully chosen boutique stays</li>
          </ul>
          <a className="button button-gold" href="#plan">Start a conversation <span>→</span></a>
        </div>
      </section>

      <section className="gallery section-shell" id="gallery">
        <div className="section-title" data-reveal="up">
          <p>Moments from the island</p>
          <h2>Your Sri Lanka story awaits</h2>
        </div>
        <div className="gallery-grid">
          <div data-reveal="image"><Image src="/images/south-coast.jpg" alt="Sri Lanka's tropical south coast" fill sizes="(max-width: 700px) 100vw, 50vw" /></div>
          <div data-reveal="image" data-reveal-delay="100"><Image src="/images/ella-train.jpg" alt="Train journey through Ella" fill sizes="(max-width: 700px) 50vw, 25vw" /></div>
          <div data-reveal="image" data-reveal-delay="180"><Image src="/images/elephants.jpg" alt="Wild elephants in Sri Lanka" fill sizes="(max-width: 700px) 50vw, 25vw" /></div>
          <div data-reveal="image" data-reveal-delay="100"><Image src="/images/sigiriya.jpg" alt="Sigiriya at sunrise" fill sizes="(max-width: 700px) 100vw, 50vw" /></div>
        </div>
      </section>

      <section className="planner" id="plan">
        <div className="planner-intro" data-reveal="left">
          <p className="eyebrow">Your journey starts here</p>
          <h2>Tell us where your imagination is going.</h2>
          <p>
            Share a few details. A Ceyluxe travel specialist will create your
            first private itinerary—without pressure or generic packages.
          </p>
          <div className="direct-contact">
            <a href="mailto:hello@ceyluxetours.com">hello@ceyluxetours.com</a>
            <a href={whatsappHref} target="_blank" rel="noreferrer">Chat on WhatsApp ↗</a>
            <span>Colombo · Sri Lanka</span>
          </div>
        </div>
        <div data-reveal="right" data-reveal-delay="100"><BookingForm /></div>
      </section>

      <footer id="contact">
        <div className="footer-main" data-reveal="up">
          <div className="footer-brand">
            <a className="brand" href="#top" aria-label="Ceyluxe Tours home">
              <span className="brand-mark">C</span>
              <span><strong>CEYLUXE</strong><small>TOURS · SRI LANKA</small></span>
            </a>
            <p>Private journeys, thoughtfully made in Sri Lanka.</p>
          </div>
          <div className="footer-links">
            <strong>Explore</strong>
            <a href="#about">Our world</a><a href="#journeys">Journeys</a><a href="#gallery">Gallery</a>
          </div>
          <div className="footer-links">
            <strong>Contact</strong>
            <a href="mailto:hello@ceyluxetours.com">Email us</a><a href={whatsappHref}>WhatsApp</a><a href="#plan">Plan a journey</a>
          </div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Ceyluxe Tours</span><span>Made with care in Sri Lanka</span></div>
      </footer>
    </main>
  );
}
