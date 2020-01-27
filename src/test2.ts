//import * as AWS from 'aws-sdk';
//import { PostgreSQLPW_Secret_Name } from './cdk/constants';
'use strict';

//Get secret
// const getSecret = () => new AWS.SecretsManager().getSecretValue({
//   SecretId: process.env.PostgreSQLPW_Secret_Name
// }).promise().then(value => value.SecretString)

//Query Params
const id = 1

//Make the request
module.exports.handler = async function (event, context, callback) {
  //const secretPW = await getSecret();
  const { Client } = require('pg');
  const client = new Client(
  //   {
  //   user: 'root',
  //   host: 'idb.cftxnrm1zaoh.us-east-2.rds.amazonaws.com',
  //   database: 'idb_db',
  //   password: secretPW,
  //   port: 5432,
  // }
  );

  try {
    await client.connect();
    console.log('connected')
    const res = await client.query('select * from WBS1');
    console.log('ress',res)
    await client.end();
    console.log('ress2',res)
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify({ "message": res })
    };
    callback(null, response);
  }
  catch (err) {
    console.log('Err: ', err)
    callback(null, err);
  }
}
