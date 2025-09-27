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

<div class="mb-8">
	<h2 class="text-2xl font-bold mb-4">My Documents</h2>
	<div class="flex mb-4">
		<input
			type="file"
			accept=".pdf"
			class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
			bind:this={fileInput}
		/>
		<button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500" on:click={handleUpload}>Upload PDF</button>
	</div>
	<ul>
		{#if $documents && $documents.length > 0}
			{#each $documents as doc (doc._id)}
				<li class="py-2 border-b border-gray-200">{doc.title}</li>
			{/each}
		{:else}
			<p class="text-gray-500">No documents yet. Upload a PDF to get started.</p>
		{/if}
	</ul>
</div>