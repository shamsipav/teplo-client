<script lang="ts">
    import dayjs from 'dayjs'
    import { page } from '$app/stores'
    import axios from 'axios'
    import type { IFurnace, IUnionFullResult } from '$lib/types'
    import { API_URL, RESULT_FIELDS } from '$lib/consts'
    import { fade } from 'svelte/transition'
    
    let variants: IFurnace[] = $page.data.variants

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
            result = response.data
            errorMessage = ''
        } catch (error) {
            errorMessage = error.response.data
            console.log(`Не удалось обновить варианты исходных данных: ${error}`)
        }
    }
</script>

<div class="container">
    <p class="h3 mb-3">Сопоставление параметров расчета базовых периодов</p>
    <p class="lead mb-2">Варианты исходных данных</p>
    <div class="row">
        <div class="col">
            <select class="form-select mb-3" bind:value={baseVariantSelected} aria-label="Default select example" on:change={checkVariants}>
                <option value=0 selected disabled>Базовый период</option>
                {#each variants as variant}
                    <option value={variant.id}>
                        Вариант №{variant.id} от {variant.saveDate ? dayjs(variant.saveDate).format('DD.MM.YYYY HH:mm:ss') : 'неизвестной даты'}
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
    <button type="button" class="btn btn-warning" on:click={getDifference} disabled={disabled}>Сравнить</button>
    {#if errorMessage}
        <p class="text-danger mt-3" transition:fade>{errorMessage}</p>
    {/if}
    {#if result}
        <div class="result mt-4" transition:fade>
            <p class="h5 mb-3">Результаты сопоставления</p>
            <button type="button" class="btn btn-light mb-3" on:click={() => fullResults = !fullResults}>
                {fullResults ? 'Краткая форма' : 'Полная форма'}
            </button>
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
                    <!-- TODO: Убрать дублирующийся код -->
                    {#each RESULT_FIELDS as field}
                        {#if !fullResults}
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
                        {:else}
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
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<style>
</style>