<script lang="ts">
  import { auth, logout } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { page } from '$app/stores';

  let { children } = $props();

  onMount(() => {
    const unsub = auth.subscribe(state => {
      if (!state.isAuthenticated) {
        goto('/login');
      }
    });
    return unsub;
  });

  function isActive(path: string) {
      return $page.url.pathname === path ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700';
  }
</script>

<div class="min-h-screen flex flex-col">
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold text-blue-600">TTS CMS</span>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a href="/" class="{isActive('/')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Dashboard
            </a>
            <a href="/questions" class="{isActive('/questions')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Questions
            </a>
            <a href="/crosswords/levels" class="{isActive('/crosswords/levels')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Crossword Levels
            </a>
          </div>
        </div>
        <div class="flex items-center">
             <span class="mr-4 text-sm text-gray-500">{$auth.user?.username}</span>
             <Button variant="ghost" onclick={logout}>Logout</Button>
        </div>
      </div>
    </div>
  </nav>

  <main class="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
    {@render children()}
  </main>
</div>
