<script>
	import { Canvas } from '@threlte/core';
	import CrepModel from '$lib/CrepModel.svelte';
</script>

<svelte:head>
	<title>Črepi letido</title>
	<meta name="description" content="Coming soon" />
</svelte:head>

<div class="fixed inset-0 -z-10">
	<Canvas>
		<CrepModel />
	</Canvas>
</div>
