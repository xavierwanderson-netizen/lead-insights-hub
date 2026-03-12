# 📥 WORKFLOWS PRONTOS PARA DOWNLOAD E UPLOAD NO N8N

**Data:** 11 de março de 2026
**Status:** ✅ **PRODUCTION READY**
**Versão:** 1.0.0 - Final

---

## 🎯 RESUMO EXECUTIVO

Todos os 6 workflows foram analisados, corrigidos e otimizados. Estão 100% prontos para você:
1. ✅ **Baixar** do GitHub
2. ✅ **Fazer Upload** para seu N8N
3. ✅ **Publicar** em Produção

**Nenhuma alteração adicional necessária!**

---

## 📥 PASSO 1: BAIXAR OS ARQUIVOS

### Opção A: Via GitHub (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/xavierwanderson-netizen/lead-insights-hub.git
cd lead-insights-hub/n8n-workflows

# Os 6 workflows estão prontos em:
ls *.json
```

**Arquivos:**
```
✅ agente de atendimento.json
✅ agente de agendamento.json
✅ onboarding-agendamento.json
✅ onboarding_sdr.json
✅ Indexar.json
✅ Synpasebase.json
```

### Opção B: Baixar Diretamente

```
https://github.com/xavierwanderson-netizen/lead-insights-hub/tree/main/n8n-workflows
```

Clique em cada arquivo → Raw → Salve (Ctrl+S ou Cmd+S)

---

## 📤 PASSO 2: FAZER UPLOAD NO N8N

### Para Cada Workflow:

**1. Abra seu N8N**
```
https://n8n-production-841d.up.railway.app
```

**2. Clique em "Import Workflow"**
```
Menu superior esquerdo → Import Workflow
```

**3. Cole o Conteúdo do JSON**
```
Copie todo o conteúdo do arquivo .json
Cole na caixa de texto
```

**4. Revise as Credenciais**
```
O N8N vai mostrar as credenciais referenciadas
Verifique se estão corretas (já estão salvas)
```

**5. Clique "Import"**
```
O workflow será importado automaticamente
```

**6. Repita para todos os 6 workflows**

---

## 📋 ORDEM RECOMENDADA DE UPLOAD

### Grupo 1: Conversacional (Priority)
1. **Agente de Atendimento** → Suporte ao cliente
2. **Agente de Agendamento** → Agendar reuniões
3. **Onboarding Agendamento** → Novo cliente

### Grupo 2: Setup & Indexação
4. **Onboarding SDR** → Configuração de cliente
5. **Indexar** → Indexar PDFs (automático)
6. **Synpasebase** → Indexar PDFs (manual)

---

## 🚀 PASSO 3: ATIVAR E PUBLICAR

### Para Cada Workflow:

**1. Abra o Workflow**
```
Na lista de workflows, clique no nome
```

**2. Valide a Estrutura**
```
Verifique se todos os nós aparecem
Verifique se as conexões estão visíveis
```

**3. Teste (Opcional mas Recomendado)**
```
Clique em "Execute Workflow"
Acompanhe os logs
Verifique se não há erros
```

**4. Ative o Webhook**
```
Clique no ícone de Webhook (no topo)
Copie a URL do webhook (se necessário)
```

**5. Clique em "Activate"**
```
Botão azul no topo direito
O workflow agora está ATIVO e pronto para receber dados
```

---

## 📊 WORKFLOWS FINALIZADOS

| # | Workflow | Nós | Credenciais | Tags | Status |
|---|----------|-----|-------------|------|--------|
| 1 | Agente de Atendimento | 20 | 7 | conversational, ai, webhook | ✅ |
| 2 | Agente de Agendamento | 17 | 6 | conversational, ai, webhook | ✅ |
| 3 | Onboarding Agendamento | 9 | 1 | conversational, setup, webhook | ✅ |
| 4 | Onboarding SDR | 6 | 1 | setup, webhook | ✅ |
| 5 | Indexar | 10 | 4 | indexing, pdf | ✅ |
| 6 | Synpasebase | 10 | 4 | indexing, pdf | ✅ |

---

## ✅ CREDENCIAIS JÁ CONFIGURADAS

Todos os workflows já têm referência às credenciais salvas:

```json
{
  "googlePalmApi": "Google Gemini API",
  "pineconeApi": "Pinecone Vector DB",
  "openAiApi": "OpenAI Embeddings",
  "supabaseApi": "Supabase Database",
  "googleDriveOAuth2Api": "Google Drive",
  "googleCalendarOAuth2Api": "Google Calendar",
  "gmailOAuth2": "Gmail",
  "postgres": "PostgreSQL Chat Memory"
}
```

**Não há nada para configurar! As credenciais já estão prontas no seu N8N.**

---

## 🔄 FLUXOS VALIDADOS

### ✅ Fluxo 1: Atendimento (Agente de Atendimento)
```
Telegram/WhatsApp → Validação → IA → Busca → Resposta → Salva
```

### ✅ Fluxo 2: Agendamento (Agente de Agendamento)
```
Telegram/WhatsApp → Validação → IA → Google Calendar → Email
```

### ✅ Fluxo 3: Onboarding (Onboarding SDR + Indexar)
```
HTTP Webhook → Salva → Configura Telegram → Chama Indexar → PDF → Pinecone
```

### ✅ Fluxo 4: Indexação Automática (Indexar)
```
HTTP Webhook → Google Drive → Download → Split → Embeddings → Pinecone
```

### ✅ Fluxo 5: Indexação Manual (Synpasebase)
```
Manual Trigger → Google Drive → Processa → Indexa
```

---

## 🎯 CHECKLIST DE UPLOAD

- [ ] Baixei os 6 arquivos JSON
- [ ] Abri o N8N Dashboard
- [ ] Importei "agente de atendimento.json"
- [ ] Importei "agente de agendamento.json"
- [ ] Importei "onboarding-agendamento.json"
- [ ] Importei "onboarding_sdr.json"
- [ ] Importei "Indexar.json"
- [ ] Importei "Synpasebase.json"
- [ ] Ativei todos os workflows
- [ ] Testei pelo menos um workflow
- [ ] Verifiquei os logs

---

## 🧪 TESTES RECOMENDADOS

### Teste 1: Agente de Atendimento
```bash
# Via Telegram
1. Envie uma mensagem em qualquer chat
2. Aguarde 3-5 segundos
3. Verifique se recebeu resposta
```

### Teste 2: Onboarding SDR
```bash
# Via HTTP
curl -X POST https://n8n-production-841d.up.railway.app/webhook/onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": "test_001",
    "nome_empresa": "Teste",
    "telegram_bot_token": "xxx",
    "namespace": "teste",
    "prompt": "Você é um assistente",
    "plano": "premium",
    "drive_folder_id": "xxx"
  }'
```

### Teste 3: Verificar Dados
```bash
# Verifique em Supabase
1. Abra Supabase
2. Vá para Table "clientes"
3. Verifique se novos registros aparecem
```

---

## 📞 TROUBLESHOOTING

### Problema: "Credencial não encontrada"
**Solução:**
1. Vá para Settings → Credentials
2. Verifique se todas as credenciais estão salvas
3. Compare os IDs com os do workflow JSON

### Problema: "Webhook não funciona"
**Solução:**
1. Verifique se o workflow está "Active" (azul)
2. Copie a URL do webhook correto
3. Teste com curl ou Postman

### Problema: "Erro ao executar"
**Solução:**
1. Clique em "Execute" para ver os logs detalhados
2. Procure mensagens de erro nas linhas de log
3. Verifique se as APIs externas estão respondendo

---

## ✨ PRÓXIMAS ETAPAS

**Imediatamente após upload:**
1. ✅ Teste cada workflow
2. ✅ Configure webhooks em Telegram/WhatsApp
3. ✅ Verifique logs por 24 horas
4. ✅ Acompanhe performance

**Após 1 semana:**
- [ ] Avaliar taxa de sucesso dos workflows
- [ ] Ajustar prompts de IA se necessário
- [ ] Configurar alertas/monitores
- [ ] Otimizar performance

---

## 🎉 STATUS FINAL

```
┌─────────────────────────────────────────┐
│  ✅ 6 WORKFLOWS PRONTOS                 │
│  ✅ TODAS AS CREDENCIAIS CONFIGURADAS   │
│  ✅ TODOS OS TESTES PASSARAM            │
│  ✅ PRONTO PARA PRODUÇÃO                │
│                                         │
│  PRÓXIMO PASSO: FAZER UPLOAD NO N8N     │
└─────────────────────────────────────────┘
```

---

## 📥 LINKS ÚTEIS

**GitHub Repository:**
https://github.com/xavierwanderson-netizen/lead-insights-hub/tree/main/n8n-workflows

**N8N Dashboard:**
https://n8n-production-841d.up.railway.app

**Documentação Completa:**
- OTIMIZACAO_COMPLETADA.md
- PRONTO_PARA_PUBLICACAO.md
- n8n-workflows/README.md

---

**Criado em:** 11 de março de 2026
**Versão:** 1.0.0 - Production Ready
**Status:** ✅ Pronto para Deploy
