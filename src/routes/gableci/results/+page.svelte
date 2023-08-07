<script>
	// @ts-nocheck
	import CloudX from 'phosphor-svelte/lib/CloudX';
	import Intersect from 'phosphor-svelte/lib/Intersect';
	import Exclude from 'phosphor-svelte/lib/Exclude';
	import CaretLeft from 'phosphor-svelte/lib/CaretLeft';
	import Van from 'phosphor-svelte/lib/Van';
	import Phone from 'phosphor-svelte/lib/Phone';
	import ForkKnife from 'phosphor-svelte/lib/ForkKnife';

	import { people } from '../people';

	const getData = async () => {
		const response = await fetch('/db');
		const { restData, dbData: data } = await response.json();

		const mappedData = data?.reduce((current, item) => {
			let newIntersects = { ...current.intersectHelper };

			Object.keys(item.selections).forEach((sel) => {
				if (sel in newIntersects) {
					newIntersects[sel]++;
				} else {
					newIntersects[sel] = 1;
				}
			});

			return {
				...current,
				intersectHelper: newIntersects,
				choices: {
					...current.choices,
					[item.name]: item.selections
				}
			};
		}, {});

		const intersects = Object.keys(mappedData.intersectHelper)
			.filter(Boolean)
			.filter((c) => mappedData.intersectHelper[c] === data.length)
			.reduce((curr, key) => {
				return {
					...curr,
					[key]: Object.entries(mappedData.choices).reduce((c, [personSlug, restaurants]) => {
						if (Object.keys(restaurants).includes(key)) {
							return [...c, personSlug];
						}

						return [...c];
					}, [])
				};
			}, {});

		const nonIntersects = Object.keys(mappedData.intersectHelper).reduce((curr, key) => {
			if (Object.keys(intersects).includes(key)) {
				return curr;
			}

			return {
				...curr,
				[key]: Object.entries(mappedData.choices).reduce((c, [personSlug, restaurants]) => {
					if (Object.keys(restaurants).includes(key)) {
						return [...c, personSlug];
					}

					return [...c];
				}, [])
			};
		}, {});

		return {
			rawData: mappedData,
			noOfPeople: data.length,
			intersects: intersects,
			nonIntersects: nonIntersects,
			restData: restData.restaurants.reduce((current, item) => {
				return {
					...current,
					[item.slug]: { name: item.name, meals: item.meals, meta: item.meta }
				};
			}, {})
		};
	};
</script>

{#await getData()}
	<div class="w-full py-40 flex items-center justify-center">
		<span class="loading loading-spinner loading-lg" />
	</div>
{:then { rawData, intersects, nonIntersects, restData }}
	<a class="btn btn-outline btn-sm flex gap-1 fixed top-4 left-4 normal-case" href="/gableci">
		<CaretLeft weight='duotone' size='18' color='currentColor' />
		Buš si još nekaj izabral?
	</a>

	<div class="p-10 pt-40 flex justify-center">
		<h1 class="text-6xl font-semibold tracking-tight">Ke bumo denes jeli?</h1>
	</div>

	{@const hasIntersect = Object.keys(intersects)?.length > 0}

	{#if hasIntersect}
		<div class="flex flex-wrap gap-8 p-10 justify-center">
			{#each Object.entries(intersects) as [restName, choices]}
				<div class="card w-96 bg-base-100 shadow-xl">
					<figure class="px-10 pt-10">
						<Intersect color="currentColor" size="64" weight="duotone" />
					</figure>
					<div class="card-body items-center text-center">
						<h2 class="card-title">{restData[restName].name}</h2>

						<div class="card-actions items-center text-sm gap-8">
							{#if restData[restName].meta.phone}
								<div class="flex items-center gap-2">
									<Phone color="currentColor" size="20" weight="duotone" />
									{restData[restName].meta.phone}
								</div>
							{/if}

							{#if restData[restName].meta.url}
								<a
									href={restData[restName].meta.url}
									target="_blank"
									rel="noreferrer nofollow"
									class="btn btn-sm normal-case flex items-center gap-2"
								>
									<ForkKnife color="currentColor" size="20" weight="duotone" />

									Pogleč kaj ima
								</a>
							{/if}

							{#if restData[restName].meta.delivery}
								<div class="flex items-center gap-2">
									<Van color="currentColor" size="20" weight="duotone" />
									{restData[restName].meta.delivery}
								</div>
							{/if}
						</div>

						<div class="text-left w-full pt-1 mt-4 border-t border-t-base-300">
							{#each choices as person}
								<h3 class="text-base font-semibold mt-5 mb-1">{people[person]}</h3>

								<ul class="text-xs leading-tight space-y-2">
									{#each rawData.choices[person][restName].split(',') as index}
										<li class="">{restData[restName].meals[index - 1].name}</li>
									{/each}
								</ul>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="p-10 flex justify-center">
			<div class="card w-96 bg-base-100 shadow-xl">
				<figure class="px-10 pt-10">
					<Exclude color="currentColor" size="64" weight="duotone" />
				</figure>
				<div class="card-body items-center text-center">
					<h2 class="card-title">Nema intersecta 🥲</h2>
				</div>
			</div>
		</div>
	{/if}

	<div class="p-10 pb-2 flex justify-center">
		<h2 class="text-4xl">
			{hasIntersect ? 'Ostali restorani' : 'Backup izbori'}
		</h2>
	</div>

	<div class="flex flex-wrap gap-8 p-10 pb-40 justify-center">
		{#each Object.entries(nonIntersects) as [restName, choices]}
			<div class="card w-96 bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">{restData[restName].name}</h2>

					{#each choices as person}
						<h3 class="text-base font-semibold mt-5 mb-1">{people[person]}</h3>

						<ul class="text-xs leading-tight space-y-2">
							{#each rawData.choices[person][restName].split(',') as index}
								<li class="">{restData[restName].meals[index - 1].name}</li>
							{/each}
						</ul>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{:catch error}
	<div class="w-full py-40 flex flex-col gap-4 items-center justify-center">
		<div class="alert alert-error text-white dark:text-black w-96">
			<CloudX color="currentColor" size="24" weight="duotone" />
			<span>Neke je crklo. Pogleč ispod.</span>
		</div>

		<pre class="font-mono text-sm">{error.message}</pre>

		<a
			class="btn btn-outline btn-xs normal-case"
			href="https://gableci.hr/vz/"
			target="_blank"
			rel="noreferrer nofollow"
		>
			Jæbiga, ideme ručno
		</a>
	</div>
{/await}
