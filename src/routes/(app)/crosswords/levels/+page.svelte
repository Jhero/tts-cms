<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import Button from '$lib/components/ui/Button.svelte';
  import Table from '$lib/components/ui/Table.svelte';
  import Loader from '$lib/components/ui/Loader.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import { goto } from '$app/navigation';

  let allLevels = $state<any[]>([]);
  let displayedLevels = $state<any[]>([]);
  let loading = $state(true);
  let error = $state('');

  let page = $state(1);
  let itemsPerPage = 10;
  let totalItems = $state(0);
  
  let showDeleteModal = $state(false);
  let levelToDelete = $state<number | null>(null);

  async function loadLevels() {
    loading = true;
    try {
      const res = await api.get<any>('/crosswords/levels');
      if (res.data) {
          allLevels = Array.isArray(res.data) ? res.data : (res.data.levels || []); 
          totalItems = allLevels.length;
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
      displayedLevels = allLevels.slice(start, start + itemsPerPage);
  }

  function openDeleteModal(id: number) {
      levelToDelete = id;
      showDeleteModal = true;
  }

  function closeDeleteModal() {
      showDeleteModal = false;
      levelToDelete = null;
  }

  async function confirmDelete() {
      if (!levelToDelete) return;

      try {
          await api.delete(`/crosswords/levels/${levelToDelete}`);
          loadLevels();
          closeDeleteModal();
      } catch (err: any) {
          alert(err.message);
          closeDeleteModal();
      }
  }

  onMount(loadLevels);
</script>

<div class="flex justify-between items-center mb-6">
  <h1 class="text-2xl font-semibold text-gray-900">Crossword Levels</h1>
  <div class="space-x-2">
    <Button variant="secondary" onclick={() => goto('/crosswords/import')}>Import JSON</Button>
    <Button onclick={() => goto('/crosswords/levels/new')}>Add Level</Button>
  </div>
</div>

{#if loading}
  <Loader />
{:else if error}
  <div class="text-red-600 py-4">{error}</div>
{:else}
  <Table headers={['ID', 'Title', 'Questions', 'Actions']}>
    {#each displayedLevels as level}
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{level.id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{level.title || level.name}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{level.questions?.length || 0}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <Button variant="ghost" class="text-indigo-600 hover:text-indigo-900 mr-2" onclick={() => goto(`/crosswords/levels/${level.id}`)}>Manage</Button>
          <Button variant="ghost" class="text-red-600 hover:text-red-900" onclick={() => openDeleteModal(level.id)}>Delete</Button>
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
    message="Are you sure you want to delete this level? All questions in it might be affected."
    confirmText="OK"
    cancelText="Cancel"
    onConfirm={confirmDelete}
    onCancel={closeDeleteModal}
  />
{/if}
