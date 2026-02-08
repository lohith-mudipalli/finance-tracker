import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AddTransactionForm from "../components/AddTransactionForm";
import CategoryPie from "../components/CategoryPie";
import SpendingLine from "../components/SpendingLine";

import {
  fetchTransactions,
  createTransaction,
  deleteTransaction,
} from "../services/transactions";
import { fetchCategoryBreakdown, fetchDailyExpenses } from "../services/analytics";
import { fetchMonthlySummary } from "../services/summary";

import { downloadCSV } from "../utils/csv";

export default function Dashboard() {
  const { user, token, logout } = useAuth();

  const [txs, setTxs] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Step 6A: monthly summary state
  const [summary, setSummary] = useState(null);

  // ✅ Step 5A: filter state
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  // (Optional) overall all-time balance
  const totalBalance = useMemo(() => {
    let balance = 0;
    for (const t of txs) {
      if (t.type === "income") balance += Number(t.amount);
      else balance -= Number(t.amount);
    }
    return balance.toFixed(2);
  }, [txs]);

  // ✅ Step 5B: filtered transactions
  const filteredTxs = useMemo(() => {
    return txs.filter((t) => {
      const matchesType = typeFilter === "all" ? true : t.type === typeFilter;
      const matchesSearch = search
        ? String(t.category).toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesType && matchesSearch;
    });
  }, [txs, typeFilter, search]);

  async function loadAll() {
    setError("");
    setLoading(true);
    try {
      const [transactions, cat, daily, monthly] = await Promise.all([
        fetchTransactions(token),
        fetchCategoryBreakdown(token, 30),
        fetchDailyExpenses(token, 30),
        fetchMonthlySummary(token),
      ]);

      setTxs(transactions);
      setPieData(cat);
      setLineData(daily);
      setSummary(monthly);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAddTransaction(payload) {
    await createTransaction(token, payload);
    await loadAll();
  }

  // ✅ Step 5D: delete handler
  async function handleDelete(id) {
    const ok = confirm("Delete this transaction?");
    if (!ok) return;

    try {
      setError("");
      await deleteTransaction(token, id);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border rounded-xl p-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Welcome{user?.email ? `, ${user.email}` : ""}!
            </p>
          </div>

          <button className="border rounded px-3 py-2" onClick={logout}>
            Logout
          </button>
        </div>

        {/* ✅ Step 6: Monthly summary cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-600">This Month Income</p>
            <p className="text-2xl font-bold">
              ${summary ? Number(summary.income).toFixed(2) : "0.00"}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-600">This Month Expense</p>
            <p className="text-2xl font-bold">
              ${summary ? Number(summary.expense).toFixed(2) : "0.00"}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-600">Net</p>
            <p className="text-2xl font-bold">
              ${summary ? Number(summary.net).toFixed(2) : "0.00"}
            </p>
          </div>
        </div>

        <AddTransactionForm onSubmit={handleAddTransaction} />

        {error && (
          <div className="p-3 border rounded bg-red-50">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-6 border rounded-xl">Loading dashboard...</div>
        ) : (
          <>
            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border rounded-xl p-4">
                <h2 className="font-semibold mb-2">Expense breakdown (Pie)</h2>
                <CategoryPie data={pieData} />
              </div>

              <div className="border rounded-xl p-4">
                <h2 className="font-semibold mb-2">Daily expenses (Line)</h2>
                <SpendingLine data={lineData} />
              </div>
            </div>

            {/* Transactions list */}
            <div className="border rounded-xl p-4">
              {/* ✅ Title + Export CSV button */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">Recent transactions</h2>

                <button
                  className="border rounded px-3 py-2"
                  onClick={() => downloadCSV("transactions.csv", filteredTxs)}
                >
                  Export CSV
                </button>
              </div>

              {/* ✅ Filters */}
              <div className="flex gap-3 items-center mb-3">
                <select
                  className="border rounded p-2"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>

                <input
                  className="border rounded p-2 flex-1"
                  placeholder="Search category (e.g., Food, Rent)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {filteredTxs.length === 0 ? (
                <div className="p-4 text-sm text-gray-600">
                  No matching transactions ✅
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2">Date</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th className="text-right">Amount</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTxs.map((t) => (
                        <tr key={t.id} className="border-b">
                          <td className="py-2">{t.date}</td>
                          <td>{t.type}</td>
                          <td>{t.category}</td>
                          <td className="text-right">
                            ${Number(t.amount).toFixed(2)}
                          </td>
                          <td className="text-right">
                            <button
                              className="border rounded px-2 py-1"
                              onClick={() => handleDelete(t.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Optional: show overall all-time balance card */}
            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-600">Overall Total Balance (All time)</p>
              <p className="text-2xl font-bold">${totalBalance}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
