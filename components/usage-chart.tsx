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
  type UsageRecord = {
    tokens_in: number;
    tokens_out: number;
    duration: string;
    task_guid: string;
    start_time: string | null;
    end_time: string | null;
    run_datetime: string | null;
  };

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [users, setUsers] = useState<Map<string, UsageRecord[]>>(new Map());
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/users")
    .then(res => res.json())
    .then(data => {
      console.log("✅ Fetched users data:", data);
      setUsers(data);
    })
    .catch(err => console.error("User usage fetch error:", err));
  }, []);

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
                {Object.keys(users).map((id) => (
                  <option key={id} value={id}>
                    {id}
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
                type="datetime-local"
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
                type="datetime-local"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(users)
              .filter(([id]) => !selectedUser || id === selectedUser)
              .map(([userId, user]) => (
                <div key={userId} className="space-y-4">
                  {/* User-Level Summary */}
                  <div className="p-4 border rounded-md bg-gray-100">
                    <div className="text-sm font-medium text-gray-800">User: {userId}</div>
                    <div className="text-sm text-gray-700">Input Tokens: {user.tokens_in.toLocaleString()}</div>
                    <div className="text-sm text-gray-700">Output Tokens: {user.tokens_out.toLocaleString()}</div>
                    <div className="text-sm text-gray-700">Compute Time: {user.duration}</div>
                  </div>

                  {/* Task Breakdown Section */}
                  <div className="p-4 border rounded-md bg-white shadow">
                    <div className="font-semibold text-gray-900 mb-2">Task Usage</div>
                    {Object.entries(user.tasks)
                      .filter(([_, task]) => {
                        const runTime = task.run_datetime ? new Date(task.run_datetime).getTime() : null;
                        const afterStart = startDate ? runTime && runTime >= new Date(startDate).getTime() : true;
                        const beforeEnd = endDate ? runTime && runTime <= new Date(endDate).getTime() : true;
                        return afterStart && beforeEnd;
                      })
                      .map(([taskId, task]) => (
                        <div key={taskId} className="mb-2 p-2 border rounded bg-gray-50">
                          <div className="text-sm font-medium text-gray-700">Task ID: {taskId}</div>
                          <div className="text-sm text-gray-700">Input Tokens: {task.tokens_in.toLocaleString()}</div>
                          <div className="text-sm text-gray-700">Output Tokens: {task.tokens_out.toLocaleString()}</div>
                          <div className="text-sm text-gray-700">Compute Time: {task.duration}</div>
                          <div className="text-sm text-gray-700">Run Time: {task.run_datetime}</div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Peak Usage Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Friday</div>
            <p className="text-sm text-muted-foreground">$7.80 total cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Daily Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5.55</div>
            <p className="text-sm text-muted-foreground">Based on last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Used Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">CPU Time</div>
            <p className="text-sm text-muted-foreground">147 hours this week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
