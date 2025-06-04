import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { transaction_id } = await request.json()

    // In a real implementation, you would use the Flutterwave secret key
    const flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY

    if (!flutterwaveSecretKey) {
      return NextResponse.json({ error: "Flutterwave secret key not configured" }, { status: 500 })
    }

    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      headers: {
        Authorization: `Bearer ${flutterwaveSecretKey}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Verification failed" }, { status: 400 })
    }

    if (data.status !== "success") {
      return NextResponse.json({ error: "Payment was not successful" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      reference: data.data.tx_ref,
      amount: data.data.amount,
      currency: data.data.currency,
      transactionDate: data.data.created_at,
      customer: {
        email: data.data.customer.email,
      },
    })
  } catch (error) {
    console.error("Error verifying Flutterwave payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
