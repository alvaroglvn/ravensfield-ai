import { getCategoryData } from "@/lib/data";

export async function GET(
  _request: Request,
  { type }: { type: string },
): Promise<Response> {
  try {
    const data = await getCategoryData(type);
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: `Failed to fetch category: ${error}` },
      { status: 500 },
    );
  }
}
