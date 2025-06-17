"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

export function TaskHistory() {
  const [tasks, setTasks] = useState([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [userFilter, setUserFilter] = useState("")
  const [taskFilter, setTaskFilter] = useState("")
  const [sortField, setSortField] = useState("create_date")

  useEffect(() => {
    fetch("http://127.0.0.1:5000/task-history")
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Error fetching task history:", err))
  }, [])

  const filtered = tasks.filter(task => {
    const dateMatch = (!startDate || task.create_date >= startDate) && (!endDate || task.create_date <= endDate)
    const userMatch = !userFilter || (task.first_name + " " + task.last_name).toLowerCase().includes(userFilter.toLowerCase())
    const taskMatch = !taskFilter || (task.agent_display_name || "").toLowerCase().includes(taskFilter.toLowerCase())
    return dateMatch && userMatch && taskMatch
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortField === "cpu_minutes") return b.cpu_minutes - a.cpu_minutes
    if (sortField === "tokens_out") return b.tokens_out - a.tokens_out
    if (sortField === "tokens_in") return b.tokens_in - a.tokens_in
    if (sortField === "estimated_cost") return b.estimated_cost - a.estimated_cost
    return new Date(b.create_date) - new Date(a.create_date)
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task History</CardTitle>
          <CardDescription>Filter, sort, and review all executed tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Filter by user name" value={userFilter} onChange={e => setUserFilter(e.target.value)} />
            <Input placeholder="Filter by task name" value={taskFilter} onChange={e => setTaskFilter(e.target.value)} />
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <select onChange={e => setSortField(e.target.value)} value={sortField} className="rounded-md border p-1 mt-2">
            <option value="create_date">Sort by Date</option>
            <option value="tokens_out">Sort by Output Tokens</option>
            <option value="tokens_in">Sort by Input Tokens</option>
            <option value="cpu_minutes">Sort by CPU Time</option>
            <option value="estimated_cost">Sort by Estimated Cost</option>
          </select>

          <div className="space-y-4">
            {sorted.map((task, i) => (
              <div key={i} className="p-4 border rounded bg-white shadow">
                <div className="font-semibold text-gray-900">{task.task_name || "Unnamed Task"}</div>
                <div className="text-sm text-muted-foreground">Executed by: {task.user_name}</div>
                <div className="text-sm">Date: {task.execution_time}</div>
                <div className="text-sm">Input Tokens: {task.tokens_in}</div>
                <div className="text-sm">Output Tokens: {task.tokens_out}</div>
                <div className="text-sm">CPU Time: {task.cpu_minutes.toFixed(2)} minutes</div>
                <div className="text-sm">Estimated Cost: ${task.estimated_cost.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
