const headers = {
  'QB-Realm-Hostname': `${process.env.API_HOSTNAME}`,
  'User-Agent': `${process.env.API_USER_AGENT}`,
  'Authorization': `${process.env.API_PAT}`,
  'Content-Type': 'application/json'
}

function generateCCR(tray, cart) {
  // STUB
}

module.exports = {
  headers
}