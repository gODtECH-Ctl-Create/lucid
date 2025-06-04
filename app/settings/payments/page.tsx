"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NavigationHeader } from "@/components/navigation-header"
import { PaymentProcessorSelector } from "@/components/payment-processor-selector"
import type { PaymentProcessor } from "@/lib/payment-config"
import { Settings, CheckCircle, AlertCircle } from "lucide-react"

export default function PaymentSettingsPage() {
  // Update the default processor to Paystack
  const [currentProcessor, setCurrentProcessor] = useState<PaymentProcessor | null>("paystack")
  const [isConfigured, setIsConfigured] = useState(false)
  const [testMode, setTestMode] = useState(true)

  const handleProcessorSelect = (processor: PaymentProcessor, config: any) => {
    setCurrentProcessor(processor)
    setIsConfigured(true)
    console.log("Selected processor:", processor, "Config:", config)
    // Here you would save the configuration to your backend
  }

  const testPayment = async () => {
    // Test payment functionality
    console.log("Testing payment...")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader title="Payment Settings" showBackButton />

      <div className="container mx-auto p-6 max-w-6xl">
        {/* Current Status */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Payment Configuration
                </CardTitle>
                <CardDescription>Configure your payment processor to accept payments</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {isConfigured ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Configured
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Not Configured
                  </Badge>
                )}
                {testMode && <Badge variant="outline">Test Mode</Badge>}
              </div>
            </div>
          </CardHeader>
          {currentProcessor && isConfigured && (
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Processor: {currentProcessor}</p>
                  <p className="text-sm text-gray-600">Ready to accept payments</p>
                </div>
                <Button onClick={testPayment} variant="outline">
                  Test Payment
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Processor Selection */}
        <PaymentProcessorSelector onSelect={handleProcessorSelect} currentProcessor={currentProcessor || undefined} />
      </div>
    </div>
  )
}
