import type { Metadata } from "next";
import { GalleryPhotoWall } from "../site-experience";

export const metadata: Metadata = {
  title: "Sri Lanka Gallery | Ceyluxe Tours",
  description: "Explore Sri Lanka's coast, hill country, wildlife and cultural landmarks through the Ceyluxe Tours gallery.",
};

export default function GalleryPage() {
  return (
    <main className="gallery-only-page">
      <GalleryPhotoWall />
    </main>
  );
}
