<script lang="ts">
    import Button from "../lib/components/material/Button.svelte";
    import TextField from "../lib/components/material/TextField.svelte";
    import Card from "../lib/components/material/Card.svelte";
    // State management is simpler in Svelte, just declare a reactive variable using 'let'
    let isMenuOpen = false;

    const navItems = ["Features", "Pricing", "About", "Contact"];

    // Data for the feature cards, including inline SVG paths for the icons
    // to avoid external dependencies while maintaining the look.
    const featuresData = [
        {
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
            title: "Blazing Speed",
            description:
                "Experience unparalleled loading times and seamless user interactions with our optimized backend.",
        },
        {
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
            title: "Fortress Security",
            description:
                "Your data is protected by industry-leading encryption and continuous threat monitoring.",
        },
        {
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
            title: "Precision Analytics",
            description:
                "Get actionable insights with detailed, real-time data visualization and custom reports.",
        },
    ];

    // Component for the feature card (Svelte way: define function or internal component)
    // We use a regular function here since Svelte doesn't require explicit functional components
    // in the script block for simple reusable logic like this.

    // Note: The FeatureCard markup is included inline in the main template using an #each block.

    // Mobile Menu Toggler icons (SVG paths for Menu and X)
    const menuIcon =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>';
    const xIcon =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
</script>

<!-- The main component structure -->
<div class="min-h-screen bg-gray-900 font-sans antialiased text-white">
    <!-- Navigation Bar -->
    <header
        class="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800"
    >
        <nav
            class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center"
        >
            <!-- Logo -->
            <div
                class="text-2xl font-bold text-white tracking-widest flex items-center"
            >
                <span class="text-lime-400 text-3xl mr-1">A</span>
                <span class="text-gray-300">ppify</span>
            </div>

            <!-- Desktop Menu -->
            <div class="hidden md:flex space-x-8 items-center">
                {#each navItems as item}
                    <a
                        href={`#${item.toLowerCase()}`}
                        class="text-gray-300 hover:text-lime-400 transition duration-150 font-medium"
                    >
                        {item}
                    </a>
                {/each}
                <button
                    class="px-5 py-2.5 text-sm font-semibold text-gray-900 bg-lime-400 rounded-lg shadow-lg hover:bg-lime-500 transition duration-200"
                >
                    Get Started
                </button>
            </div>

            <!-- Mobile Menu Button -->
            <button
                class="md:hidden text-gray-300 hover:text-lime-400"
                on:click={() => (isMenuOpen = !isMenuOpen)}
                aria-label="Toggle navigation menu"
            >
                <!-- Use @html for rendering SVG strings -->
                {@html isMenuOpen ? xIcon : menuIcon}
            </button>
        </nav>
    </header>

    <!-- Mobile Menu Drawer -->
    <div
        class="fixed top-[65px] left-0 w-full bg-gray-900 z-40 transition-all duration-300 ease-in-out"
        class:max-h-screen={isMenuOpen}
        class:opacity-100={isMenuOpen}
        class:max-h-0={!isMenuOpen}
        class:opacity-0={!isMenuOpen}
        class:overflow-hidden={!isMenuOpen}
    >
        <div class="p-4 flex flex-col space-y-3 border-t border-gray-800">
            {#each navItems as item}
                <a
                    href={`#${item.toLowerCase()}`}
                    on:click={() => (isMenuOpen = false)}
                    class="text-gray-300 hover:text-lime-400 py-2 border-b border-gray-800 last:border-b-0 text-lg"
                >
                    {item}
                </a>
            {/each}
            <button
                class="w-full mt-4 px-5 py-3 text-lg font-semibold text-gray-900 bg-lime-400 rounded-lg hover:bg-lime-500 transition duration-200"
            >
                Get Started
            </button>
        </div>
    </div>

    <main>
        <!-- Hero Section -->
        <section class="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <!-- Tagline -->
                <p
                    class="text-sm font-semibold uppercase tracking-wider text-lime-400 mb-4"
                >
                    The Future of Digital Platforms
                </p>

                <!-- Main Headline -->
                <h1
                    class="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
                >
                    Simplify Your Workflow. <br class="hidden sm:inline" /> Amplify
                    Your Results.
                </h1>

                <!-- Subtext -->
                <p class="max-w-3xl mx-auto text-xl text-gray-400 mb-10">
                    Appify provides the essential tools you need to launch,
                    scale, and manage your product with unmatched efficiency and
                    reliability.
                </p>

                <!-- CTA Buttons -->
                <div class="flex justify-center space-x-4">
                    <button
                        class="px-8 py-3 text-lg font-bold text-gray-900 bg-lime-400 rounded-xl transition duration-300 ease-in-out shadow-lime-500/50 hover:shadow-xl hover:bg-lime-500 transform hover:-translate-y-0.5"
                    >
                        Start Free Trial
                    </button>
                    <button
                        class="px-8 py-3 text-lg font-bold text-white border-2 border-gray-600 rounded-xl transition duration-300 ease-in-out hover:border-lime-400 hover:text-lime-400"
                    >
                        Learn More
                    </button>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section
            id="features"
            class="py-20 md:py-24 bg-gray-900 border-t border-gray-800"
        >
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Built for the Modern Developer
                    </h2>
                    <p class="text-xl text-gray-400 max-w-2xl mx-auto">
                        Discover the core capabilities that set our platform
                        apart from the rest.
                    </p>
                </div>

                <!-- Features Grid -->
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {#each featuresData as feature}
                        <!-- Feature Card Markup (Inlined in Svelte template) -->
                        <div
                            class="p-6 bg-gray-800 rounded-xl shadow-2xl transition duration-300 ease-in-out hover:bg-gray-700/50 hover:shadow-lime-500/30 border border-gray-700"
                        >
                            <div
                                class="w-10 h-10 text-lime-400 mb-4 p-1.5 bg-gray-900 rounded-lg"
                                aria-hidden="true"
                            >
                                {@html feature.icon}
                            </div>
                            <h3 class="text-xl font-semibold text-white mb-2">
                                {feature.title}
                            </h3>
                            <p class="text-gray-400">{feature.description}</p>
                        </div>
                    {/each}
                </div>
            </div>
        </section>

        <!-- Simple CTA Banner -->
        <section class="py-16 md:py-20 bg-gray-800 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-3xl font-extrabold text-white mb-4">
                    Ready to launch your product?
                </h2>
                <p class="text-xl text-gray-400 mb-8">
                    Join thousands of innovators simplifying their development
                    process today.
                </p>
                <button
                    class="px-10 py-4 text-xl font-bold text-gray-900 bg-lime-400 rounded-xl transition duration-300 hover:bg-lime-500 shadow-xl"
                >
                    Get Started Now
                </button>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="py-8 border-t border-gray-800">
        <div
            class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm"
        >
            <p>
                &copy; {new Date().getFullYear()} Appify. All rights reserved.
            </p>
            <div class="mt-4 md:mt-0 space-x-6">
                <a href="#privacy" class="hover:text-lime-400">Privacy Policy</a
                >
                <a href="#terms" class="hover:text-lime-400">Terms of Service</a
                >
            </div>
        </div>
    </footer>
</div>
