const { Client } = require('pg');

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

async function connect() {
  await client.connect();
}
async function end() {
  await client.end();
}
async function query(text, params) {
  let res = await client.query(text, params);
  return res.rows
}

module.exports = {
  connect,
  end,
  query,
}