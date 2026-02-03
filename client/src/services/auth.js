import { apiRequest } from "./api";

export function registerUser(email, password) {
  return apiRequest("/api/v1/auth/register", {
    method: "POST",
    body: { email, password },
  });
}

export function loginUser(email, password) {
  return apiRequest("/api/v1/auth/login", {
    method: "POST",
    body: { email, password },
  });
}
