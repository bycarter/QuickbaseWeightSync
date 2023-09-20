//const rl = require('readline-sync');
//const fs = require('fs');
require('dotenv').config();
const parse = require('json-templates');
const qb_api = require("./qb_api.js");
const qbt = require("./qb_templates.js");


qb_api.setup_DEV();
console.log(); // visual spacing

function createBody(trayN, cellN) {
  let trayNum = trayN;
  let cellNum = cellN;
  const relProdOrd = 17766;
  const relProdMaster = 275;
  const relMMR = 6;
  const tableID = 'bsrtz6zjg';

  const trayArgs = {
    trayNum,
    cellNum,
    relProdOrd,
    relProdMaster,
    relMMR,
    tableID
  }
  // create template function from JSON template
  const template = parse(qbt.testTareTemplateJSON);

  return template(trayArgs);
}

// insert single
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

batchInsertFCR();