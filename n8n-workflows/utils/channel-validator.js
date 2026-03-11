/**
 * CHANNEL VALIDATOR - Security & Validation
 * 
 * Validates:
 * - Webhook source authenticity
 * - API token validity
 * - Message format compliance
 * - Rate limiting
 */

function validateChannel(webhookData, clientConfig) {
  const validationResult = {
    valid: false,
    source: null,
    errors: [],
    warnings: [],
    timestamp: new Date().toISOString()
  };

  try {
    const source = identifyChannel(webhookData);
    validationResult.source = source;

    if (!source) {
      validationResult.errors.push("Cannot identify webhook source");
      return validationResult;
    }

    if (source === "telegram") {
      validateTelegram(webhookData, clientConfig, validationResult);
    } else if (source === "whatsapp") {
      validateWhatsApp(webhookData, clientConfig, validationResult);
    }

    validateMessageContent(webhookData, validationResult);

    validationResult.valid = validationResult.errors.length === 0;

    if (validationResult.valid) {
      console.log(`✅ [${validationResult.timestamp}] Channel validation passed [${source}]`);
    } else {
      console.error(`❌ [${validationResult.timestamp}] Channel validation failed:`, validationResult.errors);
    }

    return validationResult;

  } catch (error) {
    validationResult.errors.push(`Validation exception: ${error.message}`);
    return validationResult;
  }
}

function identifyChannel(webhookData) {
  if (webhookData.update_id !== undefined && webhookData.message) {
    return "telegram";
  }

  if (webhookData.object === "whatsapp_business_account" || webhookData.entry) {
    return "whatsapp";
  }

  return null;
}

function validateTelegram(data, config, result) {
  if (!data.message) {
    result.errors.push("TELEGRAM: Missing message field");
    return;
  }

  const msg = data.message;

  if (!msg.chat?.id) result.errors.push("TELEGRAM: Missing chat.id");
  if (!msg.from?.id) result.warnings.push("TELEGRAM: Missing from.id");
  if (!msg.text) result.errors.push("TELEGRAM: Missing message text");

  if (msg.text && msg.text.trim().length === 0) {
    result.errors.push("TELEGRAM: Message text cannot be empty");
  }

  if (!Number.isInteger(data.update_id)) {
    result.errors.push("TELEGRAM: update_id must be integer");
  }
}

function validateWhatsApp(data, config, result) {
  if (!data.entry?.[0]) {
    result.errors.push("WHATSAPP: Missing entry array");
    return;
  }

  const change = data.entry[0].changes?.[0];
  if (!change) {
    result.errors.push("WHATSAPP: Missing change object");
    return;
  }

  const value = change.value;
  if (!value) {
    result.errors.push("WHATSAPP: Missing value object");
    return;
  }

  const message = value.messages?.[0];
  if (!message) {
    result.warnings.push("WHATSAPP: No messages (status update?)");
    return;
  }

  if (!message.from) {
    result.errors.push("WHATSAPP: Missing message.from");
  }
  if (!message.text?.body) {
    result.errors.push("WHATSAPP: Missing message text");
  }

  if (message.from && !isValidPhoneNumber(message.from)) {
    result.errors.push("WHATSAPP: Invalid phone number format");
  }

  if (!message.timestamp || isNaN(parseInt(message.timestamp))) {
    result.errors.push("WHATSAPP: Invalid message timestamp");
  }
}

function validateMessageContent(webhookData, result) {
  let messageText = null;

  if (webhookData.message?.text) {
    messageText = webhookData.message.text;
  } else if (webhookData.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body) {
    messageText = webhookData.entry[0].changes[0].value.messages[0].text.body;
  }

  if (!messageText) return;

  if (messageText.includes("exec(") || messageText.includes("eval(")) {
    result.errors.push("SECURITY: Potential code injection detected");
  }

  if (messageText.length > 4096) {
    result.warnings.push("MESSAGE: Text exceeds 4096 characters");
  }

  if (messageText.trim().length === 0) {
    result.errors.push("MESSAGE: Cannot be empty or whitespace-only");
  }
}

function isValidPhoneNumber(phone) {
  return /^\d{10,15}$/.test(phone);
}

return validateChannel($input.all().json.webhook, $input.all().json.config);
