<script lang="ts">
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Textarea from '$lib/components/ui/Textarea.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import Card from '$lib/components/ui/Card.svelte';

  let title = $state('');
  let content = $state('');
  let answer = $state('');
  let loading = $state(false);
  let error = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';

    try {
      await api.post('/questions', { title, content, answer });
      goto('/questions');
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="mb-6">
    <Button variant="ghost" onclick={() => goto('/questions')}>&larr; Back to Questions</Button>
</div>

<h1 class="text-2xl font-semibold text-gray-900 mb-6">Create Question</h1>

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

        {#if error}
            <div class="text-red-600 text-sm">{error}</div>
        {/if}

        <div class="flex justify-end">
            <Button type="submit" {loading}>Create Question</Button>
        </div>
    </form>
</Card>
