"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CreditCard, QrCode, Banknote, Edit2, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useRestaurant } from "@/contexts/restaurant-context"
import { UnifiedPaymentService, type PaymentResult } from "@/lib/payment-service"

export function EnhancedCart() {
  const { state, dispatch } = useRestaurant()
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "qr">("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)
  const [paymentService, setPaymentService] = useState<UnifiedPaymentService | null>(null)

  const currentOrder = state.orders[0]
  const cartItems = currentOrder?.items || []

  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
  const tax = subtotal * 0.05
  const total = subtotal + tax

  useEffect(() => {
    const config = {
      processor: "paystack",
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    }

    if (config.publicKey) {
      const service = new UnifiedPaymentService("paystack", config)
      setPaymentService(service)
      service.initialize().catch(console.error)
    }
  }, [])

  const handlePayment = async () => {
    if (paymentMethod === "cash") {
      handleCashPayment()
      return
    }

    if (!paymentService) {
      setPaymentResult({
        success: false,
        error: "Payment provider is not configured for this demo.",
        amount: total,
        currency: "USD",
        processor: "unconfigured",
      })
      return
    }

    setIsProcessing(true)
    setPaymentResult(null)

    try {
      const result = await paymentService.processPayment(total, "USD")
      setPaymentResult(result)
      if (result.success) handlePaymentSuccess(result)
    } catch (error) {
      setPaymentResult({
        success: false,
        error: error instanceof Error ? error.message : "Payment failed",
        amount: total,
        currency: "USD",
        processor: "unknown",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCashPayment = () => {
    const result: PaymentResult = {
      success: true,
      transactionId: `CASH_${Date.now()}`,
      amount: total,
      currency: "USD",
      processor: "cash",
    }
    setPaymentResult(result)
    handlePaymentSuccess(result)
  }

  const handlePaymentSuccess = (_result: PaymentResult) => {
    if (currentOrder && currentOrder.status === "confirmed") {
      dispatch({
        type: "UPDATE_ORDER_STATUS",
        payload: { orderId: currentOrder.id, status: "sent_to_kitchen" },
      })
    }
  }

  const resetPayment = () => {
    setPaymentResult(null)
    setIsProcessing(false)
  }

  return (
    <div className="flex h-full w-[380px] flex-col border-l bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h2 className="text-xl font-bold">{currentOrder?.orderNumber || "Current Order"}</h2>
          <p className="text-sm text-gray-500">
            {currentOrder?.tableId ? `Table ${currentOrder.tableId}` : "Take away / delivery"}
          </p>
        </div>
        <Button variant="ghost" size="icon" aria-label="Edit order">
          <Edit2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="border-b p-4">
        <div className="grid grid-cols-3 gap-2">
          <Button variant="secondary" className="rounded-full">Dine in</Button>
          <Button variant="outline" className="rounded-full">Take away</Button>
          <Button variant="outline" className="rounded-full">Delivery</Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {cartItems.map((item) => (
          <div key={item.id} className="mb-4 flex items-center gap-3">
            <img
              src={item.imageUrl || "/placeholder.svg?height=64&width=64"}
              alt={item.name}
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="text-sm font-medium">{item.name}</h4>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-bold text-green-600">${item.unitPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500">{item.quantity}x</span>
              </div>
            </div>
          </div>
        ))}
        {cartItems.length === 0 && <p className="text-sm text-gray-500">No items in the current order.</p>}
      </div>

      <div className="border-t p-4">
        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-600">Tax 5%</span><span>${tax.toFixed(2)}</span></div>
          <Separator />
          <div className="flex justify-between font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          <Button variant={paymentMethod === "cash" ? "default" : "outline"} className="flex flex-col py-2" onClick={() => setPaymentMethod("cash")} disabled={isProcessing}>
            <Banknote className="mb-1 h-5 w-5" /><span className="text-xs">Cash</span>
          </Button>
          <Button variant={paymentMethod === "card" ? "default" : "outline"} className="flex flex-col py-2" onClick={() => setPaymentMethod("card")} disabled={isProcessing}>
            <CreditCard className="mb-1 h-5 w-5" /><span className="text-xs">Card</span>
          </Button>
          <Button variant={paymentMethod === "qr" ? "default" : "outline"} className="flex flex-col py-2" onClick={() => setPaymentMethod("qr")} disabled={isProcessing}>
            <QrCode className="mb-1 h-5 w-5" /><span className="text-xs">USSD / QR</span>
          </Button>
        </div>

        {paymentResult && (
          <Card className={`mb-4 ${paymentResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                {paymentResult.success ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-red-600" />}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${paymentResult.success ? "text-green-800" : "text-red-800"}`}>
                    {paymentResult.success ? "Payment Successful" : "Payment Failed"}
                  </p>
                  {paymentResult.transactionId && <p className="text-xs text-gray-600">ID: {paymentResult.transactionId}</p>}
                  {paymentResult.error && <p className="text-xs text-red-600">{paymentResult.error}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!paymentResult?.success ? (
          <Button className="h-12 w-full bg-green-600 text-white hover:bg-green-700" onClick={handlePayment} disabled={isProcessing || cartItems.length === 0}>
            {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : `Pay $${total.toFixed(2)}`}
          </Button>
        ) : (
          <div className="space-y-2">
            <Button className="h-12 w-full bg-blue-600 text-white hover:bg-blue-700" onClick={() => console.log("Print receipt")}>
              Print Receipt
            </Button>
            <Button variant="outline" className="h-10 w-full" onClick={resetPayment}>New Order</Button>
          </div>
        )}
      </div>
    </div>
  )
}
