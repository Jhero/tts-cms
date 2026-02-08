<script lang="ts">
  let { children } = $props();
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    {@render children()}
  </div>
</div>
