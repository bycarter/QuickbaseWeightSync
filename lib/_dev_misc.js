// ------------------- insert field in FCR table --------------------- //

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


// ---------------- retrieve all fields in FCR table ------------------- //
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




// ---------------- Color testing and selection ---------------- //

function printColors() {
  // Array of 256-color codes for different shades of red, pink, and magenta
  const redPinkMagentaCodes = [
    '38;5;160', '38;5;161', '38;5;162', '38;5;163', '38;5;164',
    '38;5;165', '38;5;166', '38;5;167', '38;5;168', '38;5;169',
    '38;5;196', '38;5;197', '38;5;198', '38;5;199', '38;5;200',
    '38;5;201', '38;5;202', '38;5;203', '38;5;204', '38;5;205'
  ];

  const blueCodes = [
    '38;5;18', '38;5;19', '38;5;20', '38;5;21', '38;5;22',
    '38;5;23', '38;5;24', '38;5;25', '38;5;26', '38;5;27'
  ];

  console.log("Testing various shades of red, pink, and magenta:\n");

  redPinkMagentaCodes.forEach((code, index) => {
    console.log(`  ${colorText(`${index + 1}. Shade`, code)} using code ${code}`);
  });

  console.log("\nChoose the color code that matches your preference.");
}