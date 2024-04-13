<script lang="ts">
     import { onMount } from 'svelte'
     import 'intro.js/introjs.css'
     import introJs from 'intro.js'
     
     onMount(() => {
         const intro = introJs()
         intro.setOptions({
             steps: [
                 {
                     title: 'Welcome',
                     intro: 'Welcome to the tutorial',
                 },
                 {
                     element: document.querySelector('#step1'),
                     intro: 'This is step 1',
                 },
                 {
                     element: document.querySelector('#step2'),
                     intro: 'This is step 2',
                 }
             ]
         })
         intro.setOption('dontShowAgain', false)
         intro.start()
     })
</script>

<svelte:head>
	<title>TeploClient: Главная</title>
</svelte:head>

<div class="container all">
    <div class="header d-flex justify-content-center mb-4">
        <img class="me-4" src="/img/urfu-logo.png" alt="urfu-logo">
        <img src="/img/tim-logo.png" alt="tim-logo">
    </div>
    <h1 class="h1 text-center" data-intro='Hello step one!'>Информационно-моделирующая система<br/> теплового режима доменной плавки</h1>
    <div class="text-center mt-5">
        <a href="/base" class="btn btn-outline-secondary">Перейти к базовому режиму</a>
    </div>
    <div id="step1">Step 1 Content</div>
    <div id="step2">Step 2 Content</div>
</div>

<style>
    .all {
        padding-top: 6em;
        z-index: 100;
    }

    .btn {
        font-size: 1.2em;
    }

    .header img {
        max-height: 4em;
    }

    .buttons {
        margin-bottom: 8em;
    }
</style>