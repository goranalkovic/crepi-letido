<script>
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { Suspense } from '@threlte/extras';
	import Crepi from './Crepi.svelte';
	import { Grid } from '@threlte/extras';

	import { Spinner, Card } from 'flowbite-svelte';
	import { Float } from '@threlte/extras';

	let darkMode = document?.documentElement?.classList?.contains('dark') ?? false;

	const observer = new MutationObserver((mutations) => {
		mutations.forEach(({ attributeName, target }) => {
			if (attributeName !== 'class') {
				return;
			}

			// @ts-ignore
			const currentClassState = target?.classList?.contains('dark');

			if (currentClassState !== darkMode) {
				darkMode = currentClassState;
			}
		});
	});

	observer.observe(document.documentElement, { attributes: true });
</script>

<T.OrthographicCamera makeDefault position={[40, 40, 40]} rotation={[-44, -14, 4]} zoom={25}>
	<OrbitControls enableDamping />
</T.OrthographicCamera>
<Grid
	cellSize={0}
	sectionSize={5}
	sectionColor={darkMode ? '#55555f' : '#fefecc'}
	sectionThickness={1}
	fadeDistance={180}
	fadeStrength={1}
	infiniteGrid
/>

<Float floatingRange={[-5, 5]} rotationIntensity={1} rotationSpeed={4} speed={8}>
	<Suspense>
		<div class="absolute inset-0" slot="fallback">
			<Card padding="sm" shadow={false} rounded class="gap-4 items-center m-auto">
				<Spinner size="20" />
				<p class="text-xl dark:text-white">Črep se fčitava...</p>
			</Card>
		</div>
		<Crepi
			{darkMode}
			position={[2, 21, 20]}
			scale={[0.15, -0.15, 0.15]}
			rotation={[0, -0.005, -0.5]}
		/>
		<Crepi {darkMode} position={[23, 10, 20]} scale={[0.15, -0.15, 0.15]} rotation={[0, 0, 0.5]} />
	</Suspense>
</Float>
<T.AmbientLight intensity={0.25} />
