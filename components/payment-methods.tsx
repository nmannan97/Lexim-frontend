"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CreditCard, Plus, Settings } from "lucide-react"

export function PaymentMethods() {
  const paymentMethods = [
    {
      id: "1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      last4: "5555",
      brand: "Mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your payment methods and billing preferences</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {method.brand} •••• •••• •••• {method.last4}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                    </p>
                  </div>
                  {method.isDefault && <Badge variant="secondary">Default</Badge>}
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Preferences</CardTitle>
          <CardDescription>Configure your billing and notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-topoff">Auto Top-off</Label>
              <p className="text-sm text-muted-foreground">Automatically add credits when balance falls below $10</p>
            </div>
            <Switch id="auto-topoff" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="usage-alerts">Usage Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive notifications when approaching usage limits</p>
            </div>
            <Switch id="usage-alerts" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="monthly-summary">Monthly Summary</Label>
              <p className="text-sm text-muted-foreground">Receive monthly billing summary via email</p>
            </div>
            <Switch id="monthly-summary" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="low-balance">Low Balance Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when your balance is running low</p>
            </div>
            <Switch id="low-balance" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
          <CardDescription>Update your billing information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Company</Label>
                <p className="text-sm text-muted-foreground">Acme Corporation</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Tax ID</Label>
                <p className="text-sm text-muted-foreground">12-3456789</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Address</Label>
              <p className="text-sm text-muted-foreground">
                123 Business St
                <br />
                San Francisco, CA 94105
                <br />
                United States
              </p>
            </div>
            <Button variant="outline">Update Billing Address</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
