<script lang="ts">
  let { 
    value = $bindable(), 
    type = 'text', 
    id, 
    placeholder = '', 
    required = false, 
    class: className = '',
    error = ''
  } = $props();
</script>

<div class="w-full">
  <input
    {type}
    {id}
    bind:value
    {placeholder}
    {required}
    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border {error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} {className}"
  />
  {#if error}
    <p class="mt-1 text-sm text-red-600">{error}</p>
  {/if}
</div>
