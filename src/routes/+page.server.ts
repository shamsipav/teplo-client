// TODO: Remove axios, add types and refactoring code
import { API_URL } from '$lib/consts'
import axios from 'axios'
import https from 'https'

export async function load({ cookies, locals }) {
    const user = locals.user
    const token = cookies.get('token')
    try {
        // TODO: THIS IS NOT SAFE !!!
        const httpsAgent = new https.Agent({ rejectUnauthorized: false })
        const defaultResponse = await axios.get(`${API_URL}/furnace/default`, { httpsAgent })

        if (user) {
            const variantsResponse = await axios.get(`${API_URL}/furnace/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` }, httpsAgent })
            return {
                user: user,
                default: defaultResponse.data,
                variants: variantsResponse.data
            }
        }

        return {
            default: defaultResponse.data
        }
    } catch(error) {
        // TODO: Add logging
        console.log(error)
        console.log(error.response.data)
        return {
            default: {},
            variants: {}
        }
    }
}