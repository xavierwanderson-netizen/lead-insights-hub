#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateId() {
  return randomUUID();
}

function addErrorHandlerToWebhookFlows(workflow) {
  console.log(`  📝 Adicionando Error Handler...`);
  const errorHandlerId = generateId();
  const errorHandlerNode = {
    parameters: {
      jsCode: `// Error Handler
try {
  if (!$input.all().json || (Array.isArray($input.all().json) && $input.all().json.length === 0)) {
    throw new Error('Empty payload');
  }
  return [$input.all()];
} catch (error) {
  console.error('Error:', error.message);
  throw error;
}`
    },
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [300, -100],
    id: errorHandlerId,
    name: 'Error Handler'
  };
  workflow.nodes = workflow.nodes || [];
  workflow.nodes.push(errorHandlerNode);
  return errorHandlerId;
}

function addValidatorToWebhookFlows(workflow) {
  console.log(`  🛡️  Adicionando Webhook Validator...`);
  const validatorId = generateId();
  const validatorNode = {
    parameters: {
      jsCode: `// Webhook Validator
const data = $input.all().json;
const errors = [];
if (!data.body && !data.query) errors.push('Missing request data');
if (data.body?.cliente_id) {
  if (typeof data.body.cliente_id !== 'string' || data.body.cliente_id.length === 0) {
    errors.push('Invalid cliente_id');
  }
}
if (data.body?.namespace && !/^[a-zA-Z0-9_-]+$/.test(data.body.namespace)) {
  errors.push('Invalid namespace format');
}
const payload = JSON.stringify(data);
if (payload.includes('exec(') || payload.includes('eval(')) {
  errors.push('Possible code injection');
}
if (errors.length > 0) throw new Error('VALIDATION_ERROR: ' + errors.join(' | '));
return [$input.all()];`
    },
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [450, -100],
    id: validatorId,
    name: 'Webhook Validator'
  };
  workflow.nodes = workflow.nodes || [];
  workflow.nodes.push(validatorNode);
  return validatorId;
}

function optimizeIndexar(workflowPath) {
  console.log(`📖 Lendo: Indexar.json`);
  const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));
  console.log(`✨ Otimizando: ${workflow.name}`);
  addErrorHandlerToWebhookFlows(workflow);
  addValidatorToWebhookFlows(workflow);
  workflow.connections = workflow.connections || {};
  if (workflow.connections['Webhook']) {
    workflow.connections['Webhook'] = {
      main: [[{ node: 'Webhook Validator', type: 'main', index: 0 }]]
    };
  }
  workflow.connections['Webhook Validator'] = {
    main: [[{ node: 'Error Handler', type: 'main', index: 0 }]]
  };
  workflow.connections['Error Handler'] = {
    main: [[{ node: 'Edit Fields', type: 'main', index: 0 }]]
  };
  return workflow;
}

function optimizeOnboardingSdr(workflowPath) {
  console.log(`📖 Lendo: onboarding_sdr.json`);
  const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));
  console.log(`✨ Otimizando: ${workflow.name}`);
  addValidatorToWebhookFlows(workflow);
  addErrorHandlerToWebhookFlows(workflow);
  workflow.connections = workflow.connections || {};
  if (workflow.connections['Webhook']) {
    workflow.connections['Webhook'] = {
      main: [[{ node: 'Webhook Validator', type: 'main', index: 0 }]]
    };
  }
  workflow.connections['Webhook Validator'] = {
    main: [[{ node: 'Error Handler', type: 'main', index: 0 }]]
  };
  workflow.connections['Error Handler'] = {
    main: [[{ node: 'Create a row', type: 'main', index: 0 }]]
  };
  return workflow;
}

function optimizeSynpasebase(workflowPath) {
  console.log(`📖 Lendo: Synpasebase.json`);
  const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));
  console.log(`✨ Otimizando: ${workflow.name}`);
  addErrorHandlerToWebhookFlows(workflow);
  return workflow;
}

function saveWorkflow(workflow, outputPath) {
  fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2));
  console.log(`💾 Salvo: ${path.basename(outputPath)}`);
}

async function main() {
  const workflowsDir = path.join(__dirname, '..').replace(/\/g, '/');
  const workflows = [
    { name: 'Indexar.json', label: 'Indexar (PDF)', optimize: optimizeIndexar },
    { name: 'onboarding_sdr.json', label: 'Onboarding SDR', optimize: optimizeOnboardingSdr },
    { name: 'Synpasebase.json', label: 'Synpasebase', optimize: optimizeSynpasebase }
  ];
  console.log('🚀 Otimizando 3 workflows faltantes...\n');
  for (const workflow of workflows) {
    try {
      const workflowPath = path.join(workflowsDir, workflow.name).replace(/\/g, '/');
      if (!fs.existsSync(workflowPath)) {
        console.warn(`⚠️  Não encontrado: ${workflow.name}\n`);
        continue;
      }
      const optimized = workflow.optimize(workflowPath);
      saveWorkflow(optimized, workflowPath);
      console.log(`✅ ${workflow.label} otimizado!\n`);
    } catch (error) {
      console.error(`❌ Erro: ${workflow.name} -`, error.message);
    }
  }
  console.log('✨ Concluído!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
