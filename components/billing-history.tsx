"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, CreditCard, Plus } from "lucide-react"

export function BillingHistory() {
  const transactions = [
    {
      id: "TXN-001",
      date: "2024-01-15",
      type: "usage",
      description: "CPU Time - 45.2 hours",
      amount: -6.78,
      status: "completed",
    },
    {
      id: "TXN-002",
      date: "2024-01-15",
      type: "usage",
      description: "Token Usage - 250K tokens",
      amount: -5.0,
      status: "completed",
    },
    {
      id: "TXN-003",
      date: "2024-01-14",
      type: "topoff",
      description: "Credit Top-off",
      amount: 50.0,
      status: "completed",
    },
    {
      id: "TXN-004",
      date: "2024-01-13",
      type: "usage",
      description: "Storage - 1.2 GB",
      amount: -2.4,
      status: "completed",
    },
    {
      id: "TXN-005",
      date: "2024-01-12",
      type: "usage",
      description: "CPU Time - 32.1 hours",
      amount: -4.82,
      status: "completed",
    },
    {
      id: "TXN-006",
      date: "2024-01-10",
      type: "topoff",
      description: "Credit Top-off",
      amount: 25.0,
      status: "completed",
    },
  ]

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "topoff":
        return <Plus className="h-4 w-4 text-green-600" />
      case "usage":
        return <CreditCard className="h-4 w-4 text-blue-600" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Failed
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent billing transactions and usage charges</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()} • {transaction.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(transaction.status)}
                  <div
                    className={`text-right font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              </div>
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
            <div className="text-2xl font-bold">$156.42</div>
            <p className="text-sm text-muted-foreground">+8% from previous month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Credits Added (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$200.00</div>
            <p className="text-sm text-muted-foreground">4 transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Daily Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5.21</div>
            <p className="text-sm text-muted-foreground">Based on usage patterns</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
