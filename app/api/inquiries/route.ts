import { getDb } from "../../../db";
import { inquiries } from "../../../db/schema";

function clean(value: unknown, maxLength = 500) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;

    if (clean(payload.website)) {
      return Response.json({ reference: "CYL-RECEIVED" }, { status: 201 });
    }

    const name = clean(payload.name, 120);
    const email = clean(payload.email, 180).toLowerCase();

    if (!name || !email || !email.includes("@")) {
      return Response.json(
        { error: "Please provide your name and a valid email address." },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();
    const reference = `CYL-${id.slice(0, 6).toUpperCase()}`;
    const db = getDb();

    await db.insert(inquiries).values({
      id,
      reference,
      name,
      email,
      whatsapp: clean(payload.whatsapp, 60),
      travelDate: clean(payload.travelDate, 20),
      travellers: clean(payload.travellers, 20),
      journey: clean(payload.journey, 80),
      budget: clean(payload.budget, 40),
      message: clean(payload.message, 2000),
    });

    return Response.json({ reference }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const unavailable =
      message.includes("D1") ||
      message.includes("no such table") ||
      message.includes("inquiries");

    return Response.json(
      {
        error: unavailable
          ? "Booking requests are being connected. Please email hello@ceyluxetours.com for now."
          : "We could not send your request. Please try again.",
      },
      { status: 500 },
    );
  }
}
