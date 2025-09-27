<script lang="ts">
    export let variant: "text" | "outlined" | "contained" = "text";
    export let color: "primary" | "secondary" | "default" = "default";
    export let onClick: () => void = () => {};

    const baseClasses =
        "font-bold py-2 px-4 rounded inline-flex items-center justify-center";

    const variantClasses = {
        text: "bg-transparent hover:bg-gray-100",
        outlined: "bg-transparent border",
        contained: "shadow",
    };

    const colorClasses = {
        primary: {
            text: "text-blue-500 hover:bg-blue-50",
            outlined: "border-blue-500 text-blue-500 hover:bg-blue-50",
            contained: "bg-blue-500 text-white hover:bg-blue-700",
        },
        secondary: {
            text: "text-purple-500 hover:bg-purple-50",
            outlined: "border-purple-500 text-purple-500 hover:bg-purple-50",
            contained: "bg-purple-500 text-white hover:bg-purple-700",
        },
        default: {
            text: "text-gray-800 hover:bg-gray-200",
            outlined: "border-gray-500 text-gray-800 hover:bg-gray-200",
            contained: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        },
    };

    $: finalClasses = [
        baseClasses,
        variantClasses[variant],
        colorClasses[color][variant],
    ]
        .join(" ")
        .trim();
</script>

<button class={finalClasses} on:click={onClick}>
    <slot />
</button>
