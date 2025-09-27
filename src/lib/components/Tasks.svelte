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

<div class="tasks-container">
	<h2>My Tasks</h2>
	<div class="add-task">
		<input type="text" placeholder="Add a new task" bind:value={newTaskText} on:keydown={(e) => e.key === 'Enter' && handleAddTask()} />
		<button onclick={handleAddTask}>Add</button>
	</div>
	<ul>
		{#if $tasks && $tasks.length > 0}
			{#each $tasks as task (task._id)}
				<li>
					<input
						type="checkbox"
						checked={task.completed}
						on:change={() => updateTask({ id: task._id, completed: !task.completed })}
					/>
					<span class:completed={task.completed}>{task.text}</span>
					<button class="delete" onclick={() => deleteTask({ id: task._id })}>X</button>
				</li>
			{/each}
		{:else}
			<p>No tasks yet. Add one!</p>
		{/if}
	</ul>
</div>

<style>
	.tasks-container {
		margin-bottom: 2rem;
	}
	.add-task {
		display: flex;
		margin-bottom: 1rem;
	}
	.add-task input {
		flex-grow: 1;
		margin-right: 0.5rem;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	li {
		display: flex;
		align-items: center;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border-color);
	}
	li input[type='checkbox'] {
		margin-right: 0.5rem;
	}
	.completed {
		text-decoration: line-through;
		color: #aaa;
	}
	.delete {
		margin-left: auto;
		background: none;
		border: none;
		color: red;
		cursor: pointer;
	}
</style>