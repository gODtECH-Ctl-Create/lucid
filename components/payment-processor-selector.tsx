"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { paymentProcessors, type PaymentProcessor } from "@/lib/payment-config"
import { Check, CreditCard, Globe, Shield } from "lucide-react"

interface PaymentProcessorSelectorProps {
  onSelect: (processor: PaymentProcessor, config: any) => void
  currentProcessor?: PaymentProcessor
}

export function PaymentProcessorSelector({ onSelect, currentProcessor }: PaymentProcessorSelectorProps) {
  const [selectedProcessor, setSelectedProcessor] = useState<PaymentProcessor | null>(currentProcessor || null)
  const [config, setConfig] = useState({
    apiKey: "",
    environment: "sandbox" as "sandbox" | "production",
    merchantId: "",
    applicationId: "",
    locationId: "",
    clientId: "",
    publicKey: "",
    merchantCode: "",
    payItemId: "",
    serviceTypeId: "",
    businessId: "",
  })

  const handleProcessorSelect = (processor: PaymentProcessor) => {
    setSelectedProcessor(processor)
  }

  const handleSaveConfiguration = () => {
    if (selectedProcessor) {
      onSelect(selectedProcessor, config)
    }
  }

  // Update the getConfigFields method to handle the African payment processors
  const getConfigFields = (processor: PaymentProcessor) => {
    switch (processor) {
      case "paystack":
        return (
          <div className="space-y-2">
            <Label htmlFor="publicKey">Public Key</Label>
            <Input
              id="publicKey"
              value={config.publicKey}
              onChange={(e) => setConfig((prev) => ({ ...prev, publicKey: e.target.value }))}
              placeholder="pk_test_..."
              type="password"
            />
          </div>
        )
      case "flutterwave":
        return (
          <div className="space-y-2">
            <Label htmlFor="publicKey">Public Key</Label>
            <Input
              id="publicKey"
              value={config.publicKey}
              onChange={(e) => setConfig((prev) => ({ ...prev, publicKey: e.target.value }))}
              placeholder="FLWPUBK_TEST-..."
              type="password"
            />
          </div>
        )
      case "interswitch":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="merchantCode">Merchant Code</Label>
              <Input
                id="merchantCode"
                value={config.merchantCode}
                onChange={(e) => setConfig((prev) => ({ ...prev, merchantCode: e.target.value }))}
                placeholder="MX12345"
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payItemId">Pay Item ID</Label>
              <Input
                id="payItemId"
                value={config.payItemId}
                onChange={(e) => setConfig((prev) => ({ ...prev, payItemId: e.target.value }))}
                placeholder="Default12345"
                type="password"
              />
            </div>
          </>
        )
      case "voguepay":
        return (
          <div className="space-y-2">
            <Label htmlFor="merchantId">Merchant ID</Label>
            <Input
              id="merchantId"
              value={config.merchantId}
              onChange={(e) => setConfig((prev) => ({ ...prev, merchantId: e.target.value }))}
              placeholder="demo"
              type="password"
            />
          </div>
        )
      case "remita":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="publicKey">Public Key</Label>
              <Input
                id="publicKey"
                value={config.publicKey}
                onChange={(e) => setConfig((prev) => ({ ...prev, publicKey: e.target.value }))}
                placeholder="remita_public_key"
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="merchantId">Merchant ID</Label>
              <Input
                id="merchantId"
                value={config.merchantId}
                onChange={(e) => setConfig((prev) => ({ ...prev, merchantId: e.target.value }))}
                placeholder="2547916"
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceTypeId">Service Type ID</Label>
              <Input
                id="serviceTypeId"
                value={config.serviceTypeId}
                onChange={(e) => setConfig((prev) => ({ ...prev, serviceTypeId: e.target.value }))}
                placeholder="4430731"
                type="password"
              />
            </div>
          </>
        )
      case "kora":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="publicKey">Public Key</Label>
              <Input
                id="publicKey"
                value={config.publicKey}
                onChange={(e) => setConfig((prev) => ({ ...prev, publicKey: e.target.value }))}
                placeholder="kora_public_key"
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessId">Business ID</Label>
              <Input
                id="businessId"
                value={config.businessId}
                onChange={(e) => setConfig((prev) => ({ ...prev, businessId: e.target.value }))}
                placeholder="KBusiness_12345"
                type="password"
              />
            </div>
          </>
        )
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              value={config.apiKey}
              onChange={(e) => setConfig((prev) => ({ ...prev, apiKey: e.target.value }))}
              placeholder="API Key"
              type="password"
            />
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose Your Payment Processor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(paymentProcessors).map(([key, processor]) => (
            <Card
              key={key}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedProcessor === key ? "ring-2 ring-green-500 bg-green-50" : ""
              }`}
              onClick={() => handleProcessorSelect(key as PaymentProcessor)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{processor.name}</CardTitle>
                  {selectedProcessor === key && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <CardDescription>{processor.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm font-medium text-green-600">{processor.fees}</div>
                <div className="space-y-1">
                  {processor.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedProcessor && (
        <Card>
          <CardHeader>
            <CardTitle>Configure {paymentProcessors[selectedProcessor].name}</CardTitle>
            <CardDescription>
              Enter your {paymentProcessors[selectedProcessor].name} credentials to enable payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <Select
                value={config.environment}
                onValueChange={(value: "sandbox" | "production") =>
                  setConfig((prev) => ({ ...prev, environment: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                  <SelectItem value="production">Production (Live)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {getConfigFields(selectedProcessor)}

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveConfiguration} className="bg-green-600 hover:bg-green-700">
                Save Configuration
              </Button>
              <Button variant="outline" onClick={() => setSelectedProcessor(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>African Payment Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium mb-2">Paystack</h4>
              <p className="text-sm text-gray-600">Leading payment processor in Nigeria with Pan-African presence</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-medium mb-2">Flutterwave</h4>
              <p className="text-sm text-gray-600">Pan-African payment solution with global reach</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium mb-2">Interswitch</h4>
              <p className="text-sm text-gray-600">Established payment infrastructure across Africa</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
