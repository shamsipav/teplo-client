// TODO: Remove axios, add types and refactoring code
import { API_URL } from '$lib/consts'
import axios from 'axios'
import https from 'https'

export async function load() {
    try {
        // TODO: THIS IS NOT SAFE !!!
        const httpsAgent = new https.Agent({ rejectUnauthorized: false })
        const defaultResponse = await axios.get(`${API_URL}/furnace/default`, { httpsAgent })

        const variantsResponse = await axios.get(`${API_URL}/furnace`, { httpsAgent })

        return {
            default: defaultResponse.data,
            variants: variantsResponse.data
        }
    } catch(error) {
        // TODO: Add logging
        console.log(error.response.data)
        return {
            default: {},
            variants: {}
        }
    }
}