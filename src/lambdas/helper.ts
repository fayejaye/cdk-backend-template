export const lambdaResponse = (statusCode: number, body: {[key: string]: any}) => ({
    statusCode,
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    isBase64Encoded: false
})

