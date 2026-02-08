<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ProgressBar />

<div class="min-h-screen bg-gray-50">
	{@render children()}
</div>
