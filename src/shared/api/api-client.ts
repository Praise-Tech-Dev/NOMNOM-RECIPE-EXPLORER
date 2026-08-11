import { ApiError } from "./api-error";

const BASE_URL = "https://dummyjson.com/";

export async function apiClient<T>(
  endpoint: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    signal,
  });

  if (!response.ok) {
    throw new ApiError("Unable to fetch recipes data ", response.status);
  }
  const data: T = await response.json();

  return data;
}