export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const mutation = options.method && !["GET", "HEAD"].includes(options.method);
  if (mutation && path !== "/access") {
    const access = await fetch("/api/access", {
      method: "POST",
      credentials: "include",
    });
    if (!access.ok) throw new Error("Please log in to continue.");
  }
  const response = await fetch(`/api${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await response
    .json()
    .catch(() => ({
      message: "Server unavailable. Check that the server is running.",
    }));
  if (!response.ok)
    throw new Error(data.message || "Request failed. Please try again.");
  return data as T;
}
export const errorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
