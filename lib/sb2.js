const colorText = (text, colorCode) => `\x1b[${colorCode}m${text}\x1b[0m`;

let [ red, green, blue, b2 ] = ['38;5;205', '38;5;36', '38;5;19', '38;5;27'];
const gray = 90; // bright black

const blueCodes = [
  '38;5;18', '38;5;19', '38;5;20', '38;5;21', '38;5;22',
  '38;5;23', '38;5;24', '38;5;25', '38;5;26', '38;5;27'
];

console.log("Testing various shades of red, green, and blue:\n");

console.log(`  ${colorText(`${'1****'}. Shade`, b2)} using code ${b2}`);
console.log(`  ${colorText(`${'1****'}. Shade`, red)} using code ${red}`);
console.log(`  ${colorText(`${'1****'}. Shade`, green)} using code ${green}`);
console.log(`  ${colorText(`${'1****'}. Shade`, red)} using code ${red}`);
console.log(`  ${colorText(`${'1****'}. Shade`, blue)} using code ${blue}`);

// console.log("\nBlue shades:");
// blueCodes.forEach((code, index) => {
//   console.log(`  ${colorText(`${index + 1}. Shade`, code)} using code ${code}`);
// });

console.log("\nChoose the color codes that match your preferences.");

function printMenuHeader() {
  console.log(colorText(`  ------------------------------`, gray));
  console.log(colorText(`  *       MASS 9000 MENU       *`, gray));
  console.log(colorText(`  ------------------------------`, gray));
}
function printGrossStats(trayNum, cellNum, tare) {
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

function printMenuHeader2(inSpecIn, color) {
  let str = '';
  if (inSpecIn) {
    str = `  *  ^_^  PASS PASS PASS  ^_^  *` ;
  } else {
    str =`  *  T_T  FAIL FAIL FAIL  T_T  *`
  }
  console.log(colorText(`  ------------------------------`, color));
  console.log(colorText(`${str}`, color));
  console.log(colorText(`  ------------------------------`, color));
}

printGrossStats(4, 81, 6.031);
printGrossStats2(0.523, 2.11, false);
printGrossStats(4, 81, 6.031);
printGrossStats2(0.52, 2.11, true);