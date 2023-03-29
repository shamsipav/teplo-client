<script lang='ts'>
    import 'dayjs/locale/ru'
    import dayjs from 'dayjs'
    dayjs.locale('ru')
</script>

<nav class="navbar navbar-expand-lg bg-body-tertiary mb-3">
    <div class="container">
        <a class="navbar-brand" href="/">Teplo Client</a>
        <div class="collapse navbar-collapse">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="/comparison">Сопоставление</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/project">Проектный режим</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/reference">Справочник корректировочных коэффициентов</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<main>
    <slot />
</main>

<footer>
    <p class="mt-5 mb-5 text-center">Copyright © {new Date().getFullYear()} | TeploAPI by Pavel Shamsimukhametov</p>
</footer>

<style>

</style>
