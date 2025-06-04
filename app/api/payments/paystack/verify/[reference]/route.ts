import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { reference: string } }) {
  const reference = params.reference

  try {
    // In a real implementation, you would use the Paystack secret key
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

    if (!paystackSecretKey) {
      return NextResponse.json({ error: "Paystack secret key not configured" }, { status: 500 })
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Verification failed" }, { status: 400 })
    }

    if (data.data.status !== "success") {
      return NextResponse.json({ error: "Payment was not successful" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      reference: data.data.reference,
      amount: data.data.amount / 100, // Convert from kobo to naira
      currency: data.data.currency,
      transactionDate: data.data.transaction_date,
      customer: {
        email: data.data.customer.email,
      },
    })
  } catch (error) {
    console.error("Error verifying Paystack payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
