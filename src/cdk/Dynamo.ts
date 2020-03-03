import { Construct } from "@aws-cdk/core";
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb'
import { DYNAMODB_TABLENAME } from './constants'

export class Dynamo extends Construct {
    constructor(parent: Construct, id: string) {
        super(parent, id)
        this.create()
    }

    private create() {
        new Table(this, 'DynamoDbTable', {
            readCapacity: 5,
            writeCapacity: 5,
            tableName: DYNAMODB_TABLENAME,
            serverSideEncryption: true,
            partitionKey: {name: 'userId', type: AttributeType.STRING},
            sortKey: {name: 'headerId', type: AttributeType.STRING},
        })
    }
}
