"use client";

import { Show, SignIn } from "@clerk/react";
import Link from "next/link";
import { AdminDashboard } from "./admin-dashboard";

export default function AdminPage() {
  return (
    <>
      <Show when="signed-out">
        <main className="admin-login">
          <section className="admin-login-story">
            <Link className="admin-brand" href="/">
              <span>C</span>
              <strong>CEYLUXE TOURS</strong>
            </Link>
            <div>
              <p>Private operations</p>
              <h1>Your journeys,<br />beautifully managed.</h1>
              <span>
                Manage signature tours, Cloudinary imagery and every new
                booking from one secure place.
              </span>
            </div>
            <small>Colombo · Sri Lanka</small>
          </section>
          <section className="admin-login-form">
            <div>
              <p>Admin portal</p>
              <h2>Welcome back</h2>
              <span>Sign in with your approved Ceyluxe admin account.</span>
            </div>
            <SignIn
              routing="virtual"
              forceRedirectUrl="/admin"
              appearance={{
                elements: {
                  rootBox: "clerk-root",
                  cardBox: "clerk-card-box",
                  card: "clerk-card",
                },
              }}
            />
            <Link href="/">← Return to website</Link>
          </section>
        </main>
      </Show>
      <Show when="signed-in">
        <AdminDashboard />
      </Show>
    </>
  );
}
