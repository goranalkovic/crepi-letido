<script>
	import '../app.postcss';

	import { fly } from 'svelte/transition';
	import { circIn, circOut } from 'svelte/easing';

	export let data;

    const direction = data.url === '/gableci/results' ? 1 : -1;
</script>

<div class="app">
	<main>
		{#key data.url}
			<div
				in:fly={{ x: direction * -100, duration: 400, delay: 350, easing: circOut }}
				out:fly={{ x: direction * 100, duration: 300, easing: circIn }}
			>
				<slot />
			</div>
		{/key}
	</main>
</div>
