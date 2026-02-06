import { apiRequest } from "./api";

export function fetchCategoryBreakdown(token, days = 30) {
  return apiRequest(`/api/v1/analytics/category-breakdown?days=${days}`, { token });
}

export function fetchDailyExpenses(token, days = 30) {
  return apiRequest(`/api/v1/analytics/daily-expenses?days=${days}`, { token });
}
