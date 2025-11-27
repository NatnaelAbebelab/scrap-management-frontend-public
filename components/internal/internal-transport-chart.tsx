"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTheme } from "next-themes"

const data = [
  {
    name: "Jan",
    total: 65,
  },
  {
    name: "Feb",
    total: 72,
  },
  {
    name: "Mar",
    total: 84,
  },
  {
    name: "Apr",
    total: 78,
  },
  {
    name: "May",
    total: 92,
  },
  {
    name: "Jun",
    total: 86,
  },
  {
    name: "Jul",
    total: 94,
  },
  {
    name: "Aug",
    total: 88,
  },
  {
    name: "Sep",
    total: 76,
  },
  {
    name: "Oct",
    total: 82,
  },
  {
    name: "Nov",
    total: 68,
  },
  {
    name: "Dec",
    total: 70,
  },
]

export function InternalTransportChart() {
  const { theme } = useTheme()

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#e5e7eb"} />
        <XAxis
          dataKey="name"
          stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
          fontSize={13}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
          fontSize={13}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
            color: theme === "dark" ? "#f9fafb" : "#111827",
          }}
          formatter={(value) => [`${value} transports`, "Count"]}
          labelStyle={{ fontSize: 14, fontWeight: 600 }}
        />
        <Bar dataKey="total" fill={theme === "dark" ? "#B03C34" : "#982E26"} radius={[4, 4, 0, 0]} barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  )
}
