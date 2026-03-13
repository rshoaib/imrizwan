const fs = require('fs');
const path = require('path');

class SupabaseREST {
  constructor() {
    let envPath = path.resolve('.env.local');
    if (!fs.existsSync(envPath)) {
      envPath = path.resolve('.env');
      if (!fs.existsSync(envPath)) {
        throw new Error('Missing .env.local or .env file in project root');
      }
    }
    
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
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or Base URL in ' + path.basename(envPath));
    }

    this.restUrl = this.url + '/rest/v1';
    this.headers = {
      'apikey': this.key,
      'Authorization': 'Bearer ' + this.key,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  async select(table, select = '*') {
    const res = await fetch(`${this.restUrl}/${table}?select=${select}`, { headers: this.headers });
    if (!res.ok) throw new Error(`Select Failed: ${res.status} ${await res.text()}`);
    return await res.json();
  }

  async safeInsertWithId(table, payload, conflictField) {
    const existing = await this.select(table, `id,${conflictField}`);
    
    if (existing.some(r => r[conflictField] === payload[conflictField])) {
        console.log(`❌ [${table}] Record with ${conflictField}='${payload[conflictField]}' already exists.`);
        return null; // Skip if conflict detected
    }

    const maxId = existing.length > 0 ? Math.max(...existing.map(r => r.id)) : 0;
    const nextId = maxId + 1;
    
    const finalPayload = { id: nextId, ...payload };
    const res = await fetch(`${this.restUrl}/${table}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(finalPayload)
    });

    if (!res.ok) throw new Error(`Insert Failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    console.log(`✅ [${table}] Inserted ID ${nextId} successfully.`);
    return data;
  }
}

module.exports = SupabaseREST;
