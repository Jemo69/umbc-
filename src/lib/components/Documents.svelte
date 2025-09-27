<script lang="ts">
	import { query, mutation } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';

	const documents = query(api.documents.get);
	const getUploadUrl = mutation(api.documents.getUploadUrl);
	const createDocument = mutation(api.documents.create);

	let fileInput: HTMLInputElement;

	async function handleUpload() {
		const file = fileInput.files?.[0];
		if (!file) return;

		const uploadUrl = await getUploadUrl();
		if (!uploadUrl) return;

		const result = await fetch(uploadUrl, {
			method: 'POST',
			headers: { 'Content-Type': file.type },
			body: file
		});

		const { storageId } = await result.json();

		await createDocument({ storageId, title: file.name });

		fileInput.value = '';
	}
</script>

<div class="documents-container">
	<h2>My Documents</h2>
	<div class="upload-document">
		<input type="file" accept=".pdf" bind:this={fileInput} />
		<button on:click={handleUpload}>Upload PDF</button>
	</div>
	<ul>
		{#if $documents && $documents.length > 0}
			{#each $documents as doc (doc._id)}
				<li>{doc.title}</li>
			{/each}
		{:else}
			<p>No documents yet. Upload a PDF to get started.</p>
		{/if}
	</ul>
</div>

<style>
	.documents-container {
		margin-bottom: 2rem;
	}
	.upload-document {
		display: flex;
		margin-bottom: 1rem;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	li {
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border-color);
	}
</style>