<script lang="ts">
    import { type Snippet } from 'svelte';
    let { children, class: className = '' }: { children: Snippet; class?: string } = $props();
</script>

<div class="bg-white shadow sm:rounded-lg overflow-hidden {className}">
  <div class="px-4 py-5 sm:p-6">
    {@render children()}
  </div>
</div>
