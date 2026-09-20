
// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";

// const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || "";
// const APP_SECRET = process.env.META_APP_SECRET || "";           // Messenger + WhatsApp
// const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET || ""; // Instagram only

// // ============================================================
// // 1. META WEBHOOK VERIFICATION
// // ============================================================

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const mode = searchParams.get("hub.mode");
//   const token = searchParams.get("hub.verify_token");
//   const challenge = searchParams.get("hub.challenge");

//   if (mode === "subscribe" && token === VERIFY_TOKEN) {
//     return new NextResponse(challenge, {
//       status: 200,
//       headers: { "Content-Type": "text/plain" },
//     });
//   }

//   return new NextResponse("Forbidden", { status: 403 });
// }

// // ============================================================
// // 2. RECEIVE META EVENTS
// // ============================================================

// export async function POST(req: NextRequest) {
//   try {
//     const rawBody = await req.text();
//     const signature = req.headers.get("x-hub-signature-256");
//     const body = JSON.parse(rawBody);

//     console.log("========== META WEBHOOK ==========");
//     console.log("Webhook object:", body.object);

//     // Object ke hisaab se sahi secret choose karo
//     const secretToUse = body.object === "instagram" ? INSTAGRAM_APP_SECRET : APP_SECRET;

//     if (!isValidSignature(rawBody, signature, secretToUse)) {
//       console.log("❌ INVALID META SIGNATURE");
//       console.log("=================================");
//       return new NextResponse("Invalid signature", { status: 401 });
//     }

//     console.log("✅ META SIGNATURE VALID");

//     if (body.object === "instagram") {
//       await handleInstagramEvent(body);
//     } else if (body.object === "page") {
//       await handleMessengerEvent(body);
//     } else if (body.object === "whatsapp_business_account") {
//       await handleWhatsAppEvent(body);
//     } else {
//       console.log("Unknown webhook object:", body.object);
//     }

//     console.log("=================================");
//     return new NextResponse("EVENT_RECEIVED", { status: 200 });
//   } catch (error) {
//     console.error("❌ META WEBHOOK ERROR:", error);
//     return new NextResponse("Webhook error", { status: 500 });
//   }
// }

// // ============================================================
// // 3. SIGNATURE VALIDATION
// // ============================================================

// function isValidSignature(rawBody: string, signature: string | null, secret: string): boolean {
//   if (!signature || !secret) return false;

//   const expectedHash = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
//   const expectedSignature = `sha256=${expectedHash}`;

//   return signature === expectedSignature;
// }

// // ============================================================
// // 4. INSTAGRAM
// // ============================================================

// async function handleInstagramEvent(body: any) {
//   const entries = body.entry || [];

//   for (const entry of entries) {
//     const messagingEvents = entry.messaging || [];

//     for (const messaging of messagingEvents) {
//       const senderId = messaging.sender?.id;
//       const recipientId = messaging.recipient?.id;
//       const message = messaging.message;

//       if (!message || !senderId || message.is_echo) continue;

//       const text = message.text;
//       console.log("📩 Instagram message | Sender:", senderId, "| Message:", text);

//       const accessToken = process.env.META_INSTAGRAM_ACCESS_TOKEN;
//       if (!accessToken) {
//         console.error("❌ META_INSTAGRAM_ACCESS_TOKEN is missing");
//         continue;
//       }

//       try {
//         const response = await fetch(
//           `https://graph.instagram.com/v21.0/${recipientId}/messages`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${accessToken}`,
//             },
//             body: JSON.stringify({
//               recipient: { id: senderId },
//               message: { text: "Thanks for your message! We received it and will get back to you shortly" },
//             }),
//           }
//         );

//         const result = await response.json();
//         console.log("📤 Instagram reply status:", response.status, result);
//       } catch (error) {
//         console.error("❌ Instagram reply error:", error);
//       }
//     }
//   }
// }

// // ============================================================
// // 5. MESSENGER
// // ============================================================

// async function handleMessengerEvent(body: any) {
//   const entries = body.entry || [];

//   for (const entry of entries) {
//     const messagingEvents = entry.messaging || [];

//     for (const messaging of messagingEvents) {
//       const senderId = messaging.sender?.id;
//       const message = messaging.message;

//       if (!message || message.is_echo) continue;

//       console.log("📩 Messenger message | Sender:", senderId, "| Message:", message.text);

//       const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN;
//       if (!pageAccessToken) {
//         console.error("❌ META_PAGE_ACCESS_TOKEN is missing");
//         continue;
//       }

//       try {
//         const response = await fetch(
//           `https://graph.facebook.com/v21.0/me/messages?access_token=${pageAccessToken}`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               recipient: { id: senderId },
//               message: { text: "Thanks to you shortly." },
//             }),
//           }
//         );

//         const result = await response.json();
//         console.log("📤 Messenger reply status:", response.status, result);
//       } catch (error) {
//         console.error("❌ Messenger reply error:", error);
//       }
//     }
//   }
// }

// // ============================================================
// // 6. WHATSAPP
// // ============================================================

// // async function handleWhatsAppEvent(body: any) {
// //   const entries = body.entry || [];

// //   for (const entry of entries) {
// //     const changes = entry.changes || [];

// //     for (const change of changes) {
// //       const messages = change.value?.messages || [];

// //       for (const message of messages) {
// //         console.log("📩 WhatsApp message | Sender:", message.from, "| Message:", message.text?.body);
// //       }
// //     }
// //   }
// // }
// async function handleWhatsAppEvent(body: any) {
//   const entries = body.entry || [];

//   for (const entry of entries) {
//     const changes = entry.changes || [];

//     for (const change of changes) {
//       const messages = change.value?.messages || [];

//       for (const message of messages) {
//         const senderId = message.from;
//         const text = message.text?.body;

//         if (!senderId || !text) continue;

//         console.log("📩 WhatsApp message | Sender:", senderId, "| Message:", text);
// console.log("📩 WhatsApp message | Sender:", senderId, "| Message:", text);
// // ye line print hone ke BAAD hi token check hota hai

//         const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
//         const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

//         if (!accessToken || !phoneNumberId) {
//           console.error("❌ WhatsApp env vars missing");
//           continue;
//         }

//         try {
//           const response = await fetch(
//             `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${accessToken}`,
//               },
//               body: JSON.stringify({
//                 messaging_product: "whatsapp",
//                 to: senderId,
//                 text: { body: "Thanks for your message! We'll get back to you shortly." },
//               }),
//             }
//           );

//           const result = await response.json();
//           console.log("📤 WhatsApp reply status:", response.status, result);
//         } catch (error) {
//           console.error("❌ WhatsApp reply error:", error);
//         }
//       }
//     }
//   }
// }

// app/api/webhooks/meta/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { handleTurn } from "@/lib/services/conversationService";
import logger from "@/lib/utils/logger";

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || "";
const APP_SECRET = process.env.META_APP_SECRET || "";
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET || "";

// ---- Verification ----
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("hub.mode") === "subscribe" && searchParams.get("hub.verify_token") === VERIFY_TOKEN) {
    return new NextResponse(searchParams.get("hub.challenge"), { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// ---- Incoming events ----
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hub-signature-256");
    const body = JSON.parse(rawBody);

    const secretToUse = body.object === "instagram" ? INSTAGRAM_APP_SECRET : APP_SECRET;
    if (!isValidSignature(rawBody, signature, secretToUse)) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    if (body.object === "instagram") await handleMetaEvent(body, "instagram");
    else if (body.object === "page") await handleMetaEvent(body, "messenger");
    else if (body.object === "whatsapp_business_account") await handleWhatsApp(body);

    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch (err: any) {
    logger.error("[metaWebhook] failed", err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}

function isValidSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  const expected = `sha256=${crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex")}`;
  return signature === expected;
}

// ---- Instagram + Messenger (same messaging[] shape) ----
async function handleMetaEvent(body: any, channel: "instagram" | "messenger") {
  for (const entry of body.entry || []) {
    for (const messaging of entry.messaging || []) {
      const senderId = messaging.sender?.id;
      const message = messaging.message;
      if (!message || !senderId || message.is_echo) continue;

      const result = await handleTurn({
        channel,
        externalUserId: senderId,
        text: message.text,
        name: null,
      });

      if (!result.skipped && result.reply) {
        await sendReply(channel, senderId, result.reply);
      }
    }
  }
}

// ---- WhatsApp ----
async function handleWhatsApp(body: any) {
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      for (const message of change.value?.messages || []) {
        const senderId = message.from;
        const text = message.text?.body;
        if (!senderId || !text) continue;

        const result = await handleTurn({
          channel: "whatsapp",
          externalUserId: senderId,
          text,
          name: null,
        });

        if (!result.skipped && result.reply) {
          await sendReply("whatsapp", senderId, result.reply);
        }
      }
    }
  }
}

// ---- Send reply back on the right platform ----
async function sendReply(channel: "instagram" | "messenger" | "whatsapp", to: string, text: string) {
  try {
    if (channel === "instagram") {
      const token = process.env.META_INSTAGRAM_ACCESS_TOKEN;
      const res = await fetch(`https://graph.instagram.com/v21.0/me/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipient: { id: to }, message: { text } }),
      });
      logger.info("[metaWebhook] IG reply status", res.status);
    } else if (channel === "messenger") {
      const token = process.env.META_PAGE_ACCESS_TOKEN;
      const res = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient: { id: to }, message: { text } }),
      });
      logger.info("[metaWebhook] Messenger reply status", res.status);
    } else if (channel === "whatsapp") {
      const token = process.env.WHATSAPP_ACCESS_TOKEN;
      const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messaging_product: "whatsapp", to, text: { body: text } }),
      });
      logger.info("[metaWebhook] WhatsApp reply status", res.status);
    }
  } catch (err) {
    logger.error(`[metaWebhook] sendReply(${channel}) failed`, err);
  }
}