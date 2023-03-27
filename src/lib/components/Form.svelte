<script lang="ts">
    import { fade } from 'svelte/transition'
    import { redirect } from '$lib/utils.js'
    import type { IFullResult } from '$lib/types';

    export let path: string
    export let redirectTo = ''
    export let autocomplete: 'on' | 'off' = 'on'
    export let width = 500
    export let content: 'application/json' | 'multipart/form-data' = 'application/json';

    let result: IFullResult = undefined

    let successText = ''
    let errorText = ''
    let loaderShow = false
    const handleSubmit = async (e) => {
        const ACTION_URL = e.target.action
        const formData = new FormData(e.target)
        const data = {}
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

            result = await res.json()

            if (res.ok) {
                loaderShow = false
                errorText = ''

                e.target.reset()
                if (redirectTo) redirect(redirectTo)
            } else {
                loaderShow = false
                // errorText = result.errorMessage
                errorText = 'Необходимо настроить errorMessage'
                successText = ''
            }
        } catch (error) {
            loaderShow = false
            errorText = 'Попробуйте повторить запрос позже'
        }
    }
</script>

<form class="form" style={`max-width: ${width}px;`} action={path} on:submit|preventDefault={handleSubmit} autocomplete={autocomplete}>
    <slot />
    {#if successText}
        <p transition:fade>{successText}</p>
    {/if}
    {#if errorText}
        <p transition:fade>Произошла ошибка при выполнении запроса<br/>{errorText}</p>
    {/if}
</form>
<!-- {#if loaderShow}
    <div class="awaiter-wrapper" transition:fade>
        <Awaiter />
    </div>
{/if} -->
{#if result}
    <p>Сокращенная форма результатов расчета:</p>
    <p>Индекс низа печи: {Math.round(result.result.indexOfTheBottomOfTheFurnace * 1000) / 1000}</p>
    <p>Индекс верха печи: {Math.round(result.result.indexOfTheFurnaceTop * 1000) / 1000}</p>
    <p>Теоретическая температура горения: {Math.round(result.result.theoreticalBurningTemperatureOfCarbonCoke * 1000) / 1000}</p>
{/if}

<style>

</style>