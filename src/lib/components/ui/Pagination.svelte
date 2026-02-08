<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';

  let { 
    page = 1, 
    totalItems = 0, 
    itemsPerPage = 10, 
    hasMore = false, // For server-side when total is unknown
    onPageChange 
  }: { 
    page: number; 
    totalItems?: number; 
    itemsPerPage?: number; 
    hasMore?: boolean;
    onPageChange: (newPage: number) => void; 
  } = $props();

  let totalPages = $derived(totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 0);
  
  // If totalPages is known (client-side), use it. 
  // If not (server-side without count), rely on hasMore.
  let canGoNext = $derived(totalPages > 0 ? page < totalPages : hasMore);
  let canGoPrev = $derived(page > 1);

  function handlePrev() {
    if (canGoPrev) onPageChange(page - 1);
  }

  function handleNext() {
    if (canGoNext) onPageChange(page + 1);
  }
</script>

<div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
  <div class="flex flex-1 justify-between sm:hidden">
    <Button variant="secondary" disabled={!canGoPrev} onclick={handlePrev}>Previous</Button>
    <Button variant="secondary" disabled={!canGoNext} onclick={handleNext}>Next</Button>
  </div>
  <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
    <div>
      <p class="text-sm text-gray-700">
        Showing
        <span class="font-medium">{(page - 1) * itemsPerPage + 1}</span>
        to
        <span class="font-medium">
          {totalPages > 0 ? Math.min(page * itemsPerPage, totalItems) : (page * itemsPerPage)}
        </span>
        {#if totalPages > 0}
          of <span class="font-medium">{totalItems}</span> results
        {/if}
      </p>
    </div>
    <div>
      <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <Button 
          variant="secondary" 
          class="rounded-l-md rounded-r-none border-r-0" 
          disabled={!canGoPrev} 
          onclick={handlePrev}
        >
          Previous
        </Button>
        <div class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
          Page {page}
        </div>
        <Button 
          variant="secondary" 
          class="rounded-r-md rounded-l-none" 
          disabled={!canGoNext} 
          onclick={handleNext}
        >
          Next
        </Button>
      </nav>
    </div>
  </div>
</div>
