"use client"

import { useState, useEffect } from "react"
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

  // Get current order (for demo, using the first order)
  const currentOrder = state.orders[0]
  const cartItems = currentOrder?.items || []

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const tax = subtotal * 0.05
  const total = subtotal + tax

  useEffect(() => {
    // Initialize payment service based on configuration
    // This would come from your app settings
    const config = {
      processor: "paystack", // or 'flutterwave', 'interswitch', etc.
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    }

    if (config.publicKey) {
      const service = new UnifiedPaymentService("paystack", config)
      setPaymentService(service)

      // Initialize the payment service
      service.initialize().catch(console.error)
    }
  }, [])

  const handlePayment = async () => {
    if (paymentMethod === "cash") {
      handleCashPayment()
      return
    }

    if (!paymentService) {
      console.error("Payment service not initialized")
      return
    }

    setIsProcessing(true)
    setPaymentResult(null)

    try {
      const result = await paymentService.processPayment(total, "USD")
      setPaymentResult(result)

      if (result.success) {
        handlePaymentSuccess(result)
      }
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
    // Handle cash payment
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

  const handlePaymentSuccess = (result: PaymentResult) => {
    if (currentOrder) {
      dispatch({
        type: "UPDATE_ORDER_STATUS",
        payload: { orderId: currentOrder.id, status: "preparing" },
      })
      dispatch({ type: "UPDATE_METRICS" })
    }
  }

  const resetPayment = () => {
    setPaymentResult(null)
    setIsProcessing(false)
  }

  return (
    <div className="w-[380px] bg-white border-l flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Table {currentOrder?.tableNumber || "4"}</h2>
          <p className="text-sm text-gray-500">{currentOrder?.customerName || "Floyd Miles"}</p>
        </div>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 border-b">
        <div className="flex gap-2 mb-4">
          <Button variant="secondary" className="flex-1 rounded-full">
            Dine in
          </Button>
          <Button variant="outline" className="flex-1 rounded-full">
            Take Away
          </Button>
          <Button variant="outline" className="flex-1 rounded-full">
            Delivery
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {cartItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 mb-4">
            <img
              src={item.image || "/placeholder.svg?height=64&width=64"}
              alt={item.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="text-sm font-medium">{item.title}</h4>
              <div className="flex justify-between items-center mt-1">
                <span className="text-green-600 font-bold">${item.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">{item.quantity}X</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sub Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax 5%</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total Amount</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            variant={paymentMethod === "cash" ? "default" : "outline"}
            className="flex flex-col items-center py-2"
            onClick={() => setPaymentMethod("cash")}
            disabled={isProcessing}
          >
            <Banknote className="h-5 w-5 mb-1" />
            <span className="text-xs">Cash</span>
          </Button>
          <Button
            variant={paymentMethod === "card" ? "default" : "outline"}
            className="flex flex-col items-center py-2"
            onClick={() => setPaymentMethod("card")}
            disabled={isProcessing}
          >
            <CreditCard className="h-5 w-5 mb-1" />
            <span className="text-xs">Card</span>
          </Button>
          <Button
            variant={paymentMethod === "qr" ? "default" : "outline"}
            className="flex flex-col items-center py-2"
            onClick={() => setPaymentMethod("qr")}
            disabled={isProcessing}
          >
            <QrCode className="h-5 w-5 mb-1" />
            <span className="text-xs">USSD/QR</span>
          </Button>
        </div>

        {/* Payment Result */}
        {paymentResult && (
          <Card
            className={`mb-4 ${paymentResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                {paymentResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${paymentResult.success ? "text-green-800" : "text-red-800"}`}>
                    {paymentResult.success ? "Payment Successful!" : "Payment Failed"}
                  </p>
                  {paymentResult.transactionId && (
                    <p className="text-xs text-gray-600">ID: {paymentResult.transactionId}</p>
                  )}
                  {paymentResult.error && <p className="text-xs text-red-600">{paymentResult.error}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card Payment Container */}
        {paymentMethod === "card" && !paymentResult?.success && (
          <div id="card-container" className="mb-4 p-3 border rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 text-center">Card payment form will appear here</p>
          </div>
        )}

        {/* Action Buttons */}
        {!paymentResult?.success ? (
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
            onClick={handlePayment}
            disabled={isProcessing || cartItems.length === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${total.toFixed(2)}`
            )}
          </Button>
        ) : (
          <div className="space-y-2">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
              onClick={() => console.log("Print receipt")}
            >
              Print Receipt
            </Button>
            <Button variant="outline" className="w-full h-10" onClick={resetPayment}>
              New Order
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
