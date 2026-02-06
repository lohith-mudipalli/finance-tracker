import { useState } from "react";

export default function AddTransactionForm({ onSubmit }) {
  const today = new Date().toISOString().slice(0, 10);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(today);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      amount: Number(amount),
      type,
      category,
      date,
    };

    if (!payload.amount || payload.amount < 0) {
      setError("Amount must be a positive number");
      return;
    }

    setSaving(true);
    try {
      await onSubmit(payload);
      setAmount("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border rounded-xl p-4">
      <h2 className="font-semibold mb-3">Add transaction</h2>

      {error && <div className="mb-3 p-2 border rounded bg-red-50">{error}</div>}

      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-4">
        <input
          className="border rounded p-2"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select className="border rounded p-2" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          className="border rounded p-2"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input className="border rounded p-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <button className="md:col-span-4 border rounded p-2 font-semibold" disabled={saving}>
          {saving ? "Saving..." : "Add"}
        </button>
      </form>
    </div>
  );
}
