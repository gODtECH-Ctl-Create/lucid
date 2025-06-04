export class InterswitchPaymentService {
  private merchantCode: string
  private payItemId: string
  private customerId = ""
  private environment: "TEST" | "LIVE"

  constructor(merchantCode: string, payItemId: string, environment: "TEST" | "LIVE" = "TEST") {
    this.merchantCode = merchantCode
    this.payItemId = payItemId
    this.environment = environment
  }

  async initialize() {
    if (!window.webpayCheckout) {
      throw new Error("Interswitch SDK not loaded")
    }

    return true
  }

  async processPayment(amount: number, currency = "NGN") {
    this.customerId = `cust_${Date.now()}`

    return new Promise((resolve, reject) => {
      const options = {
        merchant_code: this.merchantCode,
        pay_item_id: this.payItemId,
        amount: Math.round(amount * 100), // Convert to kobo
        currency: 566, // NGN currency code
        site_redirect_url: window.location.origin + "/api/payments/interswitch/callback",
        txn_ref: `txn_${Date.now()}`,
        customer_id: this.customerId,
        cust_name: "Customer Name",
        cust_email: "customer@example.com",
        cust_mobile: "08000000000",
        mode: this.environment,
      }

      window.webpayCheckout(options, (response: any) => {
        if (response.resp === "00") {
          resolve({
            transactionId: response.txnref,
            status: "success",
            amount: amount,
            currency: currency,
          })
        } else {
          reject(new Error(`Payment failed: ${response.desc}`))
        }
      })
    })
  }
}
