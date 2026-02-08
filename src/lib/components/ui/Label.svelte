<script lang="ts">
    import { type Snippet } from 'svelte';
    let { for: htmlFor, children, class: className = '' }: { for?: string; children: Snippet; class?: string } = $props();
</script>

<label for={htmlFor} class="block text-sm font-medium text-gray-700 mb-1 {className}">
  {@render children()}
</label>
