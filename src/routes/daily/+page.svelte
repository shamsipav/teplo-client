<script lang="ts">
    import axios from 'axios'
    import dayjs from 'dayjs'
    import type { PageData } from './$types'
    import type { IModal, IResponse, IFurnaceBase } from '$lib/types'
    import { API_URL, FURNACE_FIELDS } from '$lib/consts'
    import { Toast, Modal, NewForm } from '$components'
    import { fade } from 'svelte/transition'
    import { getCookie, isGuidNullOrEmpty } from '$lib/utils'
    import { onMount } from 'svelte'
    import { NIL as NIL_UUID } from 'uuid'

    let confirmDeleteModal: IModal
    let createModal: IModal

    let updateForm: HTMLFormElement
    let createForm: HTMLFormElement

    let modalTitle = 'Добавить данные о работе доменной печи'

    export let data: PageData

    let defaultState: IFurnaceBase = data.default
    let dailes: IFurnaceBase[] = data.dailes

    let selectedFurnace: string
    let selectedDate: string = new Date().toISOString().split('T')[0]

    let furnaces: IFurnaceBase[] = data.furnaces
    let authorized: boolean = data.authorized

    let errorMessage: string
    let successMessage: string

    let loaderShow = false
    let notifyVisible = false

    let token: any = null

    onMount(() => token = getCookie('token'))

    console.log(dailes)

    let deleteDayInfoId: string
    const showConfirmDeleteModal = (currentDayInfoId: string) => {
        deleteDayInfoId = currentDayInfoId
        confirmDeleteModal.open()
    }

    const confirmDeleteHandler = async (dayInfoId: string) => {
        confirmDeleteModal.close()
        await deleteDayInfo(dayInfoId)
    }

    const deleteDayInfo = async (dayInfoId: string) => {
        if (!isGuidNullOrEmpty(dayInfoId)) {
            const token = getCookie('token')
            try {
                loaderShow = true
                const response = await axios.delete(`${API_URL}/daily/${dayInfoId}`, { headers: { 'Authorization': `Bearer ${token}` } })
                const responseResult: IResponse = response.data
                errorMessage = ''
                successMessage = responseResult.successMessage
                notifyVisible = true
                loaderShow = false

                dailes = dailes.filter(daily => daily.id !== dayInfoId)
                createModal.close()

                setTimeout(() => {
                    notifyVisible = false
                }, 2500)
            } catch (error) {
                successMessage = ''
                errorMessage = error.response.data.errorMessage
                console.log(`Не удалось удалить посуточную информацию о работе ДП: ${error}`)

                loaderShow = false
                setTimeout(() => {
                    notifyVisible = false
                }, 2500)
            }
        }
    }

    const successHandler = (e) => {
        if (isGuidNullOrEmpty(currentDayInfo.id)) {
            dailes = [ ...dailes, e.detail.result.result ]
            createModal.close()
        }
        successMessage = e.detail.result.successMessage
        notifyVisible = true
        setTimeout(() => {
            notifyVisible = false
        }, 2500)
    }

    let currentDayInfo: IFurnaceBase = defaultState
    let dailyInfoOpened = false

    const openModalForDay = async (dailyId: string) => {
        const response = await axios.get(`${API_URL}/daily/${dailyId}`, { headers: { 'Authorization': `Bearer ${token}` } })
        const responseResult: IResponse = response.data

        currentDayInfo = responseResult.result
        selectedDate = currentDayInfo.day.split('T')[0]
        selectedFurnace = furnaces.find(furnace => furnace.id == currentDayInfo.furnaceId).id
        modalTitle = `Данные о работе доменной печи №${furnaces.find(f => f.id == currentDayInfo.furnaceId).numberOfFurnace} за ${dayjs(currentDayInfo.day).format('DD.MM.YYYY')}`
        dailyInfoOpened = true
        createModal.open()
    }

    const addDailyInfoHandler = () => {
        modalTitle = 'Добавить данные о работе доменной печи'
        currentDayInfo = defaultState
        selectedFurnace = furnaces?.length > 0 ? furnaces[0].id : NIL_UUID
        selectedDate = new Date().toISOString().split('T')[0]
        dailyInfoOpened = false
        createModal.open()
    }
</script>

<svelte:head>
	<title>TeploClient: Посуточная информация о печах</title>
</svelte:head>

<Modal zIndex="1062" bind:this={confirmDeleteModal} title="Подтвердите удаление" on:confirm={() => confirmDeleteHandler(deleteDayInfoId)}>
    <p>Вы действительно хотите удалить данные о работе печи за эти сутки?</p>
</Modal>

<Modal hasFooter={false} size="modal-xl" bind:this={createModal} title={modalTitle}>
    <NewForm path="{API_URL}/daily" on:success={successHandler}>
        {#if selectedFurnace !== null}
            <input type="string" name="furnaceId" value={selectedFurnace} hidden>
        {/if}
        <div class="d-flex">
            <div class="me-3">
                {#if furnaces?.length > 0}
                    <p class="lead mb-2">Доменная печь</p>
                    <select class="form-select mb-3" bind:value={selectedFurnace} aria-label="Default select example" disabled={dailyInfoOpened}>
                        {#each furnaces as furnace}
                            <option value={furnace.id} selected={defaultState.furnaceId == furnace.id}>
                                ДП №{furnace.numberOfFurnace}
                            </option>
                        {/each}
                    </select>
                {/if}
            </div>
            <div>
                <p class="lead mb-2">Сутки</p>
                <input class="form-control" bind:value={selectedDate} type="date" disabled={dailyInfoOpened}>
                <input type="string" name="day" value={selectedDate} hidden>
            </div>
        </div>
        {#if !isGuidNullOrEmpty(currentDayInfo.id)}
            <button type="button" class="btn btn-outline-danger btn-sm" on:click={() => showConfirmDeleteModal(currentDayInfo.id)}>Удалить данные за эти сутки</button>
        {/if}
        <div class="d-flex align-items-start">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Параметр</th>
                        <th scope="col">Значение</th>
                    </tr>
                </thead>
                <tbody>
                    {#each FURNACE_FIELDS.slice(0, FURNACE_FIELDS.length - 11 / 2) as field, i}
                        {#if i > 11}
                            <tr>
                                <td>{field.description}</td>
                                <td>
                                    <input type="text" class="form-control" name={field.name} value={currentDayInfo ? currentDayInfo[field.name] : 0} autocomplete="off" required>
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
                                <input type="text" class="form-control" name={field.name} value={defaultState ? defaultState[field.name] : 0} autocomplete="off" required>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <button class="btn btn-success">Сохранить</button>
    </NewForm>
</Modal>

<div class="container">
    <p class="h3 mb-3">Посуточная информация о работе доменных печей</p>
    {#if authorized}
        <div class="d-flex align-items-center mb-3">
            {#if loaderShow}
                <div class="spinner-border" role="status" transition:fade>
                    <span class="visually-hidden">Loading...</span>
                </div>
            {/if}
        </div>
        {#if dailes?.length > 0}
            {#each furnaces as furnace}
                <p class="h6">Доменная печь №{furnace.numberOfFurnace}</p>
                <div class="d-flex mb-3">
                    {#each dailes as daily}
                        {#if daily.furnaceId == furnace.id}
                            <button on:click={() => openModalForDay(daily.id)} class="btn btn-outline-secondary me-2">{dayjs(daily.day).format('DD.MM.YYYY')}</button>
                        {/if}
                    {/each}
                    {#if !dailes.find(d => d.furnaceId == furnace.id)}
                        <div class="d-flex mb-3">
                            <p>Посуточная информация отсутствует</p>
                        </div>
                    {/if}
                </div>
            {/each}
        {:else}
            {#each furnaces as furnace}
                <p class="h6">Доменная печь №{furnace.numberOfFurnace}</p>
                <div class="d-flex mb-3">
                    <p>Посуточная информация отсутствует</p>
                </div>
            {/each}
        {/if}
        <button type="button" class="btn btn-outline-primary" on:click={addDailyInfoHandler}>Добавить данные</button>
     {:else}
        <p>Справочник посуточной доступен только для авторизированных пользователей</p>
    {/if}
</div>

{#if successMessage}
    {#if notifyVisible}
        <div class="notify" transition:fade>
            <Toast variant="green">{successMessage}</Toast>
        </div>
    {/if}
{/if}
{#if errorMessage}
    {#if notifyVisible}
    <div class="notify" transition:fade>
        <Toast variant="error">{errorMessage}</Toast>
    </div>
    {/if}
{/if}

<style>
</style>