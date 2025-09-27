<script lang="ts">
	import { query, mutation } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';

	const tasks = query(api.tasks.get);
	const addTask = mutation(api.tasks.add);
	const updateTask = mutation(api.tasks.update);
	const deleteTask = mutation(api.tasks.del);

	let newTaskText = '';

	function handleAddTask() {
		if (newTaskText.trim() === '') return;
		addTask({ text: newTaskText });
		newTaskText = '';
	}
</script>

<div class="mb-8">
	<h2 class="text-2xl font-bold mb-4">My Tasks</h2>
	<div class="flex mb-4">
		<input
			type="text"
			placeholder="Add a new task"
			class="flex-grow p-2 border border-gray-300 rounded-md mr-2"
			bind:value={newTaskText}
			on:keydown={(e) => e.key === 'Enter' && handleAddTask()}
		/>
		<button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500" onclick={handleAddTask}>Add</button>
	</div>
	<ul>
		{#if $tasks && $tasks.length > 0}
			{#each $tasks as task (task._id)}
				<li class="flex items-center py-2 border-b border-gray-200">
					<input
						type="checkbox"
						class="mr-2"
						checked={task.completed}
						on:change={() => updateTask({ id: task._id, completed: !task.completed })}
					/>
					<span class:line-through={task.completed} class:text-gray-500={task.completed}>
						{task.text}
					</span>
					<button
						class="ml-auto bg-transparent border-none text-red-600 hover:text-red-800 cursor-pointer"
						onclick={() => deleteTask({ id: task._id })}
					>
						X
					</button>
				</li>
			{/each}
		{:else}
			<p class="text-gray-500">No tasks yet. Add one!</p>
		{/if}
	</ul>
</div>