<script lang="ts">
    import axios from 'axios'
    import dayjs from 'dayjs'
    import { Form, Toast } from '$components'
    import { API_URL, FURNACE_FIELDS } from '$lib/consts'
    import type { IFurnace, IFurnaceBase, IResponse, IUser } from '$lib/types'
    import type { PageData } from './$types'
    import { getCookie } from '$lib/utils'
    import { fade } from 'svelte/transition'

    export let data: PageData

    let user: IUser = data.user
    let defaultState: IFurnaceBase = data.default
    let variants: IFurnaceBase[] = data.variants
    let furnaces: IFurnace[] = data.furnaces
    let saveVariant = false

    let notifyMessage = ''

    let selectedVariant
    let selectedFurnace

    const getCurrentVariant = (selectedVariant: number) => {
        defaultState = selectedVariant == 0 ? data.default : variants.find(x => x.id == selectedVariant)
        saveVariant = false

        notifyMessage = `Вариант "${defaultState.name === null ? 'По умолчанию' : defaultState.name}" успешно загружен`
        setTimeout(() => notifyMessage = '', 2500)
    }

    const getVariants = async () => {
        try {
            const token = getCookie('token')
            if (token) {
                const response = await axios.get(`${API_URL}/variant`, { headers: { 'Authorization': `Bearer ${token}` } })
                const responseResult: IResponse = response.data
                variants = responseResult.result

            } else {
                console.log('Не удалось получить токен для обновления списка вариантов')
            }
        } catch (error) {
            console.log(`Не удалось обновить варианты исходных данных: ${error}`)
        }
    }

    const successHandler = async () => {
        if (user) {
            await getVariants()
        }

        if (defaultState.id > 0 && !saveVariant)
            notifyMessage = `Вариант ${defaultState.name ? `"${defaultState.name}"` : 'Без названия'} от ${defaultState.saveDate ? dayjs(defaultState.saveDate).format('DD.MM.YYYY') : 'неизвестной даты'} обновлен`
        else
            notifyMessage = 'Расчет базового периода выполнен успешно'

        setTimeout(() => notifyMessage = '', 2500)
    }
</script>

<svelte:head>
	<title>TeploClient: Главная</title>
</svelte:head>

<div class="container">
    <p class="h3 mb-3">Расчет базового периода</p>
    {#if user}
        <div class="d-flex">
            <div class="me-3">
                <p class="lead mb-2">Варианты исходных данных</p>
                {#if variants?.length > 0}
                    <select class="form-select mb-3" bind:value={selectedVariant} aria-label="Default select example" on:change={() => getCurrentVariant(selectedVariant)}>
                        <option selected disabled>Вариант исходных данных</option>
                        <option selected value="0">По умолчанию</option>
                        {#each variants as variant}
                            <option value={variant.id}>
                                {variant.name ? `"${variant.name}"` : 'Без названия'} от {variant.saveDate ? dayjs(variant.saveDate).format('DD.MM.YYYY HH:mm:ss') : 'неизвестной даты'}
                            </option>
                        {/each}
                    </select>
                {:else}
                    <select class="form-select mb-3">
                        <option selected disabled>Вариант исходных данных</option>
                        <option selected value="0">По умолчанию</option>
                    </select>
                {/if}
            </div>
            <div>
                {#if furnaces?.length > 0}
                    <p class="lead mb-2">Доменная печь</p>
                    <select class="form-select mb-3" bind:value={selectedFurnace} aria-label="Default select example">
                        {#each furnaces as furnace}
                            <option value={furnace.id} selected={defaultState.numberOfFurnace == furnace.numberOfFurnace}>
                                ДП №{furnace.numberOfFurnace}
                            </option>
                        {/each}
                    </select>
                {/if}
            </div>
        </div>
    {/if}
    {#if Object.keys(defaultState).length > 0}
        <Form path="{API_URL}/base" on:success={successHandler}>
            {#if defaultState.id > 0}
                <input type="number" name="id" value={defaultState.id} hidden>
            {/if}
            {#if selectedFurnace !== null}
                <input type="number" name="numberOfFurnace" value={selectedFurnace} hidden>
            {/if}
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Параметр</th>
                        <th scope="col">Значение</th>
                    </tr>
                </thead>
                <tbody>
                    {#each FURNACE_FIELDS as field, i}
                        {#if i > 11}
                            <tr>
                                <td>{field.description}</td>
                                <td>
                                    <input type="text" class="form-control" name={field.name} value={defaultState ? defaultState[`${field.name}`] : 0} autocomplete="off" required>
                                </td>
                            </tr>
                        {/if}
                    {/each}
                </tbody>
            </table>
            <div class="d-flex align-items-center">
                <button type="submit" class="btn btn-success me-3">Рассчитать</button>
                {#if user}
                    <div class="d-flex align-items-center">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div class="form-check" style="flex: 1 0 auto;" on:click={() => saveVariant = !saveVariant}>
                            <input name="save" class="form-check-input" type="checkbox" value={saveVariant} checked={saveVariant}>
                            <!-- svelte-ignore a11y-label-has-associated-control -->
                            <label class="form-check-label">Сохранить вариант исходных данных</label>
                        </div>
                        {#if saveVariant}
                            <input transition:fade type="text" class="form-control ms-3" name="name" placeholder="Название варианта" autocomplete="off" required>
                        {/if}
                    </div>
                {/if}
            </div>
        </Form>
    {:else}
        <p>Не удалось получить вариант исходных данных для расчета с сервера WebAPI</p>
    {/if}
</div>

{#if notifyMessage}
    <div class="notify" transition:fade>
        <Toast variant="green">{notifyMessage}</Toast>
    </div>
{/if}
