import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { tours } from "@/lib/tours";
import { ScrollReveal, SiteHeader } from "../site-experience";

export const metadata: Metadata = {
  title: "Private Sri Lanka Tour Packages",
  description:
    "Explore private Sri Lanka itineraries across the Cultural Triangle, hill country, wildlife parks and south coast.",
};

export default function PackagesPage() {
  return (
    <main>
      <SiteHeader />
      <ScrollReveal />
      <section className="packages-hero">
        <div>
          <p className="eyebrow">Curated starting points</p>
          <h1>Private journeys,<br /><em>made personal.</em></h1>
          <p>
            Choose an itinerary that speaks to you. Every route, stay and daily
            rhythm can be reshaped by your Ceyluxe travel specialist.
          </p>
        </div>
      </section>

      <section className="package-catalog section-shell">
        <div className="section-title" data-reveal="up">
          <p>Explore our collection</p>
          <h2>Signature Sri Lanka tours</h2>
          <span>Privately guided, thoughtfully paced and completely flexible.</span>
        </div>
        <div className="package-list">
          {tours.map((tour, index) => (
            <article className="package-list-card" key={tour.slug} data-reveal="up" data-reveal-delay={String(index * 100)}>
              <Link className="package-list-image" href={`/packages/${tour.slug}`}>
                <Image src={tour.image} alt={tour.alt} fill sizes="(max-width: 1050px) 100vw, 45vw" />
                <span>{tour.category}</span>
              </Link>
              <div className="package-list-copy">
                <p>{tour.duration} · {tour.nights}</p>
                <h2><Link href={`/packages/${tour.slug}`}>{tour.title}</Link></h2>
                <span>{tour.route}</span>
                <p className="package-summary">{tour.summary}</p>
                <ul>
                  {tour.highlights.slice(0, 3).map((highlight) => (
                    <li key={highlight}>✓ {highlight}</li>
                  ))}
                </ul>
                <div className="package-card-actions">
                  <Link className="button button-gold" href={`/packages/${tour.slug}`}>View itinerary <span>→</span></Link>
                  <Link href={`/packages/${tour.slug}#booking`}>Reserve this tour</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
