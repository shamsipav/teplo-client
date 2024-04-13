<script lang='ts'>
    import 'dayjs/locale/ru'
    import dayjs from 'dayjs'
    import type { IModal, IUser } from '$lib/types'
    import { Modal, NewForm, Toast } from '$components'
    import { API_URL } from '$lib/consts'
    import type { PageData } from './$types'
    import { logout } from '$lib/utils'
    import { fade } from 'svelte/transition'
    import { clickOutside } from '$lib/actions'

    dayjs.locale('ru')

    export let data: PageData

    let user: IUser = data.user

    let loginModal: IModal = undefined
    let registerModal: IModal = undefined

    let showDropdown = false

    let successMessage = ''

    const authentificate = async () => {
        successMessage = 'Вход в аккаунт выполнен'
    }

    const registration = async () => {
        successMessage = 'Успешная регистрация'
        setTimeout(() => registerModal.close(), 1000)
        loginModal.open()
    }
</script>

<Modal bind:this={loginModal} hasFooter={false} title="Вход">
    <NewForm path="{API_URL}/auth/login" on:success={authentificate} redirectTo="/">
        <div class="form-floating mb-3">
            <input type="email" name="email" class="form-control" id="email" placeholder="Email" required>
            <label for="email">Email</label>
        </div>
        <div class="form-floating">
            <input type="password" name="password" class="form-control" id="password" placeholder="Пароль" required>
            <label for="password">Пароль</label>
        </div>
        <button class="btn btn-success mt-3">Войти</button>
    </NewForm>
</Modal>

<Modal bind:this={registerModal} hasFooter={false} title="Регистрация">
    <NewForm path="{API_URL}/auth/signup" on:success={registration}>
        <div class="form-floating mb-3">
            <input type="text" name="firstName" class="form-control" id="firstName" placeholder="Имя" required>
            <label for="firstName">Имя</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" name="lastName" class="form-control" id="lastName" placeholder="Фамилия" required>
            <label for="lastName">Фамилия</label>
        </div>
        <div class="form-floating mb-3">
            <input type="email" name="email" class="form-control" id="email" placeholder="Email" required>
            <label for="email">Email</label>
        </div>
        <div class="form-floating">
            <input type="password" name="password" class="form-control" id="password" placeholder="Пароль" required>
            <label for="password">Пароль</label>
        </div>
        <button class="btn btn-success mt-3">Регистрация</button>
    </NewForm>
</Modal>

<nav class="navbar navbar-expand-lg bg-body-tertiary mb-3">
    <div class="container">
        <a class="navbar-brand" href="/">
            <img src="/img/urfu-logo.png" alt="" height="32" class="d-inline-block align-text-top me-2">
            <img src="/img/tim-logo.png" alt="" height="32" class="d-inline-block align-text-top me-2">
            TeploClient
          </a>
        <div class="collapse navbar-collapse">
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link" href="/base">Базовый режим</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/comparison">Сопоставление</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/project">Проектный режим</a>
                </li>
                <li class="nav-item dropdown">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <a class="nav-link dropdown-toggle" href="" on:click={() => showDropdown = !showDropdown} use:clickOutside={() => showDropdown = false}>Справочники</a>
                    <ul class="dropdown-menu" class:show={showDropdown}>
                        <li class="nav-item">
                            <a class="dropdown-item" href="/daily" on:click={() => showDropdown = false}>Посуточная информация о печах</a>
                        </li>
                        <li class="nav-item">
                            <a class="dropdown-item" href="/furnaces" on:click={() => showDropdown = false}>Справочник доменных печей</a>
                        </li>
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
                <a href="/lk" class="link-bold mb-0 me-3">{user.firstName}</a>
                <button type="button" class="btn btn-outline-secondary btn-sm" on:click={logout}>Выйти</button>
            {:else}
                <button type="button" class="btn btn-success btn-sm me-2" on:click={loginModal.open}>Войти</button>
                <button type="button" class="btn btn-outline-success btn-sm" on:click={registerModal.open}>Регистрация</button>
            {/if}
        </div>
    </div>
</nav>

<main>
    <slot />
    {#if successMessage}
       <div class="notify" transition:fade>
           <Toast variant="green">{successMessage}</Toast>
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
