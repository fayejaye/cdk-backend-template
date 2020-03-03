'use strict';
import { DynamoDB } from 'aws-sdk'
import { DYNAMODB_TABLENAME } from './cdk/constants'
import { lambdaResponse } from './helper'
var docClient = new DynamoDB.DocumentClient({ region: 'ap-southeast-2' });

module.exports.handler = async function(event) {
  console.log('Incoming event: ', event)
  console.log('Parsed event: ', JSON.parse(event.body))

  let e = JSON.parse(event.body)
  let eventFood = e.food

  try{
    let res = await docClient.put({TableName: DYNAMODB_TABLENAME,
    Item: { userId:'1', headerId:'1', food: eventFood }}).promise();
    return lambdaResponse(res.$response.httpResponse.statusCode, { body: res.$response.httpResponse.body } )
  }
  catch (err){
    console.log("Error and Code: ",err.message)
    return lambdaResponse(err.code, { message: err.message })
  }
}