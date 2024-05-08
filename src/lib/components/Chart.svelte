<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onMount } from 'svelte';

    export let baseValue: number
    export let compValue: number

    export let paramName: string
    export let chartIndex: number
    
    onMount(()  => {
        const ctx = document.getElementById(`chart-${chartIndex}`);
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [`${paramName} (базовый / проектный)`],
                datasets: [{
                    label: "Базовый",
                    data: [Math.round(baseValue * 100) / 100],
                    borderWidth: 1
                }, {
                    label: "Сравнительный",
                    data: [Math.round(compValue * 100) / 100],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true
            }
        })
    })
</script>

<div class="chart-wrapper">
    <canvas id="chart-{chartIndex}"></canvas>
</div>

<style>
    .chart-wrapper {
        margin: 0 auto;
    }
</style>