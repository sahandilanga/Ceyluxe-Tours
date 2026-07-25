function getBackendUrl() {
  return process.env.BACKEND_API_URL?.replace(/\/+$/, "") ?? "";
}

export async function POST(request: Request) {
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    return Response.json(
      {
        error:
          "The booking service is being connected. Please email hello@ceyluxetours.com for now.",
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(`${backendUrl}/api/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
      signal: AbortSignal.timeout(12_000),
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return Response.json(
      {
        error:
          "The booking service is temporarily unavailable. Please try again shortly.",
      },
      { status: 502 },
    );
  }
}
