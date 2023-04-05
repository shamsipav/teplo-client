// TODO: Remove axios, add types and refactoring code
import { API_URL } from '$lib/consts'
import type { IResponse } from '$lib/types'
import axios from 'axios'
import https from 'https'

export async function load() {
    try {
        // TODO: THIS IS NOT SAFE !!!
        const httpsAgent = new https.Agent({ rejectUnauthorized: false })
        const referenceResponse = await axios.get(`${API_URL}/reference`, { httpsAgent })
        const referenceResult: IResponse = referenceResponse.data

        return {
            reference: referenceResult.result
        }
    } catch(error) {
        // TODO: Add logging
        console.log(error.response.data.errorMessage)
        return {
            reference: {}
        }
    }
}