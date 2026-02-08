<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Loader from '$lib/components/ui/Loader.svelte';

  const id = $page.params.id;
  const urlLevelId = $page.url.searchParams.get('level_id');

  let levelId = $state<number | null>(urlLevelId ? parseInt(urlLevelId) : null);
  
  let number = $state(0);
  let clue = $state('');
  let answer = $state('');
  let isAcross = $state(true);
  let questions_id = $state<number | null>(null);
  
  let levels = $state<any[]>([]);
  let levelQuestions = $state<any[]>([]);

  let loading = $state(false);
  let pageLoading = $state(true);
  let error = $state('');

  onMount(async () => {
      try {
          // Fetch levels and question data in parallel
          const [levelsRes, qRes] = await Promise.all([
              api.get<any>('/crosswords/levels'),
              api.get<any>(`/crosswords/questions/${id}`)
          ]);
          
          levels = Array.isArray(levelsRes.data) ? levelsRes.data : (levelsRes.data.levels || []);
          
          const q = qRes.data;
          number = q.number;
          clue = q.clue;
          answer = q.answer;
          isAcross = q.isAcross;
          questions_id = q.questions_id || null;
          
          // Use the question's actual level_id
          if (q.level_id) {
              levelId = q.level_id;
          }
          
          // Fetch questions for the selected level to populate the dropdown
          if (levelId) {
             await fetchLevelQuestions(levelId);
          }

      } catch (err: any) {
          error = err.message;
      } finally {
          pageLoading = false;
      }
  });

  async function fetchLevelQuestions(lid: number) {
      try {
          const res = await api.get<any>(`/crosswords/questions?level_id=${lid}`);
          levelQuestions = Array.isArray(res.data) ? res.data : (res.data.questions || []);
      } catch (err: any) {
          console.error('Failed to load questions for level:', err);
          levelQuestions = [];
      }
  }

  async function handleLevelChange() {
      if (!levelId) {
          levelQuestions = [];
          return;
      }
      // When level changes, clear the linked question as it might not be valid anymore
      questions_id = null;
      await fetchLevelQuestions(levelId);
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

    try {
      await api.put(`/crosswords/questions/${id}`, {
          level_id: levelId || 0,
          number: parseInt(String(number)),
          clue,
          answer,
          isAcross,
          questions_id: questions_id ? parseInt(String(questions_id)) : null
      });
      
      // If we came from a specific level view, go back there.
      if (urlLevelId) {
        goto(`/crosswords/levels/${urlLevelId}`);
      } else {
        // Otherwise go to the general questions list
        goto('/crosswords/questions');
      }
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleBack() {
      if (urlLevelId) {
          goto(`/crosswords/levels/${urlLevelId}`);
      } else {
          goto('/crosswords/questions');
      }
  }
</script>

<div class="mb-6">
    <Button variant="ghost" onclick={handleBack}>&larr; Back</Button>
</div>

<h1 class="text-2xl font-semibold text-gray-900 mb-6">Edit Crossword Question</h1>

{#if pageLoading}
    <Loader />
{:else}
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
                             <!-- Don't link to self -->
                            {#if q.id !== parseInt(String(id))}
                                <option value={q.id}>{q.number} {q.isAcross ? 'Across' : 'Down'} - {q.clue ? q.clue.substring(0, 30) + (q.clue.length > 30 ? '...' : '') : ''}</option>
                            {/if}
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
                <Button type="submit" {loading}>Update Question</Button>
            </div>
        </form>
    </Card>
{/if}
