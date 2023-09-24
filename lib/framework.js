//const rl = require('readline-sync');
//const fs = require('fs');
require('dotenv').config({path: '../.env'});
const parse = require('json-templates');
const qb_api = require("./qb_api.js");
const qbt = require("./qb_templates.js");
const db = require("../db/db.js");


qb_api.setup_DEV();
// console.log(); // visual spacing

async function main() {
  await db.connect().catch(console.error);

  let [startId, endId] = await fetchIdRange(process.env.QB_PO_ID);
  let currId = startId;

  while (currId <= endId) {
    // extract values from row
    let [ tray_n, cell_n, tare, gross, c_gross ] = await fetchRowValues(currId);
    // generate body from data and template
    let body = createBody(tray_n, cell_n, tare, gross, c_gross);

    // POST body to QB
    const callbackOK = res => console.log({tray_n, cell_n, stat: "200 OK"});
    await insertFCRtoQB(body, callbackOK);
    currId++;
  }
  await db.end().catch(console.error);
}

// main().catch(console.error);

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

// insert single Fill Control Record
async function insertFCRtoQB(body, cbOK) {
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

// returns startId & endId for prodOrderId
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