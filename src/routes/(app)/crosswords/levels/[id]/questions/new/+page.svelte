<script lang="ts">
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import Card from '$lib/components/ui/Card.svelte';

  const levelId = $page.params.id;
  
  let number = $state(1);
  let clue = $state('');
  let answer = $state('');
  let isAcross = $state(true);
  let row = $state(0);
  let col = $state(0);
  let questions_id = $state<number | null>(null);
  
  let loading = $state(false);
  let error = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';

    try {
      await api.post('/crosswords/questions', {
          level_id: parseInt(levelId),
          number: parseInt(String(number)),
          clue,
          answer,
          isAcross,
          row: parseInt(String(row)),
          col: parseInt(String(col)),
          questions_id: questions_id ? parseInt(String(questions_id)) : 0
      });
      goto(`/crosswords/levels/${levelId}`);
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="mb-6">
    <Button variant="ghost" onclick={() => goto(`/crosswords/levels/${levelId}`)}>&larr; Back to Level</Button>
</div>

<h1 class="text-2xl font-semibold text-gray-900 mb-6">Add Crossword Question</h1>

<Card>
    <form class="space-y-6" onsubmit={handleSubmit}>
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
                <Label for="number">Number</Label>
                <Input id="number" type="number" bind:value={number} required />
            </div>
             <div>
                <Label for="questions_id">Linked Question ID (Optional)</Label>
                <Input id="questions_id" type="number" bind:value={questions_id} />
            </div>
            <div class="sm:col-span-2">
                <Label for="clue">Clue</Label>
                <Input id="clue" bind:value={clue} required />
            </div>
            <div class="sm:col-span-2">
                <Label for="answer">Answer</Label>
                <Input id="answer" bind:value={answer} required />
            </div>
            <div>
                <Label for="direction">Direction</Label>
                <select id="direction" bind:value={isAcross} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                    <option value={true}>Across</option>
                    <option value={false}>Down</option>
                </select>
            </div>
            <div>
                <Label for="row">Row</Label>
                <Input id="row" type="number" bind:value={row} required />
            </div>
            <div>
                <Label for="col">Column</Label>
                <Input id="col" type="number" bind:value={col} required />
            </div>
        </div>

        {#if error}
            <div class="text-red-600 text-sm">{error}</div>
        {/if}

        <div class="flex justify-end">
            <Button type="submit" {loading}>Add Question</Button>
        </div>
    </form>
</Card>
