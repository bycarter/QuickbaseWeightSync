const fs = require('fs');
const rl = require('readline-sync');
const menu = require("./menu_templates.js")



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

function inputParameters() {
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
  fs.appendFileSync('.env', `QB_MMR=${prodId}\n`);
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