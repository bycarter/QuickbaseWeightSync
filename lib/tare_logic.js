const rl = require('readline-sync');
const db = require("../db/db.js");
const menu = require("./menu_templates.js");

async function main() {
  await getParameters();
  await createTrayCellRows();
  await collectTares();
}

async function collectTares() {
  // select `id` range
  let [startId, endId] = await fetchIdRange(process.env.QB_PO_ID);
  let currId = startId;

  while (currId <= endId) {
    // fetch current tray-cell
    let currTrayCellObj = await db.query(
      `SELECT tray_n, cell_n FROM control_records WHERE id=${currId}`);
    let [currTray, currCell] = [currTrayCellObj[0].tray_n, currTrayCellObj[0].cell_n];
    console.log(currTray);

    // display menu
    menu.clearScreen();
    menu.printCollectTares(currTray, currCell);

    // get new tare value
    let currTare = rl.question('Enter current tare: ');

    // update db with tare value
    await db.query(`UPDATE control_records SET tare = ${currTare} WHERE id = ${currId};`);

    currId += 1;
  }
}
async function fetchIdRange(prodOrderId) {
  let startId = (await db.query(
    `SELECT min(id) FROM control_records WHERE prod_order = ${prodOrderId}`))[0].min;
  let endId = (await db.query(
    `SELECT max(id) FROM control_records WHERE prod_order = ${prodOrderId}`))[0].max;

  return [startId, endId];
}

async function createTrayCellRows(num) {
  const NUM_CARTS_PER_TRAY = 100;
  const LAST_CELL = 91;
  const numTrays = process.env.QB_NUM_CARTS / NUM_CARTS_PER_TRAY;
  let queryValues = '';

  // generate `VALUES` string
  for (let tray = 1; tray <= numTrays; tray += 1) {
    for (let cell = 1; cell < 100; cell += 10) {
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
  //menu.clearScreen();
  menu.printTareMenu();

  // get PO record ID
  let prodOrderRecordId = rl.question(`Enter Production Order Record ID: `);

  menu.clearScreen();
  menu.printTareMenu(prodOrderRecordId);

  // get cart size
  let cartSize = rl.question(`
${menu.colorText('1.', menu.red)} 0.3g Disposable
${menu.colorText('2.', menu.red)} 0.5g Cartridge
${menu.colorText('3.', menu.red)} 0.9g Cartridge

Select a size (${menu.colorText('1', menu.red)}, ${menu.colorText('2', menu.red)}, ${menu.colorText('3', menu.red)}): `);

  let cartSizeString = cartSizeToString(cartSize);

  menu.clearScreen();
  menu.printTareMenu(prodOrderRecordId, cartSizeString);
  let numCarts = rl.question('How many total carts? ');

  menu.clearScreen();
  menu.printTareMenu(prodOrderRecordId, cartSizeString, String(numCarts));

  let option = rl.question('Confirm details (y/n): ');
  while (option !== 'y' && option !== 'n') {
    option = rl.question('Confirm details (y/n): ');
  }
  if (option === 'y') {
    // save params in process.env
    process.env.QB_PO_ID = `${prodOrderRecordId}`;
    resolveAndSaveSize(cartSize);
    process.env.QB_NUM_CARTS = `${numCarts}`;
    if (cartSize === '1') {
      process.env.CART_SIZE = '0.3';
    } else if (cartSize === '2') {
      process.env.CART_SIZE = '0.5';
    } else {
      process.env.CART_SIZE = '0.9';
    }
  } else if (option === 'n') {
    await getParameters();
  }

}

function resolveAndSaveSize(option) {
  let mmrId = null;
  let prodId = null;

  // map `option` to quickbase Record IDs for MMR & Product Item
  if (option === '1') {
    [ mmrId, prodId ] = [8, 276];
  } else if (option === '2') {
      [ mmrId, prodId ] = [6, 275];
  } else if (option === '3') {
    [ mmrId, prodId ] = [7, 272];
  }
  // write to process.env
  process.env.QB_MMR = `${mmrId}`;
  process.env.QB_PROD_ID = `${prodId}`;

}
function cartSizeToString(option) {
  if (option === '1') {
    return '0.3g'
  } else if (option === '2') {
    return '0.5g'
  } else if (option === '3') {
    return '0.9g'
  }
}

module.exports = {
  main,
}