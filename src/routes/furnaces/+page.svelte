<script lang="ts">
    import axios, { type AxiosResponse } from 'axios'
    // @ts-ignore
    import type { PageData } from './$types'
    import type { IModal, IResponse, IFurnaceBase } from '$lib/types'
    import { API_URL, FURNACE_FIELDS} from '$lib/consts'
    import { Toast, Modal } from '$components'
    import { fade } from 'svelte/transition'
    import { getCookie, isGuidNullOrEmpty } from '$lib/utils'

    let confirmDeleteModal: IModal

    let updateForm: HTMLFormElement
    let createForm: HTMLFormElement

    export let data: PageData

    let furnaces: IFurnaceBase[] = data.furnaces
    let authorized: boolean = data.authorized

    let errorMessage: string
    let successMessage: string

    let loaderShow = false
    let notifyVisible = false
    
    let isNewFurnaceAdded = false

    const updateOrCreateFurnace = async (e) => {
        const formData = new FormData(e.target)
        const data:any = {}
        formData.forEach((value, key) => data[key] = value)

        const token = getCookie('token')

        try {
            loaderShow = true
            let response: AxiosResponse<any, any> = undefined
            let responseResult: IResponse = undefined
            if (!isGuidNullOrEmpty(data.id)) {
                response = await axios.put(`${API_URL}/furnace`, data, { headers: { 'Authorization': `Bearer ${token}` } })
                responseResult = response.data
                const furnace: IFurnaceBase = responseResult.result
                const currentIndex = furnaces.findIndex(x => x.id == furnace.id)
                furnaces[currentIndex] = furnace
            } else {
                response = await axios.post(`${API_URL}/furnace`, data, { headers: { 'Authorization': `Bearer ${token}` } })
                responseResult = response.data

                isNewFurnaceAdded = false

                if (furnaces) furnaces = [ ...furnaces, responseResult.result ]
                else furnaces = [ responseResult.result ]
            }

            errorMessage = ''
            successMessage = responseResult.successMessage
            notifyVisible = true
            loaderShow = false

            setTimeout(() => {
                notifyVisible = false
            }, 2500)
        } catch (error) {
            notifyVisible = true
            successMessage = ''
            errorMessage = error.response.data.errorMessage
            if (data.id == 0) {
                console.log(`Не удалось обновить справочник печей: ${error}`)
            } else {
                console.log(`Не удалось добавить печь в справочник печей: ${error}`)
            }

            loaderShow = false
            setTimeout(() => {
                notifyVisible = false
            }, 2500)
        }
    }

    let deleteFurnaceNumber: number
    let deleteFurnaceId: string
    const showConfirmDeleteModal = (furnace: IFurnaceBase) => {
        deleteFurnaceNumber = furnace.numberOfFurnace
        deleteFurnaceId = furnace.id
        confirmDeleteModal.open()
    }

    const confirmDeleteHandler = async (furnaceId: string) => {
        confirmDeleteModal.close()
        await deleteFurnace(furnaceId)
    }

    const deleteFurnace = async (furnaceId: string) => {
        if (!isGuidNullOrEmpty(furnaceId)) {
            const token = getCookie('token')
            try {
                loaderShow = true
                const response = await axios.delete(`${API_URL}/furnace/${furnaceId}`, { headers: { 'Authorization': `Bearer ${token}` } })
                const responseResult: IResponse = response.data
                errorMessage = ''
                successMessage = responseResult.successMessage
                notifyVisible = true
                loaderShow = false

                furnaces = furnaces.filter(material => material.id !== furnaceId)

                setTimeout(() => {
                    notifyVisible = false
                }, 2500)
            } catch (error) {
                successMessage = ''
                errorMessage = error.response.data.errorMessage
                console.log(`Не удалось удалить печь из справочника печей: ${error}`)

                loaderShow = false
                setTimeout(() => {
                    notifyVisible = false
                }, 2500)
            }
        }
    }
</script>

<svelte:head>
	<title>TeploClient: Печи</title>
</svelte:head>

<Modal bind:this={confirmDeleteModal} title="Подтвердите удаление" on:confirm={() => confirmDeleteHandler(deleteFurnaceId)}>
    <p>Вы действительно хотите удалить печь №{deleteFurnaceNumber}?</p>
</Modal>

<form on:submit|preventDefault={updateOrCreateFurnace} bind:this={updateForm} id="updateForm" hidden></form>
<form on:submit|preventDefault={updateOrCreateFurnace} bind:this={createForm} id="createForm" hidden></form>

<div class="container">
    <p class="h3 mb-3">Справочник доменных печей</p>
    {#if authorized}
        <div class="d-flex align-items-center mb-3">
            <p class="lead me-3 mb-1">Изменения применяются автоматически</p>
            {#if loaderShow}
                <div class="spinner-border" role="status" transition:fade>
                    <span class="visually-hidden">Loading...</span>
                </div>
            {/if}
        </div>
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        {#each FURNACE_FIELDS as field, i}
                            {#if i <= 11}
                                <th scope="col">{field.description}</th>
                            {/if}
                        {/each}
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {#if furnaces?.length > 0}
                        {#each furnaces as furnace}
                            <tr>
                                <input form="updateForm" name="id" type="text" value={furnace.id} hidden>
                                {#each FURNACE_FIELDS as field, i}
                                    {#if i <= 11}
                                        <td>
                                            <input form="updateForm" type="text" class="form-control" name={field.name} value={furnace[`${field.name}`]} autocomplete="off" required on:change={() => updateForm.requestSubmit()}>
                                        </td>
                                    {/if}
                                {/each}
                                <td>
                                    <button type="button" class="btn btn-outline-danger btn-sm" on:click={() => showConfirmDeleteModal(furnace)}>Удалить</button>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                    {#if isNewFurnaceAdded}
                        <tr transition:fade>
                            {#each FURNACE_FIELDS as field, i}
                                {#if i <= 11}
                                    <td>
                                        <input form="createForm" type="text" class="form-control" name={field.name} autocomplete="off" required>
                                    </td>
                                {/if}
                            {/each}
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
        {#if isNewFurnaceAdded}
            <button type="button" class="btn btn-outline-success" on:click={() => createForm.requestSubmit()}>Сохранить</button>
            <button type="button" class="btn btn-outline-secondary" on:click={() => isNewFurnaceAdded = false}>Отмена</button>
        {:else}
            <button type="button" class="btn btn-outline-primary" on:click={() => isNewFurnaceAdded = true}>Добавить</button>
        {/if}
        {#if furnaces.length == 0 && !isNewFurnaceAdded}
            <p class="mt-3" transition:fade>В справочнике еще печей</p>
        {/if}
    {:else}
        <p>Справочник печей доступен только для авторизированных пользователей</p>
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