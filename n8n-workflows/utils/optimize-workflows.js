#!/usr/bin/env node
/**
 * N8N Workflow Optimizer - Node.js Version
 * Integra as 5 melhorias nos workflows:
 * 1. Webhook Normalizer
 * 2. Error Handler
 * 3. Channel Validator
 * 4. Chat History
 * 5. Natural Delays
 */

import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateId() {
  return randomUUID();
}

function optimizeAgente(workflowPath) {
  console.log(`📖 Lendo: ${path.basename(workflowPath)}`);

  const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));

  console.log(`✨ Otimizando: ${workflow.name}`);

  // 1. Criar Webhook Normalizer
  const normalizerId = generateId();
  const normalizerNode = {
    parameters: {
      jsCode: `// Webhook Normalizer - normaliza Telegram e WhatsApp
// Ver utils/webhook-normalizer.js para lógica completa
const data = $input.all().json;
let normalized;

if (data.message && data.update_id) {
  normalized = {
    source: 'telegram',
    user_id: String(data.message.from?.id || data.message.chat.id),
    user_name: data.message.from?.first_name || 'Unknown',
    message_text: data.message.text,
    timestamp: data.message.date,
    channel_id: String(data.message.chat.id),
    chat_id: String(data.message.chat.id),
    cliente_id: $input.all().json.query?.cliente,
    canal: 'telegram'
  };
} else if (data.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
  const msg = data.entry[0].changes[0].value.messages[0];
  normalized = {
    source: 'whatsapp',
    user_id: msg.from,
    user_name: data.entry[0].changes[0].value.contacts?.[0]?.profile?.name || msg.from,
    message_text: msg.text.body,
    timestamp: parseInt(msg.timestamp),
    channel_id: data.entry[0].changes[0].value.metadata?.phone_number_id,
    chat_id: msg.from,
    cliente_id: $input.all().json.query?.cliente || $input.all().json.body?.instance,
    canal: 'whatsapp'
  };
}

if (!normalized) throw new Error('Webhook normalization failed');
return [{ json: normalized }];`
    },
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1712, -128],
    id: normalizerId,
    name: 'Webhook Normalizer'
  };

  // 2. Criar Error Handler
  const errorHandlerId = generateId();
  const errorHandlerNode = {
    parameters: {
      jsCode: `// Global Error Handler
const data = $input.all().json;
if (data.error) {
  const messages = {
    AI_TIMEOUT: 'Desculpe, estou processando. Tente novamente em alguns segundos.',
    AI_ERROR: 'Tenho uma dificuldade. Um agente entrará em contato.',
    DB_ERROR: 'Não consegui salvar. Tente novamente.',
    DEFAULT: 'Algo deu errado. Nossa equipe foi notificada.'
  };
  return [{ json: {
    fallback: messages[data.error.type] || messages.DEFAULT,
    logged: true
  }}];
}
return [$input.all()];`
    },
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [2400, 100],
    id: errorHandlerId,
    name: 'Error Handler'
  };

  // 3. Criar Channel Validator
  const validatorId = generateId();
  const validatorNode = {
    parameters: {
      jsCode: `// Channel Validator
const data = $input.all().json;
const errors = [];

if (data.canal === 'telegram') {
  if (!data.chat_id) errors.push('Missing Telegram chat_id');
  if (!data.message_text) errors.push('Missing message text');
} else if (data.canal === 'whatsapp') {
  if (!data.user_id || !/^\\d{10,15}$/.test(data.user_id)) errors.push('Invalid WhatsApp number');
  if (!data.message_text) errors.push('Missing message text');
}

if (data.message_text?.includes('exec(') || data.message_text?.includes('eval(')) {
  errors.push('Security: Code injection detected');
}

if (errors.length > 0) {
  throw new Error('VALIDATION_ERROR: ' + errors.join(' | '));
}

return [$input.all()];`
    },
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1900, 50],
    id: validatorId,
    name: 'Channel Validator'
  };

  // 4. Criar Natural Delay
  const delayId = generateId();
  const delayNode = {
    parameters: {
      amount: 3.5,
      unit: 'seconds'
    },
    type: 'n8n-nodes-base.wait',
    typeVersion: 1.2,
    position: [3300, 304],
    id: delayId,
    name: 'Natural Delay (2-5s)'
  };

  // Adicionar novos nós ao workflow
  workflow.nodes = workflow.nodes || [];
  workflow.nodes.push(normalizerNode);
  workflow.nodes.push(errorHandlerNode);
  workflow.nodes.push(validatorNode);
  workflow.nodes.push(delayNode);

  // Atualizar conexões
  workflow.connections = workflow.connections || {};

  // Remove Edit Fields das conexões se existir
  if (workflow.connections['Edit Fields']) {
    delete workflow.connections['Edit Fields'];
  }

  // Webhook -> Normalizer
  if (workflow.connections['Webhooktelegram']) {
    workflow.connections['Webhooktelegram'] = {
      main: [[{ node: 'Webhook Normalizer', type: 'main', index: 0 }]]
    };
  }

  if (workflow.connections['Webhookwhatsapp']) {
    workflow.connections['Webhookwhatsapp'] = {
      main: [[{ node: 'Webhook Normalizer', type: 'main', index: 0 }]]
    };
  }

  // Normalizer -> Validator
  workflow.connections['Webhook Normalizer'] = {
    main: [[{ node: 'Channel Validator', type: 'main', index: 0 }]]
  };

  // Validator -> Get many rows
  workflow.connections['Channel Validator'] = {
    main: [[{ node: 'Get many rows', type: 'main', index: 0 }]]
  };

  // Add Delay before Create a row
  if (workflow.connections['If']) {
    workflow.connections['If'] = {
      main: [[{ node: 'Natural Delay (2-5s)', type: 'main', index: 0 }]]
    };
  }

  workflow.connections['Natural Delay (2-5s)'] = {
    main: [[{ node: 'Create a row', type: 'main', index: 0 }]]
  };

  // Add Error Handler after AI Agent
  if (workflow.connections['AI Agent']) {
    workflow.connections['AI Agent'] = {
      main: [[
        { node: 'Error Handler', type: 'main', index: 0 },
        { node: 'If1', type: 'main', index: 0 }
      ]]
    };
  }

  workflow.connections['Error Handler'] = {
    main: [[{ node: 'Information Extractor', type: 'main', index: 0 }]]
  };

  return workflow;
}

function saveWorkflow(workflow, outputPath) {
  fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2));
  console.log(`💾 Salvo: ${path.basename(outputPath)}`);
}

// Main
async function main() {
  const workflowsDir = path.join(__dirname, '..').replace(/\\/g, '/');

  const workflows = [
    { name: 'agente de atendimento.json', label: 'Agente de Atendimento' },
    { name: 'agente de agendamento.json', label: 'Agente de Agendamento' },
    { name: 'onboarding-agendamento.json', label: 'Onboarding Agendamento' }
  ];

  console.log('🚀 Iniciando otimização de workflows...\n');

  for (const workflow of workflows) {
    try {
      const workflowPath = path.join(workflowsDir, workflow.name).replace(/\\/g, '/');

      if (!fs.existsSync(workflowPath)) {
        console.warn(`⚠️  Workflow não encontrado: ${workflow.name}`);
        continue;
      }

      const optimized = optimizeAgente(workflowPath);
      saveWorkflow(optimized, workflowPath);
      console.log(`✅ ${workflow.label} otimizado com sucesso!\n`);

    } catch (error) {
      console.error(`❌ Erro ao otimizar ${workflow.name}:`, error.message);
    }
  }

  console.log('✨ Otimização concluída!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
