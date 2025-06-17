// components/UserOverview.tsx
"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function UserOverview() {
  const [usageData, setUsageData] = useState<Record<string, any>>({})
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sortField, setSortField] = useState("total_cost")

  useEffect(() => {
    fetch("http://127.0.0.1:5000/daily-usage")
      .then(res => res.json())
      .then(data => setUsageData(data))
      .catch(err => console.error("Error fetching usage data:", err))
  }, [])

  const filteredAndSortedData = Object.entries(usageData)
    .filter(([date]) => {
      const dateValue = new Date(date)
      const afterStart = startDate ? dateValue >= new Date(startDate) : true
      const beforeEnd = endDate ? dateValue <= new Date(endDate) : true
      return afterStart && beforeEnd
    })
    .sort((a, b) => {
      if (sortField === "total_cost") return b[1].total_cost - a[1].total_cost
      if (sortField === "cpu_hours") return b[1].cpu_hours - a[1].cpu_hours
      if (sortField === "tokens_used") return b[1].tokens_used - a[1].tokens_used
      return 0
    })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Usage Overview</CardTitle>
          <div className="flex gap-4 mt-4">
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            <select
              value={sortField}
              onChange={e => setSortField(e.target.value)}
              className="rounded-md border p-1"
            >
              <option value="total_cost">Sort by Cost</option>
              <option value="cpu_hours">Sort by CPU Hours</option>
              <option value="tokens_used">Sort by Tokens Used</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredAndSortedData.map(([date, stats]) => (
            <div key={date} className="border rounded p-4 bg-white shadow">
              <div className="font-bold text-lg mb-2">{date}</div>
              <div className="text-sm text-gray-700">CPU Hours: {stats.cpu_hours.toFixed(2)}</div>
              <div className="text-sm text-gray-700">Storage (GB): {stats.storage_gb.toFixed(2)}</div>
              <div className="text-sm text-gray-700">Tokens Used: {stats.tokens_used.toLocaleString()}</div>
              <div className="text-sm text-gray-700">Total Cost: ${stats.total_cost.toFixed(2)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}