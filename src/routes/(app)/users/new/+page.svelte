<script lang="ts">
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import Card from '$lib/components/ui/Card.svelte';

  let username = $state('');
  let password = $state('');
  let api_key = $state('');
  let role = $state('user');
  let loading = $state(false);
  let error = $state('');
  let success = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';
    success = '';

    try {
      await api.post('/auth/register', {
        username,
        password,
        api_key,
        role
      });
      success = 'User created successfully!';
      // Reset form
      username = '';
      password = '';
      // api_key = ''; // Keep API key as it might be same for next user
      role = 'user';
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="mb-6">
    <Button variant="ghost" onclick={() => goto('/')}>&larr; Back to Dashboard</Button>
</div>

<h1 class="text-2xl font-semibold text-gray-900 mb-6">Create New User</h1>

<Card>
    <form class="space-y-6" onsubmit={handleSubmit}>
        <div>
            <Label for="username">Username</Label>
            <Input id="username" bind:value={username} required />
        </div>

        <div>
            <Label for="password">Password</Label>
            <Input id="password" type="password" bind:value={password} required />
        </div>

        <div>
            <Label for="api_key">API Key (Registration Secret)</Label>
            <Input id="api_key" bind:value={api_key} required />
            <p class="mt-1 text-xs text-gray-500">Required to authorize user creation.</p>
        </div>

        <div>
            <Label for="role">Role</Label>
            <select id="role" bind:value={role} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
        </div>

        {#if error}
            <div class="text-red-600 text-sm">{error}</div>
        {/if}
        
        {#if success}
            <div class="text-green-600 text-sm">{success}</div>
        {/if}

        <div class="flex justify-end">
            <Button type="submit" {loading}>Create User</Button>
        </div>
    </form>
</Card>
