"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

type AgentUsage = {
  agent_display_name: string
  estimated_cost: number
  runs: number
  total_cpu_hours: number
  total_cpu_minutes: number
  total_tokens_in: number
  total_tokens_out: number
}

export function BillingHistory() {
  const [usageData, setUsageData] = useState<AgentUsage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://127.0.0.1:5000/agent-usage")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then((json) => {
        setUsageData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error loading agent usage:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p className="text-muted-foreground">Loading billing history...</p>
  }

  const totalSpent = usageData.reduce((acc, cur) => acc + cur.estimated_cost, 0)
  const averageDailySpend = totalSpent / 30

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Agent Usage Overview</CardTitle>
            <CardDescription>Resource usage and costs grouped by agent</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageData.map((agent, idx) => (
              <Card key={idx} className="p-4 border">
                <h2 className="font-bold text-lg">{agent.agent_display_name}</h2>
                <p>Runs: {agent.runs}</p>
                <p>Tokens In: {agent.total_tokens_in.toLocaleString()}</p>
                <p>Tokens Out: {agent.total_tokens_out.toLocaleString()}</p>
                <p>Total CPU Hours: {agent.total_cpu_hours.toFixed(4)}</p>
                <p>Estimated Cost: ${agent.estimated_cost.toFixed(2)}</p>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Spent (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Summed across all agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Credits Added (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-sm text-muted-foreground">Currently not tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Daily Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageDailySpend.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Over the last 30 days</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
