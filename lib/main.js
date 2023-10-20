const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const db = require("../db/db.js");
const qb_api = require("./qb_api.js");
const menu = require("./menu_templates.js");
const tare = require("./tare_logic.js");
const gross = require("./gross_logic.js");
const fw = require("./framework.js");

async function main() {
  await db.connect().catch(console.error);

  qb_api.setup_DEV();
  console.log(); // visual spacing

  let run = true;

  while (run) {
    let option = null;
    //menu.clearScreen();

    // TODO: guard clause
    option = String(menu.printMainMenu());

    switch (option) {
      case "1":
        await tare.main().catch(console.error);
        break;
      case "2":
        await gross.main().catch(console.error);
        break;
      case "3":
        await fw.main().catch(console.error);

        break;
      case "4":
        run = false;
        break;
    }
  }

  await db.end().catch(console.error);
}

main().catch(console.error);
