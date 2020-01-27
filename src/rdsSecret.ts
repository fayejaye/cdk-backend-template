import * as AWS from 'aws-sdk';

let pw: string

export const getRdsSecret = async () => {
    if (!pw) {
        const { SecretString } = await new AWS.SecretsManager().getSecretValue({
            SecretId: process.env.PostgreSQLPW_Secret_Name
        }).promise()

        pw = SecretString
    }
    return pw;
}
