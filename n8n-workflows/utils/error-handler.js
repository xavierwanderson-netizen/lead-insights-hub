/**
 * GLOBAL ERROR HANDLER - Fallback & Recovery System
 * 
 * Handles errors in:
 * - AI Agent responses
 * - HTTP requests (Telegram, WhatsApp, Evolution API)
 * - Database operations
 * - External API calls
 */

function handleError(error, context = {}) {
  const timestamp = new Date().toISOString();
  const errorLog = {
    timestamp,
    type: error.type || "UNKNOWN_ERROR",
    message: error.message || String(error),
    context,
    retry_count: context.retry_count || 0
  };

  // 1️⃣ LOG ERROR
  console.error(`❌ [${timestamp}] ERROR:`, JSON.stringify(errorLog, null, 2));

  // 2️⃣ DETERMINE FALLBACK RESPONSE
  let fallbackMessage = getFallbackMessage(error.type, context.source);

  // 3️⃣ SHOULD RETRY?
  if (shouldRetry(error.type) && context.retry_count < 3) {
    errorLog.action = "RETRY";
    errorLog.next_retry = `${context.retry_count + 1}/3`;
    console.log(`🔄 Retrying... (${errorLog.next_retry})`);
    return {
      retry: true,
      retry_count: context.retry_count + 1,
      error: errorLog
    };
  }

  // 4️⃣ SEND FALLBACK
  errorLog.action = "FALLBACK";
  errorLog.fallback_message = fallbackMessage;

  return {
    error: errorLog,
    fallback: {
      text: fallbackMessage,
      source: context.source || "unknown",
      timestamp: timestamp,
      should_notify_support: shouldNotifySupport(error.type)
    }
  };
}

// ───────────────────────────────────────────────────────────────
// FALLBACK MESSAGES
// ───────────────────────────────────────────────────────────────
function getFallbackMessage(errorType, source = "unknown") {
  const messages = {
    AI_RESPONSE_TIMEOUT: "Desculpe, estou processando sua mensagem. Tente novamente em alguns segundos.",
    AI_API_ERROR: "Tenho uma pequena dificuldade no momento. Um agente entrará em contato em breve.",
    DATABASE_ERROR: "Não consegui salvar seus dados. Tente novamente ou entre em contato com o suporte.",
    WEBHOOK_NORMALIZATION_ERROR: "Formato de mensagem não reconhecido. Tente enviar novamente.",
    CHANNEL_VALIDATION_ERROR: "Canal não suportado. Use Telegram ou WhatsApp.",
    HTTP_REQUEST_ERROR: "Não consegui enviar sua mensagem. Tente novamente.",
    RATE_LIMIT_ERROR: "Muitas requisições. Aguarde 1 minuto e tente novamente.",
    AUTHENTICATION_ERROR: "Erro de autenticação. Entre em contato com o suporte.",
    UNKNOWN_ERROR: "Algo deu errado. Nossa equipe foi notificada. Tente novamente mais tarde."
  };

  return messages[errorType] || messages.UNKNOWN_ERROR;
}

// ───────────────────────────────────────────────────────────────
// RETRY LOGIC
// ───────────────────────────────────────────────────────────────
function shouldRetry(errorType) {
  const retryableErrors = [
    "AI_RESPONSE_TIMEOUT",
    "HTTP_REQUEST_ERROR",
    "DATABASE_ERROR",
    "RATE_LIMIT_ERROR"
  ];
  return retryableErrors.includes(errorType);
}

function shouldNotifySupport(errorType) {
  const criticalErrors = [
    "DATABASE_ERROR",
    "AUTHENTICATION_ERROR",
    "AI_API_ERROR"
  ];
  return criticalErrors.includes(errorType);
}

// ───────────────────────────────────────────────────────────────
// EXPORT FOR N8N
// ───────────────────────────────────────────────────────────────
return handleError($input.all().json.error, $input.all().json.context);
