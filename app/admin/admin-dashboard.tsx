"use client";

import { UserButton, useAuth, useUser } from "@clerk/react";
import Image from "next/image";
import Link from "next/link";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Tab = "overview" | "bookings" | "tours";
type BookingStatus = "new" | "contacted" | "quoted" | "confirmed" | "closed";
type WorkspaceState = "waiting-for-auth" | "loading" | "online" | "error";

type Booking = {
  _id: string;
  reference: string;
  inquiryType: "custom_inquiry" | "package_booking";
  packageName: string;
  name: string;
  email: string;
  whatsapp: string;
  travelDate: string;
  arrivalDate: string;
  departureDate: string;
  travellers: string;
  rooms: string;
  mealPlan: string;
  journey: string;
  budget: string;
  message: string;
  status: BookingStatus;
  adminNotes: string;
  createdAt: string;
};

type TourDay = {
  title: string;
  route: string;
  description: string;
};

type AdminTour = {
  _id: string;
  slug: string;
  category: string;
  title: string;
  duration: string;
  nights: string;
  route: string;
  image: string;
  alt: string;
  summary: string;
  intro: string;
  highlights: string[];
  days: TourDay[];
  isPublished: boolean;
  sortOrder: number;
  updatedAt: string;
};

type Overview = {
  stats: {
    totalBookings: number;
    newBookings: number;
    confirmedBookings: number;
    activeTours: number;
  };
  recentBookings: Booking[];
  system?: {
    database: "connected";
    api: "online";
  };
};

class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const statusLabels: Record<BookingStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  confirmed: "Confirmed",
  closed: "Closed",
};

const blankDay = (index: number): TourDay => ({
  title: `Day ${String(index + 1).padStart(2, "0")}`,
  route: "",
  description: "",
});

function friendlyDate(value: string) {
  if (!value) return "Not supplied";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminDashboard() {
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [tab, setTab] = useState<Tab>("overview");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tours, setTours] = useState<AdminTour[]>([]);
  const [workspaceState, setWorkspaceState] =
    useState<WorkspaceState>("waiting-for-auth");
  const [error, setError] = useState("");
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingTour, setEditingTour] = useState<AdminTour | "new" | null>(null);

  const request = useCallback(
    async <T,>(path: string, init: RequestInit = {}): Promise<T> => {
      let lastResponse: Response | null = null;

      for (let attempt = 0; attempt < 2; attempt += 1) {
        const token = await getToken();
        const headers = new Headers(init.headers);
        if (token) headers.set("Authorization", `Bearer ${token}`);
        if (init.body && !(init.body instanceof FormData)) {
          headers.set("Content-Type", "application/json");
        }

        const response = await fetch(`/api/admin/${path}`, {
          ...init,
          headers,
          cache: "no-store",
          credentials: "same-origin",
        });
        lastResponse = response;

        if (response.status === 401 && attempt === 0) {
          await wait(450);
          continue;
        }

        const result = (await response.json().catch(() => ({}))) as T & {
          error?: string;
        };
        if (!response.ok) {
          const message =
            response.status === 401
              ? "Your Clerk session could not be verified. Sign out, sign in again, and retry."
              : response.status === 403
                ? "This account is signed in but is not listed in ADMIN_USER_IDS."
                : response.status === 502
                  ? "The backend service is offline. Start the backend and retry."
                  : result.error || "The request could not be completed.";
          throw new AdminApiError(message, response.status);
        }
        return result;
      }

      throw new AdminApiError(
        "The admin session could not be verified.",
        lastResponse?.status ?? 401,
      );
    },
    [getToken],
  );

  const loadOverview = useCallback(async () => {
    const result = await request<Overview>("overview");
    setOverview(result);
  }, [request]);

  const loadBookings = useCallback(
    async (nextSearch: string, nextStatus: string) => {
      const params = new URLSearchParams();
      if (nextSearch.trim()) params.set("search", nextSearch.trim());
      if (nextStatus) params.set("status", nextStatus);
      const result = await request<{ bookings: Booking[] }>(
        `bookings?${params.toString()}`,
      );
      setBookings(result.bookings);
    },
    [request],
  );

  const loadTours = useCallback(async () => {
    const result = await request<{ tours: AdminTour[] }>("tours");
    setTours(result.tours);
  }, [request]);

  const loadWorkspace = useCallback(async () => {
    setWorkspaceState("loading");
    setError("");
    setErrorStatus(null);

    try {
      const [overviewResult, bookingResult, tourResult] = await Promise.all([
        request<Overview>("overview"),
        request<{ bookings: Booking[] }>("bookings"),
        request<{ tours: AdminTour[] }>("tours"),
      ]);
      setOverview(overviewResult);
      setBookings(bookingResult.bookings);
      setTours(tourResult.tours);
      setWorkspaceState("online");
    } catch (caught) {
      setWorkspaceState("error");
      setErrorStatus(caught instanceof AdminApiError ? caught.status : null);
      setError(
        caught instanceof Error
          ? caught.message
          : "The admin workspace could not be loaded.",
      );
    }
  }, [request]);

  useEffect(() => {
    if (!authLoaded || !isSignedIn) {
      return;
    }

    const timer = window.setTimeout(() => {
      void loadWorkspace();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [authLoaded, isSignedIn, loadWorkspace]);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  async function updateBooking(
    booking: Booking,
    update: Partial<Pick<Booking, "status" | "adminNotes">>,
  ) {
    try {
      const result = await request<{ booking: Booking }>(
        `bookings/${booking._id}`,
        { method: "PATCH", body: JSON.stringify(update) },
      );
      setBookings((current) =>
        current.map((item) => (item._id === booking._id ? result.booking : item)),
      );
      setSelectedBooking((current) =>
        current?._id === booking._id ? result.booking : current,
      );
      await loadOverview();
      showNotice("Booking updated");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update booking.");
    }
  }

  async function toggleTour(tour: AdminTour) {
    try {
      const result = await request<{ tour: AdminTour }>(
        `tours/${tour._id}/visibility`,
        {
          method: "PATCH",
          body: JSON.stringify({ isPublished: !tour.isPublished }),
        },
      );
      setTours((current) =>
        current.map((item) => (item._id === tour._id ? result.tour : item)),
      );
      await loadOverview();
      showNotice(result.tour.isPublished ? "Tour published" : "Tour moved to draft");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update tour.");
    }
  }

  async function tourSaved(savedTour: AdminTour) {
    await Promise.all([loadTours(), loadOverview()]);
    setEditingTour(null);
    showNotice(
      savedTour.isPublished
        ? "Tour saved — it is now visible on the website"
        : "Tour saved as a draft",
    );
  }

  const name =
    user?.firstName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "Admin";

  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/">
          <span>C</span>
          <strong>CEYLUXE</strong>
        </Link>
        <nav aria-label="Admin sections">
          <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>
            <i>01</i> Overview
          </button>
          <button className={tab === "bookings" ? "active" : ""} onClick={() => setTab("bookings")}>
            <i>02</i> Bookings
            {!!overview?.stats.newBookings && <b>{overview.stats.newBookings}</b>}
          </button>
          <button className={tab === "tours" ? "active" : ""} onClick={() => setTab("tours")}>
            <i>03</i> Tours
          </button>
        </nav>
        <div className="admin-sidebar-bottom">
          <Link href="/" target="_blank">View live website ↗</Link>
          <span>Secure admin workspace</span>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p>Operations dashboard</p>
            <h1>{tab === "overview" ? `Good day, ${name}` : tab === "bookings" ? "Guest bookings" : "Tour collection"}</h1>
          </div>
          <div className="admin-account">
            <span
              className={`admin-connection admin-connection-${workspaceState}`}
            >
              <i />
              {workspaceState === "online"
                ? "Backend connected"
                : workspaceState === "error"
                  ? errorStatus === 401
                    ? "Session not verified"
                    : errorStatus === 403
                      ? "Admin access denied"
                      : "Backend unavailable"
                  : "Connecting…"}
            </span>
            <span>{user?.primaryEmailAddress?.emailAddress}</span>
            <UserButton />
          </div>
        </header>

        {notice && <div className="admin-toast" role="status">✓ {notice}</div>}
        {error && workspaceState !== "error" && (
          <div className="admin-error" role="alert">
            <span>{error}</span>
            <button onClick={() => setError("")}>Dismiss</button>
          </div>
        )}

        {workspaceState === "waiting-for-auth" ||
        workspaceState === "loading" ? (
          <div className="admin-loading"><span /><p>Preparing your workspace…</p></div>
        ) : workspaceState === "error" ? (
          <WorkspaceError
            message={error}
            status={errorStatus}
            onRetry={() => void loadWorkspace()}
          />
        ) : (
          <>
            {tab === "overview" && overview && (
              <OverviewPanel overview={overview} onOpenBookings={() => setTab("bookings")} onAddTour={() => { setTab("tours"); setEditingTour("new"); }} />
            )}
            {tab === "bookings" && (
              <BookingsPanel
                bookings={bookings}
                search={search}
                statusFilter={statusFilter}
                onSearchChange={setSearch}
                onStatusChange={(value) => {
                  setStatusFilter(value);
                  void loadBookings(search, value);
                }}
                onSubmit={() => void loadBookings(search, statusFilter)}
                onSelect={setSelectedBooking}
                onStatusUpdate={(booking, status) => void updateBooking(booking, { status })}
              />
            )}
            {tab === "tours" && (
              <ToursPanel
                tours={tours}
                onAdd={() => setEditingTour("new")}
                onEdit={setEditingTour}
                onToggle={(tour) => void toggleTour(tour)}
              />
            )}
          </>
        )}
      </section>

      {selectedBooking && (
        <BookingDrawer
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSave={(adminNotes) => void updateBooking(selectedBooking, { adminNotes })}
        />
      )}
      {editingTour && (
        <TourEditor
          tour={editingTour === "new" ? null : editingTour}
          request={request}
          onClose={() => setEditingTour(null)}
          onSaved={(savedTour) => void tourSaved(savedTour)}
          onError={setError}
        />
      )}
    </main>
  );
}

function OverviewPanel({
  overview,
  onOpenBookings,
  onAddTour,
}: {
  overview: Overview;
  onOpenBookings: () => void;
  onAddTour: () => void;
}) {
  const cards = [
    ["Total bookings", overview.stats.totalBookings, "All enquiries received"],
    ["Needs attention", overview.stats.newBookings, "New guest requests"],
    ["Confirmed", overview.stats.confirmedBookings, "Confirmed journeys"],
    ["Live tours", overview.stats.activeTours, "Published packages"],
  ] as const;

  return (
    <div className="admin-content">
      <section className="admin-stats">
        {cards.map(([label, value, hint], index) => (
          <article key={label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{label}</p>
            <strong>{value}</strong>
            <small>{hint}</small>
          </article>
        ))}
      </section>
      <section className="admin-grid">
        <article className="admin-panel recent-panel">
          <div className="admin-panel-heading">
            <div><p>Latest activity</p><h2>Recent bookings</h2></div>
            <button onClick={onOpenBookings}>View all →</button>
          </div>
          {overview.recentBookings.length ? (
            <div className="recent-list">
              {overview.recentBookings.map((booking) => (
                <div key={booking._id}>
                  <span className={`status-pill status-${booking.status}`}>{statusLabels[booking.status]}</span>
                  <strong>{booking.name}</strong>
                  <p>{booking.packageName || "Tailor-made journey"}</p>
                  <small>{friendlyDate(booking.createdAt)}</small>
                </div>
              ))}
            </div>
          ) : <EmptyState title="No bookings yet" body="New website enquiries will appear here." />}
        </article>
        <article className="admin-panel admin-quick">
          <p>Quick action</p>
          <h2>Create a new<br />signature journey.</h2>
          <span>Add its itinerary, highlights and hero image, then publish when it is ready.</span>
          <button onClick={onAddTour}>Add a tour <i>→</i></button>
        </article>
      </section>
    </div>
  );
}

function BookingsPanel({
  bookings,
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onSubmit,
  onSelect,
  onStatusUpdate,
}: {
  bookings: Booking[];
  search: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSubmit: () => void;
  onSelect: (booking: Booking) => void;
  onStatusUpdate: (booking: Booking, status: BookingStatus) => void;
}) {
  return (
    <div className="admin-content">
      <form className="booking-tools" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <label>
          <span className="sr-only">Search bookings</span>
          <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search guest, email or reference…" />
        </label>
        <select aria-label="Filter by status" value={statusFilter} onChange={(event) => onStatusChange(event.target.value)}>
          <option value="">All statuses</option>
          {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <button type="submit">Search</button>
      </form>
      <section className="admin-panel booking-table-panel">
        {bookings.length ? (
          <div className="booking-table-wrap">
            <table className="booking-table">
              <thead><tr><th>Guest</th><th>Journey</th><th>Travel</th><th>Status</th><th>Received</th><th /></tr></thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td><strong>{booking.name}</strong><span>{booking.email}</span><small>{booking.reference}</small></td>
                    <td><strong>{booking.packageName || "Tailor-made"}</strong><span>{booking.inquiryType === "package_booking" ? "Package booking" : "Custom enquiry"}</span></td>
                    <td><strong>{booking.arrivalDate ? friendlyDate(booking.arrivalDate) : booking.travelDate || "Flexible"}</strong><span>{booking.travellers ? `${booking.travellers} traveller${booking.travellers === "1" ? "" : "s"}` : "Guests not set"}</span></td>
                    <td>
                      <select className={`status-select status-${booking.status}`} value={booking.status} onChange={(event) => onStatusUpdate(booking, event.target.value as BookingStatus)} aria-label={`Status for ${booking.name}`}>
                        {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </td>
                    <td>{friendlyDate(booking.createdAt)}</td>
                    <td><button className="table-action" onClick={() => onSelect(booking)}>View →</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState title="No matching bookings" body="Try a different search or status filter." />}
      </section>
    </div>
  );
}

function ToursPanel({
  tours,
  onAdd,
  onEdit,
  onToggle,
}: {
  tours: AdminTour[];
  onAdd: () => void;
  onEdit: (tour: AdminTour) => void;
  onToggle: (tour: AdminTour) => void;
}) {
  const publishedCount = tours.filter((tour) => tour.isPublished).length;
  const draftCount = tours.length - publishedCount;

  return (
    <div className="admin-content">
      <div className="tour-toolbar">
        <div>
          <p>MongoDB collection</p>
          <div className="tour-counts">
            <span>{tours.length} total</span>
            <span>{publishedCount} live</span>
            <span>{draftCount} draft</span>
          </div>
        </div>
        <button type="button" onClick={onAdd}>＋ Add new tour</button>
      </div>
      {tours.length ? (
        <section className="admin-tour-grid">
          {tours.map((tour) => (
            <article className="admin-tour-card" key={tour._id}>
              <div className="admin-tour-image">
                <Image src={tour.image} alt={tour.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 1150px) 50vw, 33vw" />
                <span className={tour.isPublished ? "live" : "draft"}>{tour.isPublished ? "Live" : "Draft"}</span>
              </div>
              <div>
                <p>{tour.category} · {tour.duration}</p>
                <h2>{tour.title}</h2>
                <span>{tour.route}</span>
                <div className="admin-tour-actions">
                  <button type="button" onClick={() => onEdit(tour)}>Edit tour</button>
                  <button type="button" onClick={() => onToggle(tour)}>{tour.isPublished ? "Unpublish" : "Publish"}</button>
                  {tour.isPublished && (
                    <Link href={`/packages/${tour.slug}`} target="_blank">
                      View live ↗
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : <div className="admin-panel"><EmptyState title="No dashboard tours yet" body="Create your first tour, enable Publish on website, and it will appear automatically on the homepage and packages page." action="Add the first tour" onAction={onAdd} /></div>}
    </div>
  );
}

function BookingDrawer({
  booking,
  onClose,
  onSave,
}: {
  booking: Booking;
  onClose: () => void;
  onSave: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(booking.adminNotes || "");
  const details = [
    ["Reference", booking.reference],
    ["Email", booking.email],
    ["Phone", booking.whatsapp || "Not supplied"],
    ["Package", booking.packageName || "Tailor-made journey"],
    ["Arrival", booking.arrivalDate ? friendlyDate(booking.arrivalDate) : booking.travelDate || "Flexible"],
    ["Departure", booking.departureDate ? friendlyDate(booking.departureDate) : "Not supplied"],
    ["Travellers", booking.travellers || "Not supplied"],
    ["Rooms", booking.rooms || "Not supplied"],
    ["Meal plan", booking.mealPlan?.replaceAll("-", " ") || "Not supplied"],
    ["Budget", booking.budget?.replaceAll("-", " ") || "Not supplied"],
  ];

  return (
    <div className="admin-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="booking-drawer" role="dialog" aria-modal="true" aria-labelledby="booking-title">
        <button className="drawer-close" onClick={onClose} aria-label="Close booking">×</button>
        <p>Guest booking</p>
        <h2 id="booking-title">{booking.name}</h2>
        <span className={`status-pill status-${booking.status}`}>{statusLabels[booking.status]}</span>
        <dl>{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        {booking.message && <div className="guest-message"><span>Guest message</span><p>{booking.message}</p></div>}
        <label className="admin-notes">
          <span>Private admin notes</span>
          <textarea rows={5} maxLength={2000} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Call outcome, quoted price, hotel notes…" />
        </label>
        <button className="drawer-save" onClick={() => onSave(notes)}>Save notes</button>
      </aside>
    </div>
  );
}

function TourEditor({
  tour,
  request,
  onClose,
  onSaved,
  onError,
}: {
  tour: AdminTour | null;
  request: <T>(path: string, init?: RequestInit) => Promise<T>;
  onClose: () => void;
  onSaved: (tour: AdminTour) => void;
  onError: (message: string) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState(tour?.title ?? "");
  const [slug, setSlug] = useState(tour?.slug ?? "");
  const [days, setDays] = useState<TourDay[]>(tour?.days.length ? tour.days : [blankDay(0)]);
  const [saving, setSaving] = useState(false);
  const [imageName, setImageName] = useState("");
  const heading = tour ? `Edit ${tour.title}` : "Create a new tour";

  const dayCountLabel = useMemo(
    () => `${days.length} itinerary day${days.length === 1 ? "" : "s"}`,
    [days.length],
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const image = fields.get("image");

    if (!tour && (!(image instanceof File) || image.size === 0)) {
      onError("Please choose a hero image for the new tour.");
      return;
    }
    if (image instanceof File && image.size > 6 * 1024 * 1024) {
      onError("The tour image must be smaller than 6 MB.");
      return;
    }
    if (
      image instanceof File &&
      image.size > 0 &&
      !["image/jpeg", "image/png", "image/webp"].includes(image.type)
    ) {
      onError("Use a JPG, PNG, or WebP tour image.");
      return;
    }

    const highlights = String(fields.get("highlights") ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    const payload = {
      slug,
      title,
      category: String(fields.get("category") ?? ""),
      duration: String(fields.get("duration") ?? ""),
      nights: String(fields.get("nights") ?? ""),
      route: String(fields.get("route") ?? ""),
      alt: String(fields.get("alt") ?? ""),
      summary: String(fields.get("summary") ?? ""),
      intro: String(fields.get("intro") ?? ""),
      highlights,
      days,
      isPublished: fields.get("isPublished") === "on",
      sortOrder: Number(fields.get("sortOrder") ?? 0),
    };

    const body = new FormData();
    body.set("tour", JSON.stringify(payload));
    if (image instanceof File && image.size) body.set("image", image);

    setSaving(true);
    try {
      const result = await request<{ tour: AdminTour }>(
        tour ? `tours/${tour._id}` : "tours",
        {
          method: tour ? "PATCH" : "POST",
          body,
        },
      );
      onSaved(result.tour);
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : "Unable to save tour.");
    } finally {
      setSaving(false);
    }
  }

  function updateDay(index: number, field: keyof TourDay, value: string) {
    setDays((current) =>
      current.map((day, dayIndex) =>
        dayIndex === index ? { ...day, [field]: value } : day,
      ),
    );
  }

  return (
    <div className="tour-editor-wrap">
      <header>
        <button type="button" onClick={onClose}>← Back to tours</button>
        <div><p>{tour ? "Tour editor" : "New itinerary"}</p><h2>{heading}</h2></div>
        <button type="button" className="editor-save-top" onClick={() => formRef.current?.requestSubmit()} disabled={saving}>{saving ? "Saving…" : "Save tour"}</button>
      </header>
      <form ref={formRef} className="tour-editor" onSubmit={submit}>
        <section className="editor-main">
          <div className="editor-section">
            <div className="editor-heading"><span>01</span><div><h3>Tour identity</h3><p>The essentials shown on package cards and links.</p></div></div>
            <div className="editor-fields">
              <label className="editor-wide"><span>Tour title</span><input required maxLength={120} value={title} onChange={(event) => { const next = event.target.value; setTitle(next); if (!tour) setSlug(makeSlug(next)); }} placeholder="Cultural & Wildlife Discovery" /></label>
              <label><span>URL slug</span><input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={80} value={slug} onChange={(event) => setSlug(makeSlug(event.target.value))} placeholder="cultural-wildlife-discovery" /></label>
              <label><span>Category</span><input name="category" required maxLength={60} defaultValue={tour?.category} placeholder="Cultural" /></label>
              <label><span>Duration</span><input name="duration" required maxLength={40} defaultValue={tour?.duration} placeholder="7 days" /></label>
              <label><span>Nights</span><input name="nights" required maxLength={40} defaultValue={tour?.nights} placeholder="6 nights" /></label>
              <label className="editor-wide"><span>Route</span><input name="route" required maxLength={300} defaultValue={tour?.route} placeholder="Colombo · Sigiriya · Kandy · Galle" /></label>
            </div>
          </div>

          <div className="editor-section">
            <div className="editor-heading"><span>02</span><div><h3>Story & highlights</h3><p>Write clear, guest-facing package copy.</p></div></div>
            <div className="editor-fields">
              <label className="editor-wide"><span>Card summary</span><textarea name="summary" required rows={3} maxLength={600} defaultValue={tour?.summary} placeholder="A concise overview for the tour card…" /></label>
              <label className="editor-wide"><span>Tour introduction</span><textarea name="intro" required rows={5} maxLength={2000} defaultValue={tour?.intro} placeholder="A fuller introduction for the package page…" /></label>
              <label className="editor-wide"><span>Highlights · one per line</span><textarea name="highlights" required rows={6} defaultValue={tour?.highlights.join("\n")} placeholder={"Climb Sigiriya at first light\nPrivate wildlife safari\nStay in boutique hotels"} /></label>
            </div>
          </div>

          <div className="editor-section">
            <div className="editor-heading"><span>03</span><div><h3>Day-by-day itinerary</h3><p>{dayCountLabel}</p></div></div>
            <div className="day-editor-list">
              {days.map((day, index) => (
                <article key={index}>
                  <div><strong>Day {String(index + 1).padStart(2, "0")}</strong>{days.length > 1 && <button type="button" onClick={() => setDays((current) => current.filter((_, dayIndex) => dayIndex !== index))}>Remove</button>}</div>
                  <label><span>Day label</span><input required maxLength={40} value={day.title} onChange={(event) => updateDay(index, "title", event.target.value)} /></label>
                  <label><span>Place / route</span><input required maxLength={160} value={day.route} onChange={(event) => updateDay(index, "route", event.target.value)} placeholder="Arrival in Colombo" /></label>
                  <label><span>Description</span><textarea required rows={3} maxLength={1200} value={day.description} onChange={(event) => updateDay(index, "description", event.target.value)} placeholder="Describe the day’s experience…" /></label>
                </article>
              ))}
            </div>
            {days.length < 30 && <button className="add-day" type="button" onClick={() => setDays((current) => [...current, blankDay(current.length)])}>＋ Add another day</button>}
          </div>
        </section>

        <aside className="editor-aside">
          <div className="editor-section image-section">
            <h3>Hero image</h3>
            {tour?.image && <Image src={tour.image} alt="" width={800} height={500} />}
            <label className="image-drop">
              <input name="image" type="file" accept="image/jpeg,image/png,image/webp" required={!tour} onChange={(event) => setImageName(event.target.files?.[0]?.name ?? "")} />
              <strong>{imageName || (tour ? "Replace current image" : "Choose tour image")}</strong>
              <span>JPG, PNG or WebP · max 6 MB</span>
            </label>
            <label><span>Image description</span><textarea name="alt" required rows={3} maxLength={180} defaultValue={tour?.alt} placeholder="Describe the image for accessibility" /></label>
          </div>
          <div className="editor-section publish-section">
            <h3>Publishing</h3>
            <label className="publish-check"><input name="isPublished" type="checkbox" defaultChecked={tour?.isPublished ?? false} /><span><strong>Publish on website</strong><small>Guests can see and book this tour.</small></span></label>
            <label><span>Display order</span><input name="sortOrder" type="number" min="0" max="10000" defaultValue={tour?.sortOrder ?? 0} /></label>
          </div>
          <button className="editor-submit" type="submit" disabled={saving}>{saving ? "Uploading & saving…" : "Save tour"} <span>→</span></button>
        </aside>
      </form>
    </div>
  );
}

function EmptyState({
  title,
  body,
  action,
  onAction,
}: {
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}) {
  return <div className="admin-empty"><span>◇</span><h3>{title}</h3><p>{body}</p>{action && <button onClick={onAction}>{action}</button>}</div>;
}

function WorkspaceError({
  message,
  status,
  onRetry,
}: {
  message: string;
  status: number | null;
  onRetry: () => void;
}) {
  const isAuthenticationError = status === 401;
  const isAuthorizationError = status === 403;
  const heading = isAuthenticationError
    ? "Your admin session needs to reconnect."
    : isAuthorizationError
      ? "This account needs admin access."
      : "We couldn't connect your workspace.";

  return (
    <section className="workspace-error" role="alert">
      <div className="workspace-error-mark">!</div>
      <p>
        {isAuthenticationError || isAuthorizationError
          ? "Admin authentication"
          : "Admin connection"}
      </p>
      <h2>{heading}</h2>
      <span>{message}</span>
      <div>
        <button type="button" onClick={onRetry}>Retry connection</button>
        <Link href="/admin">Refresh admin page</Link>
      </div>
      <small>
        The public website remains available while the admin connection is
        restored.
      </small>
    </section>
  );
}
