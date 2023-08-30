<script lang="ts">
    import dayjs from 'dayjs'
    import axios from 'axios'
    import type { IFurnace, IResponse, IUnionFullResult } from '$lib/types'
    import { API_URL, FURNACE_FIELDS, RESULT_FIELDS } from '$lib/consts'
    import { fade } from 'svelte/transition'
    import type { PageData } from './$types'
    import { exportResultToExcel } from '$lib/utils'

    export let data: PageData
    
    let authorized: boolean = data.authorized
    let variants: IFurnace[] = data.variants

    let baseVariantSelected
    let compVariantSelected

    let disabled = false

    let result: IUnionFullResult

    let fullResults = false

    let errorMessage: string

    disabled = true

    const checkVariants = () => {
        if (baseVariantSelected == 0 || compVariantSelected == 0) {
            disabled = true
        } else if (baseVariantSelected == compVariantSelected) {
            disabled = true
            errorMessage = 'Необходимо выбрать разные варианты исходных данных'
        } else {
            disabled = false
            errorMessage = ''
        }
    }

    const getDifference = async () => {
        try {
            const response = await axios.get(`${API_URL}/base`, { params: { basePeriodId: baseVariantSelected, comparativePeriodId: compVariantSelected } })
            const jsonResult: IResponse = response.data
            result = jsonResult.result
            errorMessage = ''
        } catch (error) {
            errorMessage = error.response.data.errorMessage
            console.log(`Не удалось обновить варианты исходных данных: ${error}`)
        }
    }
</script>

<svelte:head>
	<title>TeploClient: Сопоставление</title>
</svelte:head>

<div class="container">
    <p class="h3 mb-3">Сопоставление параметров расчета базовых периодов</p>
    {#if authorized}
        <p class="lead mb-2">Варианты исходных данных</p>
        {#if variants?.length > 0}
            <div class="row">
                <div class="col">
                    <select class="form-select mb-3" bind:value={baseVariantSelected} aria-label="Default select example" on:change={checkVariants}>
                        <option value=0 selected disabled>Базовый период</option>               
                        {#each variants as variant}
                        <option value={variant.id}>
                            {variant.name ? `"${variant.name}"` : 'Без названия'} от {variant.saveDate ? dayjs(variant.saveDate).format('DD.MM.YYYY HH:mm:ss') : 'неизвестной даты'}
                        </option>
                        {/each}
                    </select>
                </div>
                <div class="col">
                    <select class="form-select mb-3" bind:value={compVariantSelected} aria-label="Default select example" on:change={checkVariants}>
                        <option value=0 selected disabled>Сравнительный период</option>
                        {#each variants as variant}
                            <option value={variant.id}>
                                Вариант №{variant.id} от {variant.saveDate ? dayjs(variant.saveDate).format('DD.MM.YYYY HH:mm:ss') : 'неизвестной даты'}
                            </option>
                        {/each}
                    </select>
                </div>
            </div>
            <button type="button" class="btn btn-success" on:click={getDifference} disabled={disabled}>Сравнить</button>
        {:else}
            <p class="mt-3">Нет сохраненных вариантов</p>
        {/if}
        {#if errorMessage}
            <p class="text-danger mt-3" transition:fade>{errorMessage}</p>
        {/if}
        {#if result}
            <div class="result mt-4" transition:fade>
                <p class="h5 mb-3">Результаты сопоставления</p>
                <button type="button" class="btn btn-light mb-3" on:click={() => fullResults = !fullResults}>
                    {fullResults ? 'Краткая форма' : 'Полная форма'}
                </button>
                <button type="button" class="btn btn-light mb-3" on:click={() => exportResultToExcel(result, true, 'comparative')}>Экспорт в Excel</button>
                {#if fullResults}
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Параметр</th>
                                <th scope="col">Значение (базовый пер.)</th>
                                <th scope="col">Значение (сравнительный пер.)</th>
                                <th scope="col">Отклонение</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="table-warning">
                                <td colspan="7" class="text-center">Исходные данные</td>
                            </tr>
                            {#each FURNACE_FIELDS as field}
                                <tr transition:fade>
                                    <td>{field.description}</td>
                                    <td>{Math.round(result.baseResult.input[`${field.name}`] * 100) / 100}</td>
                                    <td>{Math.round(result.comparativeResult.input[`${field.name}`] * 100) / 100}</td>
                                    <td>{Math.abs(Math.round((result.comparativeResult.input[`${field.name}`] - result.baseResult.input[`${field.name}`]) * 100) / 100)}</td>
                                </tr>
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
                                    {#if field.name !== 'resultDate'}
                                        <td>{field.description}</td>
                                        {#if field.name == 'theoreticalBurningTemperatureOfCarbonCoke'}
                                            <td><mark>{Math.round(result.baseResult.result[`${field.name}`])}</mark></td>
                                            <td><mark>{Math.round(result.comparativeResult.result[`${field.name}`])}</mark></td>
                                            <td>{Math.abs(Math.round(result.comparativeResult.result[`${field.name}`] - result.baseResult.result[`${field.name}`]))}</td>
                                        {:else}
                                            <td><mark>{Math.round(result.baseResult.result[`${field.name}`] * 100) / 100}</mark></td>
                                            <td><mark>{Math.round(result.comparativeResult.result[`${field.name}`] * 100) / 100}</mark></td>
                                            <td>{Math.abs(Math.round((result.comparativeResult.result[`${field.name}`] - result.baseResult.result[`${field.name}`]) * 100) / 100)}</td>
                                        {/if}
                                    {/if}
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {:else}
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Параметр</th>
                                <th scope="col">Значение (базовый пер.)</th>
                                <th scope="col">Значение (сравнительный пер.)</th>
                                <th scope="col">Отклонение</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each RESULT_FIELDS as field}
                                {#if field.name == 'indexOfTheBottomOfTheFurnace' || field.name == 'indexOfTheFurnaceTop' || field.name == 'theoreticalBurningTemperatureOfCarbonCoke' || field.name == 'resultDate'}
                                    <tr transition:fade>
                                        {#if field.name !== 'resultDate'}
                                            <td>{field.description}</td>
                                            {#if field.name == 'theoreticalBurningTemperatureOfCarbonCoke'}
                                                <td><mark>{Math.round(result.baseResult.result[`${field.name}`])}</mark></td>
                                                <td><mark>{Math.round(result.comparativeResult.result[`${field.name}`])}</mark></td>
                                                <td>{Math.abs(Math.round(result.comparativeResult.result[`${field.name}`] - result.baseResult.result[`${field.name}`]))}</td>
                                            {:else}
                                                <td><mark>{Math.round(result.baseResult.result[`${field.name}`] * 100) / 100}</mark></td>
                                                <td><mark>{Math.round(result.comparativeResult.result[`${field.name}`] * 100) / 100}</mark></td>
                                                <td>{Math.abs(Math.round((result.comparativeResult.result[`${field.name}`] - result.baseResult.result[`${field.name}`]) * 100) / 100)}</td>
                                            {/if}
                                        {/if}
                                    </tr>
                                {/if}
                            {/each}
                        </tbody>
                    </table>
                {/if}
            </div>
        {/if}
    {:else}
        <p>Сопоставление параметров доступно только для авторизированных пользователей</p>
    {/if}
</div>

<style>
</style>