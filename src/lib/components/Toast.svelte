<script lang="ts">
    export let variant: 'success' | 'error' = 'success'
</script>

<div class="toast align-items-center {variant == 'success' ? 'text-bg-warning' : 'text-bg-danger'}  border-0 show" role="alert">
    <div class="d-flex">
        <div class="toast-body">
            <slot />
        </div>
        <button type="button" class="btn-close btn-close-dark me-2 m-auto" on:click></button>
    </div>
</div>

<style>
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
    }
</style>