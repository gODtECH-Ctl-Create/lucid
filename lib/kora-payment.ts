export class KoraPaymentService {
  private publicKey: string
  private businessId: string
  private environment: "test" | "live"

  constructor(publicKey: string, businessId: string, environment: "test" | "live" = "test") {
    this.publicKey = publicKey
    this.businessId = businessId
    this.environment = environment
  }

  async initialize() {
    if (!window.Kora) {
      throw new Error("Kora SDK not loaded")
    }

    return true
  }

  async processPayment(amount: number, currency = "NGN") {
    const reference = `kora_${Date.now()}`

    return new Promise((resolve, reject) => {
      window.Kora.setup({
        key: this.publicKey,
        amount: amount,
        currency: currency,
        reference: reference,
        customer: {
          name: "Customer Name",
          email: "customer@example.com",
          phone: "08000000000",
        },
        businessId: this.businessId,
        onClose: () => {
          reject(new Error("Payment window closed"))
        },
        onSuccess: (response: any) => {
          resolve({
            transactionId: response.reference,
            status: "success",
            amount: amount,
            currency: currency,
          })
        },
        onError: (error: any) => {
          reject(new Error(`Payment failed: ${error.message || "Unknown error"}`))
        },
      })
    })
  }
}
