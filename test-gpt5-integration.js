#!/usr/bin/env node

// Test script for Azure OpenAI GPT-5 integration
const https = require('https');

// Configuration from environment
const AZURE_ENDPOINT = 'https://ai-hubjan31758181607127.openai.azure.com';
const AZURE_API_KEY = 'd05d9a76a3624eebafacd8db6c78e370';
const DEPLOYMENT_NAME = 'finagent2-model-router';
const API_VERSION = '2025-01-01-preview';

console.log('🧪 Testing Azure OpenAI GPT-5 Integration');
console.log('=========================================\n');

// Test message for GPT-5
const testMessage = {
  messages: [
    {
      role: 'system',
      content: 'You are a helpful assistant. Identify yourself and your model.'
    },
    {
      role: 'user',
      content: 'What model are you and what are your capabilities?'
    }
  ],
  max_tokens: 150,
  temperature: 0.7
};

// Prepare the request
const data = JSON.stringify(testMessage);
const path = `/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`;

const options = {
  hostname: AZURE_ENDPOINT.replace('https://', '').replace('/', ''),
  port: 443,
  path: path,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'api-key': AZURE_API_KEY,
    'Content-Length': data.length
  }
};

console.log(`📡 Endpoint: ${AZURE_ENDPOINT}`);
console.log(`🔑 API Key: ${AZURE_API_KEY.substring(0, 10)}...`);
console.log(`🚀 Deployment: ${DEPLOYMENT_NAME}`);
console.log(`📦 API Version: ${API_VERSION}\n`);

console.log('Sending test request...\n');

const req = https.request(options, (res) => {
  let responseData = '';
  
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Status Message: ${res.statusMessage}\n`);
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(responseData);
      
      if (res.statusCode === 200) {
        console.log('✅ Success! Response from Azure OpenAI:\n');
        console.log('Model:', response.model || 'Not specified');
        console.log('Response:', response.choices?.[0]?.message?.content || 'No content');
        console.log('\n📊 Usage Stats:');
        console.log('  Prompt tokens:', response.usage?.prompt_tokens);
        console.log('  Completion tokens:', response.usage?.completion_tokens);
        console.log('  Total tokens:', response.usage?.total_tokens);
        
        // Check if it's GPT-5
        const content = response.choices?.[0]?.message?.content || '';
        if (content.toLowerCase().includes('gpt-5') || content.toLowerCase().includes('gpt 5')) {
          console.log('\n🎉 GPT-5 Confirmed! The model router is using GPT-5.');
        } else if (content.toLowerCase().includes('gpt-4')) {
          console.log('\n⚠️  Model appears to be GPT-4. GPT-5 may not be available yet.');
        }
      } else {
        console.log('❌ Error Response:\n');
        console.log(JSON.stringify(response, null, 2));
        
        if (res.statusCode === 401) {
          console.log('\n⚠️  Authentication failed. Please check your API key.');
        } else if (res.statusCode === 404) {
          console.log('\n⚠️  Deployment not found. Please check the deployment name.');
        }
      }
    } catch (e) {
      console.log('❌ Failed to parse response:', e.message);
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

// Send the request
req.write(data);
req.end();

console.log('⏳ Waiting for response...\n');