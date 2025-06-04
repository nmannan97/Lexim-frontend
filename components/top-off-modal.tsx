"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, DollarSign } from "lucide-react"

interface TopOffModalProps {
  isOpen: boolean
  onClose: () => void
  currentBalance: number
  onBalanceUpdate: (newBalance: number) => void
}

export function TopOffModal({ isOpen, onClose, currentBalance, onBalanceUpdate }: TopOffModalProps) {
  const [selectedAmount, setSelectedAmount] = useState("50")
  const [customAmount, setCustomAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const presetAmounts = ["25", "50", "100", "200", "custom"]

  const getAmount = () => {
    return selectedAmount === "custom" ? Number.parseFloat(customAmount) || 0 : Number.parseFloat(selectedAmount)
  }

  const handleTopOff = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const amount = getAmount()
    onBalanceUpdate(currentBalance + amount)
    setIsProcessing(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Add Credits
          </DialogTitle>
          <DialogDescription>Add credits to your account to continue using our services</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Balance */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Balance</span>
                <span className="text-lg font-semibold">${currentBalance.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Amount Selection */}
          <div className="space-y-3">
            <Label>Select Amount</Label>
            <RadioGroup value={selectedAmount} onValueChange={setSelectedAmount}>
              <div className="grid grid-cols-2 gap-3">
                {presetAmounts.map((amount) => (
                  <div key={amount} className="flex items-center space-x-2">
                    <RadioGroupItem value={amount} id={amount} />
                    <Label htmlFor={amount} className="flex-1 cursor-pointer">
                      {amount === "custom" ? "Custom Amount" : `$${amount}`}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {selectedAmount === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="custom-amount">Custom Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="0.00"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="pl-10"
                    min="5"
                    max="1000"
                    step="0.01"
                  />
                </div>
              </div>
            )}
          </div>

          {/* New Balance Preview */}
          {getAmount() > 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">New Balance</span>
                  <span className="text-lg font-semibold text-green-700">
                    ${(currentBalance + getAmount()).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <Card className="cursor-pointer hover:bg-gray-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5" />
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleTopOff} disabled={getAmount() < 5 || isProcessing} className="flex-1">
              {isProcessing ? "Processing..." : `Add $${getAmount().toFixed(2)}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
