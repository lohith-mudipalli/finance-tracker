import { apiRequest } from "./api";

export function fetchTransactions(token) {
  return apiRequest("/api/v1/transactions", { token });
}

export function createTransaction(token, payload) {
  return apiRequest("/api/v1/transactions", {
    method: "POST",
    token,
    body: payload,
  });
}

export function deleteTransaction(token, id) {
  return apiRequest(`/api/v1/transactions/${id}`, {
    method: "DELETE",
    token,
  });
}
