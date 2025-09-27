<script lang="ts">
    export let label: string = "";
    export let value: string = "";
    export let variant: "filled" | "outlined" = "outlined";
    export let fullWidth: boolean = false;

    const baseClasses = "relative";

    const variantClasses = {
        filled: "bg-gray-100 rounded-t-lg",
        outlined: "",
    };

    const inputClasses = {
        filled: "block w-full px-3 pt-6 pb-2 text-gray-900 bg-transparent appearance-none focus:outline-none focus:ring-0 peer",
        outlined:
            "block w-full px-3 pt-4 pb-2 text-gray-900 bg-transparent border rounded-md appearance-none focus:outline-none focus:ring-0 peer",
    };

    const labelClasses = {
        filled: "absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-3 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4",
        outlined:
            "absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-1 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4",
    };

    $: finalWrapperClasses = [
        baseClasses,
        variantClasses[variant],
        fullWidth ? "w-full" : "",
    ]
        .join(" ")
        .trim();
</script>

<div class={finalWrapperClasses}>
    <input
        type="text"
        bind:value
        placeholder=" "
        class="{inputClasses[variant]} {fullWidth ? 'w-full' : ''}"
    />
    <label class={labelClasses[variant]}>{label}</label>
    {#if variant === "outlined"}
        <fieldset
            aria-hidden="true"
            class="absolute inset-0 border border-gray-300 rounded-md -z-10"
        >
            <legend class="px-2 text-transparent select-none">{label}</legend>
        </fieldset>
    {/if}
</div>
