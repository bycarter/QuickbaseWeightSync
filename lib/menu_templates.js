const rl = require('readline-sync');

// Add ANSI color codes
const colorText = (text, colorCode) => `\x1b[${colorCode}m${text}\x1b[0m`;

// ANSI color codes (31 is red, 90 is bright black/gray)
const red = '38;5;205';
const gray = 90; // bright black
let green = '38;5;36';
let blue = '38;5;19';

function printApiWelcome() {
  console.log();
  console.log(`Welcome :)`);
  console.log();
  console.log(`You are working in:`);
  console.log(`  ${colorText('Quickbase Realm', red)}${colorText(':', gray)}      ${process.env.QB_HOSTNAME}`);
  console.log(`  ${colorText('Quickbase User-Agent', red)}${colorText(':', gray)} ${process.env.QB_USER_AGENT}`);
  console.log(`  ${colorText('Quickbase PAT', red)}${colorText(':', gray)}        ${process.env.QB_PAT}`);
}
function printMainMenu() {
  console.log();
  printMenuHeader();
  console.log(`  ${colorText('*', gray)}  ${colorText('1.', red)} Start New Tares        ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('2.', red)} Start Gross            ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('3.', red)} POST Rows -> QB        ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('4.', red)} Exit                   ${colorText('*', gray)}`);
  console.log(colorText(`  ------------------------------`, gray));
  return rl.question(`\nYour choice, Dave? `)
}

function printTareMenu(poRecId = '', cartSize = '', numCarts = '') {
  console.log();
  printMenuHeader();
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} PO Record: ${poRecId.padEnd(5, ' ')}        ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} Cart Size: ${cartSize.padEnd(5, ' ')}        ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} Num Carts: ${numCarts.padEnd(5, ' ')}        ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} < blank >               ${colorText('*', gray)}`);
  console.log(colorText(`  ------------------------------`, gray));
}

function printCollectTares(trayNum, cellNum) {
  cellNum = String(cellNum);
  trayNum = String(trayNum);
  console.log();
  printMenuHeader();
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} Tray: ${trayNum.padEnd(5, ' ')}            ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} Cell: ${cellNum.padEnd(5, ' ')}            ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} < blank >               ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} < blank >               ${colorText('*', gray)}`);
  console.log(colorText(`  ------------------------------`, gray));
}
function printCollectGrosses(trayNum, cellNum, tare) {
  cellNum = String(cellNum);
  trayNum = String(trayNum);
  tare = String(tare);

  console.log();
  printMenuHeader();
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} Tray: ${trayNum.padEnd(5, ' ')}             ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} Cell: ${cellNum.padEnd(5, ' ')}             ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} Tare: ${tare.padEnd(5, ' ')}             ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} < blank >               ${colorText('*', gray)}`);
  console.log(colorText(`  ------------------------------`, gray));
}
function printGrossStats(currNetIn, percentErrorIn, inSpecIn) {
  currNetIn = String(currNetIn) + ' g';
  percentErrorIn = String(percentErrorIn) + ' %';
  let accent = inSpecIn === true ? green : blue;
  let str = '';
  if (inSpecIn) {
    str = `  *  ^_^  PASS PASS PASS  ^_^  *` ;
  } else {
    str =`  *  T_T  FAIL FAIL FAIL  T_T  *`
  }
  let inSpecInStr = String(inSpecIn).toUpperCase();

  console.log();
  console.log(colorText(`  ------------------------------`, accent));
  console.log(colorText(`${str}`, accent));
  console.log(colorText(`  ------------------------------`, accent));
  console.log(`  ${colorText('*', accent)}  ${colorText('*', accent)} Net:     ${currNetIn.padEnd(5, ' ')}        ${colorText('*', accent)}`);
  console.log(`  ${colorText('*', accent)}  ${colorText('*', accent)} P_Err:   ${percentErrorIn.padEnd(10, ' ')}     ${colorText('*', accent)}`);
  console.log(`  ${colorText('*', accent)}  ${colorText('*', accent)} In_Spec: ${inSpecInStr.padEnd(5, ' ')}          ${colorText('*', accent)}`);
  console.log(`  ${colorText('*', accent)}  ${colorText('*', accent)} < blank >               ${colorText('*', accent)}`);
  console.log(colorText(`  ------------------------------`, accent));
}

function printMenuHeader() {
  console.log(colorText(`  ------------------------------`, gray));
  console.log(colorText(`  *       MASS 9000 MENU       *`, gray));
  console.log(colorText(`  ------------------------------`, gray));
}
const clearScreen = () => {
  process.stdout.write('\x1b[2J'); // clears screen
  process.stdout.write('\x1b[0f'); // moves cursor to top left
};


module.exports = {
  printApiWelcome,
  printMainMenu,
  printTareMenu,
  printCollectTares,
  printCollectGrosses,
  printGrossStats,
  clearScreen,
  colorText,
  red,
  gray,
}