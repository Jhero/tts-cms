<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import Button from '$lib/components/ui/Button.svelte';
  import Table from '$lib/components/ui/Table.svelte';
  import Loader from '$lib/components/ui/Loader.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import { goto } from '$app/navigation';

  let allQuestions = $state<any[]>([]);
  let displayedQuestions = $state<any[]>([]);
  let loading = $state(true);
  let error = $state('');

  let page = $state(1);
  let itemsPerPage = 10;
  let totalItems = $state(0);
  
  let showDeleteModal = $state(false);
  let questionToDelete = $state<number | null>(null);

  async function loadQuestions() {
    loading = true;
    try {
      const res = await api.get<any>('/crosswords/questions');
      if (res.data) {
          allQuestions = Array.isArray(res.data) ? res.data : (res.data.questions || []); 
          totalItems = allQuestions.length;
          updatePage(1);
      }
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
  
  function updatePage(newPage: number) {
      page = newPage;
      const start = (page - 1) * itemsPerPage;
      displayedQuestions = allQuestions.slice(start, start + itemsPerPage);
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
          await api.delete(`/crosswords/questions/${questionToDelete}`);
          loadQuestions();
          closeDeleteModal();
      } catch (err: any) {
          alert(err.message);
          closeDeleteModal();
      }
  }

  onMount(loadQuestions);
</script>

<div class="flex justify-between items-center mb-6">
  <h1 class="text-2xl font-semibold text-gray-900">All Crossword Questions</h1>
  <Button onclick={() => goto('/crosswords/questions/new')}>Add Question</Button>
</div>

{#if loading}
  <Loader />
{:else if error}
  <div class="text-red-600 py-4">{error}</div>
{:else}
  <Table headers={['ID', 'Level ID', 'Number', 'Clue', 'Answer', 'Direction', 'Pos (R,C)', 'Actions']}>
    {#each displayedQuestions as q}
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.level_id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{q.number}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{q.clue}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.answer}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.isAcross ? 'Across' : 'Down'}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.row}, {q.col}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <Button variant="ghost" class="text-indigo-600 hover:text-indigo-900 mr-2" onclick={() => goto(`/crosswords/questions/${q.id}`)}>Edit</Button>
          <Button variant="ghost" class="text-red-600 hover:text-red-900" onclick={() => openDeleteModal(q.id)}>Delete</Button>
        </td>
      </tr>
    {/each}
  </Table>
  
  <Pagination 
    {page} 
    {totalItems} 
    {itemsPerPage} 
    onPageChange={updatePage} 
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
