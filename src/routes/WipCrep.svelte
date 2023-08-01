<script>
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { onMount } from 'svelte';

	const modelURL = '/crep.glb';
	let model = null;

	onMount(async () => {
		const loader = new GLTFLoader();
		model = await loader.loadAsync(modelURL);
	});

	let spin = 0, move = 0, moveFlip = false;

	SC.onFrame(() => {
		spin += 0.01;

		if (moveFlip) {
			move -= 0.001;
		} else {
			move += 0.001;
		}

		if (move >= 1) {
			moveFlip = true;
		}

		if (moveFlip && move <= 0.002) {
			moveFlip = false;
		}
	});

	let darkMode = false;
</script>

{#if model?.scene}
	<SC.Canvas
		antialias
		background={new THREE.Color(darkMode ? 0x100C08 : 'papayawhip')}
		fog={new THREE.FogExp2(darkMode ? 0x100C08 : 'papayawhip', 0.015)}
		shadows
	>
		<SC.Primitive
			object={model.scene}
			scale={[0.05, 0.05, 0.05]}
			position={[0, 0, move * 50]}
			rotation={[spin, 0, 0]}
		/>
		<SC.PerspectiveCamera position={[-4, -4, 80]} zoom={1} fov={35} />
		<SC.DirectionalLight intensity={darkMode ? 0.8 : 2} position={[-1, 3, 2]} shadow={{ mapSize: [2048, 2048] }} />
		<SC.Primitive
			object={new THREE.GridHelper(400, 400, 0x3D301F, 0x3D301F)}
			position={[0, -10, 0]}
		/>
	</SC.Canvas>

	<div class="fixed top-4 right-4">
		<button class:text-amber-400={darkMode} on:click={() => darkMode = !darkMode}>Noć / dan</button>
	</div>
{:else}
	<div class="flex items-center justify-center bg-zinc-900 text-zinc-200 h-screen text-8xl">
		Črep se fčitava...
	</div>
{/if}
