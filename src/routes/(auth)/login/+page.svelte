<script lang="ts">
  import { api } from '$lib/api';
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import Card from '$lib/components/ui/Card.svelte';

  let username = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');

  async function handleLogin(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';

    try {
      const res = await api.post<{ data: { token: string }, message?: string }>('/auth/login', { username, password });
      
      // Assuming response structure: { data: { token: "..." }, success: true }
      // The API spec shows Response object with data field.
      
      if (res.data && res.data.token) {
          auth.set({
              token: res.data.token,
              user: { username },
              isAuthenticated: true
          });
          goto('/');
      } else {
          error = res.message || 'Login failed - No token received';
      }
    } catch (err: any) {
      console.error(err);
      error = err.message || 'An error occurred';
    } finally {
      loading = false;
    }
  }
</script>

<div>
  <div class="text-center mb-8">
    <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
  </div>

  <Card>
    <form class="space-y-6" onsubmit={handleLogin}>
      <div>
        <Label for="username">Username</Label>
        <Input id="username" bind:value={username} required />
      </div>

      <div>
        <Label for="password">Password</Label>
        <Input id="password" type="password" bind:value={password} required />
      </div>

      {#if error}
        <div class="text-red-600 text-sm text-center">{error}</div>
      {/if}

      <div>
        <Button type="submit" class="w-full" {loading}>
          Sign in
        </Button>
      </div>
    </form>
  </Card>
</div>
