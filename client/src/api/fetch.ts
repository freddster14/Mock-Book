import type { UserForm } from "shared-types";
import { ApiError } from "../types";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiFetch = async (endpoint: string, options: RequestInit) => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })
    const data = await res.json();

    if (!res.ok) {
      console.log("API Error Response:", data);
      throw new Error(data.error.type, data.error.data)
    }

    return data
  } catch (error) {
    console.error("API Fetch Error:", error)
    throw error
  }
}

export const formFetch = async (endpoint: string, formData: UserForm) => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();

    if (!res.ok) {
      console.log("API Error Response:", data);
      throw new ApiError(data.error.type, data.error.data)
    }

    return data
  } catch (error) {
    console.error("API Fetch Error:", error)
    throw error
  }
}