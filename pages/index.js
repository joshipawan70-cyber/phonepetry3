// pages/api/phonepe-webhook.js
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body;

    console.log("Webhook payload received:", payload);

    // --- Security: Verify PhonePe signature ---
    const secretKey = process.env.PHONEPE_SECRET; // store your secret key in .env.local
    const signature = req.headers["x-phonepe-signature"]; // PhonePe sends signature in this header

    if (!signature) {
      console.warn("Missing PhonePe signature!");
      return res.status(400).json({ error: "Missing signature" });
    }

    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(JSON.stringify(payload))
      .digest("hex");

    if (hash !== signature) {
      console.warn("Invalid signature!");
      return res.status(400).json({ error: "Invalid signature" });
    }

    // --- Optional: Store transaction in DB (Firebase example placeholder) ---
    // await saveTransactionToDB(payload);

    // --- Respond to PhonePe ---
    res.status(200).json({
      status: "success",
      message: "Payment confirmed",
      transactionId: payload.transactionId,
    });

    // --- Optional: Notify customer/system asynchronously ---
    // await notifyCustomer(payload);

  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
