export const lambdaResponse = (statusCode: number, body: {[key: string]: any}) => ({
    statusCode,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':true
    },
    body: JSON.stringify(body),
    isBase64Encoded: false
})

