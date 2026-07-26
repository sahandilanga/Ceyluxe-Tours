export type TourDay = {
  title: string;
  route: string;
  description: string;
};

export type Tour = {
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
};

export const tours: Tour[] = [
  {
    slug: "ceylon-signature",
    category: "Signature",
    title: "The Ceylon Signature",
    duration: "12 days",
    nights: "11 nights",
    route: "Colombo · Sigiriya · Kandy · Ella · Yala · Galle",
    image: "/images/sigiriya.jpg",
    alt: "Sigiriya rock rising above green forest in Sri Lanka",
    summary:
      "Our complete island story: ancient kingdoms, tea-country railways, wild safaris and slow days beside the Indian Ocean.",
    intro:
      "A privately guided journey across Sri Lanka’s most evocative landscapes. Move from ancient rock citadels to mist-covered tea country, search for wildlife at dawn, and finish among the lanes and beaches of the south coast.",
    highlights: [
      "Climb Sigiriya before the day warms",
      "Ride the celebrated hill-country railway",
      "Private jeep safari through Yala National Park",
      "Stay in handpicked boutique hotels",
      "Explore Galle Fort with a local host",
    ],
    days: [
      { title: "Day 01", route: "Arrive in Colombo", description: "Meet your private chauffeur-guide at the airport and settle into a peaceful first night near Colombo." },
      { title: "Day 02", route: "Colombo to Sigiriya", description: "Travel into the Cultural Triangle, stopping for a seasonal local experience before checking into your forest retreat." },
      { title: "Day 03", route: "Sigiriya & village life", description: "Climb Sigiriya at first light, then slow down with a guided village walk and traditional lunch." },
      { title: "Day 04", route: "Polonnaruwa & Minneriya", description: "Cycle or walk through Polonnaruwa’s ancient ruins before an afternoon elephant safari." },
      { title: "Day 05", route: "Dambulla to Kandy", description: "Visit Dambulla Cave Temple and a spice garden en route to Sri Lanka’s hill capital." },
      { title: "Day 06", route: "Kandy heritage", description: "Discover the Temple of the Tooth, the Royal Botanical Gardens and an intimate cultural performance." },
      { title: "Day 07", route: "Scenic rail to Ella", description: "Board the celebrated hill-country train and watch tea estates and cloud forest unfold outside your window." },
      { title: "Day 08", route: "Ella highlands", description: "Choose a sunrise walk, Nine Arch Bridge, a tea experience or an unhurried day in the hills." },
      { title: "Day 09", route: "Ella to Yala", description: "Descend through changing landscapes to a wilderness lodge beside Yala National Park." },
      { title: "Day 10", route: "Yala safari to Galle", description: "Search for elephants, sloth bears and leopards at dawn, then continue to the southern coast." },
      { title: "Day 11", route: "Galle & the coast", description: "Explore Galle Fort with a local storyteller and enjoy a final afternoon beside the Indian Ocean." },
      { title: "Day 12", route: "Private departure", description: "A relaxed breakfast and private transfer to the airport for your onward flight." },
    ],
  },
  {
    slug: "tea-trails",
    category: "Highlands",
    title: "Tea Trails by Rail",
    duration: "8 days",
    nights: "7 nights",
    route: "Kandy · Nuwara Eliya · Ella · Haputale",
    image: "/images/ella-train.jpg",
    alt: "Blue train travelling through Sri Lanka hill country",
    summary:
      "A slower journey through cloud forest, tea estates and timeless railway towns, designed for walkers and romantics.",
    intro:
      "Follow Sri Lanka’s most beautiful railway into the central highlands. Private walks, estate-hosted tea experiences and characterful stays give this journey a gentle rhythm and a strong sense of place.",
    highlights: [
      "Reserved scenic train journey to Ella",
      "Private tea tasting with an estate host",
      "Sunrise walk above the Haputale valleys",
      "Guided visit to the Royal Botanical Gardens",
      "Flexible walking options for every pace",
    ],
    days: [
      { title: "Day 01", route: "Arrive in Kandy", description: "Meet your chauffeur-guide and travel into the hills for a restful evening overlooking Kandy." },
      { title: "Day 02", route: "Kandy’s living heritage", description: "Visit the Royal Botanical Gardens, local markets and the Temple of the Tooth with a private guide." },
      { title: "Day 03", route: "Kandy to Nuwara Eliya", description: "Climb through tea country with waterfall stops and an estate lunch along the way." },
      { title: "Day 04", route: "Tea country immersion", description: "Walk through working tea fields, meet an estate host and learn how Ceylon tea is made and tasted." },
      { title: "Day 05", route: "Rail journey to Ella", description: "Take reserved seats on the highland train to Ella, one of Asia’s most memorable rail journeys." },
      { title: "Day 06", route: "Ella at your pace", description: "Walk to Nine Arch Bridge, climb Little Adam’s Peak or enjoy a slow morning at your retreat." },
      { title: "Day 07", route: "Haputale sunrise", description: "Travel to Haputale for a ridge walk and wide views across Sri Lanka’s southern plains." },
      { title: "Day 08", route: "Private departure", description: "Enjoy breakfast in the hills before your private onward transfer." },
    ],
  },
  {
    slug: "wild-south",
    category: "Wildlife",
    title: "Wild South Escape",
    duration: "9 days",
    nights: "8 nights",
    route: "Udawalawe · Yala · Mirissa · Galle",
    image: "/images/elephants.jpg",
    alt: "Elephants walking through a Sri Lankan landscape",
    summary:
      "Big wilderness, intimate camps and the easy southern coast—a private adventure with space to breathe.",
    intro:
      "Pair ethical wildlife encounters with the relaxed character of Sri Lanka’s south. Private safari drives, small-scale stays and generous time by the ocean make this an easy, immersive escape.",
    highlights: [
      "Ethical elephant encounters in Udawalawe",
      "Dawn and dusk private safari drives",
      "Boutique beach stay and Galle Fort walk",
      "Naturalist-led wilderness experiences",
      "Time to swim, surf or simply slow down",
    ],
    days: [
      { title: "Day 01", route: "Arrive on the south coast", description: "Meet your chauffeur-guide and travel south to a quiet boutique stay." },
      { title: "Day 02", route: "Udawalawe", description: "Visit the Elephant Transit Home and take a private afternoon safari through open grassland." },
      { title: "Day 03", route: "Udawalawe to Yala", description: "Travel east through rural landscapes and settle into a wilderness camp near Yala." },
      { title: "Day 04", route: "Yala at dawn", description: "Set out early with a specialist naturalist to search for leopards, elephants and birdlife." },
      { title: "Day 05", route: "A slower wilderness day", description: "Choose a second safari, a guided nature walk or a quiet day at camp." },
      { title: "Day 06", route: "Yala to Mirissa", description: "Follow the coast west and arrive at your beach retreat in time for sunset." },
      { title: "Day 07", route: "The Indian Ocean", description: "Swim, surf, take a seasonal whale-watching trip or leave the day beautifully unplanned." },
      { title: "Day 08", route: "Galle Fort", description: "Continue to Galle for a private heritage walk and final evening inside the fort." },
      { title: "Day 09", route: "Private departure", description: "A leisurely breakfast followed by your private airport transfer." },
    ],
  },
];

function isTour(value: unknown): value is Tour {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Tour>;
  return (
    typeof candidate.slug === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.image === "string" &&
    Array.isArray(candidate.highlights) &&
    Array.isArray(candidate.days)
  );
}

type DatabaseTourResult = {
  tours: Tour[];
  managedSlugs: string[];
};

async function loadDatabaseTours(): Promise<DatabaseTourResult> {
  const backendUrl = process.env.BACKEND_API_URL?.replace(/\/+$/, "");
  if (!backendUrl) return { tours: [], managedSlugs: [] };

  try {
    const response = await fetch(`${backendUrl}/api/tours`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return { tours: [], managedSlugs: [] };
    const result = (await response.json()) as {
      tours?: unknown[];
      managedSlugs?: unknown[];
    };
    return {
      tours: Array.isArray(result.tours) ? result.tours.filter(isTour) : [],
      managedSlugs: Array.isArray(result.managedSlugs)
        ? result.managedSlugs.filter(
            (slug): slug is string => typeof slug === "string",
          )
        : [],
    };
  } catch {
    return { tours: [], managedSlugs: [] };
  }
}

export async function getPublishedTours() {
  const { tours: databaseTours, managedSlugs } = await loadDatabaseTours();
  if (!databaseTours.length && !managedSlugs.length) return tours;

  const databaseSlugs = new Set(managedSlugs);
  return [
    ...databaseTours,
    ...tours.filter((tour) => !databaseSlugs.has(tour.slug)),
  ];
}

export async function getTour(slug: string) {
  const publishedTours = await getPublishedTours();
  return publishedTours.find((tour) => tour.slug === slug);
}
