<script lang="ts">
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import Card from '$lib/components/ui/Card.svelte';

  let name = $state('');
  let loading = $state(false);
  let error = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';

    try {
      await api.post('/crosswords/levels', { name });
      goto('/crosswords/levels');
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="mb-6">
    <Button variant="ghost" onclick={() => goto('/crosswords/levels')}>&larr; Back to Levels</Button>
</div>

<h1 class="text-2xl font-semibold text-gray-900 mb-6">Create Level</h1>

<Card>
    <form class="space-y-6" onsubmit={handleSubmit}>
        <div>
            <Label for="name">Level Name</Label>
            <Input id="name" bind:value={name} required />
        </div>

        {#if error}
            <div class="text-red-600 text-sm">{error}</div>
        {/if}

        <div class="flex justify-end">
            <Button type="submit" {loading}>Create Level</Button>
        </div>
    </form>
</Card>
