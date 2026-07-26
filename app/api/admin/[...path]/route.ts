const backendUrl = () =>
  process.env.BACKEND_API_URL?.replace(/\/+$/, "") ?? "";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function forward(request: Request, context: RouteContext) {
  const baseUrl = backendUrl();
  if (!baseUrl) {
    return Response.json(
      { error: "The admin API has not been configured." },
      { status: 503 },
    );
  }

  const { path } = await context.params;
  const url = new URL(request.url);
  const target = `${baseUrl}/api/admin/${path.map(encodeURIComponent).join("/")}${url.search}`;
  const headers = new Headers();
  const authorization = request.headers.get("authorization");
  const cookie = request.headers.get("cookie");
  const contentType = request.headers.get("content-type");
  if (authorization) headers.set("Authorization", authorization);
  if (cookie) headers.set("Cookie", cookie);
  if (contentType) headers.set("Content-Type", contentType);

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      signal: AbortSignal.timeout(60_000),
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json(
      { error: "The admin service is temporarily unavailable." },
      { status: 502 },
    );
  }
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
