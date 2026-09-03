// Two different base URLs are needed under Docker Compose:
// - Server-side code (Server Components, SSR) runs inside the frontend
//   container itself, so "localhost" there means the frontend container,
//   not the backend one — it needs the Docker service name.
// - Browser-side code runs on the user's actual machine, where the
//   backend is reachable via the host-mapped port.
// Outside Docker (local `npm run dev`), both are the same localhost.
const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"
    : process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  // NOTE: swap for an httpOnly cookie once the backend sets one — plain
  // localStorage is fine to unblock frontend/backend integration, not
  // for production auth storage.
  return window.localStorage.getItem("fitpro_access_token");
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean; // attach the bearer token, default true
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;
  const token = auth ? getAccessToken() : null;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Matches API_CONTRACTS.md error shapes: {detail} or {field: [msgs]}
    const message = typeof data.detail === "string" ? data.detail : "Request failed.";
    const fieldErrors = typeof data.detail === "string" ? undefined : data;
    throw new ApiError(response.status, message, fieldErrors);
  }

  return data as T;
}
