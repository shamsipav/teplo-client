// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { IUser } from '$lib/types'
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: IUser
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
