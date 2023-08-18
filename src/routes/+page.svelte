<script>
	import { Canvas } from '@threlte/core';
	import { Kbd } from 'flowbite-svelte';
	import CrepModel from '$lib/CrepModel.svelte';
	import Mouse from 'phosphor-svelte/lib/Mouse';
	import MouseSimple from 'phosphor-svelte/lib/MouseSimple';
</script>

<svelte:head>
	<title>Črepi letido</title>
	<meta name="description" content="Črep simulator is a premiere way to see čreps flying" />
</svelte:head>

<div class="fixed inset-0">
	<Canvas>
		<CrepModel />
	</Canvas>
</div>
