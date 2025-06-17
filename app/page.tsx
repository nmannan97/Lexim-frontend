"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Cpu, HardDrive, MessageSquare, Plus, TrendingUp, Calendar, DollarSign, AlertTriangle } from "lucide-react"
import { TopOffModal } from "@/components/top-off-modal"
import { UsageChart } from "@/components/usage-chart"
import { UserOverview } from "@/components/user-overview"
import { BillingHistory } from "@/components/billing-history"
import { TaskHistory } from "@/components/task-history"

export default function BillingDashboard() {
  const [isTopOffOpen, setIsTopOffOpen] = useState(false)
  const [currentBalance, setCurrentBalance] = useState(5000)
  const [usageSummary, setUsageSummary] = useState({ tokens_in: 0, tokens_out: 0, minutes: 0 })

  useEffect(() => {
    fetch("http://127.0.0.1:5000/users")
      .then(res => res.json())
      .then(data => {
        const totals = Object.values(data).reduce(
          (acc, user) => {
            acc.tokens_in += user.tokens_in || 0
            acc.tokens_out += user.tokens_out || 0
            const minutes = parseFloat(user.duration_minutes?.replace(" minutes", "")) || 0
            acc.minutes += minutes
            return acc
          },
          { tokens_in: 0, tokens_out: 0, minutes: 0 }
        )
        setUsageSummary(totals)
      })
      .catch(err => console.error("/users fetch error:", err))
  }, [])

  const usageData = {
    tokens: {
      used: usageSummary.tokens_in + usageSummary.tokens_out,
      limit: 10000000,
      cost: ((usageSummary.tokens_in + usageSummary.tokens_out) / 1000) * 1.15,
      unit: "tokens"
    },
    time: {
      timeCompute: usageSummary.minutes / 60,
      computeLimit: 10
    },
    cpu: { used: 0, limit: 1, cost: 0, unit: "" },
    storage: { used: 2.3, limit: 5, cost: 4.6, unit: "GB" }
  }

  const totalUsageCost = usageData.tokens.cost + usageData.storage.cost
  const isLowBalance = currentBalance < 20

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your usage and billing preferences</p>
          </div>
          <Button onClick={() => setIsTopOffOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Credits
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className={`${isLowBalance ? "border-orange-200 bg-orange-50" : ""}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              {isLowBalance && <AlertTriangle className="h-4 w-4 text-orange-500" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              {isLowBalance && <p className="text-xs text-orange-600 mt-1">Low balance - consider adding credits</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${usageData.tokens.cost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Input tokens charge</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${((usageSummary.tokens_in / 1000) * 1.15).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Charged per input of items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Output token charge</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${((usageSummary.tokens_out / 1000) * 1.15).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Charged per output of the LLM</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Compute Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{usageData.time.timeCompute.toFixed(2)} / {usageData.time.computeLimit} hours</span>
                  <span>{((usageData.time.timeCompute / usageData.time.computeLimit) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(usageData.time.timeCompute / usageData.time.computeLimit) * 100} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Storage
              </CardTitle>
              <Badge variant="secondary">${usageData.storage.cost}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{usageData.storage.used} / {usageData.storage.limit} GB</span>
                  <span>{((usageData.storage.used / usageData.storage.limit) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(usageData.storage.used / usageData.storage.limit) * 100} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Token Usage
              </CardTitle>
              <Badge variant="secondary">${usageData.tokens.cost.toFixed(2)}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{(usageData.tokens.used / 1000).toFixed(0)}K / {(usageData.tokens.limit / 1000).toFixed(0)}K tokens</span>
                  <span>{((usageData.tokens.used / usageData.tokens.limit) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(usageData.tokens.used / usageData.tokens.limit) * 100} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="daily-usage" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily-usage">Daily usage overview</TabsTrigger>
            <TabsTrigger value="user-usage">user-wise usage</TabsTrigger>
            <TabsTrigger value="history">Task/Agent-wise Usage Overview</TabsTrigger>
            <TabsTrigger value="task-history">Task History</TabsTrigger>
          </TabsList>

          <TabsContent value="daily-usage" className="space-y-4">
            <UsageChart />
          </TabsContent>

          <TabsContent value="user-usage" className="space-y-4">
            <UserOverview />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <BillingHistory />
          </TabsContent>

          <TabsContent value="task-history" className="space-y-4">
            <TaskHistory />
          </TabsContent>
        </Tabs>

        <TopOffModal
          isOpen={isTopOffOpen}
          onClose={() => setIsTopOffOpen(false)}
          currentBalance={currentBalance}
          onBalanceUpdate={setCurrentBalance}
        />
      </div>
    </div>
  )
}
