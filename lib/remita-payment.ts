export class RemitaPaymentService {
  private publicKey: string
  private merchantId: string
  private serviceTypeId: string
  private environment: "test" | "live"

  constructor(publicKey: string, merchantId: string, serviceTypeId: string, environment: "test" | "live" = "test") {
    this.publicKey = publicKey
    this.merchantId = merchantId
    this.serviceTypeId = serviceTypeId
    this.environment = environment
  }

  async initialize() {
    if (!window.RemitaPayment) {
      throw new Error("Remita SDK not loaded")
    }

    return true
  }

  async processPayment(amount: number, currency = "NGN") {
    const paymentReference = `rem_${Date.now()}`

    return new Promise((resolve, reject) => {
      const paymentEngine = new window.RemitaPayment(
        this.publicKey,
        this.merchantId,
        this.serviceTypeId,
        paymentReference,
        amount,
        this.environment,
      )

      paymentEngine.processPayment({
        onSuccess: (response: any) => {
          resolve({
            transactionId: response.paymentReference,
            rrr: response.RRR,
            status: "success",
            amount: amount,
            currency: currency,
          })
        },
        onError: (error: any) => {
          reject(new Error(`Payment failed: ${error.message || "Unknown error"}`))
        },
        onClose: () => {
          reject(new Error("Payment window closed"))
        },
      })
    })
  }
}
