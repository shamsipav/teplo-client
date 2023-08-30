<script lang="ts">
    import dayjs from 'dayjs'
    import type { PageData } from './$types'
    import { API_URL, FURNACE_FIELDS, PROJECT_FIELDS, RESULT_FIELDS } from '$lib/consts'
    import type { IFurnace, IResponse, IUnionFullResult } from '$lib/types'
    import { fade } from 'svelte/transition'
    import axios from 'axios'
    import { getCookie } from '$lib/utils'

    export let data: PageData

    let authorized: boolean = data.authorized
    let variants: IFurnace[] = data.variants

    let successMessage: string
    let errorMessage: string

    let selectedVariant

    let baseVariant: IFurnace
    let fullResults = false

    const getCurrentVariant = (selectedVariant: number) => {
        baseVariant = variants.find(x => x.id == selectedVariant)
    }

    let result: IUnionFullResult

    const getProjectResult = async (e) => {
        const formData = new FormData(e.target)
        const data: any = {}
        formData.forEach((value, key) => data[key] = value)

        const token = getCookie('token')

        try {
            const response = await axios.post(`${API_URL}/project`, data, { params: { inputDataId: selectedVariant }, headers: { 'Authorization': `Bearer ${token}` } })
            const responseResult: IResponse = response.data
            result = responseResult.result
        } catch (error) {
            successMessage = ''
            errorMessage = error.response.data.errorMessage
            console.log(`Не удалось выполнить расчет проектного периода: ${error}`)
        }
    }
</script>

<svelte:head>
	<title>TeploClient: Проектный режим</title>
</svelte:head>

<div class="container">
    <p class="h3 mb-3">Проектный режим</p>
    {#if authorized}
        <p class="lead mb-2">Вариант исходных данных</p>
        {#if variants?.length > 0}
            <select class="form-select mb-3" bind:value={selectedVariant} aria-label="Default select example" on:change={() => getCurrentVariant(selectedVariant)}>
                <option selected disabled>Вариант исходных данных</option>
                {#each variants as variant}
                    <option value={variant.id}>
                        Вариант №{variant.id} от {variant.saveDate ? dayjs(variant.saveDate).format('DD.MM.YYYY HH:mm:ss') : 'неизвестной даты'}
                    </option>
                {/each}
            </select>
        {:else}
            <p class="mt-3">Нет сохраненных вариантов</p>
        {/if}
        {#if baseVariant}
            <form on:submit|preventDefault={getProjectResult} transition:fade>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Параметр</th>
                            <th scope="col">Значение (базовый)</th>
                            <th scope="col">Значение (проектный)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each PROJECT_FIELDS as field}
                            <tr>
                                <td>{field.description}</td>
                                <td>
                                    {baseVariant[`${field.name}`]}
                                </td>
                                <td>
                                    <input type="text" class="form-control" name={field.name} value={baseVariant[`${field.name}`]} autocomplete="off" required>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
                <div class="d-flex align-items-center">
                    <button type="submit" class="btn btn-success">Отправить</button>
                </div>
            </form>
            {#if errorMessage}
                <p class="text-danger mt-3" transition:fade>{errorMessage}</p>
            {/if}
        {/if}
        {#if result}
            <div class="result mt-4" transition:fade>
                <p class="h5 mb-3">Результаты прогноза показателей теплового режима доменной плавки</p>
                <button type="button" class="btn btn-light mb-3" on:click={() => fullResults = !fullResults}>
                    {fullResults ? 'Краткая форма' : 'Полная форма'}
                </button>
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
        <p>Проектный режим доступен только для авторизированных пользователей</p>
    {/if}
</div>