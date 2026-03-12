# 🚀 Instruções de Deploy no N8N

## Opção 1: Via Script (Automático)

```bash
# 1. Defina as variáveis de ambiente
export N8N_BASE_URL="https://n8n-production-841d.up.railway.app"
export N8N_API_KEY="seu_token_aqui"

# 2. Execute o script de deploy
cd n8n-workflows/utils
node deploy-workflows.js
```

## Opção 2: Manual (N8N Dashboard)

```bash
# Para cada workflow:
1. Abra N8N Dashboard
2. Clique em "Import"
3. Cole o JSON do workflow
4. Clique "Import"
5. Ative o workflow
```

## Como Obter o API Key:

1. Abra N8N: https://synpase.app.n8n.cloud
2. Vá para: Settings → API Keys
3. Clique: "Generate API Key"
4. Copie e use no script

## Testes Após Deploy:

### Teste 1: Agente de Atendimento
```bash
curl -X POST https://n8n-production-841d.up.railway.app/webhook/telegram \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "text": "Olá, como você está?",
      "from": {"id": 123, "first_name": "João"},
      "chat": {"id": 456}
    },
    "update_id": 789
  }'
```

### Teste 2: Onboarding SDR
```bash
curl -X POST https://n8n-production-841d.up.railway.app/webhook/onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": "test_001",
    "nome_empresa": "Empresa Teste",
    "telegram_bot_token": "xxx",
    "namespace": "teste",
    "prompt": "Você é um assistente...",
    "plano": "premium",
    "drive_folder_id": "folder_xxx"
  }'
```

## Status:

✅ Workflows prontos para deploy
✅ Credenciais salvas em N8N
✅ Scripts de automação inclusos
