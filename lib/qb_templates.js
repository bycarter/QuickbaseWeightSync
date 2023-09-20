const headers = {
  'QB-Realm-Hostname': `${process.env.QB_HOSTNAME}`,
  'User-Agent': `${process.env.QB_USER_AGENT}`,
  'Authorization': `${process.env.QB_PAT}`,
  'Content-Type': 'application/json'
}
const testTareTemplateJSON = {
  "to": '{{tableID}}',
  "data": [
    { "6": { "value": '{{trayNum}}' },
      "7": { "value": '{{cellNum}}' },
      "13": { "value": '{{relProdOrd}}' },
      "16": { "value": '{{relProdMaster}}' },
      "20": { "value": '{{relMMR}}' },
    }
  ],
  "fieldsToReturn": [6, 7, 13, 16, 20]
}

/*
// FCR field KEY - <field_id>: { value: <data> } >
"data": [
    { "6": { "value": 99 }, // tray_number
      "7": { "value": 99 }, // cell_number
      "8": { "value": 99 }, // tare_weight
      "9": { "value": 99 }, // gross_weight
      "25":{ "value": 99 }, // corrected_gross_weight
      "12": { "value": "a" }, // notes
      * "13": { "value": 17763 }, // related production order 'Record ID#'
      * "16": { "value": 21 }, // Related Product_Master_Item
      * "20": { "value": 6 } // Related Master Manufacturing Record
    }
  ],

  // extra - might need
  14, 'production_order_name'
  16, 'Related Product_Master_Item'
  17, 'Product_Master_Item - master_product_item'
  20, 'Related Master Manufacturing Record'
  21, 'Master Manufacturing Record - MMR_name'
  29, 'not_used'
 */



function generateCCR(tray, cart) {
  // STUB
}

module.exports = {
  headers,
  testTareTemplateJSON
}