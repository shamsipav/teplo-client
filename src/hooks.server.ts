import { getUserInformation } from '$lib/utils'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = (async ({ event, resolve }) => {
    const token = event.cookies.get('token')
    event.locals.user = await getUserInformation(token)

    const response = await resolve(event)
    return response

}) satisfies Handle