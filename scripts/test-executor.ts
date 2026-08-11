import { AgentExecutor } from '../src/lib/executor';

async function smokeTest() {
  console.log('🧪 Testing Agent Executor with OpenRouter...\n');

  // Check environment
  console.log('1️⃣ Checking configuration...');
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'mistralai/mixtral-8x7b-instruct';

  if (!apiKey) {
    console.log('⚠️  OPENROUTER_API_KEY not set');
    console.log('   Add to .env.local: OPENROUTER_API_KEY=sk_...');
    console.log('   Get key from: https://openrouter.ai/keys\n');
  } else {
    console.log('✅ OPENROUTER_API_KEY configured');
  }

  console.log(`✅ Model: ${model}\n`);

  if (!apiKey) {
    console.log('⏭️  Skipping API test (no key). Ready to test when key added.\n');
    process.exit(0);
  }

  // Test executor
  console.log('2️⃣ Testing query execution...');
  try {
    const result = await AgentExecutor.execute(
      'What is 2 + 2?',
      'You are a helpful math assistant.'
    );

    console.log('✅ Execution completed:');
    console.log(`   Status: ${result.status}`);
    console.log(`   Result: ${result.result.substring(0, 100)}...`);
    console.log(`   Tokens: ${result.tokens_used}`);
    console.log(`   Time: ${result.execution_ms}ms\n`);

    if (result.tool_calls && result.tool_calls.length > 0) {
      console.log('🔧 Tools used:');
      result.tool_calls.forEach((call) => {
        console.log(`   - ${call.name}: ${JSON.stringify(call.input)}`);
      });
      console.log();
    }

    console.log('✅ Executor test passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Executor test failed:', error);
    process.exit(1);
  }
}

smokeTest();
