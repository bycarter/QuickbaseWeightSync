const rl = require("readline-sync");
const db = require("../db/db.js");
const menu = require("./menu_templates.js");

/*
Refactor upper/lower bound and validation logic
Refactor `tare_logic` and `gross_logic` into one `logic` file
 */
const TARE_UPPER_BOUND_0_9_EVO = 6.692;
const TARE_LOWER_BOUND_0_9_EVO = 5.012; // found one at 6.411
// const TARE_UPPER_BOUND_0_9_EVO = 6.192;
// const TARE_LOWER_BOUND_0_9_EVO = 5.012; // found one at 6.411
const TARE_UPPER_BOUND_0_5_PF = 5.278;
const TARE_LOWER_BOUND_0_5_PF = 4.111;
const TARE_UPPER_BOUND_0_5_FLEX = 17.988; // Updated to increase upper bound
const TARE_LOWER_BOUND_0_5_FLEX = 17.118;

async function main() {
  await getParameters();
  await createTrayCellRows();
  await collectTares();
  menu.clearScreen();
}

async function collectTares() {
  // select `id` range
  let [startId, endId] = await fetchIdRange(process.env.QB_PO_ID);
  let currId = startId;

  let currTare = null; // needs to be in scope of the function body

  while (currId <= endId) {
    // fetch current tray-cell
    let currTrayCellObj = await db.query(
      `SELECT tray_n, cell_n FROM control_records WHERE id=${currId}`,
    );
    let [currTray, currCell] = [
      currTrayCellObj[0].tray_n,
      currTrayCellObj[0].cell_n,
    ];
    console.log(currTray);

    // display menu
    menu.clearScreen();
    menu.printCollectTares(currTray, currCell);

    // get new tare value
    let outOfTolerance = true;
    while (outOfTolerance) {
      currTare = rl.question("Enter current tare: ");
      outOfTolerance = await validateTareTolerance(Number(currTare));
    }

    // update db with tare value
    await db.query(
      `UPDATE control_records SET tare = ${currTare} WHERE id = ${currId};`,
    );

    currId += 1;
  }
}
async function validateTareTolerance(tareIn) {
  // FUNCTION IN GROSS LOGIC TOO
  console.log(process.env.CART_SIZE);
  if (process.env.CART_SIZE === "0.9") {
    return !(
      tareIn >= TARE_LOWER_BOUND_0_9_EVO && tareIn <= TARE_UPPER_BOUND_0_9_EVO
    );
  } else if (process.env.CART_SIZE === "0.5") {
    return !(
      tareIn >= TARE_LOWER_BOUND_0_5_PF && tareIn <= TARE_UPPER_BOUND_0_5_PF
    );
  } else if (process.env.CART_SIZE === "0.5_FLEX") {
    return !(
      tareIn >= TARE_LOWER_BOUND_0_5_FLEX && tareIn <= TARE_UPPER_BOUND_0_5_FLEX
    );
  } else {
    return new Error(
      "Error: func validateTareTolerance. Cart size not present or matching process.env",
    );
  }
}

async function fetchIdRange(prodOrderId) {
  let startId = (
    await db.query(
      `SELECT min(id) FROM control_records WHERE prod_order = ${prodOrderId}`,
    )
  )[0].min;
  let endId = (
    await db.query(
      `SELECT max(id) FROM control_records WHERE prod_order = ${prodOrderId}`,
    )
  )[0].max;

  return [startId, endId];
}

async function createTrayCellRows(num) {
  let NUM_CARTS_PER_TRAY = null;
  let LAST_CELL = null;
  let numTrays = null;
  let queryValues = "";

  if (process.env.CART_SIZE !== "0.5_FLEX") {
    NUM_CARTS_PER_TRAY = 100;
    LAST_CELL = 91;
    numTrays = process.env.QB_NUM_CARTS / NUM_CARTS_PER_TRAY;
  } else {
    // tray sizes for 0.5 FLEX - 50x tray
    NUM_CARTS_PER_TRAY = 50;
    LAST_CELL = 41;
    numTrays = process.env.QB_NUM_CARTS / NUM_CARTS_PER_TRAY;
  }
  // generate `VALUES` string
  for (let tray = 1; tray <= numTrays; tray += 1) {
    for (let cell = 1; cell < NUM_CARTS_PER_TRAY; cell += 10) {
      if (tray === numTrays && cell === LAST_CELL) {
        queryValues += `(${tray}, ${cell}, ${process.env.QB_PO_ID})`;
      } else {
        queryValues += `(${tray}, ${cell}, ${process.env.QB_PO_ID}), `;
      }
    }
  }
  let text = `INSERT INTO control_records (tray_n, cell_n, prod_order) VALUES ${queryValues};`;
  // insert tray-cell values in new rows
  await db.query(text).catch(console.error);
  console.log();
  console.log("tray-cell rows created!");
}
async function getParameters() {
  /*
  Needs refactoring, it is doing too much.
  - Do we want to store params in .env?
  - - Probably in a table
   */
  menu.clearScreen();
  menu.printTareMenu();

  // get PO record ID
  let prodOrderRecordId = rl.question(`Enter Production Order Record ID: `);

  menu.clearScreen();
  menu.printTareMenu(prodOrderRecordId);

  // get cart size
  let cartSize = rl.question(
    `     ${menu.colorText("1.", menu.red)} 0.5g FLEX AIO
     ${menu.colorText("2.", menu.red)} 0.5g Cartridge
     ${menu.colorText("3.", menu.red)} 0.9g Cartridge

Select a size (${menu.colorText("1", menu.red)}, ${menu.colorText(
      "2",
      menu.red,
    )}, ${menu.colorText("3", menu.red)}): `,
  );

  let cartSizeString = cartSizeToString(cartSize);

  menu.clearScreen();
  menu.printTareMenu(prodOrderRecordId, cartSizeString);
  let numCarts = rl.question("How many total carts? ");

  menu.clearScreen();
  menu.printTareMenu(prodOrderRecordId, cartSizeString, String(numCarts));

  let option = rl.question("Confirm details (y/n): ");
  while (option !== "y" && option !== "n") {
    option = rl.question("Confirm details (y/n): ");
  }
  if (option === "y") {
    // save params in process.env
    process.env.QB_PO_ID = `${prodOrderRecordId}`;
    resolveAndSaveSize(cartSize);
    process.env.QB_NUM_CARTS = `${numCarts}`;
    if (cartSize === "1") {
      process.env.CART_SIZE = "0.5_FLEX";
    } else if (cartSize === "2") {
      process.env.CART_SIZE = "0.5";
    } else {
      process.env.CART_SIZE = "0.9";
    }
  } else if (option === "n") {
    await getParameters();
  }
  menu.clearScreen();
}

function resolveAndSaveSize(option) {
  let mmrId = null;
  let prodId = null;

  // map `option` to quickbase Record IDs for MMR & Product Item
  if (option === "1") {
    [mmrId, prodId] = [16, 350]; // 0.5 FLEX
  } else if (option === "2") {
    [mmrId, prodId] = [6, 275]; // 0.5 cart
  } else if (option === "3") {
    [mmrId, prodId] = [7, 272]; // 0.9 cart
  }
  // write to process.env
  process.env.QB_MMR = `${mmrId}`;
  process.env.QB_PROD_ID = `${prodId}`;
}
function cartSizeToString(option) {
  if (option === "1") {
    return "0.3g";
  } else if (option === "2") {
    return "0.5g";
  } else if (option === "3") {
    return "0.9g";
  }
}

module.exports = {
  main,
};
