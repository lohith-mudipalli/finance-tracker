export function downloadCSV(filename, rows) {
  const headers = ["date", "type", "category", "amount"];
  const csv = [
    headers.join(","),
    ...rows.map((r) => [r.date, r.type, r.category, r.amount].join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
