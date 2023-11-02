<script>
	// @ts-nocheck
	import { T } from '@threlte/core';
	import { OrbitControls, Suspense, Grid, Sky } from '@threlte/extras';

	import { Spinner, Card } from 'flowbite-svelte';

	import { AutoColliders } from '@threlte/rapier';
	import Emitter from './Emitter.svelte';

	let darkMode = document?.documentElement?.classList?.contains('dark') ?? false;

	const observer = new MutationObserver((mutations) => {
		mutations.forEach(({ attributeName, target }) => {
			if (attributeName !== 'class') {
				return;
			}

			const currentClassState = target?.classList?.contains('dark');

			if (currentClassState !== darkMode) {
				darkMode = currentClassState;
			}
		});
	});

	observer.observe(document.documentElement, { attributes: true });
</script>

<Sky
	turbidity={darkMode ? 20 : 0.65}
	rayleigh={darkMode ? 0.57 : 0.17}
	azimuth={180}
	elevation={darkMode ? -5 : 85}
	mieCoefficient={darkMode ? 0.038 : 0.013}
	exposure={darkMode ? 0.26 : 1}
/>

<T.PerspectiveCamera makeDefault position={[-95, 148, 60]} fov={25} zoom={1.65}>
	<OrbitControls enableDamping />
</T.PerspectiveCamera>

<Grid
	cellSize={0}
	sectionSize={5}
	sectionColor={darkMode ? '#55555f' : '#fefecc'}
	sectionThickness={1}
	fadeDistance={180}
	fadeStrength={1}
	infiniteGrid
/>

<Suspense>
	<div class="absolute inset-0" slot="fallback">
		<Card padding="sm" shadow={false} rounded class="gap-4 items-center m-auto">
			<Spinner size="20" />
			<p class="text-xl dark:text-white">Črep se fčitava...</p>
		</Card>
	</div>

	<T.Group position={[0, 10, 0]} rotation={[0, 0, 10]}>
		<AutoColliders shape="cuboid">
			<T.Mesh receiveShadow position={[0, 0, 5]}>
				<T.BoxGeometry args={[20, 0.125, 45]} />
				<T.MeshPhysicalMaterial
				roughness={1}
				color={darkMode ? '#242834' : 'white'}
				/>
			</T.Mesh>
		</AutoColliders>
	</T.Group>

	<Emitter />
</Suspense>

<T.SpotLight position={[0, 25, 30]} rotation={[-40,10,30]} castShadow />