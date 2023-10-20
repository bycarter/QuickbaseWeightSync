const rl = require('readline-sync');
const db = require("../db/db.js");
const menu = require("./menu_templates.js");

const GROSS_UPPER_BOUND_0_9_EVO = 7.537; // TARE UPPER + ( 0.9 * 1.05 )
const GROSS_LOWER_BOUND_0_9_EVO = 7.269; // TARE LOWER + ( 0.9 / 1.05 )
const GROSS_UPPER_BOUND_0_5_PF = 5.803;  // TARE UPPER + ( 0.5 * 1.05 )
const GROSS_LOWER_BOUND_0_5_PF = 5.586; // TARE LOWER + ( 0.5 / 1.05 )
const GROSS_UPPER_BOUND_0_3_PF = 14.483;
const GROSS_LOWER_BOUND_0_3_PF = 14.04;


async function main() {
  let allTaresExist = await verifyTaresExist();
  if (!allTaresExist) {
    console.log('Tare data missing or incomplete...');
    return;
  }
  await collectGrosses();

}

async function collectGrosses() {
  // select `id` range
  let [startId, endId] = await fetchIdRange(process.env.QB_PO_ID);
  let currId = startId;
  const STAT_DELAY = 1000

  let currGross = null; // needs to be in scope of the function body

  while (currId <= endId) {
    // fetch current tray-cell-tare
    let currTrayCellObj = await db.query(
      `SELECT tray_n, cell_n, tare FROM control_records WHERE id=${currId}`);
    let [currTray, currCell, currTare] = [
      currTrayCellObj[0].tray_n,
      currTrayCellObj[0].cell_n,
      currTrayCellObj[0].tare];
    console.log(currTray);

    // display menu
    menu.clearScreen();
    menu.printCollectGrosses(currTray, currCell, currTare);

    // get new gross value-0.004
    let outOfTolerance = true;
    while(outOfTolerance) {
      currGross = rl.question('Enter current gross: ');
      outOfTolerance = await validateGrossTolerance(Number(currGross));
    }

    // calc net
    let [ currNet, expectedNet, percentError, inSpec ] = await calcStats(currTare, currGross);

    // delay function
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // display results
    menu.clearScreen();
    menu.printGrossStats(currNet, percentError, inSpec, currTare);

    // out of spec logic
    if (inSpec) {
      // in spec
      // update db with gross, net, p_error, in_spec values
      await db.query(
        `UPDATE control_records ` +
        `SET gross = ${currGross}, net = ${currNet}, p_error = ${percentError}, in_spec = ${inSpec} ` +
        `WHERE id = ${currId};`
      );

      await delay(STAT_DELAY);

    } else {
      // out of spec
      let cGross = await correctGross(currTare, currGross);

      [ currNet, expectedNet, percentError, inSpec ] = await calcStats(currTare, cGross);

      menu.clearScreen();
      menu.printGrossStats(currNet, percentError, inSpec, currTare);

      await delay(STAT_DELAY);

      // update db with gross, net, p_error, in_spec values
      await db.query(
        `UPDATE control_records ` +
        `SET gross = ${currGross}, c_gross = ${cGross}, net = ${currNet}, p_error = ${percentError}, in_spec = ${inSpec} ` +
        `WHERE id = ${currId};`
      );
    }

    currId += 1;
  }
}
async function validateGrossTolerance(tareIn) {
  // FUNCTION IN TARE LOGIC TOO
  if (process.env.CART_SIZE === '0.9') {
    return !((tareIn >= GROSS_LOWER_BOUND_0_9_EVO) && (tareIn <= GROSS_UPPER_BOUND_0_9_EVO));
  } else if (process.env.CART_SIZE === '0.5') {
    return !((tareIn >= GROSS_LOWER_BOUND_0_5_PF) && (tareIn <= GROSS_UPPER_BOUND_0_5_PF));
    } else if (process.env.CART_SIZE === '0.3') {
      return !((tareIn >= GROSS_LOWER_BOUND_0_3_PF) && (tareIn <= GROSS_UPPER_BOUND_0_3_PF));
  } else {
    return new Error('Error: func validateTareTolerance. Cart size not present or matching process.env');
  }

}

async function correctGross(currTare, currGross) {
  let inSpec = false;

  while (!inSpec) {
    let [ currNet, expectedNet, percentError, newSpec ] = await calcStats(currTare, currGross);
    menu.clearScreen();
    menu.printGrossStats(currNet, percentError, newSpec, currTare);
    currGross = rl.question('Enter corrected gross: ');

    // update stats with corrected gross;
    [ currNet, expectedNet, percentError, inSpec ] = await calcStats(currTare, currGross);
  }
  return currGross;
}
async function calcStats(currTare, currGross) {
  let currNet = (currGross - currTare).toFixed(3);
  let expectedNet = Number(process.env.CART_SIZE);
  let percentError = (Math.abs( (currNet - expectedNet) / expectedNet ) * 100).toFixed(2);
  let inSpec = percentError < 5;

  return [ currNet, expectedNet, percentError, inSpec ];
}
async function verifyTaresExist() {
  let [startId, endId] = await fetchIdRange(process.env.QB_PO_ID);
  let currId = startId;

  while (currId <= endId) {
    let currTrayCellObj = await db.query(
      `SELECT tare FROM control_records WHERE id=${currId}`);
    let tare = currTrayCellObj[0].tare;
    if (!tare) return false;
    currId += 1;
  }
  console.log('Tares verified!')
  return true;
}
async function fetchIdRange(prodOrderId) {
  let startId = (await db.query(
    `SELECT min(id) FROM control_records WHERE prod_order = ${prodOrderId}`))[0].min;
  let endId = (await db.query(
    `SELECT max(id) FROM control_records WHERE prod_order = ${prodOrderId}`))[0].max;
  return [startId, endId];
}

module.exports = {
  main,
}