<script>
	// @ts-nocheck

	import { useFrame } from '@threlte/core'
	import { Euler, Vector3 } from 'three'
	import Particle from './Particle.svelte'

	const getId = () => {
		return Math.random().toString(16).slice(2)
	}

	const getRandomPosition = () => {
		return new Vector3((Math.random() * 2) + 0.5 - Math.random() * 1, 5 - Math.random() * 1 + 40, (Math.random() * 20) + 0.5 - Math.random() * 1)
	}

	const getRandomRotation = () => {
		return new Euler(Math.random() * 10, Math.random() * 10, Math.random() * 10)
	}

	let bodies = [];

	let lastBodyMounted = 0
	let bodyEveryMilliseconds = 500
	let longevityMilliseconds = 6000

	useFrame(() => {
		if (lastBodyMounted + bodyEveryMilliseconds < Date.now()) {
			const body = {
				id: getId(),
				mounted: Date.now(),
				position: getRandomPosition(),
				rotation: getRandomRotation()
			}
			bodies.unshift(body)
			lastBodyMounted = Date.now()
			bodies = bodies
		}
		const deleteIds = []
		bodies.forEach((body) => {
			if (body.mounted + longevityMilliseconds < Date.now()) {
				deleteIds.push(body.id)
			}
		})

		if (deleteIds.length) {
			deleteIds.forEach((id) => {
				const index = bodies.findIndex((body) => body.id === id)
				if (index !== -1) bodies.splice(index, 1)
			})
			bodies = bodies
		}
	})
</script>

{#each bodies as body (body.id)}
	<Particle position={body.position} rotation={body.rotation} />
{/each}
