<script lang="ts">
    import axios from 'axios'
    import dayjs from 'dayjs'
    import { Form } from '$components'
    import { API_URL, FURNACE_FIELDS } from '$lib/consts'
    import type { IFurnace, IUser } from '$lib/types'
    import type { PageData } from './$types'
    import { getCookie } from '$lib/utils';

    export let data: PageData

    let user: IUser = data.user
    let defaultState = data.default
    let variants: IFurnace[] = data.variants
    let saveVariant = false

    let selectedVariant

    const getCurrentVariant = (selectedVariant: number) => {
        defaultState = selectedVariant == 0 ? data.default : variants.find(x => x.id == selectedVariant)
        saveVariant = false
    }

    const getVariants = async () => {
        try {
            const token = getCookie('token')
            if (token) {
                const response = await axios.get(`${API_URL}/furnace/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } })
                variants = response.data
            } else {
                console.log('Не удалось получить токен для обновления списка вариантов')
            }
        } catch (error) {
            console.log(`Не удалось обновить варианты исходных данных: ${error}`)
        }
    }
</script>

<div class="container">
    <p class="h3 mb-3">Расчет базового периода</p>
    {#if user}
        {#if variants?.length > 0}
            <p class="lead mb-2">Вариант исходных данных</p>
            <select class="form-select mb-3" bind:value={selectedVariant} aria-label="Default select example" on:change={() => getCurrentVariant(selectedVariant)}>
                <option selected disabled>Вариант исходных данных</option>
                <option selected value="0">По умолчанию</option>
                {#each variants as variant}
                    <option value={variant.id}>
                        Вариант №{variant.id} от {variant.saveDate ? dayjs(variant.saveDate).format('DD.MM.YYYY HH:mm:ss') : 'неизвестной даты'}
                    </option>
                {/each}
            </select>
        {/if}
    {/if}
    <Form path="{API_URL}/base" on:success={saveVariant ? getVariants : undefined}>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Параметр</th>
                    <th scope="col">Значение</th>
                </tr>
            </thead>
            <tbody>
                {#each FURNACE_FIELDS as field}
                    <tr>
                        <td>{field.description}</td>
                        <td>
                            <input type="text" class="form-control" name={field.name} value={defaultState ? defaultState[`${field.name}`] : 0} autocomplete="off" required>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
        <div class="d-flex align-items-center">
            <button type="submit" class="btn btn-warning me-3">Отправить</button>
            {#if user}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="form-check" on:click={() => saveVariant = !saveVariant}>
                    <input name="save" class="form-check-input" type="checkbox" value={saveVariant} checked={saveVariant}>
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="form-check-label">Сохранить вариант исходных данных</label>
                </div>
            {/if}
        </div>
    </Form>
</div>
