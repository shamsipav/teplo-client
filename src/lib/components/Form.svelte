<script lang="ts">
    import dayjs from 'dayjs'
    import { fade } from 'svelte/transition'
    import { redirect } from '$lib/utils.js'
    import type { IFullResult } from '$lib/types'
    import { RESULT_FIELDS } from '$lib/consts'
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    export let path: string
    export let redirectTo = ''
    export let autocomplete: 'on' | 'off' = 'on'
    export let content: 'application/json' | 'multipart/form-data' = 'application/json'

    let fullResults = false
    let result: IFullResult = undefined

    let successText = ''
    let errorText = ''
    let loaderShow = false
    const handleSubmit = async (e) => {
        const ACTION_URL = e.target.action
        const formData = new FormData(e.target)
        const data:any = {}
        formData.forEach((value, key) => data[key] = value)

        // TODO: Вынести в +page.svelte к справочнику корр. коэффициентов
        // let referenceObject = undefined

        // if (reference) {
        //     let cokeFiltered = filter(data, ([key, _]) => key.startsWith('cokeCunsumptionCoefficents'));
        //     let cokeObject = removeKeyNames(cokeFiltered)

        //     let furnaceFiltered = filter(data, ([key, _]) => key.startsWith('furnanceCapacityCoefficents'));
        //     let furnaceObject = removeKeyNames(furnaceFiltered)

        //     referenceObject = {
        //         cokeCunsumptionCoefficents: cokeObject,
        //         furnanceCapacityCoefficents: furnaceObject
        //     }
        // }

        let CURRENT_URL = data.save == 'true' ? ACTION_URL + '?save=true' : ACTION_URL

        try {
            loaderShow = true
            let res = await fetch(CURRENT_URL, {
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
                dispatch('success')

                // e.target.reset()
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

<form class="form" action={path} on:submit|preventDefault={handleSubmit} autocomplete={autocomplete}>
    <slot />
    {#if successText}
        <p transition:fade>{successText}</p>
    {/if}
    {#if errorText}
        <p transition:fade>Произошла ошибка при выполнении запроса<br/>{errorText}</p>
    {/if}
</form>
{#if loaderShow}
    <div class="spinner-border mt-4" role="status" transition:fade>
        <span class="visually-hidden">Loading...</span>
    </div>
{/if}
<!-- TODO: Вынести отсюда в отдельный компонент -->
{#if result}
    <div class="result" transition:fade>
        <!-- <p class="h5 mt-4 mb-3">Сокращенная форма результатов расчета:</p>
        <p>Индекс низа печи: <mark>{Math.round(result.result.indexOfTheBottomOfTheFurnace * 100) / 100}</mark></p>
        <p>Индекс верха печи: <mark>{Math.round(result.result.indexOfTheFurnaceTop * 100) / 100}</mark></p>
        <p>Теоретическая температура горения: <mark>{Math.round(result.result.theoreticalBurningTemperatureOfCarbonCoke)}</mark> °С</p>
        <p>Дата проведения расчета: <mark>{dayjs(result.result.resultDate).format('DD.MM.YYYY HH:mm:ss')}</mark></p> -->
        <div class="result__full mt-4" transition:fade>
            <p class="h5 mb-3">Результаты расчета</p>
            <button type="button" class="btn btn-secondary mb-3" on:click={() => fullResults = !fullResults}>
                {fullResults ? 'Краткая форма' : 'Полная форма'}
            </button>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Параметр</th>
                        <th scope="col">Значение</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- TODO: Убрать дублирующийся код -->
                    {#each RESULT_FIELDS as field}
                    {#if !fullResults}
                        {#if field.name == 'indexOfTheBottomOfTheFurnace' || field.name == 'indexOfTheFurnaceTop' || field.name == 'theoreticalBurningTemperatureOfCarbonCoke' || field.name == 'resultDate'}
                            <tr transition:fade>
                                {#if field.name == 'resultDate'}
                                    <td>{field.description}</td>
                                    <td><mark>{dayjs(result.result[`${field.name}`]).format('DD.MM.YYYY HH:mm:ss')}</mark></td>
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
                    {:else}
                        <tr 
                            class="{field.name == 'indexOfTheBottomOfTheFurnace' ||
                            field.name == 'indexOfTheFurnaceTop' ||
                            field.name == 'theoreticalBurningTemperatureOfCarbonCoke' ? 'table-primary' : ''}" 
                            transition:fade
                        >
                            {#if field.name == 'resultDate'}
                                <td>{field.description}</td>
                                <td><mark>{dayjs(result.result[`${field.name}`]).format('DD.MM.YYYY HH:mm:ss')}</mark></td>
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
                </tbody>
            </table>
        </div>
    </div>
{/if}

<style>

</style>