<script lang="ts">
    import dayjs from 'dayjs'
    import { page } from '$app/stores'
    import { Form } from '$components'
    import { API_URL, FURNACE_FIELDS } from '$lib/consts'
    import type { IFurnace } from '$lib/types'
    import axios from 'axios'

    let defaultState = $page.data.default
    let variants: IFurnace[] = $page.data.variants
    let saveVariant = false

    let selectedVariant

    const getCurrentVariant = (selectedVariant: number) => {
        defaultState = variants.find(x => x.id == selectedVariant)
        saveVariant = false
    }

    const getVariants = async () => {
        try {
            const response = await axios.get(`${API_URL}/furnace`)
            variants = response.data
        } catch (error) {
            console.log(`Не удалось обновить варианты исходных данных: ${error}`)
        }
    }
</script>

<div class="container">
    <p class="h3 mb-3">Расчет базового периода</p>
    <p class="lead mb-2">Вариант исходных данных</p>
    <select class="form-select mb-3" bind:value={selectedVariant} aria-label="Default select example" on:change={() => getCurrentVariant(selectedVariant)}>
        <option selected disabled>Вариант исходных данных</option>
        <option selected>По умолчанию</option>
        {#each variants as variant}
            <option value={variant.id}>
                Вариант №{variant.id} от {variant.saveDate ? dayjs(variant.saveDate).format('DD.MM.YYYY HH:mm:ss') : 'неизвестной даты'}
            </option>
        {/each}
      </select>
    <Form path="{API_URL}/base" on:success={getVariants}>
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
                            <input type="text" class="form-control" name={field.name} value={defaultState[`${field.name}`]} autocomplete="off" required>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
        <div class="d-flex align-items-center">
            <button type="submit" class="btn btn-primary me-3">Отправить</button>
            <div class="form-check" on:click={() => saveVariant = !saveVariant}>
                <input name="save" class="form-check-input" type="checkbox" value={saveVariant} checked={saveVariant} on:change={() => saveVariant = !saveVariant}>
                <label class="form-check-label">Сохранить вариант исходных данных</label>
            </div>
        </div>
    </Form>
</div>
