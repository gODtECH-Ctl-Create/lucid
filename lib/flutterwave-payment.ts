export class FlutterwavePaymentService {
  private publicKey: string
  private txRef = ""
  private customerDetails: any = {}

  constructor(publicKey: string, customerDetails = {}) {
    this.publicKey = publicKey
    this.customerDetails = {
      name: "Customer Name",
      email: "customer@example.com",
      phone_number: "08000000000",
      ...customerDetails,
    }
  }

  async initialize() {
    if (!window.FlutterwaveCheckout) {
      throw new Error("Flutterwave SDK not loaded")
    }

    return true
  }

  async processPayment(amount: number, currency = "NGN") {
    this.txRef = `fw_${Date.now()}`

    return new Promise((resolve, reject) => {
      window.FlutterwaveCheckout({
        public_key: this.publicKey,
        tx_ref: this.txRef,
        amount: amount,
        currency: currency,
        payment_options: "card, banktransfer, ussd, mobilemoney",
        customer: {
          email: this.customerDetails.email,
          phone_number: this.customerDetails.phone_number,
          name: this.customerDetails.name,
        },
        callback: (response: any) => {
          if (response.status === "successful") {
            resolve({
              transactionId: response.transaction_id,
              txRef: this.txRef,
              status: "success",
              amount: response.amount,
              currency: response.currency,
            })
          } else {
            reject(new Error("Payment failed"))
          }
        },
        onclose: () => {
          reject(new Error("Payment window closed"))
        },
        customizations: {
          title: "Restaurant POS Payment",
          description: "Payment for your order",
          logo: "https://your-restaurant-logo-url.com/logo.png",
        },
      })
    })
  }
}
