<script>
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import CrepModel from '$lib/CrepModel.svelte';
</script>

<svelte:head>
	<title>Črepi letido</title>
	<meta name="description" content="Črep simulator is a premiere way to see čreps flying" />
</svelte:head>

<div class="fixed inset-0">
	<Canvas>

		<World>
			<CrepModel />
		</World>
	</Canvas>
</div>
