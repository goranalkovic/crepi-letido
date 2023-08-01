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
</script>

{#if model?.scene}
	<SC.Canvas
		antialias
		background={new THREE.Color('papayawhip')}
		fog={new THREE.FogExp2('papayawhip', 0.015)}
		shadows
	>
		<SC.Primitive
			object={model.scene}
			scale={[0.05, 0.05, 0.05]}
			position={[0, 0, move * 50]}
			rotation={[spin, 0, 0]}
		/>
		<SC.PerspectiveCamera position={[-4, -4, 80]} zoom={1} fov={35} />
		<SC.DirectionalLight intensity={2} position={[-1, 3, 2]} shadow={{ mapSize: [2048, 2048] }} />
		<SC.Primitive
			object={new THREE.GridHelper(400, 400, 0xD0C3AE, 0xD0C3AE)}
			position={[0, -10, 0]}
		/>
	</SC.Canvas>
{:else}
	Črep se fčitava...
{/if}
