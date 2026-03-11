/**
 * WEBHOOK NORMALIZER - Telegram & WhatsApp Standardization
 * 
 * Converts both Telegram and WhatsApp webhooks to unified structure
 * Used in: agente-de-atendimento, agente-de-agendamento workflows
 */

function normalizeWebhook(webhookData) {
  try {
    let normalized;

    // 1️⃣ DETECT SOURCE
    if (webhookData.message && webhookData.update_id !== undefined) {
      // ✅ TELEGRAM
      normalized = normalizeTelegram(webhookData);
    } else if (webhookData.object === "whatsapp_business_account" || webhookData.entry) {
      // ✅ WHATSAPP
      normalized = normalizeWhatsApp(webhookData);
    } else {
      throw new Error(`WEBHOOK_SOURCE_UNKNOWN: Cannot identify webhook source`);
    }

    // 2️⃣ VALIDATE REQUIRED FIELDS
    validateNormalizedData(normalized);

    // 3️⃣ LOG SUCCESS
    console.log(`✅ [${new Date().toISOString()}] Webhook normalized [${normalized.source}]: ${normalized.user_id}`);

    return normalized;

  } catch (error) {
    console.error(`❌ [${new Date().toISOString()}] Webhook normalization failed:`, error.message);
    throw {
      error: error.message,
      type: "WEBHOOK_NORMALIZATION_ERROR",
      timestamp: new Date().toISOString(),
      rawData: webhookData
    };
  }
}

// ───────────────────────────────────────────────────────────────
// TELEGRAM NORMALIZER
// ───────────────────────────────────────────────────────────────
function normalizeTelegram(data) {
  const message = data.message;
  
  // Validate required fields
  if (!message) {
    throw new Error("TELEGRAM_MISSING_MESSAGE: No message field");
  }
  if (!message.chat || !message.chat.id) {
    throw new Error("TELEGRAM_MISSING_CHAT: No chat ID");
  }
  if (!message.text) {
    throw new Error("TELEGRAM_MISSING_TEXT: No text content");
  }

  return {
    source: "telegram",
    user_id: String(message.from?.id || message.chat.id),
    user_name: message.from?.first_name || message.chat.first_name || "Unknown",
    message_text: message.text.trim(),
    timestamp: message.date || Math.floor(Date.now() / 1000),
    channel_id: String(message.chat.id),
    message_id: String(message.message_id || ""),
    raw_data: data,
    validated: true
  };
}

// ───────────────────────────────────────────────────────────────
// WHATSAPP NORMALIZER
// ───────────────────────────────────────────────────────────────
function normalizeWhatsApp(data) {
  // Navigate nested structure
  const entry = data.entry?.[0];
  const change = entry?.changes?.[0];
  const value = change?.value;
  const message = value?.messages?.[0];
  const contact = value?.contacts?.[0];

  // Validate required fields
  if (!message) {
    throw new Error("WHATSAPP_MISSING_MESSAGE: No message");
  }
  if (!message.from) {
    throw new Error("WHATSAPP_MISSING_FROM: No from field");
  }
  if (!message.text?.body) {
    throw new Error("WHATSAPP_MISSING_TEXT: No text content");
  }

  return {
    source: "whatsapp",
    user_id: message.from,
    user_name: contact?.profile?.name || message.from,
    message_text: message.text.body.trim(),
    timestamp: parseInt(message.timestamp) || Math.floor(Date.now() / 1000),
    channel_id: value?.metadata?.phone_number_id || value?.metadata?.display_phone_number,
    message_id: message.id || "",
    raw_data: data,
    validated: true
  };
}

// ───────────────────────────────────────────────────────────────
// VALIDATION
// ───────────────────────────────────────────────────────────────
function validateNormalizedData(data) {
  const required = ["source", "user_id", "user_name", "message_text", "timestamp"];
  const errors = [];

  // Check required fields
  for (const field of required) {
    if (data[field] === null || data[field] === undefined || data[field] === "") {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate source
  if (!["telegram", "whatsapp"].includes(data.source)) {
    errors.push(`Invalid source: ${data.source}`);
  }

  // Validate timestamp
  if (typeof data.timestamp !== "number") {
    errors.push(`Invalid timestamp type: ${typeof data.timestamp}`);
  }

  // Validate message
  if (typeof data.message_text !== "string" || data.message_text.length === 0) {
    errors.push("Message text must be non-empty string");
  }

  if (errors.length > 0) {
    throw new Error(`VALIDATION_ERROR: ${errors.join(" | ")}`);
  }

  return true;
}

// ───────────────────────────────────────────────────────────────
// EXPORT FOR N8N
// ───────────────────────────────────────────────────────────────
return normalizeWebhook($input.all().json);
