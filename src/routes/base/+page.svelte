<script lang="ts">
    import axios from 'axios'
    import dayjs from 'dayjs'
    import { Form, Toast } from '$components'
    import { API_URL, FURNACE_FIELDS } from '$lib/consts'
    import type { IFurnace, IFurnaceBase, IResponse, IUser } from '$lib/types'
    // @ts-ignore
    import type { PageData } from './$types'
    import { getCookie, isGuidNullOrEmpty } from '$lib/utils'
    import { fade } from 'svelte/transition'
    import { NIL as NIL_UUID } from 'uuid'

    export let data: PageData

    let user: IUser = data.user
    let defaultState: IFurnaceBase = data.default
    let variants: IFurnaceBase[] = data.variants
    let furnaces: IFurnace[] = data.furnaces
    let dailes: IFurnaceBase[] = data.dailes
    let saveVariant = false

    let notifyMessage = ''

    let selectedVariant = NIL_UUID
    let selectedFurnace = furnaces?.length > 0 ? furnaces[0].id : NIL_UUID

    let disabledFurnaces = false
    const getCurrentVariant = (selectedVariant: string) => {
        if (!isGuidNullOrEmpty(selectedVariant)) {
            defaultState = isGuidNullOrEmpty(selectedVariant) ? data.default : variants.find(x => x.id == selectedVariant)
            saveVariant = false
            disabledFurnaces = true

            notifyMessage = `Вариант "${defaultState.name === null ? 'По умолчанию' : defaultState.name}" ${defaultState.saveDate ? 'от ' + dayjs(defaultState.saveDate).format('DD.MM.YYYY') : ''} успешно загружен`
            setTimeout(() => notifyMessage = '', 2500)
        } else {
            defaultState = data.default
            disabledFurnaces = false
        }
    }

    const getVariants = async () => {
        try {
            const token = getCookie('token')
            if (token) {
                const response = await axios.get(`${API_URL}/variant`, { headers: { 'Authorization': `Bearer ${token}` } })
                const responseResult: IResponse = response.data
                variants = responseResult.result

                if (saveVariant == true && variants.length > 0)
                    selectedVariant = variants[variants.length - 1].id

            } else {
                console.log('Не удалось получить токен для обновления списка вариантов')
            }
        } catch (error) {
            console.log(`Не удалось обновить варианты исходных данных: ${error}`)
        }
    }

    const deleteVariant = async (variantId: string) => {
        try {
            const token = getCookie('token')
            if (token) {
                const response = await axios.delete(`${API_URL}/variant/${variantId}`, { headers: { 'Authorization': `Bearer ${token}` } })
                const responseResult: IResponse = response.data

                variants = variants.filter(variant => variant.id !== variantId)
                selectedVariant = NIL_UUID
                getCurrentVariant(NIL_UUID)

                notifyMessage = responseResult.successMessage

            } else {
                console.log('Не удалось получить токен для обновления списка вариантов')
            }
        } catch (error) {
            console.log(`Не удалось обновить варианты исходных данных: ${error}`)
        }
    }

    const successHandler = async (e) => {
        if (user) {
            await getVariants()
        }

        if (!isGuidNullOrEmpty(defaultState.id) && defaultState.id !== selectedDayId && !saveVariant) {
            notifyMessage = `Вариант ${defaultState.name ? `"${defaultState.name}"` : 'Без названия'} от ${defaultState.saveDate ? dayjs(defaultState.saveDate).format('DD.MM.YYYY') : 'неизвестной даты'} обновлен`
        }
        else
            notifyMessage = 'Расчет базового периода выполнен успешно'

        setTimeout(() => notifyMessage = '', 2500)
    }

    let selectedDayId: string
    let disabledFurnacesAndVariants = false
    function handleDayChange(event) {
        let value = event.target.value
        if (!isGuidNullOrEmpty(value)) 
        {
            selectedVariant = NIL_UUID
            disabledFurnacesAndVariants = true
            defaultState = dailes.find(x => x.id == value)
        }
        else 
        {
            disabledFurnacesAndVariants = false
            defaultState = data.default
        }
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
                    <select class="form-select mb-3" bind:value={selectedVariant} aria-label="Default select example" on:change={() => getCurrentVariant(selectedVariant)} disabled={disabledFurnacesAndVariants}>
                        <option selected disabled>Вариант исходных данных</option>
                        <option selected value="{NIL_UUID}">По умолчанию</option>
                        {#each variants as variant}
                            <option value={variant.id}>
                                {variant.name ? `"${variant.name}"` : 'Без названия'} от {variant.saveDate ? dayjs(variant.saveDate).format('DD.MM.YYYY HH:mm:ss') : 'неизвестной даты'}
                            </option>
                        {/each}
                    </select>
                {:else}
                    <select class="form-select mb-3">
                        <option selected disabled>Вариант исходных данных</option>
                        <option selected value="{NIL_UUID}">По умолчанию</option>
                    </select>
                {/if}
            </div>
            <div class="me-3">
                {#if furnaces?.length > 0}
                    <p class="lead mb-2">Доменная печь</p>
                    <select class="form-select mb-3" bind:value={selectedFurnace} aria-label="Default select example" disabled={disabledFurnacesAndVariants || disabledFurnaces}>
                        <option selected disabled>Доменная печь</option>
                        {#each furnaces as furnace}
                            <option value={furnace.id} selected={defaultState.furnaceId == furnace.id}>
                                ДП №{furnace.numberOfFurnace}
                            </option>
                        {/each}
                    </select>
                {/if}
            </div>
            <div>
                {#if dailes?.length > 0}
                    <p class="lead mb-2">Посуточная информация</p>
                    <!-- selected day -->
                    <select class="form-select mb-3" bind:value={selectedDayId} on:change={handleDayChange}>
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
        {#if variants?.length > 0 && !isGuidNullOrEmpty(selectedVariant)}
            <button type="button" class="btn btn-outline-danger btn-sm" on:click={() => deleteVariant(selectedVariant)}>Удалить вариант исходных данных</button>
        {/if}
    {/if}
    {#if Object.keys(defaultState).length > 0}
        <Form path="{API_URL}/base" on:success={successHandler} isAuthorized={user != null}>
            {#if defaultState.id != null}
                <input type="string" name="id" value={defaultState.id} hidden>
            {/if}
            <input type="string" name="day" value={defaultState.day} hidden>
            <input type="string" name="saveDate" value={defaultState.saveDate} hidden>
            <input type="string" name="furnaceId" value={selectedFurnace ?? NIL_UUID} hidden>
            <div class="d-flex align-items-start">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Параметр</th>
                            <th scope="col">Значение</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each FURNACE_FIELDS.slice(0, user ? FURNACE_FIELDS.length - 11 : FURNACE_FIELDS.length / 2) as field, i}
                            {#if user}
                                {#if i > 11}
                                    <tr>
                                        <td>{field.description}</td>
                                        <td>
                                            <input type="text" class="form-control" name={field.name} value={defaultState ? defaultState[`${field.name}`] : 0} autocomplete="off" required>
                                        </td>
                                    </tr>
                                {/if}
                            {:else}
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
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Параметр</th>
                            <th scope="col">Значение</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each FURNACE_FIELDS.slice(FURNACE_FIELDS.length / 2) as field, i}
                            <tr>
                                <td>{field.description}</td>
                                <td>
                                    <input type="text" class="form-control" name={field.name} value={defaultState ? defaultState[`${field.name}`] : 0} autocomplete="off" required>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            <div class="d-flex align-items-center">
                <button type="submit" class="btn btn-success me-3">Рассчитать</button>
                {#if user}
                    {#if isGuidNullOrEmpty(selectedDayId)}
                        <div class="d-flex align-items-center">
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div class="form-check" style="flex: 1 0 auto;" on:click={() => saveVariant = !saveVariant}>
                                <input name="save" class="form-check-input" type="checkbox" value={saveVariant} checked={saveVariant}>
                                <!-- svelte-ignore a11y-label-has-associated-control -->
                                {#if isGuidNullOrEmpty(selectedVariant)}
                                    <label class="form-check-label">Сохранить вариант исходных данных</label>
                                {:else}
                                    <label class="form-check-label">Обновить вариант исходных данных</label>
                                {/if}
                            </div>
                            {#if saveVariant && isGuidNullOrEmpty(selectedVariant)}
                                <input transition:fade type="text" class="form-control ms-3" name="name" placeholder="Название варианта" autocomplete="off" required>
                            {/if}
                        </div>
                    {/if}
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