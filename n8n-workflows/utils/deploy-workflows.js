#!/usr/bin/env node
/**
 * Deploy & Test N8N Workflows
 * Requer N8N_BASE_URL e N8N_API_KEY como variáveis de ambiente
 */

import fetch from 'node-fetch';
import fs from 'fs';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://n8n-production-841d.up.railway.app';
const N8N_API_KEY = process.env.N8N_API_KEY;

if (!N8N_API_KEY) {
  console.error('❌ Erro: N8N_API_KEY não definida');
  console.error('Use: export N8N_API_KEY=seu_token');
  process.exit(1);
}

const workflows = [
  'agente de atendimento.json',
  'agente de agendamento.json',
  'onboarding-agendamento.json',
  'onboarding_sdr.json',
  'Indexar.json',
  'Synpasebase.json'
];

async function deployWorkflow(filename) {
  try {
    const content = fs.readFileSync(filename, 'utf-8');
    const workflow = JSON.parse(content);
    
    console.log(`📤 Enviando: ${workflow.name}`);
    
    const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workflow)
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.log(`   ❌ Erro: ${response.status} - ${error}`);
      return null;
    }
    
    const result = await response.json();
    console.log(`   ✅ Workflow ID: ${result.id}`);
    return result.id;
    
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`);
    return null;
  }
}

async function activateWorkflow(workflowId) {
  try {
    console.log(`   🚀 Ativando workflow...`);
    
    const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
      method: 'PATCH',
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ active: true })
    });
    
    if (response.ok) {
      console.log(`   ✅ Workflow ativado`);
      return true;
    } else {
      console.log(`   ⚠️  Não foi possível ativar`);
      return false;
    }
    
  } catch (error) {
    console.log(`   ⚠️  Erro ao ativar: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 DEPLOY E TESTE DE WORKFLOWS N8N\n');
  console.log(`Base URL: ${N8N_BASE_URL}\n`);
  
  for (const workflow of workflows) {
    const workflowId = await deployWorkflow(workflow);
    if (workflowId) {
      await activateWorkflow(workflowId);
    }
    console.log('');
  }
  
  console.log('✨ Deploy concluído!');
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
