import { getFeedData } from "@/lib/data";

export async function GET(_request: Request): Promise<Response> {
  try {
    const data = await getFeedData();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: `Failed to fetch feed data: ${error}` },
      { status: 500 },
    );
  }
}
