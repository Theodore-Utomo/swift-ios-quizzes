import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts a user-friendly message from an API error (e.g. Axios + FastAPI).
 * - For 422 validation: uses detail[0].msg (e.g. "Course name contains invalid characters")
 * - For other JSON responses: uses detail if it's a string
 * - Fallback: error.message or the provided fallback
 */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  const err = error as { response?: { data?: { detail?: unknown } }; message?: string };
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as { msg?: string };
    return first?.msg ?? fallback;
  }
  if (typeof detail === "string") return detail;
  return err?.message ?? fallback;
} 