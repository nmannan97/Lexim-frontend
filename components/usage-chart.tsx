"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function UsageChart() {
  type UserData = [number, number, string]; // [compute, input, costStr]

  const [users, setUsers] = useState<Map<string, UserData>>(new Map());

  const usageData = [
    { day: "Mon", cpu: 18, storage: 0.3, tokens: 95000, cost: 4.2 },
    { day: "Tue", cpu: 22, storage: 0.3, tokens: 120000, cost: 5.7 },
    { day: "Wed", cpu: 25, storage: 0.4, tokens: 140000, cost: 6.95 },
    { day: "Thu", cpu: 20, storage: 0.3, tokens: 110000, cost: 5.4 },
    { day: "Fri", cpu: 28, storage: 0.4, tokens: 160000, cost: 7.8 },
    { day: "Sat", cpu: 15, storage: 0.2, tokens: 85000, cost: 3.95 },
    { day: "Sun", cpu: 19, storage: 0.3, tokens: 100000, cost: 4.85 },
  ];

  useEffect(() => {
    fetch("http://127.0.0.1:5000/users")
      .then(res => res.json())
      .then(data => {
        const entries = Object.entries(data).filter(
          ([_, value]) => Array.isArray(value) && value.length === 3
        ) as [string, UserData][];
        setUsers(new Map(entries));
      })
      .catch(err => console.error("Failed to fetch users:", err));
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization users usage Overview</CardTitle>
          <CardDescription>Users usage over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...users.entries()].map(([id, [compute, input, costStr]]) => {
              const computeNum = Number(compute);
              const inputNum = Number(input);
              const cost = parseFloat(costStr);
              if (isNaN(computeNum) || isNaN(inputNum) || isNaN(cost)) return null;

              return (
                <div key={id} className="p-3 border rounded-md flex justify-between items-center bg-gray-50">
                  <span className="text-sm text-gray-700 font-medium">Input tokens: {computeNum.toLocaleString()}</span>
                  <span className="text-sm text-gray-700 font-medium">Output tokens: {inputNum.toLocaleString()}</span>
                  <span className="text-sm text-gray-700 font-medium">Compute time: {cost.toFixed(2)} hours</span>
                </div>
              );
            })}
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
