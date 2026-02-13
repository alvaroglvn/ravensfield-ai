import { fullPipeline } from "@/pipelines/full-pipeline";

export async function POST(request: Request): Promise<Response> {
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
