<script lang="ts">
    import dayjs from 'dayjs'
    import type { PageData } from './$types'
    import { API_URL, FURNACE_FIELDS, PROJECT_FIELDS, RESULT_FIELDS } from '$lib/consts'
    import type { IFurnace, IFurnaceBase, IModal, IResponse, IUnionFullResult } from '$lib/types'
    import { fade } from 'svelte/transition'
    import axios from 'axios'
    import { correctFieldWord, exportResultToExcel, getCookie, isGuidNullOrEmpty } from '$lib/utils'
    import { Toast, Chart, Modal } from '$components'
    import { NIL as NIL_UUID } from 'uuid'

    export let data: PageData

    let chartModal: IModal

    let authorized: boolean = data.authorized
    let variants: IFurnaceBase[] = data.variants
    let dailes: IFurnaceBase[] = data.dailes
    let furnaces: IFurnace[] = data.furnaces

    let successMessage: string
    let errorMessage: string

    let selectedVariant

    let baseVariant: IFurnaceBase
    let fullResults = false

    let notifyMessage = ''

    let selectedFurnace = furnaces?.length > 0 ? furnaces[0].id : NIL_UUID

    let disabledFurnacesAndDaily = false
    const getCurrentVariant = (selectedVariant: string) => {
        if (!isGuidNullOrEmpty(selectedVariant)) {
            disabledFurnacesAndDaily = true
            baseVariant = variants.find(x => x.id == selectedVariant)
            notifyMessage = `Вариант "${baseVariant.name}" ${baseVariant.saveDate ? 'от ' + dayjs(baseVariant.saveDate).format('DD.MM.YYYY') : ''} успешно загружен`
            setTimeout(() => notifyMessage = '', 2500)
        }
        else {
            baseVariant = null
            disabledFurnacesAndDaily = false
            result = null
        }
    }

    let result: IUnionFullResult

    const getProjectResult = async (e) => {
        const formData = new FormData(e.target)
        const data: any = {}
        formData.forEach((value, key) => data[key] = value)

        const token = getCookie('token')

        const inputDataId = !isGuidNullOrEmpty(selectedVariant) ? selectedVariant : selectedDayId

        try {
            const response = await axios.post(`${API_URL}/project`, data, { params: { inputDataId: inputDataId }, headers: { 'Authorization': `Bearer ${token}` } })
            const responseResult: IResponse = response.data
            result = responseResult.result
            notifyMessage = 'Расчет проектного периода выполнен'
            setTimeout(() => notifyMessage = '', 2500)
        } catch (error) {
            successMessage = ''
            errorMessage = error.response.data.errorMessage ?? 'Не удалось выполнить расчет проектного периода'
            result = null
            setTimeout(() => errorMessage = '', 3500)
            console.log(`Не удалось выполнить расчет проектного периода: ${error}`)
        }
    }

    let selectedDayId: string
    let disabledFurnacesAndVariants = false
    function handleDayChange(event) {
        let value = event.target.value
        if (!isGuidNullOrEmpty(value))
        {
            selectedVariant = NIL_UUID
            disabledFurnacesAndVariants = true
            baseVariant = dailes.find(x => x.id == selectedDayId)
            notifyMessage = 'Посуточная информация успешно загружена'
            setTimeout(() => notifyMessage = '', 2500)
            //defaultState = dailes.find(x => x.id == value)
        }
        else
        {
            disabledFurnacesAndVariants = false
            baseVariant = null
            result = null
        }
    }

    let changedCount = 0
    let changedProperties = new Map()
    const handleChange = (e) => {
        const prevValue = e.target.classList[1]
        const currentValue = e.target.value

        if (prevValue !== currentValue) {
            e.target.classList.add('modified')
            if (!changedProperties.has(e.target.name)) {
                changedProperties.set(e.target.name, PROJECT_FIELDS.find(x => x.name === e.target.name).description)
                changedCount++
            }
        } 
        else 
        {
            e.target.classList.remove('modified')
            if (changedProperties.has(e.target.name)) {
                changedProperties.delete(e.target.name)
                changedCount--
            }
        }
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
	<title>TeploClient: Проектный режим</title>
</svelte:head>

<Modal bind:this={chartModal} hasFooter={false} size="modal-xl" title="Результаты расчета" on:confirm={chartModal.close}>
    <div class="d-flex">
        <Chart chartIndex={1} baseValue={indexOfTheBottomBase} compValue={indexOfTheBottomProject} paramName="Индекс низа" />
        <Chart chartIndex={2} baseValue={indexOfTheTopBase} compValue={indexOfTheTopProject} paramName="Индекс верха" />
        <Chart chartIndex={3} baseValue={temperatureBase} compValue={temperatureProject} paramName="Теор. температура горения" />
    </div>
</Modal>

<div class="container">
    <p class="h3 mb-3">Проектный режим</p>
    {#if authorized}
        <div class="d-flex">
            <div class="me-3">
                {#if variants?.length > 0}
                    <p class="lead mb-2">Вариант исходных данных</p>
                    <select class="form-select" bind:value={selectedVariant} aria-label="Default select example" on:change={() => getCurrentVariant(selectedVariant)} disabled={disabledFurnacesAndVariants}>
                        <option selected disabled>Вариант исходных данных</option>
                        <option selected value="{NIL_UUID}">Не выбран</option>
                        {#each variants as variant}
                            <option value={variant.id}>
                                {variant.name ? `"${variant.name}"` : 'Без названия'} от {variant.saveDate ? dayjs(variant.saveDate).format('DD.MM.YYYY HH:mm:ss') : 'неизвестной даты'}
                            </option>
                        {/each}
                    </select>
                {:else}
                    <p class="mt-3">Отсутствуют сохраненные варианты исходных данных</p>
                {/if}
            </div>
            <div class="me-3">
                {#if variants?.length > 0 || dailes?.length > 0}
                    {#if furnaces?.length > 0}
                        <p class="lead mb-2">Доменная печь</p>
                        <select class="form-select" bind:value={selectedFurnace} aria-label="Default select example" disabled={disabledFurnacesAndVariants || disabledFurnacesAndDaily}>
                            <option selected disabled>Доменная печь</option>
                            {#each furnaces as furnace}
                                <option value={furnace.id} selected={baseVariant?.furnaceId == furnace.id}>
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
                    <select class="form-select mb-3" bind:value={selectedDayId} on:change={handleDayChange} disabled={disabledFurnacesAndDaily}>
                        <option selected disabled>Выбрать за сутки</option>
                        <option selected value="{NIL_UUID}">Не выбрано</option>
                        {#each dailes as daily}
                            {#if daily.furnaceId == selectedFurnace}
                                <option value={daily.id}>
                                    {dayjs(daily.day).format('DD.MM.YYYY')}
                                </option>
                            {/if}
                        {/each}
                    </select>
                {/if}
            </div>
        </div>
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
                                    <input type="text" class="form-control {baseVariant[field.name]}" name={field.name} value={baseVariant[`${field.name}`]} autocomplete="off" required on:change={handleChange}>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
                <div class="d-flex align-items-center">
                    <button type="submit" class="btn btn-success">Рассчитать</button>
                    {#if changedCount == 0}
                        <p class="mb-0 ms-3">Отсутствуют изменения для проектного периода</p>
                    {:else}
                        <p class="mb-0 ms-3">Изменено {correctFieldWord(changedCount)}</p>
                    {/if}
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
                <button type="button" class="btn btn-light mb-3" on:click={() => exportResultToExcel(result, true, 'project')}>Экспорт в Excel</button>
                <button type="button" class="btn btn-light mb-3" on:click={() => showChartModal(result)}>Графический вид</button>
                {#if result.baseResult.input['day'] && result.baseResult.input['day'] !== '0001-01-01T00:00:00'}
                    <p class="day-info">По данным работы доменной печи за сутки {dayjs(result.baseResult.input['day']).format('DD.MM.YYYY')}</p>
                {/if}
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
        <p>Проектный режим доступен только для авторизированных пользователей</p>
    {/if}
</div>
{#if notifyMessage}
    <div class="notify" transition:fade>
        <Toast variant="green">{notifyMessage}</Toast>
    </div>
{/if}

<style>
    .day-info {
        font-weight: 600;
    }

    .modified {
        background-color: #ffeb3b5e;
    }
</style>