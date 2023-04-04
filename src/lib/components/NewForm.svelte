<script lang="ts">
    import { fade } from 'svelte/transition'
    import { redirect, setCookie } from '$lib/utils.js'
    import { createEventDispatcher } from 'svelte'
    import { API_URL } from '$lib/consts'

    const dispatch = createEventDispatcher()

    export let path: string
    export let redirectTo = ''
    export let autocomplete: 'on' | 'off' = 'on'
    export let content: 'application/json' | 'multipart/form-data' = 'application/json'

    let result = undefined

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

            result = await res.text()

            if (res.ok) {
                loaderShow = false
                errorMessage = ''

                if (ACTION_URL == `${API_URL}/auth/login`) {
                    setCookie('token', result, 3, true)
                    successMessage = 'Вход выполнен'
                } else {
                    successMessage = result
                }
    
                dispatch('success')

                // e.target.reset()
                if (redirectTo) redirect(redirectTo)
            } else {
                loaderShow = false
                errorMessage = result
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
</form>
{#if successMessage}
    <p class="mt-2 mb-0" transition:fade>{successMessage}</p>
{/if}
{#if errorMessage}
    <p class="mt-2 mb-0" transition:fade>Произошла ошибка при выполнении запроса<br/>{errorMessage}</p>
{/if}

<style>

</style>