<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import Button from '$lib/components/ui/Button.svelte';
  import Table from '$lib/components/ui/Table.svelte';
  import Loader from '$lib/components/ui/Loader.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import { goto } from '$app/navigation';

  let questions = $state<any[]>([]);
  let loading = $state(true);
  let error = $state('');
  
  let page = $state(1);
  let limit = 10;
  let hasMore = $state(false);

  let showDeleteModal = $state(false);
  let questionToDelete = $state<number | null>(null);

  async function loadQuestions(pageNum = 1) {
    loading = true;
    page = pageNum;
    try {
      const offset = (pageNum - 1) * limit;
      // Fetch limit + 1 to check if there are more items
      const res = await api.get<any>(`/questions?offset=${offset}&limit=${limit + 1}`);
      let data = [];
      if (res.data) {
          data = Array.isArray(res.data) ? res.data : (res.data.questions || []); 
      }
      
      if (data.length > limit) {
          hasMore = true;
          questions = data.slice(0, limit);
      } else {
          hasMore = false;
          questions = data;
      }
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function openDeleteModal(id: number) {
      questionToDelete = id;
      showDeleteModal = true;
  }

  function closeDeleteModal() {
      showDeleteModal = false;
      questionToDelete = null;
  }

  async function confirmDelete() {
      if (!questionToDelete) return;
      try {
          await api.delete(`/questions/${questionToDelete}`);
          loadQuestions(page);
          closeDeleteModal();
      } catch (err: any) {
          alert(err.message);
          closeDeleteModal();
      }
  }

  onMount(() => loadQuestions(1));
</script>

<div class="flex justify-between items-center mb-6">
  <h1 class="text-2xl font-semibold text-gray-900">Questions</h1>
  <Button onclick={() => goto('/questions/new')}>Add Question</Button>
</div>

{#if loading}
  <Loader />
{:else if error}
  <div class="text-red-600 py-4">{error}</div>
{:else}
  <Table headers={['ID', 'Title', 'Content', 'Status', 'Actions']}>
    {#each questions as q}
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{q.title}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{q.content}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {q.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
            {q.status}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <Button variant="ghost" class="text-indigo-600 hover:text-indigo-900 mr-2" onclick={() => goto(`/questions/${q.id}`)}>Edit</Button>
          <Button variant="ghost" class="text-red-600 hover:text-red-900" onclick={() => openDeleteModal(q.id)}>Delete</Button>
        </td>
      </tr>
    {/each}
  </Table>
  
  <Pagination 
    {page} 
    {hasMore} 
    onPageChange={loadQuestions} 
  />

  <Modal
    isOpen={showDeleteModal}
    title="Are you sure?"
    message="Are you sure you want to delete this question?"
    confirmText="Delete"
    cancelText="Cancel"
    onConfirm={confirmDelete}
    onCancel={closeDeleteModal}
  />
{/if}
