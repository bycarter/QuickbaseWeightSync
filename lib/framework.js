//const rl = require('readline-sync');
//const fs = require('fs');
require('dotenv').config({path: '../.env'});
const parse = require('json-templates');
const qb_api = require("./qb_api.js");
const qbt = require("./qb_templates.js");
const db = require("../db/db.js");


// qb_api.setup_DEV();
// console.log(); // visual spacing

async function main() {
  await db.connect().catch(console.error);





  await db.end().catch(console.error);
}

main().catch(console.error);

// extracts column values from row
async function fetchRowValues(id) {
  // req: db connection
  let row = await db.query(
    `SELECT tray_n, cell_n, tare, gross, c_gross FROM control_records WHERE id=${id};`
  );
  let { tray_n, cell_n, tare, gross, c_gross } = row[0];
  return [tray_n, cell_n, tare, gross, c_gross];
}

// combine data with template to create body
function createBody(trayNum, cellNum, tare, gross, cGross) {
  const trayArgs = {
    trayNum,
    cellNum,
    tare,
    gross,
    relProdOrd: process.env.QB_PO_ID, // manually enter Record ID
    relProdMaster: process.env.QB_PROD_ID, // manually enter Record ID
    relMMR: process.env.QB_MMR, // manually enter Record ID
    tableID: 'bsrtz6zjg', // manually enter Table ID (FCR)
  }
  let template = null;

  // logic to select template if cGross is passed
  if (cGross) {
    trayArgs.cGross = cGross;

    // create template function from JSON template
    template = parse(qbt.correctedGrossTemplateJSON);
  } else {
    template = parse(qbt.grossTemplateJSON);
  }

  // populate template with args and return body
  return template(trayArgs);
}

/*

// insert single Fill Control Record
function insertFCRtoQB(body, cbOK) {
  // make sure this end point is correct
  return fetch(`https://api.quickbase.com/v1/records`,
    {
      method: 'POST',
      headers: qbt.headers,
      body: JSON.stringify(body)
    })
    .then( res => {
      if ( res.ok ) {
        // simply logs response in JSON if 200 OK
        return res.json().then( cbOK );
      }
      return res.json().then( resBody => Promise.reject({ status: res.status, ...resBody}));
    })
    .catch(err => console.log(err))
}
//
// insertFCRtoQB(createBody(1, 1), callbackOK)
//   .then(() => console.log(statusLog));


// insert records for 10 full trays
function batchInsertFCR() {
  let statusLog = [];
  let body = null;

  for (let tray = 1; tray <= 10; tray += 1) {
    for (let cell = 1; cell <= 100; cell += 10) {

      // generate body with current tray-cell values
      body = createBody(tray, cell);

      let callbackOK = res => console.log({tray, cell, stat: "200 OK"});

      // insert record into QB
      insertFCRtoQB(body, callbackOK);
    }
  }
}
*/