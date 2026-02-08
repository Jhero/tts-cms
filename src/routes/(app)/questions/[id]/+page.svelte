<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Textarea from '$lib/components/ui/Textarea.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import Card from '$lib/components/ui/Card.svelte';

  let title = $state('');
  let content = $state('');
  let answer = $state('');
  let status = $state('');
  let loading = $state(false);
  let error = $state('');
  let pageLoading = $state(true);

  const id = $page.params.id;

  onMount(async () => {
      try {
          const res = await api.get<any>(`/questions/${id}`);
          const q = res.data;
          title = q.title;
          content = q.content;
          answer = q.answer;
          status = q.status;
      } catch (err: any) {
          error = err.message;
      } finally {
          pageLoading = false;
      }
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';

    try {
      await api.put(`/questions/${id}`, { title, content, answer });
      goto('/questions');
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function updateStatus(newStatus: string) {
      try {
          await api.patch(`/questions/${id}/status`, { status: newStatus });
          status = newStatus;
      } catch (err: any) {
          alert(err.message);
      }
  }
</script>

<div class="mb-6">
    <Button variant="ghost" onclick={() => goto('/questions')}>&larr; Back to Questions</Button>
</div>

<h1 class="text-2xl font-semibold text-gray-900 mb-6">Edit Question</h1>

{#if pageLoading}
    <Loader />
{:else}
    <Card>
        <form class="space-y-6" onsubmit={handleSubmit}>
            <div>
                <Label for="title">Title</Label>
                <Input id="title" bind:value={title} required />
            </div>
            <div>
                <Label for="content">Content</Label>
                <Textarea id="content" bind:value={content} required />
            </div>
            <div>
                <Label for="answer">Answer</Label>
                <Input id="answer" bind:value={answer} required />
            </div>
            
            <div class="pt-4 border-t">
                <h3 class="text-sm font-medium text-gray-700 mb-2">Status</h3>
                <div class="flex items-center space-x-4">
                    <span class="px-2 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">{status || 'draft'}</span>
                    {#if status !== 'published'}
                        <Button type="button" variant="secondary" onclick={() => updateStatus('published')}>Publish</Button>
                    {:else}
                         <Button type="button" variant="secondary" onclick={() => updateStatus('draft')}>Unpublish</Button>
                    {/if}
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
