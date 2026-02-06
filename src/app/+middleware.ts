export const unstable_settings = {
  matcher: {
    patterns: ["/api"],
  },
};

export default function middleware(request: Request) {
  const response = new Response();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");

  return response;
}
