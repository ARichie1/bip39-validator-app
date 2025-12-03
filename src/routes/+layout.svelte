<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import "../app.css"
	let { children } = $props();
</script>

<svelte:head>
	<title>BIP39 Validator Playground</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<main>
	{@render children()}
</main>