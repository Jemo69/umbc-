<script lang="ts">
	import Tasks from '$lib/components/Tasks.svelte';
	import Documents from '$lib/components/Documents.svelte';
	import Chat from '$lib/components/Chat.svelte';
</script>

<div class="container">
	<Tasks />
	<Documents />
	<Chat />
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	.container > :global(.chat-container) {
		grid-column: span 2;
	}
</style>