<script lang="ts">
	import { query, mutation } from 'convex-svelte';
	import { authClient } from '$lib/auth-client';
	import { api } from '../convex/_generated/api';
	import Toaster from '$lib/components/Toaster.svelte';

	import '../app.css';

	let { children } = $props();

	const user = query(api.users.currentUser);
	const { session } = authClient;

	let email = '';
	let password = '';
</script>

<Toaster />

<main>
	{#if $session?.isAuthenticated}
		<div class="user-info">
			<span>{$user?.name ?? 'Loading...'}</span>
			<button onclick={() => authClient.auth.signOut()}>Sign Out</button>
		</div>
		{@render children?.()}
	{:else}
		<div class="auth-container">
			<div class="auth-form">
				<h2>Sign In or Sign Up</h2>
				<input type="email" placeholder="Email" bind:value={email} />
				<input type="password" placeholder="Password" bind:value={password} />
				<button onclick={() => authClient.auth.signInWithEmailAndPassword({ email, password })}>
					Sign In
				</button>
				<button
					onclick={async () => {
						await authClient.auth.signUpWithEmailAndPassword({
							email,
							password,
							name: email
						});
						const createUser = mutation(api.users.create);
						await createUser({ email });
					}}
				>
					Sign Up
				</button>
			</div>
		</div>
	{/if}
</main>

<style>
	.user-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}
</style>