# N8N Workflows - Lead Insights Hub

Workflows de automação N8N otimizados para atendimento e agendamento com IA.

## 📁 Estrutura

```
n8n-workflows/
├── agente de atendimento.json        # Agente de atendimento ao cliente
├── agente de agendamento.json        # Agente de agendamento de reuniões
├── onboarding-agendamento.json       # Onboarding para novos clientes
└── utils/
    ├── webhook-normalizer.js         # Normaliza webhooks Telegram/WhatsApp
    ├── error-handler.js              # Tratamento global de erros
    ├── channel-validator.js          # Validação de segurança
    ├── optimize-workflows.js          # Script Node.js para otimização
    └── optimize-workflows.py          # Script Python para otimização
```

## 🚀 Workflows Principais

### 1. Agente de Atendimento
**Arquivo:** `agente de atendimento.json`

Workflow de atendimento ao cliente via Telegram e WhatsApp com IA.

**Integrações:**
- 🤖 Google Gemini AI
- 📌 Pinecone Vector Store
- 📊 Supabase PostgreSQL
- 📱 Telegram & WhatsApp

### 2. Agente de Agendamento
**Arquivo:** `agente de agendamento.json`

Workflow para agendamento automático de reuniões.

**Integrações:**
- 📅 Google Calendar
- 🤖 Google Gemini AI
- 💾 Supabase PostgreSQL

### 3. Onboarding Agendamento
**Arquivo:** `onboarding-agendamento.json`

Workflow de onboarding para novos clientes.

## 🔧 5 Melhorias Integradas

✅ **Webhook Normalizer** - Unifica Telegram/WhatsApp
✅ **Error Handler** - Tratamento global de erros
✅ **Channel Validator** - Validação de segurança
✅ **Natural Delay** - Simula resposta humana (2-5s)
✅ **Postgres Chat Memory** - Histórico de conversas

## 📊 Estatísticas

| Workflow | Status | Tamanho |
|----------|--------|---------|
| Agente de Atendimento | ✅ | 21KB |
| Agente de Agendamento | ✅ | 19KB |
| Onboarding Agendamento | ✅ | 11KB |

## 🚀 Como Usar

1. **Importar para N8N**
   - Clique em "Import Workflow"
   - Copie o conteúdo do JSON
   - Configure credenciais

2. **Configurar Webhooks**
   ```
   https://seu-dominio.com/webhook/telegram?cliente=001
   https://seu-dominio.com/webhook/whatsapp?cliente=001
   ```

3. **Testes**
   - Use os scripts em `utils/`
   - Teste com dados reais

## 🔐 Variáveis Obrigatórias

```bash
GOOGLE_API_KEY=xxx
OPENAI_API_KEY=xxx
PINECONE_API_KEY=xxx
SUPABASE_URL=xxx
SUPABASE_KEY=xxx
TELEGRAM_BOT_TOKEN=xxx
EVOLUTION_API_URL=xxx
```

## 📝 Documentação Completa

Veja `OTIMIZACAO_COMPLETADA.md` para:
- Detalhes técnicos completos
- Fluxogramas visuais
- Troubleshooting
- Próximos passos

**Status:** ✅ Production-ready
**Versão:** 1.0.0
**Data:** 11 de março de 2026
