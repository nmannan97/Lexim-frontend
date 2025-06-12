"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function UsageChart() {
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [users, setUsers] = useState<Record<string, any>>({})
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  useEffect(() => {
    fetch("http://127.0.0.1:5000/users")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched users data:", data)
        setUsers(data)
      })
      .catch(err => console.error("User usage fetch error:", err))
  }, [])

  function parseMinutes(duration: string): number {
    const match = duration.replace(/,/g, "").match(/-?\d+(\.\d+)?/)
    return match ? parseFloat(match[0]) : 0
  }

  // Group by unique user_name
  const userNameToUserIds: Record<string, string[]> = {}
  for (const [userId, user] of Object.entries(users)) {
    const firstTask = Object.values(user.tasks || {})[0]
    const name = firstTask?.user_name || "Unknown User"
    if (!userNameToUserIds[name]) {
      userNameToUserIds[name] = []
    }
    userNameToUserIds[name].push(userId)
  }

  const aggregatedTotals = Object.values(users).reduce(
    (acc, user) => {
      acc.tokens_in += user.tokens_in || 0
      acc.tokens_out += user.tokens_out || 0
      acc.minutes += parseMinutes(user.duration || "0")
      return acc
    },
    { tokens_in: 0, tokens_out: 0, minutes: 0 }
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Users Usage Overview</CardTitle>
          <CardDescription>Users usage over time</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(users).length > 0 && (
            <div className="mb-4">
              <label htmlFor="user-select" className="block text-sm font-medium text-gray-700">
                Select a user:
              </label>
              <select
                id="user-select"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={selectedUser ?? ""}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">All users</option>
                {Object.keys(userNameToUserIds).sort().map((userName) => (
                  <option key={userName} value={userName}>
                    {userName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-4 flex gap-4 items-center">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                Start Date:
              </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                End Date:
              </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          {selectedUser === null && (
            <div className="p-4 border rounded-md bg-blue-50 mb-6">
              <div className="text-md font-semibold text-blue-900">All Users Combined</div>
              <div className="text-sm text-blue-800">Total Input Tokens: {aggregatedTotals.tokens_in.toLocaleString()}</div>
              <div className="text-sm text-blue-800">Total Output Tokens: {aggregatedTotals.tokens_out.toLocaleString()}</div>
              <div className="text-sm text-blue-800">Total Compute Time: {aggregatedTotals.minutes.toFixed(2)} minutes</div>
            </div>
          )}

          <div className="space-y-6">
            {Object.entries(userNameToUserIds)
              .filter(([userName]) => !selectedUser || userName === selectedUser)
              .map(([userName, userIds]) => (
                <div key={userName} className="space-y-6">
                  <div className="text-md font-semibold text-gray-900">{userName}</div>
                  {userIds.map((userId) => {
                    const user = users[userId]
                    return (
                      <div key={userId} className="space-y-4">
                        <div className="p-4 border rounded-md bg-white shadow">
                          <div className="font-semibold text-gray-900 mb-2">Task Usage</div>
                          {Object.entries(user.tasks).map(([taskId, task]) => (
                            <div key={taskId} className="mb-2 p-2 border rounded bg-gray-50">
                              <div className="text-sm font-medium text-gray-700">
                                Task by: <span className="text-gray-900">{task.user_name ?? "Unknown"}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">Task ID: {taskId}</div>
                              <div className="text-sm text-gray-700">Input Tokens: {task.tokens_in.toLocaleString()}</div>
                              <div className="text-sm text-gray-700">Output Tokens: {task.tokens_out.toLocaleString()}</div>
                              <div className="text-sm text-gray-700">Compute Time: {task.duration}</div>
                              <div className="text-sm text-gray-700">
                                Date created:{" "}
                                {task.run_datetime
                                  ? new Date(task.run_datetime).toLocaleString()
                                  : "N/A"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
