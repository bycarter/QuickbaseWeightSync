const rl = require('readline-sync');
const fs = require('fs');
const config = require('./config.js')
require('dotenv').config();

// DEV - hard coded variables, privitized in config file
const HOSTNAME = config.HOSTNAME;
const USER_AGENT = config.USER_AGENT;

function setup() {
  populateEnv();
  displayWelcome();
  getUserPAT();
  console.log(`PAT stored`);
}

function setup_DEV() {
  populateEnv();
  displayWelcome();
  storePAT_DEV();
  console.log(`PAT stored as: ${process.env.API_PAT}`);
}

function displayWelcome() {
  console.log();
  console.log(`Welcome :)`);
  console.log();
  console.log(`You are working in:`);
  console.log(`Quickbase Realm:      ${HOSTNAME}`);
  console.log(`Quickbase User-Agent: ${USER_AGENT}`);
  console.log();
}

function populateEnv() {
  fs.appendFileSync('.env', `API_HOSTNAME=${HOSTNAME}\n`);
  fs.appendFileSync('.env', `API_USER_AGENT=${USER_AGENT}\n`);
}

function getUserPAT() {
  // ask user for PAT (production)
  const token = rl.question('Enter your Quickbase PAT: ');

  // store PAT in dotenv (process.env) file
  fs.appendFileSync('.env', `API_PAT=QB-USER-TOKEN ${token}\n`);
}

function storePAT_DEV() {
  // so I don't have to type in my PAT every test
  const token = config.API_PAT;
  fs.appendFileSync('.env', `API_PAT=QB-USER-TOKEN ${token}\n`);
}

module.exports = {
  setup,
  setup_DEV,
};