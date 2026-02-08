<script lang="ts">
  import { navigating } from '$app/stores';
  import { onMount } from 'svelte';

  let progress = $state(0);
  let visible = $state(false);
  let interval: any;

  $effect(() => {
    if ($navigating) {
      visible = true;
      progress = 0;
      interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 90) progress = 90;
      }, 100);
    } else {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        visible = false;
        progress = 0;
      }, 500);
    }
  });
</script>

{#if visible}
  <div class="fixed top-0 left-0 w-full h-1 z-50 pointer-events-none">
    <div 
      class="h-full bg-blue-600 transition-all duration-200 ease-out"
      style="width: {progress}%"
    ></div>
  </div>
{/if}
