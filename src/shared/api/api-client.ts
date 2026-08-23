import { ApiError } from "./api-error";

const BASE_URL = "https://dummyjson.com/";

type ApiClientOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: BodyInit;
  signal?: AbortSignal;
};

export async function apiClient<T>(
  endpoint: string,
  // signal?: AbortSignal,
  options?: ApiClientOptions,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    signal: options?.signal,
    method: options?.method ?? "GET",
    body: options?.body,
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    throw new ApiError("Unable to fetch recipes data ", response.status);
  }
  const data: T = await response.json();

  return data;
}