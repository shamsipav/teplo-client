<script lang="ts">
    import { page } from '$app/stores'
    import { Form } from "$components";
    import { API_URL, FURNACE_FIELDS } from "$lib/consts";
    import type { IFurnace } from '$lib/types';

    let defaultState: IFurnace = $page.data.default;
</script>

<div class="container">
    <p class="mb-3">Форма для тестирования базового периода</p>
    <Form path="{API_URL}/base">
        {#each FURNACE_FIELDS as field}
            <div class="mb-3">
                <label class="form-label">{field.description}</label>
                <input type="text" class="form-control" name={field.name} value={defaultState[`${field.name}`]} autocomplete="off" required>
                <!-- <div class="form-text">We'll never share your email with anyone else.</div> -->
            </div>
        {/each}
        <button type="submit" class="btn btn-primary">Отправить</button>
    </Form>
</div>
