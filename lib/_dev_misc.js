// required to run
//
// require('dotenv').config();
// const qb_api = require("./qb_api.js");
// const qbt = require("./qb_templates.js");
//

// qb_api.setup_DEV();
// console.log(); // visual spacing

// --------------- insert field in FCR table -----------------

// insert single control record
function insertFCR() {
  // table_id needed for the API call
  const tableIdFCR = process.env.QB_TABLE_ID;

  // make sure this end point is correct
  fetch(`https://api.quickbase.com/v1/records`,
    {
      method: 'POST',
      headers: qbt.headers,
      body: JSON.stringify(qbt.testTemp) // make sure you pass correct body object
    })
    .then( res => {
      if ( res.ok ) {
        // simply logs response in JSON if 200 OK
        return res.json().then( res => console.log(res));
      }
      return res.json().then( resBody => Promise.reject({ status: res.status, ...resBody}));
    })
    .catch(err => console.log(err))
}


// ------------ retrieve all fields in FCR table ---------------
function pullDataFCR() {
  // table_id needed for the API call
  const tableIdFCR = process.env.QB_TABLE_ID;

  // make sure this end point is correct
  // includeFieldPerms=false will NOT return field permissions
  fetch(`https://api.quickbase.com/v1/fields?tableId=${tableIdFCR}&includeFieldPerms=false`,
    {
      method: 'GET',
      headers: qbt.headers,
    })
    .then(res => {
      // if response is 200 OK
      if (res.ok) {
        // format response in JSON
        return res.json()
          // manipulate JSON response in `then` block
          .then(res => {
            let resArray = Object.entries(res);
            // log index, id, and label
            let idNameRes = resArray.map( arr => [arr[0], arr[1].id, arr[1].label]);
            console.log(idNameRes);
          });
      }
      return res.json().then(resBody => Promise.reject({status: res.status, ...resBody}));
    })
    .catch(err => console.log(err))
}