require('dotenv').config({path: '../.env'});
const fs = require('fs');
const rl = require('readline-sync');
const menu = require("./menu_templates.js");
const db = require("../db/db.js");


async function main() {
  await db.connect().catch(console.error);

  // getParameters();
  //await createTrayCellRows(100);


  /*
  func collectTares

  - SET `endId` = SELECT end `id` (read db)
  - SET `currId` = 1
  - SET `currTray` = SELECT tray for `currId`
  - SET `currCell` = SELECT cell for `currId`

  - while `currId` <= `endId`
    menu.clearScreen();
  menu.printCollectTares(3, 51);
  - RL input curr `tare`
  - UPDATE `id` tare value
  - `currId` ++
*/
  let startId = (await db.query(
    'SELECT min(id) FROM control_records WHERE prod_order = 12345'))[0].min;
  let endId = (await db.query(
    'SELECT max(id) FROM control_records WHERE prod_order = 12345'))[0].max;
  console.log(startId, endId);

  await db.end().catch(console.error);
}

main().catch(console.error);

function start() {
/*
  .Input prod o record
  .Select Size
  .Input Number of Carts
  - start id 1
  - input value
  - next id
  -- last id -> SAVE or submit

 */

  // inputParameters();

  /*
  func collectTares

    - SET `endId` = SELECT end `id` (read db)
    - SET `currId` = 1
    - SET `currTray` = SELECT tray for `currId`
    - SET `currCell` = SELECT cell for `currId`

    - while `currId` <= `endId`
      menu.clearScreen();
      menu.printCollectTares(3, 51);
      - RL input curr `tare`
      - UPDATE `id` tare value
      - `currId` ++

   */

}
async function createTrayCellRows(num) {
  const NUM_CARTS_PER_TRAY = 100;
  const LAST_CELL = 91;
  const numTrays = num/100;//process.env.QB_NUM_CARTS / NUM_CARTS_PER_TRAY;
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
  let text = `INSERT INTO control_records (tray_n, cell_n, prod_order) VALUES ${queryValues};`
  // console.log(text);
  // let text = 'SELECT current_database();'
  await db.query(text).catch(console.error);

}
function getParameters() {
  /*
  Needs refactoring, it is doing too much.
  - Do we want to store params in .env?
  - - Probably in a table
   */
  menu.clearScreen();
  menu.printTareMenu();

  // get PO record ID
  let prodOrderRecordId = rl.question(`Enter Production Order Record ID: `);
  fs.appendFileSync('.env', `QB_PO_ID=${prodOrderRecordId}\n`);

  menu.clearScreen();
  menu.printTareMenu(prodOrderRecordId);

  // get cart size
  let cartSize = rl.question(`
${menu.colorText('1.', menu.red)} 0.3g Disposable
${menu.colorText('2.', menu.red)} 0.5g Cartridge
${menu.colorText('3.', menu.red)} 0.9g Cartridge

Select a size (${menu.colorText('1', menu.red)}, ${menu.colorText('2', menu.red)}, ${menu.colorText('3', menu.red)}): `);

  resolveAndSaveSize(cartSize);
  let cartSizeString = cartSizeToString(cartSize);

  menu.clearScreen();
  menu.printTareMenu(prodOrderRecordId, cartSizeString);

  let numCarts = rl.question('How many total carts? ');
  fs.appendFileSync('.env', `QB_NUM_CARTS=${numCarts}\n`);

  menu.clearScreen();
  menu.printTareMenu(prodOrderRecordId, cartSizeString, String(numCarts));

  let option = rl.question('Confirm details (y/n): ');
}

function resolveAndSaveSize(option) {
  let mmrId = null;
  let prodId = null;

  // map `option` to quickbase references
  if (option === '1') {
    [ mmrId, prodId ] = [8, 276];
  } else if (option === '2') {
      [ mmrId, prodId ] = [6, 275];
  } else if (option === '3') {
    [ mmrId, prodId ] = [7, 272];
  }
  // write to .env
  fs.appendFileSync('.env', `QB_MMR=${mmrId}\n`);
  fs.appendFileSync('.env', `QB_PROD_ID=${prodId}\n`);
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
  start,
}