import Axios, { AxiosResponse, AxiosError } from "axios"
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda"
import { lambdaResponse } from "./helper"
import { API_GATEWAY_URL } from "./constants"

interface Props {
    name: string; // input from user
}

interface Response  {
    message: string; //If error, a message is returned
}

const requestConfig = (apiKey: string) => ({
    headers: { 
        //'X-Api-Key': apiKey,
        'Accept': 'application/json' 
    }
})

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const props = JSON.parse(event.body) as Props
    
    try {
        // const response = await Axios.post(API_GATEWAY_URL, {
        //     browser_application: { name: props.name }
        // }, requestConfig(props.name)) as AxiosResponse<Response>
      
        // const data = response.data
        const data = 'Hello World'
        return lambdaResponse(201, { data })
    
    } catch(e) {
        const { response: { status, data } } = e as AxiosError
        
        console.log(`Received error: `, data)
        
        return lambdaResponse(status, { message: `Unexpected error occurred with status code ${status}` })
    }
}
