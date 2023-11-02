<script>
	// @ts-nocheck
	import { T } from '@threlte/core';
	import { Collider, RigidBody } from '@threlte/rapier';
	import Crep from './Crep.svelte';

	export let position = undefined;
	export let rotation = undefined;

	$: rotationCasted = rotation?.toArray();
</script>

<T.Group position={position?.toArray()}>
	<RigidBody type='dynamic'>
		<Collider
			contactForceEventThreshold={30}
			restitution={0.1}
			shape='cuboid'
			args={[0.5, 0.25, 0.5]}
		/>
		<Crep rotation={rotationCasted} />
	</RigidBody>
</T.Group>
