const fs = require('fs');
const path = require('path');

class SupabaseREST {
  constructor() {
    // 1. Parse .env.local securely without dotenv
    const envPath = path.resolve('.env.local');
    if (!fs.existsSync(envPath)) throw new Error('Missing .env.local file');
    
    const envFile = fs.readFileSync(envPath, 'utf-8');
    this.envVars = {};
    envFile.split('\n').forEach(line => {
      const [key, ...value] = line.split('=');
      if (key && value.length > 0) {
        this.envVars[key.trim()] = value.join('=').replace(/"/g, '').trim();
      }
    });

    this.url = this.envVars['VITE_SUPABASE_URL'] || this.envVars['NEXT_PUBLIC_SUPABASE_URL'];
    this.key = this.envVars['SUPABASE_SERVICE_ROLE_KEY'];

    if (!this.url || !this.key) {
      throw new Error('Missing Supabase credentials in .env.local');
    }

    this.restUrl = this.url + '/rest/v1';
    this.headers = {
      'apikey': this.key,
      'Authorization': 'Bearer ' + this.key,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  // --- CRUD METHODS ---

  /** 
   * Fetch rows from a table 
   * @param {string} table - Table name
   * @param {string} select - Comma separated columns (default: '*')
   */
  async select(table, select = '*') {
    const res = await fetch(`${this.restUrl}/${table}?select=${select}`, { headers: this.headers });
    if (!res.ok) throw new Error(`Select Failed: ${res.status} ${await res.text()}`);
    return await res.json();
  }

  /**
   * Safely inserts a row
   * @param {string} table - Table name 
   * @param {Object} payload - Data to insert
   * @param {string} conflictField - Field to check for duplicates (e.g., 'slug')
   */
  async safeInsert(table, payload, conflictField) {
    // 1. Fetch existing to check conflicts
    const existing = await this.select(table, `${conflictField}`);
    
    if (existing.some(r => r[conflictField] === payload[conflictField])) {
        console.log(`❌ [${table}] Record with ${conflictField}='${payload[conflictField]}' already exists.`);
        return null;
    }

    // 3. Insert manually
    const res = await fetch(`${this.restUrl}/${table}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`Insert Failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    console.log(`✅ [${table}] Inserted successfully.`);
    return data;
  }

  async update(table, payload, matchField, matchValue) {
    const res = await fetch(`${this.restUrl}/${table}?${matchField}=eq.${matchValue}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Update Failed: ${res.status} ${await res.text()}`);
    console.log(`✅ [${table}] Updated ${matchField}='${matchValue}' successfully.`);
  }
}

module.exports = SupabaseREST;
