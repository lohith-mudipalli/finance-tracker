import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AddTransactionForm from "../components/AddTransactionForm";
import CategoryPie from "../components/CategoryPie";
import SpendingLine from "../components/SpendingLine";

import { fetchTransactions, createTransaction } from "../services/transactions";
import { fetchCategoryBreakdown, fetchDailyExpenses } from "../services/analytics";

export default function Dashboard() {
  const { user, token, logout } = useAuth();

  const [txs, setTxs] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalBalance = useMemo(() => {
    let balance = 0;
    for (const t of txs) {
      if (t.type === "income") balance += Number(t.amount);
      else balance -= Number(t.amount);
    }
    return balance.toFixed(2);
  }, [txs]);

  async function loadAll() {
    setError("");
    setLoading(true);
    try {
      const [transactions, cat, daily] = await Promise.all([
        fetchTransactions(token),
        fetchCategoryBreakdown(token, 30),
        fetchDailyExpenses(token, 30),
      ]);

      setTxs(transactions);
      setPieData(cat);
      setLineData(daily);
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
    await loadAll(); // refresh everything
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
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

        {/* Summary cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-600">Total Balance</p>
            <p className="text-2xl font-bold">${totalBalance}</p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-600">Transactions</p>
            <p className="text-2xl font-bold">{txs.length}</p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-600">Last 30 days</p>
            <p className="text-2xl font-bold">Analytics</p>
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
              <h2 className="font-semibold mb-3">Recent transactions</h2>

              {txs.length === 0 ? (
                <div className="p-4 text-sm text-gray-600">
                  No transactions yet — add your first one above ✅
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
                      </tr>
                    </thead>
                    <tbody>
                      {txs.map((t) => (
                        <tr key={t.id} className="border-b">
                          <td className="py-2">{t.date}</td>
                          <td>{t.type}</td>
                          <td>{t.category}</td>
                          <td className="text-right">${Number(t.amount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
