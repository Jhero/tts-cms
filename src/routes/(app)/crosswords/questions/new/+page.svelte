<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import Card from '$lib/components/ui/Card.svelte';

  let levelId = $state<number | null>(null);
  let number = $state(1);
  let clue = $state('');
  let answer = $state('');
  let isAcross = $state(true);
  let questions_id = $state<number | null>(null);
  
  let levels = $state<any[]>([]);
  let levelQuestions = $state<any[]>([]);

  let loading = $state(false);
  let error = $state('');

  onMount(async () => {
      try {
          const res = await api.get<any>('/crosswords/levels');
          levels = Array.isArray(res.data) ? res.data : (res.data.levels || []);
      } catch (err: any) {
          console.error('Failed to load levels:', err);
      }
  });

  async function handleLevelChange() {
      if (!levelId) {
          levelQuestions = [];
          return;
      }
      try {
          const res = await api.get<any>(`/crosswords/questions?level_id=${levelId}`);
          levelQuestions = Array.isArray(res.data) ? res.data : (res.data.questions || []);
      } catch (err: any) {
          console.error('Failed to load questions for level:', err);
          levelQuestions = [];
      }
  }

  function handleLinkedQuestionChange() {
      if (questions_id) {
          const linkedQ = levelQuestions.find(q => q.id === questions_id);
          if (linkedQ) {
              clue = linkedQ.clue;
              answer = linkedQ.answer;
          }
      }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';

    if (!levelId) {
        error = 'Level ID is required';
        loading = false;
        return;
    }

    try {
      await api.post('/crosswords/questions', {
          level_id: parseInt(String(levelId)),
          number: parseInt(String(number)),
          clue,
          answer,
          isAcross,
          questions_id: questions_id ? parseInt(String(questions_id)) : null
      });
      goto('/crosswords/questions');
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="mb-6">
    <Button variant="ghost" onclick={() => goto('/crosswords/questions')}>&larr; Back to Questions</Button>
</div>

<h1 class="text-2xl font-semibold text-gray-900 mb-6">Add Crossword Question</h1>

<Card>
    <form class="space-y-6" onsubmit={handleSubmit}>
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
                <Label for="level_id">Level</Label>
                <select 
                    id="level_id" 
                    bind:value={levelId} 
                    onchange={handleLevelChange}
                    required
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                >
                    <option value={null}>Select a Level</option>
                    {#each levels as level}
                        <option value={level.id}>{level.title || level.name} (ID: {level.id})</option>
                    {/each}
                </select>
                <p class="mt-1 text-xs text-gray-500">The crossword level this question belongs to.</p>
            </div>
            
            <div>
                <Label for="number">Number</Label>
                <Input id="number" type="number" bind:value={number} required />
            </div>
             <div>
                <Label for="questions_id">Linked Question (Optional)</Label>
                <select 
                    id="questions_id" 
                    bind:value={questions_id} 
                    onchange={handleLinkedQuestionChange}
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                    disabled={!levelId}
                >
                    <option value={null}>None</option>
                    {#each levelQuestions as q}
                        <option value={q.id}>{q.number} {q.isAcross ? 'Across' : 'Down'} - {q.clue ? q.clue.substring(0, 30) + (q.clue.length > 30 ? '...' : '') : ''}</option>
                    {/each}
                </select>
                {#if !levelId}
                    <p class="mt-1 text-xs text-gray-500">Select a level first to see available questions.</p>
                {/if}
            </div>
            <div class="sm:col-span-2">
                <Label for="clue">Clue</Label>
                <Input id="clue" bind:value={clue} required disabled={!!questions_id} />
            </div>
            <div class="sm:col-span-2">
                <Label for="answer">Answer</Label>
                <Input id="answer" bind:value={answer} required disabled={!!questions_id} />
            </div>
            <div>
                <Label for="direction">Direction</Label>
                <select id="direction" bind:value={isAcross} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                    <option value={true}>Across</option>
                    <option value={false}>Down</option>
                </select>
            </div>
        </div>

        {#if error}
            <div class="text-red-600 text-sm">{error}</div>
        {/if}

        <div class="flex justify-end">
            <Button type="submit" {loading}>Create Question</Button>
        </div>
    </form>
</Card>
