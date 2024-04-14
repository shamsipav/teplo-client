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
        const httpsAgent = new https.Agent({ rejectUnauthorized: false })

        const defaultResponse = await axios.get(`${API_URL}/variant/default`, { httpsAgent })
        const defaultResult: IResponse = defaultResponse.data

        const furnacesResponse = await axios.get(`${API_URL}/furnace`, { headers: { 'Authorization': `Bearer ${token}` }, httpsAgent })
        const furnacesResult: IResponse = furnacesResponse.data

        const dailyResponse = await axios.get(`${API_URL}/daily`, { headers: { 'Authorization': `Bearer ${token}` }, httpsAgent })
        const dailyResult: IResponse = dailyResponse.data

        const materialsResponse = await axios.get(`${API_URL}/material`, { headers: { 'Authorization': `Bearer ${token}` }, httpsAgent })
        const materialResult: IResponse = materialsResponse.data

        return {
            authorized: true,
            default: defaultResult.result,
            furnaces: furnacesResult.result,
            dailes: dailyResult.result,
            materials: materialResult.result
        }
    } catch(error) {
        // TODO: Add logging
        console.log(error.response.data.errorMessage)
        return {
            authorized: true,
            furnaces: {},
            dailes: {},
            materials: {}
        }
    }
}