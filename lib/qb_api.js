const rl = require('readline-sync');
const fs = require('fs');
const menu = require('./menu_templates');

function setup() {
  menu.printApiWelcome();
  getUserPAT();
  // console.log(`PAT stored`); // Use to hide PAT but show it saved
  console.log(`PAT stored as: ${process.env.QB_PAT}`);

}

function setup_DEV() {
  menu.clearScreen();
  menu.printApiWelcome();
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