export class VoguePayPaymentService {
  private merchantId: string
  private memo = ""
  private environment: "demo" | "live"

  constructor(merchantId: string, environment: "demo" | "live" = "demo") {
    this.merchantId = merchantId
    this.environment = environment
  }

  async initialize() {
    if (!window.voguepay) {
      throw new Error("VoguePay SDK not loaded")
    }

    return true
  }

  async processPayment(amount: number, currency = "NGN") {
    this.memo = `Order payment - ${Date.now()}`

    return new Promise((resolve, reject) => {
      window.voguepay.init({
        v_merchant_id: this.merchantId,
        total: amount,
        memo: this.memo,
        cur: currency,
        merchant_ref: `ref_${Date.now()}`,
        developer_code: "restaurant_pos",
        store_id: 1,
        loadText: "Processing Payment...",
        customer: {
          name: "Customer Name",
          address: "Customer Address",
          city: "Customer City",
          state: "Customer State",
          zipcode: "100001",
          email: "customer@example.com",
          phone: "08000000000",
        },
        closed: () => {
          reject(new Error("Payment window closed"))
        },
        success: (transaction: any) => {
          resolve({
            transactionId: transaction.transaction_id,
            status: "success",
            amount: amount,
            currency: currency,
          })
        },
        failed: () => {
          reject(new Error("Payment failed"))
        },
      })
    })
  }
}
