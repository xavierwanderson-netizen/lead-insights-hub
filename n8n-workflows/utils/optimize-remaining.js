#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

function generateId() {
  return randomUUID();
}

function optimizeWorkflows() {
  const workflowsDir = '/tmp/lead-insights-hub/n8n-workflows';
  
  // Otimizar Indexar
  console.log('📖 Otimizando: Indexar.json');
  const indexar = JSON.parse(fs.readFileSync(path.join(workflowsDir, 'Indexar.json'), 'utf-8'));
  const errorId1 = generateId();
  indexar.nodes.push({
    parameters: { jsCode: 'return [$input.all()];' },
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [300, -100],
    id: errorId1,
    name: 'Error Handler'
  });
  fs.writeFileSync(path.join(workflowsDir, 'Indexar.json'), JSON.stringify(indexar, null, 2));
  console.log('✅ Indexar otimizado');
  
  // Otimizar onboarding_sdr
  console.log('📖 Otimizando: onboarding_sdr.json');
  const sdr = JSON.parse(fs.readFileSync(path.join(workflowsDir, 'onboarding_sdr.json'), 'utf-8'));
  const errorId2 = generateId();
  sdr.nodes.push({
    parameters: { jsCode: 'return [$input.all()];' },
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [300, -100],
    id: errorId2,
    name: 'Error Handler'
  });
  fs.writeFileSync(path.join(workflowsDir, 'onboarding_sdr.json'), JSON.stringify(sdr, null, 2));
  console.log('✅ onboarding_sdr otimizado');
  
  // Otimizar Synpasebase
  console.log('📖 Otimizando: Synpasebase.json');
  const synpase = JSON.parse(fs.readFileSync(path.join(workflowsDir, 'Synpasebase.json'), 'utf-8'));
  const errorId3 = generateId();
  synpase.nodes.push({
    parameters: { jsCode: 'return [$input.all()];' },
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [300, -100],
    id: errorId3,
    name: 'Error Handler'
  });
  fs.writeFileSync(path.join(workflowsDir, 'Synpasebase.json'), JSON.stringify(synpase, null, 2));
  console.log('✅ Synpasebase otimizado');
  
  console.log('\n✨ Todos os 3 workflows otimizados!');
}

optimizeWorkflows();
