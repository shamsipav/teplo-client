<script lang='ts'>
    import axios from 'axios'
    import 'dayjs/locale/ru'
    import dayjs from 'dayjs'
    import type { IModal, IUser } from '$lib/types'
    import { Modal, NewForm, Toast } from '$components'
    import { API_URL } from '$lib/consts'
    import type { PageData } from './$types'
    import { getCookie, logout } from '$lib/utils'
    import { fade } from 'svelte/transition'

    dayjs.locale('ru')

    export let data: PageData

    let user: IUser = data.user

    let loginModal: IModal = undefined

    let showDropdown = false

    let successMessage = ''

    const authentificate = async () => {
        successMessage = 'Вход в аккаунт выполнен'
        const token = getCookie('token')
        try {
            const response = await axios.get(`${API_URL}/auth/user`, { headers: { 'Authorization': `Bearer ${token}` } })
            user = response.data
        } catch(error) {
            // Не нужно обрабатывать
            user = undefined
        }

        setTimeout(() => loginModal.close(), 500)
        setTimeout(() => successMessage = '', 2500)
    }

    const logoutHandler = () => {
        logout()
        successMessage = 'Выход из аккаунта выполнен'
        setTimeout(() => user = undefined, 250)
        setTimeout(() => successMessage = '', 2500)
    }
</script>

<Modal bind:this={loginModal} hasFooter={false} title="Вход">
    <NewForm path="{API_URL}/auth/login" on:success={authentificate}>
        <div class="form-floating mb-3">
            <input type="email" name="email" class="form-control" id="email" placeholder="name@example.com">
            <label for="email">Email</label>
        </div>
        <div class="form-floating">
            <input type="password" name="password" class="form-control" id="password" placeholder="Password">
            <label for="password">Пароль</label>
        </div>
        <button class="btn btn-primary mt-3">Войти</button>
    </NewForm>
</Modal>

<nav class="navbar navbar-expand-lg bg-body-tertiary mb-3">
    <div class="container">
        <a class="navbar-brand" href="/">Teplo Client</a>
        <div class="collapse navbar-collapse">
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link" href="/comparison">Сопоставление</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/project">Проектный режим</a>
                </li>
                <li class="nav-item dropdown">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <a class="nav-link dropdown-toggle" href="" on:click={() => showDropdown = !showDropdown}>Справочники</a>
                    <ul class="dropdown-menu" class:show={showDropdown}>
                        <li class="nav-item">
                            <a class="dropdown-item" href="/reference" on:click={() => showDropdown = false}>Справочник корректировочных коэффициентов</a>
                        </li>
                        <li class="nav-item">
                            <a class="dropdown-item" href="/materials" on:click={() => showDropdown = false}>Справочник шихтовых материалов</a>
                        </li>
                    </ul>
                </li>
            </ul>
            {#if user}
                <a href="/lk" class="link-primary mb-0 me-3">{user.firstName}</a>
                <button type="button" class="btn btn-outline-secondary btn-sm" on:click={logoutHandler}>Выйти</button>
            {:else}
                <button type="button" class="btn btn-outline-primary btn-sm" on:click={loginModal.open}>Войти</button>
            {/if}
        </div>
    </div>
</nav>

<main>
    <slot />
    {#if successMessage}
       <div class="notify" transition:fade>
           <Toast>{successMessage}</Toast>
       </div>
    {/if}
</main>

<footer>
    <div class="container">
        <p class="mt-5 mb-3 text-center">Copyright © {new Date().getFullYear()} | TeploAPI by Pavel Shamsimukhametov</p>
    </div>
</footer>

<style>

</style>
