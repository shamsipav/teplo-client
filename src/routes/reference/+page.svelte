<script lang="ts">
    import axios from 'axios'
    import { API_URL, REFERENCE_FIELDS } from '$lib/consts'
    import type { IReference } from '$lib/types'
    import { page } from '$app/stores'
    import { filter, removeKeyNames } from '$lib/utils'
    import { fade } from 'svelte/transition'
    import { Toast } from '$components';

    let form
    
    let reference: IReference = $page.data.reference

    let errorMessage: string
    let successMessage: string

    let loaderShow = false
    let notifyVisible = false

    const updateReferene = async (e) => {
        const formData = new FormData(e.target)
        const data:any = {}
        formData.forEach((value, key) => data[key] = value)

        let cokeFiltered = filter(data, ([key, _]) => key.startsWith('cokeCunsumptionCoefficents'))
        let cokeObject = removeKeyNames(cokeFiltered)

        let furnaceFiltered = filter(data, ([key, _]) => key.startsWith('furnanceCapacityCoefficents'))
        let furnaceObject = removeKeyNames(furnaceFiltered)

        let referenceObject = {
            cokeCunsumptionCoefficents: cokeObject,
            furnanceCapacityCoefficents: furnaceObject
        }

        try {
            loaderShow = true
            const response = await axios.post(`${API_URL}/reference`, referenceObject)
            reference = response.data
            errorMessage = ''
            successMessage = 'Изменения успешно применены'
            notifyVisible = true
            loaderShow = false

            setTimeout(() => {
                notifyVisible = false
            }, 2500)
        } catch (error) {
            successMessage = ''
            errorMessage = error.response.data
            console.log(`Не удалось обновить справочник корректировочных коэффициентов: ${error}`)
            loaderShow = false
            setTimeout(() => {
                notifyVisible = false
            }, 2500)
        }
    }
</script>

<div class="container">
    <p class="h3 mb-3">Cправочник корректировочных коэффициентов</p>
    <!-- TODO: Заменить булевый пропс на что-то более универсальное -->
    <form on:submit|preventDefault={updateReferene} bind:this={form}>
        <div class="d-flex align-items-center mb-3">
            <p class="lead me-3 mb-1">Изменения применяются автоматически</p>
            {#if loaderShow}
                <div class="spinner-border" role="status" transition:fade>
                    <span class="visually-hidden">Loading...</span>
                </div>
            {/if}
        </div>
        {#if errorMessage}
            <p class="text-danger" transition:fade>{errorMessage}</p>
        {/if}
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Фактор</th>
                    <th scope="col">Изменение расхода кокса, %</th>
                    <th scope="col">Изменение производительности печи, %</th>
                </tr>
            </thead>
            <tbody>
                {#each REFERENCE_FIELDS as field}
                    <tr>
                        <td>{field.description}</td>
                        <td>
                            <input 
                                type="text" 
                                class="form-control" 
                                name={'cokeCunsumptionCoefficents.' + field.name} 
                                value={reference.cokeCunsumptionCoefficents[`${field.name}`]} 
                                autocomplete="off" 
                                required
                                on:change={() => form.requestSubmit()}
                            >
                        </td>
                        <td>
                            <input 
                                type="text" 
                                class="form-control" 
                                name={'furnanceCapacityCoefficents.' + field.name} 
                                value={reference.furnanceCapacityCoefficents[`${field.name}`]} 
                                autocomplete="off" 
                                required
                                on:change={() => form.requestSubmit()}
                            >
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </form>
</div>

{#if successMessage}
    {#if notifyVisible}
        <div class="notify" transition:fade>
            <Toast>{successMessage}</Toast>
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