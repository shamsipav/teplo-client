<script lang="ts">
    import dayjs from 'dayjs'
    import type { IUser } from '$lib/types'
    import type { PageData } from './$types'

    export let data: PageData

    let user: IUser = data.user
</script>

{#if user}
    <div class="container">
        <p class="h3 mb-4">Личный кабинет пользователя</p>
        <dl class="row">
            <dt class="col-sm-3">Имя</dt>
            <dd class="col-sm-9">{user.firstName}</dd>
            <dt class="col-sm-3">Фамилия</dt>
            <dd class="col-sm-9">{user.lastName}</dd>
            <dt class="col-sm-3">Email</dt>
            <dd class="col-sm-9">{user.email}</dd>
            <dt class="col-sm-3">Дата последнего входа</dt>
            <dd class="col-sm-9">{dayjs(user.lastLoginDate).format('DD.MM.YYYY HH:mm:ss')}</dd>
          </dl>
    </div>
{/if}

<style>
</style>