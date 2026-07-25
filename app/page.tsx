import type { Metadata } from "next";
import { BookingForm } from "./booking-form";

export const metadata: Metadata = {
  title: "Ceyluxe Tours | Private Sri Lanka Journeys",
  description:
    "Private, tailor-made Sri Lanka journeys crafted by local travel specialists. Explore culture, wildlife, hill country and the coast.",
};

const tours = [
  {
    eyebrow: "The complete island",
    title: "The Ceylon Signature",
    duration: "12 days · 11 nights",
    route: "Sigiriya · Kandy · Ella · Yala · Galle",
    image: "/images/sigiriya.jpg",
    alt: "Sigiriya rock rising above green forest in Sri Lanka",
    number: "01",
  },
  {
    eyebrow: "Highlands & heritage",
    title: "Tea Trails by Rail",
    duration: "8 days · 7 nights",
    route: "Kandy · Nuwara Eliya · Ella · Haputale",
    image: "/images/ella-train.jpg",
    alt: "Blue train travelling through Sri Lanka hill country",
    number: "02",
  },
  {
    eyebrow: "Wildlife & coast",
    title: "Wild South Escape",
    duration: "9 days · 8 nights",
    route: "Udawalawe · Yala · Mirissa · Galle",
    image: "/images/elephants.jpg",
    alt: "Elephants walking through a Sri Lankan landscape",
    number: "03",
  },
];

const inclusions = [
  "Private air-conditioned vehicle",
  "Handpicked boutique stays",
  "English-speaking chauffeur-guide",
  "24/7 in-country assistance",
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Ceyluxe Tours home">
          <span className="brand-mark">C</span>
          <span>
            <strong>CEYLUXE</strong>
            <small>TOURS · SRI LANKA</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#journeys">Journeys</a>
          <a href="#why-us">Why Ceyluxe</a>
          <a href="#process">How it works</a>
        </nav>
        <a className="header-cta" href="#plan">
          Plan my journey <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span />
            Private journeys across Sri Lanka
          </p>
          <h1>
            Sri Lanka,
            <br />
            <em>shaped around you.</em>
          </h1>
          <p className="hero-intro">
            Slow mornings, wild encounters and storied places—woven into one
            seamless private journey by people who call the island home.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#journeys">
              Explore journeys <span aria-hidden="true">↓</span>
            </a>
            <a className="text-link" href="#plan">
              Create a custom trip <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="hero-trust">
            <div>
              <strong>100%</strong>
              <span>Private & tailor-made</span>
            </div>
            <div>
              <strong>Island-wide</strong>
              <span>Local travel support</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src="/images/sigiriya.jpg"
            alt="Sigiriya rock fortress surrounded by forest"
          />
          <div className="hero-caption">
            <span>07°57&apos;N</span>
            <p>
              <strong>Sigiriya</strong>
              Cultural Triangle
            </p>
          </div>
          <div className="hero-stamp" aria-label="Made in Sri Lanka">
            <span>MADE IN</span>
            <strong>SL</strong>
            <span>SRI LANKA</span>
          </div>
        </div>
      </section>

      <div className="marquee" aria-label="Journey highlights">
        <span>ANCIENT CITIES</span><i>✦</i>
        <span>TEA COUNTRY</span><i>✦</i>
        <span>WILD SAFARIS</span><i>✦</i>
        <span>INDIAN OCEAN</span><i>✦</i>
        <span>LOCAL FLAVOURS</span>
      </div>

      <section className="journeys section-shell" id="journeys">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
              Begin with an idea
            </p>
            <h2>Signature journeys</h2>
          </div>
          <p>
            Thoughtful starting points, never fixed formulas. Every route can
            be slowed down, extended or completely reimagined.
          </p>
        </div>

        <div className="tour-grid">
          {tours.map((tour) => (
            <article className="tour-card" key={tour.title}>
              <div className="tour-image">
                <img src={tour.image} alt={tour.alt} />
                <span className="tour-number">{tour.number}</span>
              </div>
              <div className="tour-content">
                <p>{tour.eyebrow}</p>
                <h3>{tour.title}</h3>
                <div className="tour-meta">
                  <span>{tour.duration}</span>
                  <span>{tour.route}</span>
                </div>
                <a href="#plan" aria-label={`Plan ${tour.title}`}>
                  Tailor this journey <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="story" id="why-us">
        <div className="story-image">
          <img
            src="/images/south-coast.jpg"
            alt="Palm-fringed beach on Sri Lanka's south coast"
          />
          <div className="story-note">
            <span>South Coast</span>
            <strong>Stay longer.</strong>
            <p>The best journeys leave room for the unexpected.</p>
          </div>
        </div>
        <div className="story-copy">
          <p className="eyebrow light">
            <span />
            Travel, made personal
          </p>
          <h2>
            Luxury is having the
            <br />
            <em>right things taken care of.</em>
          </h2>
          <p>
            We pair local knowledge with calm, attentive planning. Your
            chauffeur-guide, stays and daily rhythm are chosen around how you
            want to experience Sri Lanka—not around a coach timetable.
          </p>
          <ul>
            {inclusions.map((item) => (
              <li key={item}>
                <span>✓</span>{item}
              </li>
            ))}
          </ul>
          <a className="button button-light" href="#plan">
            Start a conversation <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="process section-shell" id="process">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
              Simple by design
            </p>
            <h2>From idea to island</h2>
          </div>
          <p>
            One travel specialist stays with your journey from the first idea
            to your final airport transfer.
          </p>
        </div>
        <div className="process-grid">
          <article>
            <span>01</span>
            <h3>Tell us your travel style</h3>
            <p>Share your dates, pace, interests and the moments you imagine.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Receive your private route</h3>
            <p>We shape a considered itinerary and refine it together with you.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Arrive and travel easy</h3>
            <p>Your local team handles the details while you enjoy the island.</p>
          </article>
        </div>
      </section>

      <section className="planner" id="plan">
        <div className="planner-intro">
          <p className="eyebrow light">
            <span />
            Your journey starts here
          </p>
          <h2>Tell us where your imagination is going.</h2>
          <p>
            No pressure and no generic package. Send us a few details and a
            Ceyluxe travel specialist will shape the first outline of your trip.
          </p>
          <div className="planner-contact">
            <span>Email</span>
            <strong>hello@ceyluxetours.com</strong>
            <span>Based in</span>
            <strong>Colombo, Sri Lanka</strong>
          </div>
        </div>
        <BookingForm />
      </section>

      <footer>
        <div className="footer-brand">
          <a className="brand brand-light" href="#top">
            <span className="brand-mark">C</span>
            <span>
              <strong>CEYLUXE</strong>
              <small>TOURS · SRI LANKA</small>
            </span>
          </a>
          <p>Private journeys, thoughtfully made in Sri Lanka.</p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Explore</strong>
            <a href="#journeys">Journeys</a>
            <a href="#why-us">Why Ceyluxe</a>
            <a href="#process">How it works</a>
          </div>
          <div>
            <strong>Plan</strong>
            <a href="#plan">Custom journey</a>
            <a href="mailto:hello@ceyluxetours.com">Email us</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ceyluxe Tours</span>
          <span>Made with care in Sri Lanka</span>
        </div>
      </footer>
    </main>
  );
}
