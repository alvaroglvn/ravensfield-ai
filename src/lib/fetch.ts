function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // client: relative URL resolves fine
  // Server-side (SSR): call the Express server's own API routes
  const port = process.env.PORT ?? 8080;
  return `http://127.0.0.1:${port}`;
}

export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
