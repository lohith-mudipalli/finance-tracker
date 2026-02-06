import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function SpendingLine({ data }) {
  if (!data?.length) {
    return <div className="p-4 text-sm text-gray-600">No daily spending data to show.</div>;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
