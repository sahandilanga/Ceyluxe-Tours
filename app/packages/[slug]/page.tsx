import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/app/booking-form";
import { ScrollReveal, SiteHeader } from "@/app/site-experience";
import { getTour, tours } from "@/lib/tours";

type PackagePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const tour = getTour((await params).slug);
  if (!tour) return {};

  return {
    title: tour.title,
    description: tour.summary,
    openGraph: {
      title: `${tour.title} | Ceyluxe Tours`,
      description: tour.summary,
      images: [{ url: tour.image }],
    },
  };
}

export default async function PackageDetailPage({ params }: PackagePageProps) {
  const tour = getTour((await params).slug);
  if (!tour) notFound();

  return (
    <main>
      <SiteHeader />
      <ScrollReveal />

      <section className="package-detail-hero">
        <Image src={tour.image} alt={tour.alt} fill priority sizes="100vw" />
        <div className="package-detail-shade" />
        <div className="package-detail-heading">
          <Link href="/packages">← All journeys</Link>
          <p>{tour.category} · Private tour</p>
          <h1>{tour.title}</h1>
          <div>
            <span>{tour.duration} / {tour.nights}</span>
            <span>{tour.route}</span>
          </div>
        </div>
      </section>

      <section className="package-overview section-shell">
        <div className="package-overview-copy" data-reveal="left">
          <p className="eyebrow">The journey</p>
          <h2>{tour.summary}</h2>
          <p>{tour.intro}</p>
          <a className="button button-gold" href="#booking">Reserve this journey <span>↓</span></a>
        </div>
        <aside data-reveal="right">
          <p>Journey highlights</p>
          <ul>
            {tour.highlights.map((highlight, index) => (
              <li key={highlight}><span>{String(index + 1).padStart(2, "0")}</span>{highlight}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="day-plan section-shell">
        <div className="section-title" data-reveal="up">
          <p>Day-by-day plan</p>
          <h2>Your island story, one day at a time</h2>
          <span>The plan remains flexible until every detail feels right for you.</span>
        </div>
        <div className="day-accordions">
          {tour.days.map((day, index) => (
            <details key={day.title} data-reveal="up" data-reveal-delay={String(Math.min(index * 40, 240))}>
              <summary>
                <span>{day.title}</span>
                <strong>{day.route}</strong>
                <i aria-hidden="true">+</i>
              </summary>
              <p>{day.description}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="package-booking" id="booking">
        <div className="package-booking-intro" data-reveal="left">
          <p className="eyebrow">Reserve this journey</p>
          <h2>Begin planning<br />{tour.title}.</h2>
          <p>
            Send your preferred dates and group details. A Ceyluxe specialist
            will confirm availability and shape a private proposal around you.
          </p>
          <div>
            <span>Selected package</span>
            <strong>{tour.title}</strong>
            <small>{tour.duration} · {tour.nights}</small>
          </div>
        </div>
        <div data-reveal="right">
          <BookingForm
            detailed
            packageName={tour.title}
            packageSlug={tour.slug}
          />
        </div>
      </section>
    </main>
  );
}
