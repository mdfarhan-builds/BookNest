export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items, customer } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Your cart is empty." });
    }

    if (!customer?.phone) {
      return res.status(400).json({ error: "Customer phone number is required." });
    }

    const books = {
      1: { title: "The Great Gatsby", price: 100 },
      2: { title: "1984", price: 500 },
      3: { title: "To Kill a Mockingbird", price: 699 },
      4: { title: "Harry Potter", price: 100 },
      5: { title: "The Hobbit", price: 100 },
      6: { title: "Treasure Island", price: 949 },
      7: { title: "The Call of the Wild", price: 569 },
      8: { title: "The Three Musketeers", price: 159 },
      9: { title: "Moby-Dick", price: 749 },
      10: { title: "King Solomon's Mines", price: 589 },
      11: { title: "Jurassic Park", price: 259 },
      12: { title: "The Martian", price: 459 },
      13: { title: "It Ends With Us", price: 829 },
      14: { title: "The Color Purple", price: 725 },
      15: { title: "A Man Called OVE", price: 619 },
      16: { title: "The Beekeeper of Aleppo", price: 899 },
      17: { title: "A Thousand Splendid Suns", price: 549 },
      18: { title: "The Alchemist", price: 329 },
      19: { title: "The Stable Boy of Auschwitz", price: 569 },
      20: { title: "Born Survivors", price: 459 },
      21: { title: "The Ballad of Songbirds and Snakes", price: 819 },
      22: { title: "Hide and Don't Seek", price: 999 },
      23: { title: "Legendary", price: 799 },
      24: { title: "SHIVAJI", price: 1299 },
      25: { title: "The Mahabharata", price: 10 }
    };

    const selectedBooks = items.map((item) => {
      const book = books[Number(item.id)];

      if (!book) {
        throw new Error("Invalid book in cart.");
      }

      return { id: Number(item.id), ...book };
    });

    const totalAmount = selectedBooks.reduce(
      (sum, book) => sum + book.price,
      0
    );

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (!appId || !secretKey) {
      return res.status(500).json({
        error: "Cashfree credentials are not configured."
      });
    }

    const orderId = `bn_${crypto.randomUUID().replace(/-/g, "")}`;

    const response = await fetch(
      "https://api.cashfree.com/pg/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "x-api-version": "2025-01-01"
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: totalAmount,
          order_currency: "INR",
          customer_details: {
            customer_id: `bn_${String(customer.phone).replace(/\D/g, "")}`,
            customer_phone: String(customer.phone),
            ...(customer.email
              ? { customer_email: String(customer.email) }
              : {}),
            ...(customer.name
              ? { customer_name: String(customer.name) }
              : {})
          },
          order_meta: {
            return_url:
              "https://booknest01-jade.vercel.app/payment-return.html?order_id={order_id}"
          },
          order_note: "BookNest book purchase"
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree order creation failed:", data);
      return res.status(502).json({
        error: "Cashfree could not create the order. Please try again."
      });
    }

    return res.status(200).json({
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id
    });

  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      error: "Unable to create payment order."
    });
  }
}