import { fullPipeline } from "@/pipelines/full-pipeline";

export async function POST(request: Request): Promise<Response> {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await fullPipeline();
    return new Response("New article created and stored", {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in generation pipeline:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate content" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
