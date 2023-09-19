const headers = {
  'QB-Realm-Hostname': `${process.env.QB_HOSTNAME}`,
  'User-Agent': `${process.env.QB_USER_AGENT}`,
  'Authorization': `${process.env.QB_PAT}`,
  'Content-Type': 'application/json'
}
function generateCCR(tray, cart) {
  // STUB
}

module.exports = {
  headers
}