const rl = require('readline-sync');
const fs = require('fs');

function setup() {
  displayWelcome();
  getUserPAT();
  // console.log(`PAT stored`); // Use to hide PAT but show it saved
  console.log(`PAT stored as: ${process.env.QB_PAT}`);

}
function setup_DEV() {
  displayWelcome();
}
function displayWelcome() {
  console.log();
  console.log(`Welcome :)`);
  console.log();
  console.log(`You are working in:`);
  console.log(`Quickbase Realm:      ${process.env.QB_HOSTNAME}`);
  console.log(`Quickbase User-Agent: ${process.env.QB_USER_AGENT}`);
  console.log(`Quickbase PAT:        ${process.env.QB_PAT}`);
  console.log();
}
function getUserPAT() {
  // ask user for PAT (production)
  const token = rl.question('Enter your Quickbase PAT: ');

  // store PAT in dotenv (process.env) file
  fs.appendFileSync('.env', `QB_PAT=QB-USER-TOKEN ${token}\n`);
}

module.exports = {
  setup,
  setup_DEV,
};