import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminAuthProvider } from "./provider";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin",
  description: "Ceyluxe Tours operations dashboard.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
