<script lang="ts">
     import { onMount } from 'svelte'
     import 'intro.js/introjs.css'
     import introJs from 'intro.js'
    import { API_URL } from '$lib/consts';
     
     onMount(() => {
         const intro = introJs()
         intro.setOptions({
             steps: [
                 {
                     title: 'Добро пожаловать!',
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
         intro.setOption('dontShowAgain', true)
         intro.start()
     })
</script>

<svelte:head>
	<title>TeploClient: Главная</title>
</svelte:head>

<div class="container all">
    <div class="header d-flex justify-content-center mb-4 align-items-center">
        <img class="me-4" src="/img/urfu-logo-color.svg" height="54" alt="urfu-logo">
        <img src="/img/tim-logo-color.svg" alt="tim-logo">
    </div>
    <h1 class="h1 text-center mb-5" data-intro='Hello step one!'>Информационно-моделирующая система<br/> теплового режима доменной плавки</h1>
    <div class="text-center mb-5">
        <a href="/base" class="btn btn-outline-secondary">Перейти к базовому режиму</a>
        <a href="{API_URL.slice(0,-3)}swagger" class="d-block mt-3" target="_blank" >Документация TeploAPI в Swagger</a>
    </div>
    <div class="text-center">
        <img src="/img/structure.svg" height="180px" alt="structure">
    </div>
    <div class="text-center pt-5">
        <p class="lead mb-2">Магистерская диссертация студента группы НМТМ-223901, Шамсимухаметова Павла Раифовича</p>
        <p class="lead">Под руководством профессора, доктора технических наук, Лаврова Владислава Васильевича</p>
    </div>
    <!-- <div id="step1">Step 1 Content</div>
    <div id="step2">Step 2 Content</div> -->
</div>

<style>
    .all {
        padding-top: 6em;
        z-index: 100;
        height: 100%;
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