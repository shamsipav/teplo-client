// TODO: Remove axios, add types and refactoring code
import { API_URL } from '$lib/consts'
import axios from 'axios'
import https from 'https'

export async function load({ cookies }) {
    let user = null

    const token = cookies.get('token')

    if (token) {
        try {
            // TODO: THIS IS NOT SAFE !!!
            const httpsAgent = new https.Agent({ rejectUnauthorized: false })
            const response = await axios.get(`${API_URL}/api/auth/user`, { headers: { 'Authorization': `Bearer ${token}` }, httpsAgent })

            user = response.data
        } catch(error) {
            // TODO: Add logging
            console.log(error)
        }
    }

    return {
        user: user
    }
}