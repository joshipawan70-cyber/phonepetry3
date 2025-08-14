import fetch from 'node-fetch';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const webhookUrl = 'http://localhost:3000/api/phonepe-webhook'; // Local Next.js server
const payload = {
  transactionId: "test123",
  status: "SUCCESS",
  amount: 10000,
  message: "Payment successful"
};

const signature = crypto.createHmac('sha256', process.env.PHONEPE_SECRET)
                        .update(JSON.stringify(payload))
                        .digest('hex');

async function testWebhook() {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-verify': signature
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  console.log("Response from webhook:", data);
}

testWebhook();
