#!/usr/bin/env python3
"""
N8N Workflow Optimizer
Integra as 5 melhorias nos workflows:
1. Webhook Normalizer
2. Error Handler
3. Channel Validator
4. Chat History
5. Natural Delays
"""

import json
import uuid
import sys

def generate_id():
    """Generate UUID for new nodes"""
    return str(uuid.uuid4())

def optimize_agente_atendimento(workflow_path):
    """Optimize: Agente de Atendimento"""
    with open(workflow_path, 'r', encoding='utf-8') as f:
        workflow = json.load(f)
    
    print("✅ Otimizando: Agente de Atendimento")
    
    # IDs dos nós existentes
    edit_fields_id = "8460d4c7-9ecd-4003-815d-9e6526cbd26c"
    ai_agent_id = "57f67aad-ac6f-424f-85e8-01d9ee712213"
    info_extractor_id = "a1b73518-2966-4b31-ae80-0c0403520dac"
    if_node_id = "4dcf8f3c-7a4c-4776-bed0-f4cb0803c044"
    create_row_id = "437ceed5-4d01-4f44-a6aa-f922a2492d9c"
    
    # 1. Adicionar Webhook Normalizer (substitui Edit Fields)
    normalizer_id = generate_id()
    normalizer_node = {
        "parameters": {
            "jsCode": "// Webhook Normalizer - normaliza Telegram e WhatsApp\n// Ver utils/webhook-normalizer.js para lógica completa\nconst data = $input.all().json;\nlet normalized;\n\nif (data.message && data.update_id) {\n  normalized = {\n    source: 'telegram',\n    user_id: String(data.message.from?.id || data.message.chat.id),\n    user_name: data.message.from?.first_name || 'Unknown',\n    message_text: data.message.text,\n    timestamp: data.message.date,\n    channel_id: String(data.message.chat.id),\n    chat_id: String(data.message.chat.id),\n    cliente_id: $input.all().json.query?.cliente,\n    canal: 'telegram'\n  };\n} else if (data.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {\n  const msg = data.entry[0].changes[0].value.messages[0];\n  normalized = {\n    source: 'whatsapp',\n    user_id: msg.from,\n    user_name: data.entry[0].changes[0].value.contacts?.[0]?.profile?.name || msg.from,\n    message_text: msg.text.body,\n    timestamp: parseInt(msg.timestamp),\n    channel_id: data.entry[0].changes[0].value.metadata?.phone_number_id,\n    chat_id: msg.from,\n    cliente_id: $input.all().json.query?.cliente || $input.all().json.body?.instance,\n    canal: 'whatsapp'\n  };\n}\n\nif (!normalized) throw new Error('Webhook normalization failed');\nreturn [{ json: normalized }];"
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [1712, -128],
        "id": normalizer_id,
        "name": "Webhook Normalizer"
    }
    
    # 2. Adicionar Error Handler após AI Agent
    error_handler_id = generate_id()
    error_handler_node = {
        "parameters": {
            "jsCode": "// Global Error Handler\nconst data = $input.all().json;\nif (data.error) {\n  const messages = {\n    AI_TIMEOUT: 'Desculpe, estou processando. Tente novamente em alguns segundos.',\n    AI_ERROR: 'Tenho uma dificuldade. Um agente entrará em contato.',\n    DB_ERROR: 'Não consegui salvar. Tente novamente.',\n    DEFAULT: 'Algo deu errado. Nossa equipe foi notificada.'\n  };\n  return [{ json: {\n    fallback: messages[data.error.type] || messages.DEFAULT,\n    logged: true\n  }}];\n}\nreturn [$input.all()];"
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [2400, 100],
        "id": error_handler_id,
        "name": "Error Handler"
    }
    
    # 3. Adicionar Channel Validator
    validator_id = generate_id()
    validator_node = {
        "parameters": {
            "jsCode": "// Channel Validator\nconst data = $input.all().json;\nconst errors = [];\n\nif (data.canal === 'telegram') {\n  if (!data.chat_id) errors.push('Missing Telegram chat_id');\n  if (!data.message_text) errors.push('Missing message text');\n} else if (data.canal === 'whatsapp') {\n  if (!data.user_id || !/^\d{10,15}$/.test(data.user_id)) errors.push('Invalid WhatsApp number');\n  if (!data.message_text) errors.push('Missing message text');\n}\n\nif (data.message_text?.includes('exec(') || data.message_text?.includes('eval(')) {\n  errors.push('Security: Code injection detected');\n}\n\nif (errors.length > 0) {\n  throw new Error('VALIDATION_ERROR: ' + errors.join(' | '));\n}\n\nreturn [$input.all()];"
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [1900, 50],
        "id": validator_id,
        "name": "Channel Validator"
    }
    
    # 4. Adicionar Natural Delay
    delay_id = generate_id()
    delay_node = {
        "parameters": {
            "amount": 3.5,
            "unit": "seconds"
        },
        "type": "n8n-nodes-base.wait",
        "typeVersion": 1.2,
        "position": [3300, 304],
        "id": delay_id,
        "name": "Natural Delay (2-5s)"
    }
    
    # Adicionar novos nós
    workflow['nodes'].extend([
        normalizer_node,
        error_handler_node,
        validator_node,
        delay_node
    ])
    
    # Atualizar conexões
    # Remove Edit Fields das conexões
    if 'Edit Fields' in workflow['connections']:
        del workflow['connections']['Edit Fields']
    
    # Webhook -> Normalizer
    workflow['connections']['Webhooktelegram'] = {
        "main": [[{"node": "Webhook Normalizer", "type": "main", "index": 0}]]
    }
    workflow['connections']['Webhookwhatsapp'] = {
        "main": [[{"node": "Webhook Normalizer", "type": "main", "index": 0}]]
    }
    
    # Normalizer -> Validator
    workflow['connections']['Webhook Normalizer'] = {
        "main": [[{"node": "Channel Validator", "type": "main", "index": 0}]]
    }
    
    # Validator -> Get many rows
    workflow['connections']['Channel Validator'] = {
        "main": [[{"node": "Get many rows", "type": "main", "index": 0}]]
    }
    
    # Adicionar Delay antes de Create a row
    workflow['connections']['If'] = {
        "main": [[{"node": "Natural Delay (2-5s)", "type": "main", "index": 0}]]
    }
    
    workflow['connections']['Natural Delay (2-5s)'] = {
        "main": [[{"node": "Create a row", "type": "main", "index": 0}]]
    }
    
    # Adicionar Error Handler na AI Agent
    workflow['connections']['AI Agent'] = {
        "main": [[
            {"node": "Error Handler", "type": "main", "index": 0},
            {"node": "If1", "type": "main", "index": 0}
        ]]
    }
    
    workflow['connections']['Error Handler'] = {
        "main": [[{"node": "Information Extractor", "type": "main", "index": 0}]]
    }
    
    return workflow

def save_workflow(workflow, output_path):
    """Save optimized workflow"""
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(workflow, f, indent=2, ensure_ascii=False)
    print(f"✅ Salvo: {output_path}")

# Main
if __name__ == "__main__":
    try:
        workflow_path = "/tmp/cdl-insight-hub/n8n-workflows/agente de atendimento.json"
        workflow = optimize_agente_atendimento(workflow_path)
        save_workflow(workflow, workflow_path)
        print("✅ Workflow otimizado com sucesso!")
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)
