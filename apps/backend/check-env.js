#!/usr/bin/env node

/**
 * Environment Validation Script
 * Run this to check if your .env file is properly configured
 * Usage: node check-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n================================================');
console.log('    Environment Configuration Check');
console.log('================================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env file NOT FOUND!');
  console.log('   This is expected on a fresh clone or new machine.\n');

  if (fs.existsSync(envExamplePath)) {
    console.log('📋 To create your .env file:');
    console.log('   1. Copy the template: cp .env.example .env');
    console.log('   2. Add your API keys to the .env file');
    console.log('   3. Restart the backend\n');
  }

  console.log('🔑 Get free API keys from:');
  console.log('   • Groq (recommended): https://console.groq.com/keys');
  console.log('   • OpenAI: https://platform.openai.com/api-keys');
  console.log('\n================================================\n');
  process.exit(1);
}

console.log('✅ .env file found!\n');

// Load and check environment variables
require('dotenv').config();

const providers = {
  'Groq': {
    key: 'GROQ_API_KEY',
    value: process.env.GROQ_API_KEY,
    help: 'Get a free key at: https://console.groq.com/keys'
  },
  'OpenAI': {
    key: 'OPENAI_API_KEY',
    value: process.env.OPENAI_API_KEY,
    help: 'Get a key at: https://platform.openai.com/api-keys'
  },
  'Azure OpenAI': {
    key: 'AZURE_OPENAI_API_KEY',
    value: process.env.AZURE_OPENAI_API_KEY,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    help: 'Requires both API key and endpoint URL'
  }
};

let hasProvider = false;

console.log('Checking LLM Providers:');
console.log('----------------------');

for (const [name, config] of Object.entries(providers)) {
  if (name === 'Azure OpenAI') {
    if (config.value && config.endpoint) {
      console.log(`✅ ${name}: Configured`);
      hasProvider = true;
    } else if (config.value && !config.endpoint) {
      console.log(`⚠️  ${name}: API key found but missing AZURE_OPENAI_ENDPOINT`);
    } else if (!config.value && config.endpoint) {
      console.log(`⚠️  ${name}: Endpoint found but missing AZURE_OPENAI_API_KEY`);
    } else {
      console.log(`❌ ${name}: Not configured`);
      console.log(`   ${config.help}`);
    }
  } else {
    if (config.value) {
      console.log(`✅ ${name}: Configured`);
      hasProvider = true;
    } else {
      console.log(`❌ ${name}: Not configured (${config.key} not set)`);
      console.log(`   ${config.help}`);
    }
  }
}

console.log('\n================================================');

if (hasProvider) {
  console.log('✅ READY: At least one LLM provider is configured.');
  console.log('   Chat functionality should work!\n');
} else {
  console.log('❌ ERROR: No LLM providers configured!');
  console.log('   Chat will NOT work without at least one provider.\n');
  console.log('🔧 To fix:');
  console.log('   1. Edit your .env file');
  console.log('   2. Add at least one API key');
  console.log('   3. Restart the backend server\n');
  process.exit(1);
}

// Check optional services
console.log('Optional Services:');
console.log('-----------------');

const optionalServices = {
  'Redis': process.env.REDIS_URL,
  'Supabase': process.env.SUPABASE_URL,
  'Plaid': process.env.PLAID_CLIENT_ID,
  'Polygon': process.env.POLYGON_API_KEY,
};

for (const [name, value] of Object.entries(optionalServices)) {
  console.log(`${value ? '✓' : '○'} ${name}: ${value ? 'Configured' : 'Not configured (optional)'}`);
}

console.log('\n================================================\n');
console.log('✨ Environment check complete!\n');