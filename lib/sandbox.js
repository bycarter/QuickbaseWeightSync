require('dotenv').config();
const parse = require('json-templates');

const qb_api = require("./qb_api.js");
const qbt = require("./qb_templates.js");
const menu = require("./menu_templates.js")
const tare = require("./tare_logic.js");

// qb_api.setup_DEV();
// console.log(); // visual spacing

let run = true;

while(run) {
  let option = null;
  //menu.clearScreen();

  // TODO: guard clause
  option = String(menu.printMainMenu());

  switch (option) {
    case '1':
      tare.start();
      break
    case '2':
      console.log('case2');
      break;
    case '3':
      console.log('case3');
      break;
    case '4':
      run = false;
      break;
  }
}