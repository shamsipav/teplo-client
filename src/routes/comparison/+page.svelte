<script lang="ts">
    import dayjs from 'dayjs'
    import axios from 'axios'
    import type { IFurnaceBase, IResponse, IUnionFullResult, IFurnace, IModal } from '$lib/types'
    import { API_URL, FURNACE_FIELDS, RESULT_FIELDS } from '$lib/consts'
    import { fade } from 'svelte/transition'
    // @ts-ignore
    import type { PageData } from './$types'
    import { Chart, Modal } from '$components'
    import { exportResultToExcel, getCookie, isGuidNullOrEmpty } from '$lib/utils'
    import { NIL as NIL_UUID } from 'uuid'

    export let data: PageData

    let chartModal: IModal
    
    let authorized: boolean = data.authorized
    let variants: IFurnaceBase[] = data.variants
    let dailes: IFurnaceBase[] = data.dailes
    let furnaces: IFurnace[] = data.furnaces

    let selectedBaseFurnace = furnaces?.length > 0 ? furnaces[0].id : NIL_UUID
    let selectedBaseDayId = NIL_UUID

    let selectedCompFurnace = furnaces?.length > 0 ? furnaces[0].id : NIL_UUID
    let selectedCompDayId = NIL_UUID

    let baseVariantSelected = NIL_UUID
    let compVariantSelected = NIL_UUID

    let disabled = false

    let result: IUnionFullResult

    let fullResults = false

    let errorMessage: string

    disabled = true

    const validateChoosedData = () => {
        if (isGuidNullOrEmpty(baseVariantSelected) || isGuidNullOrEmpty(compVariantSelected))
        {
            disabled = true
        } else {
            disabled = false
        }

        if (isGuidNullOrEmpty(baseVariantSelected) && isGuidNullOrEmpty(compVariantSelected)) {
            if (isGuidNullOrEmpty(selectedBaseDayId) || isGuidNullOrEmpty(selectedCompDayId))
            {
                disabled = true
            } else {
                disabled = false
            }
        }
    }

    const getDifference = async () => {
        try {
            const token = getCookie('token')

            const baseParamsId = isGuidNullOrEmpty(baseVariantSelected) ? selectedBaseDayId : baseVariantSelected
            const compParamsId = isGuidNullOrEmpty(compVariantSelected) ? selectedCompDayId : compVariantSelected

            const response = await axios.get(`${API_URL}/base`, { params: { basePeriodId: baseParamsId, comparativePeriodId: compParamsId }, headers: { 'Authorization': `Bearer ${token}` } })
            const jsonResult: IResponse = response.data
            result = jsonResult.result
            errorMessage = ''
        } catch (error) {
            errorMessage = error.response.data.errorMessage ?? 'Не удалось получить результаты сопоставления'
            console.log(`Не удалось получить результаты сопоставления: ${error}`)
        }
    }

    let disabledBaseFurnacesAndDaily = false
    const baseVariantHandler = (event) => {
        let value = event.target.value
        if (!isGuidNullOrEmpty(value)) {
            disabledBaseFurnacesAndDaily = true
        } else {
            disabledBaseFurnacesAndDaily = false
        }
        validateChoosedData()
    }

    let disabledBaseVariantsAndFurnaces = false
    const handleBaseDayChange = (event) => {
        let value = event.target.value
        if (!isGuidNullOrEmpty(value)) {
            disabledBaseVariantsAndFurnaces = true
        } else {
            disabledBaseVariantsAndFurnaces = false
        }
        validateChoosedData()
    }

    let disabledCompFurnacesAndDaily = false
    const compVariantHandler = (event) => {
        let value = event.target.value
        if (!isGuidNullOrEmpty(value)) {
            disabledCompFurnacesAndDaily = true
        } else {
            disabledCompFurnacesAndDaily = false
        }
        validateChoosedData()
    }

    let disabledCompVariantsAndFurnaces = false
    const handleCompDayChange = (event) => {
        let value = event.target.value
        if (!isGuidNullOrEmpty(value)) {
            disabledCompVariantsAndFurnaces = true
        } else {
            disabledCompVariantsAndFurnaces = false
        }
        validateChoosedData()
    }

    let indexOfTheBottomBase: number
    let indexOfTheBottomProject: number

    let indexOfTheTopBase: number
    let indexOfTheTopProject: number

    let temperatureBase: number
    let temperatureProject: number
    const showChartModal = (result: IUnionFullResult) => {
        indexOfTheBottomBase = result.baseResult.result['indexOfTheBottomOfTheFurnace']
        indexOfTheBottomProject = result.comparativeResult.result['indexOfTheBottomOfTheFurnace']

        indexOfTheTopBase = result.baseResult.result['indexOfTheFurnaceTop']
        indexOfTheTopProject = result.comparativeResult.result['indexOfTheFurnaceTop']

        temperatureBase = result.baseResult.result['theoreticalBurningTemperatureOfCarbonCoke']
        temperatureProject = result.comparativeResult.result['theoreticalBurningTemperatureOfCarbonCoke']
        chartModal.open()
    }
</script>

<svelte:head>
	<title>TeploClient: Сопоставление</title>
</svelte:head>

<Modal bind:this={chartModal} hasFooter={false} size="modal-xl" title="Результаты расчета" on:confirm={chartModal.close}>
    <div class="d-flex">
        <Chart chartIndex={1} baseValue={indexOfTheBottomBase} compValue={indexOfTheBottomProject} paramName="Индекс низа" />
        <Chart chartIndex={2} baseValue={indexOfTheTopBase} compValue={indexOfTheTopProject} paramName="Индекс верха" />
        <Chart chartIndex={3} baseValue={temperatureBase} compValue={temperatureProject} paramName="Теор. температура горения" />
    </div>
</Modal>

<div class="container">
    <p class="h3 mb-4">Сопоставление параметров расчета базовых периодов</p>
    {#if authorized}
        <div>
            <p class="h5 mb-3">Базовый период</p>
            <div class="d-flex mb-3">
                <div class="me-3">
                    {#if variants?.length > 0}
                        <p class="lead mb-2">Варианты исходных данных</p>
                        <div class="row">
                            <div class="col">
                                <select class="form-select mb-3" bind:value={baseVariantSelected} aria-label="Default select example" on:change={baseVariantHandler} disabled={disabledBaseVariantsAndFurnaces}>
                                    <option value=0 selected disabled>Базовый период</option>   
                                    <option value="{NIL_UUID}" selected>Не выбран</option>            
                                    {#each variants as variant}
                                        <option value={variant.id}>
                                            {variant.name ? `"${variant.name}"` : 'Без названия'} от {variant.saveDate ? dayjs(variant.saveDate).format('DD.MM.YYYY HH:mm:ss') : 'неизвестной даты'}
                                        </option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    {:else}
                        <p>Отсутствуют сохраненные варианты исходных данных</p>
                    {/if}
                </div>
                <div class="me-3">
                    {#if variants?.length > 0 || dailes?.length > 0}
                        {#if furnaces?.length > 0}
                            <p class="lead mb-2">Доменная печь</p>
                            <select class="form-select" bind:value={selectedBaseFurnace} aria-label="Default select example" disabled={disabledBaseFurnacesAndDaily || disabledBaseVariantsAndFurnaces}>
                                <option selected disabled>Доменная печь</option>
                                <option value="{NIL_UUID}" selected>Не выбрана</option>
                                {#each furnaces as furnace}
                                    <!-- Выбирается исходя из варианта исходных данных базового периода -->
                                    <option value={furnace.id} selected={variants.find(v => v.id == baseVariantSelected)?.furnaceId == furnace.id}>
                                        ДП №{furnace.numberOfFurnace}
                                    </option>
                                {/each}
                            </select>
                        {/if}
                    {/if}
                </div>
                <div class="me-3">
                    {#if dailes?.length > 0}
                        <p class="lead mb-2">Посуточная информация</p>
                        <select class="form-select mb-3" bind:value={selectedBaseDayId} on:change={handleBaseDayChange} disabled={disabledBaseFurnacesAndDaily}>
                            <option selected disabled>Выбрать за сутки</option>
                            <option selected value="{NIL_UUID}">Не выбрано</option>
                            {#each dailes as daily}
                                {#if daily.furnaceId == selectedBaseFurnace}
                                    <option value={daily.id}>
                                        {dayjs(daily.day).format('DD.MM.YYYY')}
                                    </option>
                                {/if}
                            {/each}
                        </select>
                    {/if}
                </div>
            </div>
        </div>
        <div>
            <p class="h5 mb-3">Сравнительный период</p>
            <div class="d-flex">
                <div class="me-3">
                    {#if variants?.length > 0}
                        <p class="lead mb-2">Варианты исходных данных</p>
                        <div class="row">
                            <div class="col">
                                <select class="form-select mb-3" bind:value={compVariantSelected} aria-label="Default select example" on:change={compVariantHandler} disabled={disabledCompVariantsAndFurnaces}>
                                    <option value=0 selected disabled>Сравнительный период</option>   
                                    <option value="{NIL_UUID}" selected>Не выбран</option>            
                                    {#each variants as variant}
                                        <option value={variant.id}>
                                            {variant.name ? `"${variant.name}"` : 'Без названия'} от {variant.saveDate ? dayjs(variant.saveDate).format('DD.MM.YYYY HH:mm:ss') : 'неизвестной даты'}
                                        </option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    {:else}
                        <p>Отсутствуют сохраненные варианты исходных данных</p>
                    {/if}
                </div>
                <div class="me-3">
                    {#if variants?.length > 0 || dailes?.length > 0}
                        {#if furnaces?.length > 0}
                            <p class="lead mb-2">Доменная печь</p>
                            <select class="form-select" bind:value={selectedCompFurnace} aria-label="Default select example" disabled={disabledCompFurnacesAndDaily || disabledCompVariantsAndFurnaces}>
                                <option selected disabled>Доменная печь</option>
                                <option value="{NIL_UUID}" selected>Не выбрана</option>
                                {#each furnaces as furnace}
                                    <!-- Выбирается исходя из варианта исходных данных базового периода -->
                                    <option value={furnace.id} selected={variants.find(v => v.id == compVariantSelected)?.furnaceId == furnace.id}>
                                        ДП №{furnace.numberOfFurnace}
                                    </option>
                                {/each}
                            </select>
                        {/if}
                    {/if}
                </div>
                <div class="me-3">
                    {#if dailes?.length > 0}
                        <p class="lead mb-2">Посуточная информация</p>
                        <select class="form-select mb-3" bind:value={selectedCompDayId} on:change={handleCompDayChange} disabled={disabledCompFurnacesAndDaily}>
                            <option selected disabled>Выбрать за сутки</option>
                            <option selected value="{NIL_UUID}">Не выбрано</option>
                            {#each dailes as daily}
                                {#if daily.furnaceId == selectedCompFurnace}
                                    <option value={daily.id}>
                                        {dayjs(daily.day).format('DD.MM.YYYY')}
                                    </option>
                                {/if}
                            {/each}
                        </select>
                    {/if}
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-success" on:click={getDifference} disabled={disabled}>Произвести сравнительный расчет</button>
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
                <button type="button" class="btn btn-light mb-3" on:click={() => showChartModal(result)}>Графический вид</button>
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
                            {#each FURNACE_FIELDS as field, i}
                                {#if i == 0 || i > 11}
                                    <tr transition:fade>
                                        <td>{field.description}</td>
                                        <td>{Math.round(result.baseResult.input[`${field.name}`] * 100) / 100}</td>
                                        <td>{Math.round(result.comparativeResult.input[`${field.name}`] * 100) / 100}</td>
                                        <td>{Math.abs(Math.round((result.comparativeResult.input[`${field.name}`] - result.baseResult.input[`${field.name}`]) * 100) / 100)}</td>
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
                            {#if result.baseResult.input['day'] !== '0001-01-01T00:00:00' && result.comparativeResult.input['day'] !== '0001-01-01T00:00:00'}
                                <tr class="table-primary" transition:fade>
                                    <td>Данные за сутки</td>
                                    <td><mark>{dayjs(result.baseResult.input['day']).format('DD.MM.YYYY')}</mark></td>
                                    <td><mark>{dayjs(result.comparativeResult.input['day']).format('DD.MM.YYYY')}</mark></td>
                                    <td></td>
                                </tr>
                            {/if}
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
                            <tr transition:fade>
                                <td>Номер доменной печи</td>
                                <td><mark>{result.baseResult.input.numberOfFurnace}</mark></td>
                                <td><mark>{result.comparativeResult.input.numberOfFurnace}</mark></td>
                                <td></td>
                            </tr>
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
                            {#if result.baseResult.input['day'] !== '0001-01-01T00:00:00' && result.comparativeResult.input['day'] !== '0001-01-01T00:00:00'}
                            <tr transition:fade>
                                    <td>Данные за сутки</td>
                                    <td><mark>{dayjs(result.baseResult.input['day']).format('DD.MM.YYYY')}</mark></td>
                                    <td><mark>{dayjs(result.comparativeResult.input['day']).format('DD.MM.YYYY')}</mark></td>
                                    <td></td>
                                </tr>
                            {/if}
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