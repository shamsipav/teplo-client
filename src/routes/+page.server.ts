// TODO: Remove axios, add types and refactoring code
import { API_URL } from '$lib/consts'
import axios from 'axios'
import https from 'https'

export async function load() {
    try {
        // TODO: THIS IS NOT SAFE !!!
        const httpsAgent = new https.Agent({ rejectUnauthorized: false })
        const response = await axios.get(`${API_URL}/furnace/default`, { httpsAgent })

        return {
            default: response.data
        }
    } catch(error) {
        // TODO: Add logging
        console.log(error)
    }
}