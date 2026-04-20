const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', '5837a45e-762b-4d3c-b092-c74bd4292a9a');

  if (error) {
    console.error('Error fetching profile:', error);
  } else {
    console.log('Profile:', data);
  }
}

run();
