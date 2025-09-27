<script lang="ts">
    import { PUBLIC_CONVEX_URL } from "$env/static/public";
    import "../app.css";
    import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
    import Toaster from "$lib/components/Toaster.svelte";
    import { setupConvex } from "convex-svelte";
    const queryClient = new QueryClient();
    setupConvex(PUBLIC_CONVEX_URL);
</script>

<QueryClientProvider>
    <Toaster />

    <main class="max-w-4xl mx-auto p-8">
        {#if $session?.isAuthenticated}
            <div class="flex justify-between items-center mb-8">
                <span class="font-semibold">{$user?.name ?? "Loading..."}</span>
                <button
                    class="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    onclick={() => authClient.auth.signOut()}
                >
                    Sign Out
                </button>
            </div>
            {@render children?.()}
        {:else}
            <div class="flex justify-center items-center h-screen">
                <div
                    class="bg-gray-100 p-8 rounded-lg border border-gray-200 w-full max-w-sm"
                >
                    <h2 class="text-2xl font-bold mb-6 text-center">
                        Sign In or Sign Up
                    </h2>
                    <input
                        type="email"
                        placeholder="Email"
                        bind:value={email}
                        class="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        bind:value={password}
                        class="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <button
                        class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500 mb-2"
                        onclick={() =>
                            authClient.auth.signInWithEmailAndPassword({
                                email,
                                password,
                            })}
                    >
                        Sign In
                    </button>
                    <button
                        class="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-500"
                        onclick={async () => {
                            await authClient.auth.signUpWithEmailAndPassword({
                                email,
                                password,
                                name: email,
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
</QueryClientProvider>
