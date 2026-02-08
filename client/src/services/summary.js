import { apiRequest } from "./api";

export function fetchMonthlySummary(token, year, month) {
  const qs = [];
  if (year) qs.push(`year=${year}`);
  if (month) qs.push(`month=${month}`);
  const query = qs.length ? `?${qs.join("&")}` : "";
  return apiRequest(`/api/v1/summary/monthly${query}`, { token });
}
