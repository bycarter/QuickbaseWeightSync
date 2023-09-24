require('dotenv').config({path: '../.env'});
//const parse = require('json-templates');
const db = require("../db/db.js");
const qb_api = require("./qb_api.js");
//const qbt = require("./qb_templates.js");
const menu = require("./menu_templates.js")
const tare = require("./tare_logic.js");

async function main() {
  await db.connect().catch(console.error);

  qb_api.setup_DEV();
  console.log(); // visual spacing

  let run = true;

  while(run) {
    let option = null;
    //menu.clearScreen();

    // TODO: guard clause
    option = String(menu.printMainMenu());

    switch (option) {
      case '1':
        await tare.main().catch(console.error);
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

  await db.end().catch(console.error);
}

main().catch(console.error);