<script lang="ts">
    export let text = ''
</script>

<header class="header">
    <div class="container">
        <a data-sveltekit-preload-data="hover" href="/" class="header__logo">
            <img class="logo" src="/img/icons/round-logo.svg" alt="logo">            
        </a>
        <a data-sveltekit-preload-data="hover" href="/" class="header__text">{text}</a>
        <nav class="menu">
            <ul>
                <li><a data-sveltekit-preload-data="hover" class="menu__link" href="/">About</a></li>
                <li><a data-sveltekit-preload-data="hover" class="menu__link" href="/projects">Projects</a></li>
                <li><a data-sveltekit-preload-data="hover" class="menu__link" href="/contact">Contact</a></li>
              </ul>
        </nav>
    </div>
</header>

<style>
    .header {
        font-family: Italiana;
        padding: 1em 0 3em 0;
    }

    .header .container {
        text-align: center;
    }

    .header__logo {
        display: inline-block;
        margin-bottom: 32px;
    }

    .header__text {
        display: block;
        font-size: 3em;
        margin-bottom: 32px;    
    }

    .menu {
        display: flex;
        justify-content: center;
    }

    .menu ul {
        display: flex;
    }

    .menu li:not(:last-child) {
        margin-right: 3em;
    }

    .menu__link {
        opacity: 0.6;
        transition: 0.16s;
    }

    .menu__link:hover {
        opacity: 1;
    }
</style>