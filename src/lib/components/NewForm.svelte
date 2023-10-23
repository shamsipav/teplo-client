<script lang="ts">
    import { fade } from 'svelte/transition'
    import { redirect, setCookie } from '$lib/utils.js'
    import { createEventDispatcher } from 'svelte'
    import { API_URL } from '$lib/consts'
    import type { IResponse } from '$lib/types'

    const dispatch = createEventDispatcher()

    export let path: string
    export let redirectTo = ''
    export let autocomplete: 'on' | 'off' = 'on'
    export let content: 'application/json' | 'multipart/form-data' = 'application/json'

    let successMessage = ''
    let errorMessage = ''
    let loaderShow = false

    const handleSubmit = async (e) => {
        const ACTION_URL = e.target.action
        const formData = new FormData(e.target)
        const data:any = {}
        formData.forEach((value, key) => data[key] = value)

        try {
            loaderShow = true
            let res = await fetch(ACTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': content,
                },
                body: JSON.stringify(data)
            })

            const jsonResult: IResponse = await res.json()

            if (res.ok) {
                loaderShow = false
                errorMessage = ''
                successMessage = jsonResult.successMessage

                if (ACTION_URL == `${API_URL}/auth/login`) {
                    // 3th parameters - secure: true or false, false is NOT SAFE
                    setCookie('token', jsonResult.result, 3, false)
                }
    
                dispatch('success')

                // e.target.reset()
                if (redirectTo) redirect(redirectTo)
            } else {
                loaderShow = false
                errorMessage = jsonResult.errorMessage
                successMessage = ''
            }
        } catch (error) {
            loaderShow = false
            console.error(error)
            errorMessage = 'Попробуйте повторить запрос позже'
        }
    }
</script>

<form class="form" action={path} on:submit|preventDefault={handleSubmit} autocomplete={autocomplete}>
    <slot />
    {#if loaderShow}
        <div class="d-block spinner-border mt-2" role="status" transition:fade>
            <span class="visually-hidden">Loading...</span>
        </div>
    {/if}
</form>
{#if successMessage}
    <p class="mt-2 mb-0 text-success" transition:fade>{successMessage}</p>
{/if}
{#if errorMessage}
    <p class="mt-2 mb-0 text-danger" transition:fade>{errorMessage}</p>
{/if}