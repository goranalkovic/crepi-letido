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

<div
	class="fixed bottom-5 left-5 z-10 pointer-events-none select-none flex flex-wrap items-center gap-8"
>
	<div class="flex items-center gap-2">
		<Kbd class="px-2 py-1.5"><Mouse size="16" color="currentColor" /></Kbd>
		<span>Rotate/orbit</span>
	</div>

	<div class="flex items-center gap-2">
		<Kbd class="px-2 py-1.5">Ctrl / Shift</Kbd>
		+
		<Kbd class="px-2 py-1.5"><Mouse size="16" color="currentColor" /></Kbd>
		<span>Pan</span>
	</div>

	<div class="flex items-center gap-2">
		<Kbd class="px-2 py-1.5"><MouseSimple size="16" color="currentColor" /></Kbd>
		<span>Zoom</span>
	</div>
</div>
