<script lang="ts">
    import { page } from '$app/stores'
    import { Form } from "$components";
    import { API_URL, FURNACE_FIELDS } from "$lib/consts";
    import type { IFurnace } from '$lib/types';

    let defaultState: IFurnace = $page.data.default;
</script>

<div class="container">
    <p class="h3 mb-3">Расчет базового периода</p>
    <Form path="{API_URL}/base">
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
        <button type="submit" class="btn btn-primary">Отправить</button>
    </Form>
</div>
