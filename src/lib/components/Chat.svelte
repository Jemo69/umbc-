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

<div class="chat-container">
	<h2>Chat with a Document</h2>
	<select bind:value={selectedDocumentId}>
		<option value={null} disabled>Select a document</option>
		{#if $documents}
			{#each $documents as doc (doc._id)}
				<option value={doc._id}>{doc.title}</option>
			{/each}
		{/if}
	</select>

	<div class="chat-window">
		{#if selectedDocumentId}
			{#if $notes && $notes.length > 0}
				{#each $notes as note (note._id)}
					<div class="message" class:viewer={note.isViewer}>
						<p>{note.text}</p>
					</div>
				{/each}
			{:else}
				<p>No messages yet. Ask a question to start the conversation.</p>
			{/if}
		{:else}
			<p>Please select a document to start chatting.</p>
		{/if}
	</div>

	<div class="chat-input">
		<input
			type="text"
			placeholder="Ask a question..."
			bind:value={newMessage}
			disabled={!selectedDocumentId || sending}
			on:keydown={(e) => e.key === 'Enter' && handleSendMessage()}
		/>
		<button onclick={handleSendMessage} disabled={!selectedDocumentId || sending}>
			{#if sending}Sending...{:else}Send{/if}
		</button>
	</div>
</div>

<style>
	.chat-container {
		margin-bottom: 2rem;
	}
	select {
		width: 100%;
		padding: 0.5rem;
		margin-bottom: 1rem;
	}
	.chat-window {
		height: 300px;
		overflow-y: auto;
		border: 1px solid var(--border-color);
		padding: 1rem;
		margin-bottom: 1rem;
	}
	.message {
		margin-bottom: 1rem;
		padding: 0.5rem 1rem;
		border-radius: var(--border-radius);
		background-color: var(--brand-color-light);
	}
	.message.viewer {
		background-color: #e0e0e0;
		text-align: right;
	}
	.chat-input {
		display: flex;
	}
	.chat-input input {
		flex-grow: 1;
		margin-right: 0.5rem;
	}
</style>