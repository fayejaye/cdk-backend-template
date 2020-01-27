import { PostgreSQLPW_Secret_Name } from './cdk/constants';
import { getRdsSecret } from './rdsSecret';
'use strict';

//Make the request
module.exports.handler = async function (event, context, callback) {
  console.log('first console')
  try {
    console.log('in try')
    const secretPW = await getRdsSecret();
    console.log('mysecret', secretPW)
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify({ "message": secretPW })
    };
    callback(null, response);
  }
  catch (err) {
    console.log(err)
    callback(err, null);
  }

  // const { Client } = require('pg');
  // const client = new Client({
  //   connectionString: `postgresql://root:${secretPW}@idb.cftxnrm1zaoh.us-east-2.rds.amazonaws.com:5432/idb_db`
  // });
  //console.log('Client', client)
}

//   try {
//     await client.connect();
//     console.log('connected')
//     const res = await client.query('select * from WBS1');
//     console.log('ress', res)
//     await client.end();
//     console.log('ress2', res)
//     const response = {
//       statusCode: 200,
//       headers: {
//         "Access-Control-Allow-Origin": "*", // Required for CORS support to work
//         "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
//       },
//       body: JSON.stringify({ "message": res })
//     };
//     callback(null, response);
//   }
//   catch (err) {
//     console.log('Err: ', err)
//     callback(null, err);
//   }
// }
