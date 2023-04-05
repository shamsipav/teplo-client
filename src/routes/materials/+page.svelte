<script lang="ts">
    import axios, { type AxiosResponse } from 'axios'
    import type { PageData } from './$types'
    import type { IMaterial, IModal, IResponse } from '$lib/types'
    import { API_URL, MATERIAL_FIELDS } from '$lib/consts'
    import { Toast, Modal } from '$components'
    import { fade } from 'svelte/transition'

    let confirmDeleteModal: IModal

    let updateForm: HTMLFormElement
    let createForm: HTMLFormElement

    export let data: PageData

    let materials: IMaterial[] = data.materials

    let errorMessage: string
    let successMessage: string

    let loaderShow = false
    let notifyVisible = false
    
    let isNewMaterialAdded = false

    const updateOrCreateMaterial = async (e) => {
        const formData = new FormData(e.target)
        const data:any = {}
        formData.forEach((value, key) => data[key] = value)

        try {
            loaderShow = true
            let response: AxiosResponse<any, any> = undefined
            let responseResult: IResponse = undefined
            if (data.id > 0) {
                response = await axios.put(`${API_URL}/material`, data)
                responseResult = response.data
                const material: IMaterial = responseResult.result
                const currentIndex = materials.findIndex(x => x.id == material.id)
                materials[currentIndex] = material
            } else {
                response = await axios.post(`${API_URL}/material`, data)
                responseResult = response.data

                isNewMaterialAdded = false

                if (materials) materials = [ ...materials, responseResult.result ]
                else materials = [ responseResult.result ]
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
                console.log(`Не удалось обновить справочник шихтовых материалов: ${error}`)
            } else {
                console.log(`Не удалось добавить материал в справочник шихтовых материалов: ${error}`)
            }

            loaderShow = false
            setTimeout(() => {
                notifyVisible = false
            }, 2500)
        }
    }

    let deleteMaterialName: string
    let deleteMaterialId: number
    const showConfirmDeleteModal = (material: IMaterial) => {
        deleteMaterialName = material.name
        deleteMaterialId = material.id
        confirmDeleteModal.open()
    }

    const confirmDeleteHandler = async (materialId: number) => {
        confirmDeleteModal.close()
        await deleteMaterial(materialId)
    }

    const deleteMaterial = async (materialId: number) => {
        if (materialId !== 0) {
            try {
                loaderShow = true
                const response = await axios.delete(`${API_URL}/material/${materialId}`)
                const responseResult: IResponse = response.data
                errorMessage = ''
                successMessage = responseResult.successMessage
                notifyVisible = true
                loaderShow = false

                materials = materials.filter(material => material.id !== materialId)

                setTimeout(() => {
                    notifyVisible = false
                }, 2500)
            } catch (error) {
                successMessage = ''
                errorMessage = error.response.data.errorMessage
                console.log(`Не удалось удалить материал из справочника шихтовых материалов: ${error}`)

                loaderShow = false
                setTimeout(() => {
                    notifyVisible = false
                }, 2500)
            }
        }
    }
</script>

<svelte:head>
	<title>TeploClient: Материалы</title>
</svelte:head>

<Modal bind:this={confirmDeleteModal} title="Подтвердите удаление" on:confirm={() => confirmDeleteHandler(deleteMaterialId)}>
    <p>Вы действительно хотите удалить материал '{deleteMaterialName}'?</p>
</Modal>

<form on:submit|preventDefault={updateOrCreateMaterial} bind:this={updateForm} id="updateForm" hidden></form>
<form on:submit|preventDefault={updateOrCreateMaterial} bind:this={createForm} id="createForm" hidden></form>

<div class="container">
    <p class="h3 mb-3">Справочник шихтовых материалов</p>
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
                    {#each MATERIAL_FIELDS as field}
                        <th scope="col">{field.description}</th>
                    {/each}
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {#if materials?.length > 0}
                    {#each materials as material}
                        <tr>
                            <input form="updateForm" name="id" type="text" value={material.id} hidden>
                            {#each MATERIAL_FIELDS as field}
                                <td>
                                    <input form="updateForm" type="text" class="form-control" name={field.name} value={material[`${field.name}`]} autocomplete="off" required on:change={() => updateForm.requestSubmit()}>
                                </td>
                            {/each}
                            <td>
                                <button type="button" class="btn btn-outline-danger btn-sm" on:click={() => showConfirmDeleteModal(material)}>Удалить</button>
                            </td>
                        </tr>
                    {/each}
                {/if}
                {#if isNewMaterialAdded}
                    <tr transition:fade>
                        {#each MATERIAL_FIELDS as field}
                            {#if field.name == 'baseOne'}
                                <td></td>
                            {:else}
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
    {#if isNewMaterialAdded}
        <button type="button" class="btn btn-outline-success" on:click={() => createForm.requestSubmit()}>Сохранить</button>
        <button type="button" class="btn btn-outline-secondary" on:click={() => isNewMaterialAdded = false}>Отмена</button>
    {:else}
        <button type="button" class="btn btn-outline-primary" on:click={() => isNewMaterialAdded = true}>Добавить</button>
    {/if}
    {#if materials.length == 0 && !isNewMaterialAdded}
        <p class="mt-3" transition:fade>В справочнике еще нет материалов</p>
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