<script>
	import '../app.postcss';

	import { fly } from 'svelte/transition';
	import { circIn, circOut } from 'svelte/easing';
	import GableciNavbar from '$lib/GableciNavbar.svelte';
	import GableciFooter from '$lib/GableciFooter.svelte';

	export let data;

	const direction = data.url === '/gableci/results' ? 1 : -1;
</script>

<header class="my-8 mx-auto px-8 container sticky top-8 z-10">
	<GableciNavbar />
</header>

{#key data.url}
	<main
		in:fly={{ x: direction * -100, duration: 400, delay: 350, easing: circOut }}
		out:fly={{ x: direction * 100, duration: 300, easing: circIn }}
	>
		<slot />
	</main>
{/key}

<GableciFooter />
