const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/backend/.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMigration() {
  console.log('Verifying migration 003_financial_memory.sql...\n');
  
  const tables = [
    'financial_memory',
    'plaid_webhook_logs', 
    'plaid_securities',
    'plaid_investment_transactions'
  ];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table ${table}: ${error.message}`);
      } else {
        console.log(`✅ Table ${table}: Exists and accessible`);
      }
    } catch (e) {
      console.log(`❌ Table ${table}: ${e.message}`);
    }
  }
  
  // Check if columns were added to existing tables
  console.log('\nChecking column additions...');
  
  try {
    const { data: items, error: itemsError } = await supabase
      .from('plaid_items')
      .select('requires_reauth, disconnected_at')
      .limit(1);
    
    if (!itemsError) {
      console.log('✅ plaid_items: New columns (requires_reauth, disconnected_at) exist');
    } else {
      console.log(`❌ plaid_items columns: ${itemsError.message}`);
    }
  } catch (e) {
    console.log(`❌ plaid_items check failed: ${e.message}`);
  }
  
  try {
    const { data: accounts, error: accountsError } = await supabase
      .from('plaid_accounts')
      .select('is_active')
      .limit(1);
    
    if (!accountsError) {
      console.log('✅ plaid_accounts: New column (is_active) exists');
    } else {
      console.log(`❌ plaid_accounts column: ${accountsError.message}`);
    }
  } catch (e) {
    console.log(`❌ plaid_accounts check failed: ${e.message}`);
  }
  
  // Check if function exists
  console.log('\nChecking database functions...');
  try {
    const { data, error } = await supabase.rpc('match_financial_memory', {
      query_embedding: new Array(1536).fill(0),
      match_threshold: 0.5,
      match_count: 1,
      user_id: 'test'
    });
    
    if (!error || error.message.includes('no rows')) {
      console.log('✅ Function match_financial_memory exists');
    } else {
      console.log(`❌ Function match_financial_memory: ${error.message}`);
    }
  } catch (e) {
    console.log(`❌ Function check failed: ${e.message}`);
  }
  
  console.log('\n✨ Migration verification complete!');
}

verifyMigration().catch(console.error);