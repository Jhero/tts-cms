<script lang="ts">
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import Textarea from '$lib/components/ui/Textarea.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import Card from '$lib/components/ui/Card.svelte';

  let jsonContent = $state('');
  let loading = $state(false);
  let error = $state('');
  let success = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';
    success = '';

    try {
      let parsed;
      try {
          parsed = JSON.parse(jsonContent);
      } catch (e) {
          throw new Error('Invalid JSON format');
      }

      await api.post('/crosswords/import', parsed);
      success = 'Import successful!';
      jsonContent = '';
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

<Card>
    <form class="space-y-6" onsubmit={handleSubmit}>
        <div>
            <Label for="json">JSON Data</Label>
            <p class="text-sm text-gray-500 mb-2">Paste the JSON structure for bulk import (levels array).</p>
            <Textarea id="json" bind:value={jsonContent} required rows={15} placeholder={'{ "levels": [ ... ] }'} />
        </div>

        {#if error}
            <div class="text-red-600 text-sm">{error}</div>
        {/if}
        
        {#if success}
            <div class="text-green-600 text-sm">{success}</div>
        {/if}

        <div class="flex justify-end">
            <Button type="submit" {loading}>Import</Button>
        </div>
    </form>
</Card>
