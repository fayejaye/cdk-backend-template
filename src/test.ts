'use strict';
import { DynamoDB } from 'aws-sdk'
import { DYNAMODB_TABLENAME } from './cdk/constants'
import { lambdaResponse } from './helper'
var docClient = new DynamoDB.DocumentClient({ region: 'ap-southeast-2' });

module.exports.handler = async function() {
  try{
    let res = await docClient.get({TableName: DYNAMODB_TABLENAME,
    Key: { userId:'1', headerId:'1'}}).promise();
    let database_item = res.Item;
    return lambdaResponse(201, database_item )
  }
  catch (err){
    console.log("Error and Code: ",err.message)
    return lambdaResponse(err.code, { message: err.message })
  }
}