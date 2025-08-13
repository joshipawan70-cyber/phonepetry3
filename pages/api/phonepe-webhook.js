export default function handler(req, res) {
  if (req.method === "POST") {
    console.log("Webhook payload received:", req.body);

    // You can add custom logic here (store in DB, trigger another API, etc.)

    return res.status(200).json({ status: "success" });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
}
