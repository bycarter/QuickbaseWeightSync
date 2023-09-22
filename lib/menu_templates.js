const rl = require('readline-sync');

// Add ANSI color codes
const colorText = (text, colorCode) => `\x1b[${colorCode}m${text}\x1b[0m`;

// ANSI color codes (31 is red, 90 is bright black/gray)
const red = '38;5;205'; // red
const gray = 90; // bright black


function printCollectTares(trayNum, cellNum) {
  cellNum = String(cellNum);
  trayNum = String(trayNum);
  console.log();
  printMenuHeader();
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} Tray: ${trayNum.padEnd(5, ' ')}             ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} Cell: ${cellNum.padEnd(5, ' ')}             ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} < blank >               ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('*', red)} < blank >               ${colorText('*', gray)}`);
  console.log(colorText(`  ------------------------------`, gray));
}

function printMainMenu() {
  console.log();
  printMenuHeader();
  console.log(`  ${colorText('*', gray)}  ${colorText('1.', red)} Start New Tares        ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('2.', red)} .Start Gross           ${colorText('*', gray)}`);
  console.log(`  ${colorText('*', gray)}  ${colorText('3.', red)} .View Table            ${colorText('*', gray)}`);
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
function printMenuHeader() {
  console.log(colorText(`  ------------------------------`, gray));
  console.log(colorText(`  *       MASS 9000 MENU       *`, gray));
  console.log(colorText(`  ------------------------------`, gray));
}
const clearScreen = () => {
  process.stdout.write('\x1b[2J');
  process.stdout.write('\x1b[0f');
};

// ------------ Color testing and selection ------------ //

function printColors() {
  // Array of 256-color codes for different shades of red, pink, and magenta
  const redPinkMagentaCodes = [
    '38;5;160', '38;5;161', '38;5;162', '38;5;163', '38;5;164',
    '38;5;165', '38;5;166', '38;5;167', '38;5;168', '38;5;169',
    '38;5;196', '38;5;197', '38;5;198', '38;5;199', '38;5;200',
    '38;5;201', '38;5;202', '38;5;203', '38;5;204', '38;5;205'
  ];

  console.log("Testing various shades of red, pink, and magenta:\n");

  redPinkMagentaCodes.forEach((code, index) => {
    console.log(`  ${colorText(`${index + 1}. Shade`, code)} using code ${code}`);
  });

  console.log("\nChoose the color code that matches your preference.");
}

module.exports = {
  printMainMenu,
  printTareMenu,
  printCollectTares,
  clearScreen,
  colorText,
  red,
  gray,
}