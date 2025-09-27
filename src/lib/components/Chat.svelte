<script lang="ts">
	import { query, action } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';

	const documents = query(api.documents.get);
	let selectedDocumentId: string | null = null;
	let notes = query(
		api.notes.get,
		() => (selectedDocumentId ? { documentId: selectedDocumentId } : null)
	);
	const addNote = action(api.notes.add);

	let newMessage = '';
	let sending = false;

	async function handleSendMessage() {
		if (newMessage.trim() === '' || !selectedDocumentId) return;
		sending = true;
		const messageToSend = newMessage;
		newMessage = '';
		await addNote({ documentId: selectedDocumentId, message: messageToSend });
		sending = false;
	}
</script>

<div class="mb-8">
	<h2 class="text-2xl font-bold mb-4">Chat with a Document</h2>
	<select class="w-full p-2 border border-gray-300 rounded-md mb-4" bind:value={selectedDocumentId}>
		<option value={null} disabled>Select a document</option>
		{#if $documents}
			{#each $documents as doc (doc._id)}
				<option value={doc._id}>{doc.title}</option>
			{/each}
		{/if}
	</select>

	<div class="h-72 overflow-y-auto border border-gray-200 p-4 mb-4 rounded-md">
		{#if selectedDocumentId}
			{#if $notes && $notes.length > 0}
				{#each $notes as note (note._id)}
					<div
						class="mb-4 p-3 rounded-lg"
						class:bg-gray-100={!note.isViewer}
						class:bg-blue-100={note.isViewer}
						class:text-right={note.isViewer}
					>
						<p>{note.text}</p>
					</div>
				{/each}
			{:else}
				<p class="text-gray-500">No messages yet. Ask a question to start the conversation.</p>
			{/if}
		{:else}
			<p class="text-gray-500">Please select a document to start chatting.</p>
		{/if}
	</div>

	<div class="flex">
		<input
			type="text"
			placeholder="Ask a question..."
			class="flex-grow p-2 border border-gray-300 rounded-md mr-2"
			bind:value={newMessage}
			disabled={!selectedDocumentId || sending}
			on:keydown={(e) => e.key === 'Enter' && handleSendMessage()}
		/>
		<button
			class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 disabled:bg-gray-400"
			onclick={handleSendMessage}
			disabled={!selectedDocumentId || sending}
		>
			{#if sending}Sending...{:else}Send{/if}
		</button>
	</div>
</div>