import { SquarePaymentService } from "./square-payment"
import { PayPalPaymentService } from "./paypal-payment"
import { PaystackPaymentService } from "./paystack-payment"
import { FlutterwavePaymentService } from "./flutterwave-payment"
import { InterswitchPaymentService } from "./interswitch-payment"
import { VoguePayPaymentService } from "./voguepay-payment"
import { RemitaPaymentService } from "./remita-payment"
import { KoraPaymentService } from "./kora-payment"

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  amount: number
  currency: string
  processor: string
}

export class UnifiedPaymentService {
  private processor: string
  private service:
    | SquarePaymentService
    | PayPalPaymentService
    | PaystackPaymentService
    | FlutterwavePaymentService
    | InterswitchPaymentService
    | VoguePayPaymentService
    | RemitaPaymentService
    | KoraPaymentService
    | null = null

  constructor(processor: string, config: any) {
    this.processor = processor
    this.initializeProcessor(config)
  }

  private initializeProcessor(config: any) {
    switch (this.processor) {
      case "square":
        this.service = new SquarePaymentService(config.applicationId, config.locationId)
        break
      case "paypal":
        this.service = new PayPalPaymentService(config.clientId, config.environment)
        break
      case "paystack":
        this.service = new PaystackPaymentService(config.publicKey)
        break
      case "flutterwave":
        this.service = new FlutterwavePaymentService(config.publicKey, config.customerDetails)
        break
      case "interswitch":
        this.service = new InterswitchPaymentService(config.merchantCode, config.payItemId, config.environment)
        break
      case "voguepay":
        this.service = new VoguePayPaymentService(config.merchantId, config.environment)
        break
      case "remita":
        this.service = new RemitaPaymentService(
          config.publicKey,
          config.merchantId,
          config.serviceTypeId,
          config.environment,
        )
        break
      case "kora":
        this.service = new KoraPaymentService(config.publicKey, config.businessId, config.environment)
        break
      default:
        throw new Error(`Unsupported payment processor: ${this.processor}`)
    }
  }

  async initialize() {
    if (!this.service) {
      throw new Error("Payment service not initialized")
    }
    return this.service.initialize()
  }

  async processPayment(amount: number, currency = "USD"): Promise<PaymentResult> {
    if (!this.service) {
      throw new Error("Payment service not initialized")
    }

    try {
      const result = await this.service.processPayment(amount, currency)
      return {
        success: true,
        transactionId: result.transactionId || result.id,
        amount,
        currency,
        processor: this.processor,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Payment failed",
        amount,
        currency,
        processor: this.processor,
      }
    }
  }
}
