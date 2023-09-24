const ervy = require('../../ervy');
const { scatter, fg, bg } = ervy;

// const data = [
//   { key: 'tare', value: [4, 4, 4, 5, 2, 9], style: fg('red', '*')}
// ]

const scatterData = [{ key: 'A', value: [ 1, -4 ], style: '\x1B[31m*\x1B[0m' }]

for (let i = 2; i < 17; i++) {
  i < 6 ? scatterData.push({ key: 'A', value: [i, i], style: fg('red', '*') })
    : scatterData.push({ key: 'A', value: [i, 6], style: fg('red', '*') })
}

console.log(scatterData);
console.log(scatter(scatterData, { legendGap: 18, width: 15 }) + '\n')




/*
const ac = require('asciichart');

let data = [37, 37, 37, 38, 39, 38, 38, 39, 39, 39];
let d2 = [[1, 37], [2, 37],
  [3, 37], [4, 38], [5, 39], [6, 38],
  [7, 38], [8, 39], [9, 39], [10, 39]];

const upperLimit = [45, 45, 45, 45, 45, 45, 45, 45, 45, 45];
const lowerLimit = [25, 25, 25, 25, 25, 25, 25, 25, 25, 25];

const config = {
  offset: 10,
  height: 10, // Set the height of the chart
  padding: '     ', // Add padding to the left
  //format: function (x, i) { return (config.padding + x.toFixed (2)).slice (-config.padding.length) },
  colors: [
    ac.default,
    ac.green,
    ac.green,
  ],
};
// chart = ac.plot([d2, upperLimit, lowerLimit], config);

// console.log(chart);
console.log(ac);
function drawScatterPlot() {
  // Create a new chart instance
  const chart = ac.plot(data, {
    offset: 30,
    height: 30, // Set the height of the chart
    padding: '     ', // Add padding to the left
    format: (x) => x.toFixed(2) + ' ', // Format the data points
  });

  // Add horizontal lines for tolerance limits
  const upperLimitLine = ac.plot([upperLimit], { height: 1 });
  const lowerLimitLine = ac.plot([lowerLimit], { height: 1 });

  // Combine the chart and tolerance limit lines
  const finalChart = chart + '\n' + upperLimitLine + '\n' + lowerLimitLine;

  // Clear the terminal and display the chart
  console.clear();
  console.log(finalChart);
}

// drawScatterPlot();


 */