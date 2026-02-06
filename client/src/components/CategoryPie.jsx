import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function CategoryPie({ data }) {
  if (!data?.length) {
    return <div className="p-4 text-sm text-gray-600">No expense data to show.</div>;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie dataKey="total" nameKey="category" data={data} outerRadius={100} label />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
