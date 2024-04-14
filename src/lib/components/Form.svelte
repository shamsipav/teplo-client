<script lang="ts">
    import dayjs from 'dayjs'
    import { fade } from 'svelte/transition'
    import { exportResultToExcel, getCookie, redirect } from '$lib/utils.js'
    import type { IFullResult, IResponse } from '$lib/types'
    import { FURNACE_FIELDS, RESULT_FIELDS } from '$lib/consts'
    import { createEventDispatcher } from 'svelte'
    import axios from 'axios'

    const dispatch = createEventDispatcher()

    export let path: string
    export let redirectTo = ''
    export let autocomplete: 'on' | 'off' = 'on'
    export let content: 'application/json' | 'multipart/form-data' = 'application/json'
    export let isAuthorized = false

    let fullResults = false
    let result: IFullResult = undefined

    let successMessage = ''
    let errorMessage = ''
    let loaderShow = false

    const handleSubmit = async (e) => {
        const ACTION_URL = e.target.action
        const formData = new FormData(e.target)
        const data:any = {}
        formData.forEach((value, key) => data[key] = value)

        const token = getCookie('token')

        try {
            loaderShow = true
            const response = await axios.post(ACTION_URL, data, { params: { save: data.save, furnaceId: data.numberOfFurnace }, headers: { 'Authorization': `Bearer ${token}` } })
            const responseResult: IResponse = response.data
            result = responseResult.result

            loaderShow = false
            errorMessage = ''
            dispatch('success', result)
            // e.target.reset()
            if (redirectTo) redirect(redirectTo)
        } catch (error) {
            loaderShow = false
            errorMessage = error.response.data.errorMessage ?? 'Возникла непредвиденная ошибка'
            successMessage = ''
        }
    }
</script>

<form class="form" action={path} on:submit|preventDefault={handleSubmit} autocomplete={autocomplete}>
    <slot />
</form>
{#if successMessage}
    <p class="mt-2 mb-0 text-success" transition:fade>{successMessage}</p>
{/if}
{#if errorMessage}
    <p class="mt-2 mb-0 text-danger" transition:fade>{errorMessage}</p>
{/if}
{#if loaderShow}
    <div class="spinner-border mt-4" role="status" transition:fade>
        <span class="visually-hidden">Loading...</span>
    </div>
{/if}
<!-- TODO: Вынести отсюда в отдельный компонент -->
{#if result}
    <div class="result" transition:fade>
        <div class="result__full mt-4" transition:fade>
            <p class="h5 mb-3">Результаты расчета</p>
            <button type="button" class="btn btn-light mb-3" on:click={() => fullResults = !fullResults}>
                {fullResults ? 'Краткая форма' : 'Полная форма'}
            </button>
            <button type="button" class="btn btn-light mb-3" on:click={() => exportResultToExcel(result)}>Экспорт в Excel</button>
            {#if fullResults}
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Параметр</th>
                            <th scope="col">Значение</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="table-warning">
                            <td colspan="7" class="text-center">Исходные данные</td>
                        </tr>
                        {#each FURNACE_FIELDS as field, i}
                            {#if isAuthorized}
                                {#if i == 0 || i > 11}
                                    <tr transition:fade>
                                        <td>{field.description}</td>
                                        <td>{Math.round(result.input[`${field.name}`] * 100) / 100}</td>
                                    </tr>
                                {/if}
                            {:else}
                                <tr transition:fade>
                                    <td>{field.description}</td>
                                    <td>{Math.round(result.input[`${field.name}`] * 100) / 100}</td>
                                </tr>
                            {/if}
                        {/each}
                        <tr class="table-warning">
                            <td colspan="7" class="text-center">Результаты расчета</td>
                        </tr>
                        {#each RESULT_FIELDS as field}
                            <tr 
                                class="{field.name == 'indexOfTheBottomOfTheFurnace' ||
                                field.name == 'indexOfTheFurnaceTop' ||
                                field.name == 'theoreticalBurningTemperatureOfCarbonCoke' ? 'table-primary' : ''}" 
                                transition:fade
                            >
                                {#if field.name == 'resultDate'}
                                    <td>{field.description}</td>
                                    <td><mark>{dayjs(result.result[`${field.name}`]).format('DD.MM.YYYY')}</mark></td>
                                {:else}
                                    <td>{field.description}</td>
                                    {#if field.name == 'theoreticalBurningTemperatureOfCarbonCoke'}
                                        <td><mark>{Math.round(result.result[`${field.name}`])}</mark></td>
                                    {:else}
                                        <td><mark>{Math.round(result.result[`${field.name}`] * 100) / 100}</mark></td>
                                    {/if}
                                {/if}
                            </tr>
                        {/each}
                        {#if result.input['day'] && result.input['day'] !== '0001-01-01T00:00:00'}
                            <tr class="table-primary" transition:fade>
                                <td>Данные за сутки</td>
                                <td><mark>{dayjs(result.input['day']).format('DD.MM.YYYY')}</mark></td>
                            </tr>
                        {/if}
                    </tbody>
                </table>
            {:else}
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Параметр</th>
                            <th scope="col">Значение</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr transition:fade>
                            <td>Номер доменной печи</td>
                            <td><mark>{result.input.numberOfFurnace}</mark></td>
                        </tr>
                        {#each RESULT_FIELDS as field}
                            {#if field.name == 'indexOfTheBottomOfTheFurnace' || field.name == 'indexOfTheFurnaceTop' || field.name == 'theoreticalBurningTemperatureOfCarbonCoke' || field.name == 'resultDate'}
                                <tr transition:fade>
                                    {#if field.name == 'resultDate'}
                                        <td>{field.description}</td>
                                        <td><mark>{dayjs(result.result[`${field.name}`]).format('DD.MM.YYYY')}</mark></td>
                                    {:else}
                                        <td>{field.description}</td>
                                        {#if field.name == 'theoreticalBurningTemperatureOfCarbonCoke'}
                                            <td><mark>{Math.round(result.result[`${field.name}`])}</mark></td>
                                        {:else}
                                            <td><mark>{Math.round(result.result[`${field.name}`] * 100) / 100}</mark></td>
                                        {/if}
                                    {/if}
                                </tr>
                            {/if}
                        {/each}
                        {#if result.input['day'] && result.input['day'] !== '0001-01-01T00:00:00'}
                            <tr transition:fade>
                                <td>Данные за сутки</td>
                                <td><mark>{dayjs(result.input['day']).format('DD.MM.YYYY')}</mark></td>
                            </tr>
                        {/if}
                    </tbody>
                </table>
            {/if}
        </div>
    </div>
{/if}

<style>
    .day-info {
        font-weight: 600;
    }
</style>