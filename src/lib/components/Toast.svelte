<script lang="ts">
    export let variant: 'success' | 'error' | 'green' = 'success'
</script>

<div class="toast align-items-center {variant == 'success' ? 'text-bg-warning' : ''} {variant == 'error' ? 'text-bg-danger' : ''} {variant == 'green' ? 'green' : ''}  border-0 show" role="alert">
    <div class="d-flex">
        <div class="toast-body">
            <slot />
        </div>
        <button type="button" class="btn-close {variant == 'green' ? 'btn-close-white' : 'btn-close-dark'}  me-2 m-auto" on:click></button>
    </div>
</div>

<style>
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
    }

    .toast.green {
        background-color: #55a520;
        color: white;
    }
</style>