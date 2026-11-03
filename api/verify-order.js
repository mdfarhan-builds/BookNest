export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const orderId = req.query.order_id;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: "Order ID is missing."
      });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (!appId || !secretKey) {
      return res.status(500).json({
        success: false,
        error: "Cashfree credentials are not configured."
      });
    }

    const response = await fetch(
      `https://sandbox.cashfree.com/pg/orders/${encodeURIComponent(orderId)}`,
      {
        method: "GET",
        headers: {
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "x-api-version": "2025-01-01"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree verification failed:", data);

      return res.status(502).json({
        success: false,
        error: "Unable to verify payment."
      });
    }

    if (data.order_status !== "PAID") {
      return res.status(200).json({
        success: false,
        status: data.order_status || "UNKNOWN"
      });
    }

    return res.status(200).json({
      success: true,
      orderId: data.order_id,
      amount: data.order_amount,
      currency: data.order_currency
    });

  } catch (error) {
    console.error("Verify order error:", error);

    return res.status(500).json({
      success: false,
      error: "Payment verification failed."
    });
  }
}