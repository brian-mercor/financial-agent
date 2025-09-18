#!/usr/bin/env node

// Test script for message analyzer
import { analyzeMessage } from './src/utils/messageAnalyzer.js'

const testCases = [
  // Should NOT trigger charts (educational/explanatory)
  { message: "What is P/E ratio?", expectedStream: true, expectedChart: false },
  { message: "Explain P/E ratio", expectedStream: true, expectedChart: false },
  { message: "What's a P/B ratio?", expectedStream: true, expectedChart: false },
  { message: "How does ROI work?", expectedStream: true, expectedChart: false },
  { message: "What is EBITDA?", expectedStream: true, expectedChart: false },
  { message: "Explain options trading", expectedStream: true, expectedChart: false },
  { message: "What's a good portfolio allocation strategy?", expectedStream: true, expectedChart: false },
  { message: "How should I diversify my portfolio?", expectedStream: true, expectedChart: false },

  // Should trigger charts (explicit chart requests)
  { message: "Show me the AAPL chart", expectedStream: false, expectedChart: true },
  { message: "Display Tesla stock price", expectedStream: false, expectedChart: true },
  { message: "View MSFT chart", expectedStream: false, expectedChart: true },
  { message: "Analyze NVDA stock", expectedStream: false, expectedChart: true },
  { message: "Show $AMZN", expectedStream: false, expectedChart: true },
  { message: "Display Bitcoin chart", expectedStream: false, expectedChart: true },
  { message: "Show me Apple stock chart", expectedStream: false, expectedChart: true },

  // Edge cases
  { message: "What are the top trending stocks today?", expectedStream: true, expectedChart: false },
  { message: "Is AAPL a good buy?", expectedStream: true, expectedChart: false },  // Opinion, not chart request
  { message: "Compare AAPL and MSFT", expectedStream: true, expectedChart: false }, // Comparison, not chart
  { message: "What's the market outlook?", expectedStream: true, expectedChart: false },
];

console.log('Testing Message Analyzer\n');
console.log('='.repeat(80));

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  const result = analyzeMessage(test.message);
  const streamResult = result.shouldStream;
  const chartResult = result.isChartRequest;

  const streamPass = streamResult === test.expectedStream;
  const chartPass = chartResult === test.expectedChart;
  const testPass = streamPass && chartPass;

  if (testPass) {
    passed++;
    console.log(`✅ Test ${index + 1}: "${test.message}"`);
  } else {
    failed++;
    console.log(`❌ Test ${index + 1}: "${test.message}"`);
    console.log(`   Expected: stream=${test.expectedStream}, chart=${test.expectedChart}`);
    console.log(`   Got:      stream=${streamResult}, chart=${chartResult}`);
    if (result.symbol) {
      console.log(`   Detected symbol: ${result.symbol}`);
    }
  }
});

console.log('\n' + '='.repeat(80));
console.log(`Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed > 0) {
  console.log('\n⚠️  Some tests failed. Please review the message analyzer logic.');
  process.exit(1);
} else {
  console.log('\n✨ All tests passed!');
}