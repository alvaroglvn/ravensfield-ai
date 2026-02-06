import "dotenv/config";

const TURSO_URL = process.env.TURSO_DATABASE_URL!;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN!;

// Convert libsql:// URL to HTTPS pipeline endpoint
function getHttpUrl(url: string): string {
  const baseUrl = url.replace("libsql://", "https://");
  return `${baseUrl}/v2/pipeline`;
}

interface TursoResponse {
  results: Array<{
    response: {
      type: string;
      result?: {
        cols: Array<{ name: string }>;
        rows: Array<Array<{ type: string; value: any }>>;
      };
    };
  }>;
}

export async function executeQuery<T>(
  sql: string,
  args: any[] = [],
): Promise<T[]> {
  const url = getHttpUrl(TURSO_URL);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TURSO_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        {
          type: "execute",
          stmt: {
            sql,
            args: args.map((a) => ({ type: "text", value: String(a) })),
          },
        },
        { type: "close" },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Turso query failed: ${response.status} ${text}`);
  }

  const data: TursoResponse = await response.json();

  const result = data.results[0]?.response?.result;

  if (!result || !result.rows) {
    return [];
  }

  // Map rows to objects using column names
  return result.rows.map((row) => {
    const obj: any = {};
    result.cols.forEach((col, i) => {
      obj[col.name] = row[i]?.value;
    });
    return obj;
  }) as T[];
}
