import type { UserForm, UserSignInForm } from "shared-types";
import { ApiError } from "../types";


const API_URL = import.meta.env.MODE === 'production' ? '/api' : "http://localhost:3000";

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
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
      throw new ApiError(data.error.msg, data.error.type, data.error?.data)
    }

    return data
  } catch (error) {
    throw error
  }
}

export const userFormFetch = async (endpoint: string, formData: FormData | UserForm | UserSignInForm) => {
  try {
    let fetchOptions: RequestInit;

    if (formData instanceof FormData) {
      fetchOptions = {
        credentials: "include",
        method: "POST",
        body: formData
        // Let browser set content-type with boundary for FormData.
      };
    } else {
      fetchOptions = {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      };
    }

    const res = await fetch(`${API_URL}${endpoint}`, fetchOptions);
    const data = await res.json();

    if (!res.ok) {
      throw new ApiError(data.error.msg, data.error.type, data.error?.data)
    }

    return data;
  } catch (error) {
    throw error;
  }
}


export const avatarFetch = async (endpoint: string, options: RequestInit) => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include",
      ...options,
    })
    const data = await res.json();

    if (!res.ok) {
      throw new ApiError(data.error.msg, data.error.type, data.error?.data)
    }

    return data
  } catch (error) {
    throw error
  }
}