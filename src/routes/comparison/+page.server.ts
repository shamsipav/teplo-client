// TODO: Remove axios, add types and refactoring code
import { API_URL } from '$lib/consts'
import type { IResponse } from '$lib/types'
import axios from 'axios'
import https from 'https'

export async function load({ locals, cookies }) {
    const user = locals.user
    if (!user) return { authorized: false }
    const token = cookies.get('token')
    try {
        // TODO: THIS IS NOT SAFE !!!
        const httpsAgent = new https.Agent({ rejectUnauthorized: false })
        const variantsResponse = await axios.get(`${API_URL}/variant`, { headers: { 'Authorization': `Bearer ${token}` }, httpsAgent })
        const variantsResult: IResponse = variantsResponse.data

        const dailyResponse = await axios.get(`${API_URL}/daily`, { headers: { 'Authorization': `Bearer ${token}` }, httpsAgent })
        const dailyResult: IResponse = dailyResponse.data

        const furnacesResponse = await axios.get(`${API_URL}/furnace`, { headers: { 'Authorization': `Bearer ${token}` }, httpsAgent })
        const furnacesResult: IResponse = furnacesResponse.data

        return {
            authorized: true,
            variants: variantsResult.result,
            dailes: dailyResult.result,
            furnaces: furnacesResult.result,
        }
    } catch(error) {
        // TODO: Add logging
        console.log(error.response.data.errorMessage)
        return {
            authorized: true,
            variants: {},
            furnaces: {},
            dailes: {}
        }
    }
}