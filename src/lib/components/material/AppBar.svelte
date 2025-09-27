<script lang="ts">
    import { Settings, HelpCircle } from "lucide-svelte";
    import type { ComponentType } from "svelte";

    interface NavItem {
        Id: string;
        Icon: ComponentType;
        Href: string;
        Label: string;
    }

    export let src: string | undefined = undefined;
    export let name: string;
    export let items: NavItem[];
    export let isExpanded: boolean = false;

    let Expanded = isExpanded;
</script>

<div
    class={`relative flex flex-col items-center justify-start transition-all duration-[450ms] ease-in-out ${
        Expanded ? "w-74" : "w-30"
    }`}
>
    <article
        class="border-accent-300 bg-background-100 sticky top-5 h-[95dvh] w-full rounded-2xl border border-solid p-4 shadow-lg shadow-black/15 duration-500 ease-in-out"
    >
        <div class="mb-6 hidden items-center justify-center gap-4 md:flex">
            {#if src}
                <img {src} alt={name} class="h-12 w-12 rounded-full" />
            {/if}
            {#if Expanded}
                <span class="text-accent-800 truncate text-lg font-semibold">
                    Dashboard
                </span>
            {/if}
            <button
                on:click={() => (Expanded = !Expanded)}
                class="hover:bg-secondary-500 ml-auto rounded-lg p-2 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    {#if Expanded}
                        <path d="M15 18l-6-6 6-6" />
                    {:else}
                        <path d="M9 18l6-6-6-6" />
                    {/if}
                </svg>
            </button>
        </div>

        <nav class="space-y-2">
            {#each items as item}
                <label
                    for={item.Id}
                    class={`border-secondary-900/10 hover:bg-primary-300 group relative flex h-16 w-full cursor-pointer items-center gap-4 rounded-xl border-solid p-4 duration-300 ease-in-out`}
                >
                    <a
                        href={item.Href}
                        class="text-secondary-500 group-hover:text-primary-600 absolute inset-0"
                        aria-label={item.Label}
                    />
                    <svelte:component this={item.Icon} />
                    {#if Expanded}
                        <span
                            class="text-secondary-500 hover:text-secondary-300 truncate text-sm font-medium"
                        >
                            {item.Label}
                        </span>
                    {/if}
                </label>
            {/each}
            <div class="bg-secondary-300/20 h-[3px] w-full"></div>

            <label
                class="hover:bg-background-300 group flex flex-row items-center justify-baseline rounded-2xl p-4"
            >
                <a href="/app/setting" class="flex flex-row">
                    <Settings
                        class="text-secondary-500 group-hover:text-secondary-600 h-6 w-6"
                    />
                    {#if Expanded}
                        <span
                            class="text-secondary-500 group-hover:text-secondary-600 truncate px-1 text-sm font-medium"
                        >
                            Setting
                        </span>
                    {/if}
                </a>
            </label>

            <label
                class="hover:bg-background-300 group flex flex-row items-center justify-baseline rounded-2xl p-4"
            >
                <a href="/help" class="flex flex-row">
                    <HelpCircle
                        class="text-secondary-500 group-hover:text-secondary-600 h-6 w-6"
                    />
                    {#if Expanded}
                        <span
                            class="text-secondary-500 group-hover:text-secondary-600 truncate px-1 text-sm font-medium"
                        >
                            Help and Support
                        </span>
                    {/if}
                </a>
            </label>
        </nav>
    </article>
</div>
