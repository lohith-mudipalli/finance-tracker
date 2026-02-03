import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button className="border rounded px-3 py-2" onClick={logout}>
            Logout
          </button>
        </div>

        <p className="mt-4">
          Welcome{user?.email ? `, ${user.email}` : ""}! ✅
        </p>

        <div className="mt-6 p-4 border rounded bg-gray-50">
          Charts + transactions will come on Day 4.
        </div>
      </div>
    </div>
  );
}
