<script>
	// @ts-nocheck
	import CloudX from 'phosphor-svelte/lib/CloudX';
	import Exclude from 'phosphor-svelte/lib/Exclude';
	import Van from 'phosphor-svelte/lib/Van';
	import Phone from 'phosphor-svelte/lib/Phone';
	import ForkKnife from 'phosphor-svelte/lib/ForkKnife';
	import Pencil from 'phosphor-svelte/lib/Pencil';
	import Intersect from 'phosphor-svelte/lib/Intersect';

	import { people } from '../people';

	import {
		Button,
		Dropdown,
		DropdownItem,
		Avatar,
		DropdownDivider,
		Spinner,
		Card,
		Heading,
		P,
		Span,
		Alert,
		GradientButton,
		Badge
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';

	let activeUsers = [];

	const getData = async () => {
		const response = await fetch('/db');
		const { restData, dbData: data } = await response.json();

		if (data?.length < 1) {
			return null;
		}

		activeUsers = data.map(({ name }) => name);

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

<svelte:head>
	<title>Črepi letido | Gablec picker - Results</title>
	<meta name="description" content="Picked-a-gablec" />
</svelte:head>

<div
	class="container flex flex-wrap justify-center md:justify-between items-center mx-auto px-8 gap-8 mb-10 pt-10 md:mb-20"
>
	<div class="max-md:w-full">
		<Heading
			tag="h1"
			class="mb-4"
			customSize="text-4xl font-bold md:text-5xl lg:text-6xl font-display max-md:text-center"
		>
			Rezultati izbora za <Span
				gradient
				class="from-purple-600 to-blue-500 dark:from-pink-500 dark:to-orange-400">gablec dana</Span
			>
		</Heading>
		<P class="font-light max-md:text-center">
			Pogleč ispod ak ima intersektija.
			<br />
			Ak ima, super, onda jedan od tih restorana. Ak ne, le fuq.
		</P>
	</div>

	<div>
		{#if activeUsers?.length > 0}
			<Button size="lg" color="light" id="person-picker" class="w-48 justify-start gap-2">
				<Pencil color="currentColor" size="18" />
				Uredi jela
			</Button>
			<Dropdown inline triggeredBy="#person-picker" class="w-48">
				{#each Object.entries(people).filter( ([slug]) => activeUsers.includes(slug) ) as [slug, name]}
					{#if slug === 'ext1'}
						<DropdownDivider />
					{/if}

					<DropdownItem
						class="flex items-center text-base font-semibold gap-2 hover:bg-gray-100 dark:hover:bg-gray-600"
						on:click={() => goto(`/gableci?edit=${slug}`)}
					>
						{#if slug?.startsWith('ext')}
							<Avatar size="xs">{slug.replace('ext', 'G')}</Avatar>
						{:else}
							<Avatar src={`/profile-pictures/${slug}.jpg`} size="xs" />
						{/if}

						<span>{name}</span>
					</DropdownItem>
				{/each}
			</Dropdown>
		{/if}
	</div>
</div>

<div class="container mx-auto mb-10 md:mb-20 px-8">
	{#await getData()}
		<Card padding="xl" shadow rounded class="gap-4 items-center m-auto">
			<Spinner size="20" />
			<P>Spij si jenu, ovo bu za čas</P>
		</Card>
	{:then fetchedData}
		{#if !fetchedData}
			<Card padding="xl" shadow rounded class="gap-4 items-center m-auto">
				<p class="text-4xl">🦗🦗</p>
				<P weight="light" class="-mt-5 opacity-20 select-none">(cvrčki)</P>
				<P size="5xl" class="font-display">Nitko nije odabral...</P>

				<GradientButton href="/gableci" color="tealToLime" shadow size="xl">
					Promijeni to
				</GradientButton>
			</Card>
		{:else}
			{@const { rawData, intersects, nonIntersects, restData } = fetchedData}
			{@const allPickers = Object.keys(rawData.choices)}
			{@const hasIntersect = Object.keys(intersects)?.length > 0}

			{#if hasIntersect}
				<Heading tag="h2" class="mx-auto py-10 font-display flex items-center gap-4">
					<Intersect size="36" color="currentColor" weight="light" />
					Intersecti
				</Heading>

				<div class="flex flex-col sm:grid sm:auto-rows-auto sm:grid-cols-fill-96 gap-8">
					{#each Object.entries(intersects) as [restName, choices]}
						<Card class="max-w-none">
							<div class="flex items-center gap-4">
								<img
									src={`/restaurant-icons/${restName}.png`}
									alt={restData[restName].name}
									class="w-7 h-7 mb-3"
								/>
								<h5
									class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white"
								>
									{restData[restName].name}
								</h5>
							</div>

							<div class="font-normal text-gray-500 dark:text-gray-400 flex gap-8 leading-none">
								{#if restData[restName].meta.url && restData[restName].meta.urlType === 'menu'}
									<Button
										color="alternative"
										href={restData[restName].meta.url}
										target="_blank"
										rel="noreferrer nofollow"
										size="xs"
									>
										<div class="flex items-center gap-2 mt-auto">
											<ForkKnife color="currentColor" size="20" weight="duotone" />
											<span>Ponuda jela</span>
										</div>
									</Button>
								{/if}

								{#if restData[restName].meta.url && restData[restName].meta.urlType === 'additional'}
									<Button
										color="alternative"
										href={restData[restName].meta.url}
										target="_blank"
										rel="noreferrer nofollow"
										size="xs"
									>
										<div class="flex items-center gap-2 mt-auto">
											<ForkKnife color="currentColor" size="20" weight="duotone" />
											<span>Dod. ponuda</span>
										</div>
									</Button>
								{/if}

								{#if restData[restName].meta.phone}
									<p class="flex items-center gap-2">
										<Phone color="currentColor" size="24" weight="duotone" />
										<span class="max-w-[13ch]">{restData[restName].meta.phone}</span>
									</p>
								{/if}

								{#if restData[restName].meta.delivery}
									<p class="flex items-center gap-2">
										<Van color="currentColor" size="24" weight="duotone" />
										{restData[restName].meta.delivery}
									</p>
								{/if}
							</div>

							<div class="flex flex-col gap-2 mt-4 divide-y divide-gray-200 dark:divide-gray-700">
								{#each choices as person}
									<div class="pt-4 pb-2 last:pb-0">
										<div class="flex items-center space-x-4 mb-2">
											{#if person?.startsWith('ext')}
												<Avatar size="sm">{person.replace('ext', 'G')}</Avatar>
											{:else}
												<Avatar size="sm" src={`/profile-pictures/${person}.jpg`} />
											{/if}

											<div class="space-y-1 font-medium text-lg dark:text-white">
												<div>{people[person]}</div>
											</div>
										</div>

										<ul class="w-full flex flex-col gap-2">
											{#each rawData.choices[person][restName].split(',') as index}
												{@const mealPrice = restData?.[restName]?.meals[index - 1]?.price
													?.replace(/\(.*\s*\)/g, '')
													?.trim()}

												<li class="flex gap-2 justify-between">
													<p class="text-base text-gray-500 truncate dark:text-gray-400">
														{restData[restName].meals[index - 1].name}
													</p>

													{#if mealPrice?.length > 0}
														<Badge large color="dark" class="shrink-0">{mealPrice}</Badge>
													{/if}
												</li>
											{/each}
										</ul>
									</div>
								{/each}
							</div>
						</Card>
					{/each}
				</div>
			{:else}
				<Card color="red" class="flex flex-col items-center gap-4 mx-auto">
					<Exclude color="currentColor" size="64" weight="duotone" />
					<h5
						class="mb-2 text-6xl font-display font-semibold tracking-tight text-gray-900 dark:text-white text-center"
					>
						Nema intersecta
					</h5>
				</Card>
			{/if}

			<Heading tag="h2" class="mx-auto py-10 font-display flex items-center gap-4">
				<Exclude size="36" color="currentColor" weight="light" />
				{hasIntersect ? 'Ostali restorani' : 'Backup izbori'}
			</Heading>

			<div class="flex flex-col sm:grid sm:auto-rows-auto sm:grid-cols-fill-96 gap-8">
				{#each Object.entries(nonIntersects).sort((a, b) => b[1]?.length - a[1]?.length) as [restName, choices]}
					<Card class="max-w-none">
						<div class="flex items-center gap-4">
							<img
								src={`/restaurant-icons/${restName}.png`}
								alt={restData[restName].name}
								class="w-7 h-7 mb-3"
							/>
							<h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
								{restData[restName].name}
							</h5>
						</div>

						<div class="font-normal text-gray-500 dark:text-gray-400 flex gap-8 leading-none">
							{#if restData[restName].meta.url && restData[restName].meta.urlType === 'menu'}
								<Button
									color="alternative"
									href={restData[restName].meta.url}
									target="_blank"
									rel="noreferrer nofollow"
									size="xs"
								>
									<div class="flex items-center gap-2 mt-auto">
										<ForkKnife color="currentColor" size="20" weight="duotone" />
										<span>Ponuda jela</span>
									</div>
								</Button>
							{/if}

							{#if restData[restName].meta.url && restData[restName].meta.urlType === 'additional'}
								<Button
									color="alternative"
									href={restData[restName].meta.url}
									target="_blank"
									rel="noreferrer nofollow"
									size="xs"
								>
									<div class="flex items-center gap-2 mt-auto">
										<ForkKnife color="currentColor" size="20" weight="duotone" />
										<span>Dod. ponuda</span>
									</div>
								</Button>
							{/if}

							{#if restData[restName].meta.phone}
								<p class="flex items-center gap-2">
									<Phone color="currentColor" size="24" weight="duotone" />
									<span class="max-w-[13ch]">{restData[restName].meta.phone}</span>
								</p>
							{/if}

							{#if restData[restName].meta.delivery}
								<p class="flex items-center gap-2">
									<Van color="currentColor" size="24" weight="duotone" />
									{restData[restName].meta.delivery}
								</p>
							{/if}
						</div>

						<div class="flex flex-col gap-2 mt-4 divide-y divide-gray-200 dark:divide-gray-700">
							{#each choices as person}
								<div class="pt-4 pb-2">
									<div class="flex items-center space-x-4 mb-2">
										{#if person?.startsWith('ext')}
											<Avatar size="sm">{person.replace('ext', 'G')}</Avatar>
										{:else}
											<Avatar size="sm" src={`/profile-pictures/${person}.jpg`} />
										{/if}

										<div class="space-y-1 font-medium text-lg dark:text-white">
											<div>{people[person]}</div>
										</div>
									</div>

									<ul class="w-full flex flex-col gap-2">
										{#each rawData.choices[person][restName].split(',') as index}
											{@const mealPrice = restData?.[restName]?.meals[index - 1]?.price
												?.replace(/\(.*\s*\)/g, '')
												?.trim()}

											<li class="flex gap-2 justify-between">
												<p class="text-base text-gray-500 truncate dark:text-gray-400">
													{restData[restName].meals[index - 1].name}
												</p>

												{#if mealPrice?.length > 0}
													<Badge large color="dark" class="shrink-0">{mealPrice}</Badge>
												{/if}
											</li>
										{/each}
									</ul>
								</div>
							{/each}
						</div>

						<Alert border color="red" class="mt-auto p-4">
							<p class="font-display text-2xl mb-2">Intersect breakeri</p>
							<div class="flex -space-x-2">
								{#each allPickers.filter((p) => !choices.includes(p)) as missingPersonSlug}
									{#if missingPersonSlug?.startsWith('ext')}
										<Avatar>{missingPersonSlug.replace('ext', 'G')}</Avatar>
									{:else}
										<Avatar src={`/profile-pictures/${missingPersonSlug}.jpg`} />
									{/if}
								{/each}
							</div>
						</Alert>
					</Card>
				{/each}
			</div>
		{/if}
	{:catch error}
		<div class="w-full py-40 flex flex-col gap-4 items-center justify-center">
			<Alert color="red" class="w-64 mx-auto">
				<div class="flex items-center gap-3">
					<CloudX color="currentColor" size="20" slot="icon" />
					<span class="text-lg font-medium">Neke je crklo</span>
				</div>
				<p class="mt-2 mb-4 text-sm">
					Ne znamo ni mi točno kaj je bilo, ali evo errora:

					<details>
						<summary>Klikni ovdje za detalje</summary>
						<pre class="font-mono text-sm">{error.message}</pre>
					</details>
				</p>
				<div class="flex gap-2">
					<Button
						size="xs"
						color="red"
						href="https://gableci.hr/vz/"
						target="_blank"
						rel="noreferrer nofollow"
					>
						Jæbiga, ideme ručno
					</Button>
				</div>
			</Alert>
		</div>
	{/await}
</div>
