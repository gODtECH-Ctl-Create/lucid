// Square Web Payments SDK integration
export class SquarePaymentService {
  private payments: any
  private card: any
  private applicationId: string
  private locationId: string

  constructor(applicationId: string, locationId: string) {
    this.applicationId = applicationId
    this.locationId = locationId
  }

  async initialize() {
    if (!window.Square) {
      throw new Error("Square Web Payments SDK not loaded")
    }

    this.payments = window.Square.payments(this.applicationId, this.locationId)
    this.card = await this.payments.card()
    await this.card.attach("#card-container")
  }

  async processPayment(amount: number, currency = "USD") {
    try {
      const result = await this.card.tokenize()

      if (result.status === "OK") {
        // Send token to your backend
        const response = await fetch("/api/payments/square", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceId: result.token,
            amountMoney: {
              amount: Math.round(amount * 100), // Convert to cents
              currency: currency,
            },
            locationId: this.locationId,
          }),
        })

        const paymentResult = await response.json()
        return paymentResult
      } else {
        throw new Error("Tokenization failed")
      }
    } catch (error) {
      console.error("Payment processing error:", error)
      throw error
    }
  }

  destroy() {
    if (this.card) {
      this.card.destroy()
    }
  }
}
