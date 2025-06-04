// Update the PaymentProcessor type to include the African payment processors
export type PaymentProcessor = "paystack" | "flutterwave" | "interswitch" | "voguepay" | "remita" | "kora"

export interface PaymentConfig {
  processor: PaymentProcessor
  apiKey: string
  environment: "sandbox" | "production"
  merchantId?: string
  applicationId?: string
}

// Replace the paymentProcessors object with these African payment processors
export const paymentProcessors = {
  paystack: {
    name: "Paystack",
    description: "Popular Nigerian payment processor with Pan-African presence",
    features: ["Cards", "Bank transfers", "USSD", "Mobile money"],
    fees: "1.5% + ₦100 per transaction",
  },
  flutterwave: {
    name: "Flutterwave",
    description: "Pan-African payment solution for global merchants",
    features: ["Cards", "Mobile money", "Bank transfers", "USSD"],
    fees: "1.4% + ₦100 per transaction",
  },
  interswitch: {
    name: "Interswitch",
    description: "Leading African integrated payments processor",
    features: ["Cards", "Bank transfers", "USSD", "POS integration"],
    fees: "1.5% per transaction",
  },
  voguepay: {
    name: "VoguePay",
    description: "Secure online payment processor for African businesses",
    features: ["Cards", "Bank transfers", "Wallet", "International payments"],
    fees: "1.5% per transaction",
  },
  remita: {
    name: "Remita",
    description: "Nigerian payment solution for businesses and government",
    features: ["Cards", "Bank transfers", "USSD", "Collections"],
    fees: "1.5% per transaction",
  },
  kora: {
    name: "Kora",
    description: "Modern payment infrastructure for African businesses",
    features: ["Cards", "Bank transfers", "Mobile money", "Collections"],
    fees: "1.5% per transaction",
  },
}
