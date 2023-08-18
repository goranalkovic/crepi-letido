<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import Van from 'phosphor-svelte/lib/Van';
	import Phone from 'phosphor-svelte/lib/Phone';
	import CloudX from 'phosphor-svelte/lib/CloudX';
	import XCircle from 'phosphor-svelte/lib/XCircle';
	import PaperPlaneTilt from 'phosphor-svelte/lib/PaperPlaneTilt';
	import ForkKnife from 'phosphor-svelte/lib/ForkKnife';
	import ArrowSquareOut from 'phosphor-svelte/lib/ArrowSquareOut';
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle';
	import User from 'phosphor-svelte/lib/User';

	import { people } from '../people';

	import {
		Button,
		Dropdown,
		DropdownItem,
		Avatar,
		DropdownDivider,
		GradientButton,
		Checkbox,
		Spinner,
		Card,
		Banner,
		Heading,
		P,
		Span,
		Alert
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';

	export let data;

	let { supabase, session, userData } = data;
	$: ({ supabase, session, userData } = data);

	let selections = {};

	onMount(async () => {
		const response = await fetch('/api/get-person-selections');
		const [dbData] = await response.json();

		if (!dbData || (Array.isArray(dbData) && dbData?.length < 1)) {
			return;
		}

		Object.entries(dbData.selections).forEach(([restaurantName, selectedIndexes]) => {
			selectedIndexes
				.split(',')
				.map((val) => parseInt(val))
				.forEach((ind) => (selections[restaurantName][ind - 1] = true));
		});
	});

	const getData = async () => {
		const response = await fetch('/api/get-gableci');
		const { data } = await response.json();

		selections = data?.restaurants?.filter(Boolean)?.reduce((current, { slug, meals }) => {
			return {
				...current,
				[slug]: Array(meals.length).fill(false)
			};
		}, {});

		return data;
	};

	$: numberOfSelections = Object.values(selections)?.flat()?.filter(Boolean)?.length ?? false;
	$: allowSubmit = Object.values(selections)?.some((r) => r.some((m) => m)) ?? false;

	$: yourName = userData?.email;

	const handleClick = async () => {
		const selectionsToSend = Object.entries(selections)
			?.filter(Boolean)
			?.reduce((current, [key, value]) => {
				const selections = value
					?.map((item, i) => (item ? i + 1 : null))
					?.filter(Boolean)
					?.join(',');

				if (!selections || selections?.length < 1) {
					return current;
				}

				return {
					...current,
					[key]: selections
				};
			}, {});


		await fetch('/api/set-gablec-data', {
			method: 'POST',
			body: JSON.stringify(selectionsToSend),
			headers: {
				'content-type': 'application/json'
			}
		});

		goto('/gablec-results');
	};
</script>

<svelte:head>
	<title>Črepi letido | Gablec picker</title>
	<meta name="description" content="Pick-a-gablec" />
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
			Kaj bumo denes za <Span
				gradient
				class="from-purple-600 to-blue-500 dark:from-pink-500 dark:to-orange-400">gablec</Span
			>?
		</Heading>
		<P class="font-light max-md:text-center">
			Pogleč si jela ispod i uzmi kaj ti se sviđa.
			<br />
			Odabiri se budu mogli uređivati poslije ak fulaš nekaj.
		</P>
	</div>

	<div>
		<!-- <Button size="lg" color="light" id="person-picker" class="w-48 justify-start">
			{#if yourName?.startsWith('ext')}
				<Avatar class="mr-2">{yourName.replace('ext', 'G')}</Avatar>
			{:else if Object.keys(people).includes(yourName)}
				<Avatar src={`/profile-pictures/${yourName}.jpg`} class="mr-2" />
			{:else}
				<Avatar class="mr-2"><User size="18" color="currentColor" /></Avatar>
			{/if}
			{people?.[yourName] ?? 'Koji si ti?'}
		</Button>
		<Dropdown inline triggeredBy="#person-picker" class="w-48">
			{#each Object.entries(people) as [slug, name]}
				{#if slug === 'ext1'}
					<DropdownDivider />
				{/if}

				<DropdownItem
					class="flex items-center text-base font-semibold gap-2 hover:bg-gray-100 dark:hover:bg-gray-600"
					on:click={() => (yourName = slug)}
					disabled={slug === yourName}
				>
					{#if slug?.startsWith('ext')}
						<Avatar size="xs">{slug.replace('ext', 'G')}</Avatar>
					{:else}
						<Avatar src={`/profile-pictures/${slug}.jpg`} size="xs" />
					{/if}

					<span>{name}</span>

					{#if slug === yourName}
						<span class="ml-auto text-emerald-600 dark:text-lime-400">
							<CheckCircle color="currentColor" size="20" weight="fill" />
						</span>
					{/if}
				</DropdownItem>
			{/each}
		</Dropdown> -->
	</div>
</div>

<div class="container mx-auto mb-10 md:mb-20 px-8">
	{#await getData()}
		<Card padding="xl" shadow rounded class="gap-4 items-center m-auto">
			<Spinner size="20" />
			<P>Spij si jenu, ovo bu za čas</P>
		</Card>
	{:then value}
		{#if !value}
			<Alert color="red" class="w-64 mx-auto">
				<div class="flex items-center gap-3">
					<XCircle color="currentColor" size="20" slot="icon" />
					<span class="text-lg font-medium">Neke je crklo</span>
				</div>
				<p class="mt-2 mb-4 text-sm">
					Nema nijenog jela.
					<br />
					Reci Gocu da je sjebal.
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
		{:else}
			<div class="flex flex-col sm:grid sm:auto-rows-auto sm:grid-cols-fill-96 gap-8">
				{#each value.restaurants as restaurant}
					<Card class="max-w-none">
						<div class="flex items-center gap-4">
							<img
								src={`/restaurant-icons/${restaurant.slug}.png`}
								alt={restaurant.name}
								class="w-7 h-7 mb-3"
							/>
							<h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
								{restaurant.name}
							</h5>
						</div>

						<div class="font-normal text-gray-500 dark:text-gray-400 flex gap-8 leading-none">
							{#if restaurant.meta.url && restaurant.meta.urlType === 'menu'}
								<Button
									color="alternative"
									href={restaurant.meta.url}
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

							{#if restaurant.meta.phone}
								<p class="flex items-center gap-2">
									<Phone color="currentColor" size="24" weight="duotone" />
									<span class="max-w-[13ch]">{restaurant.meta.phone}</span>
								</p>
							{/if}

							{#if restaurant.meta.delivery}
								<p class="flex items-center gap-2">
									<Van color="currentColor" size="24" weight="duotone" />
									{restaurant.meta.delivery}
								</p>
							{/if}
						</div>

						<div class="flex flex-col gap-2 mt-5">
							{#each restaurant.meals as meal, i}
								<Checkbox custom bind:checked={selections[restaurant.slug][i]}>
									<div
										class="font-normal p-4 w-full text-gray-500 bg-white rounded-lg border-2 border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-primary-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
									>
										<div
											class="flex gap-2 mb-1"
											class:hidden={!meal?.meta?.isVegetarian && !meal?.meta?.isVegan}
										>
											{#if meal?.meta?.isVegetarian}
												<abrr title="Vegetarian">🥬</abrr>
											{/if}

											{#if meal?.meta?.isVegan}
												<abrr title="Vegan">🌱</abrr>
											{/if}
										</div>

										<div class="w-full text-lg font-semibold flex items-center gap-2">
											{meal.name}

											{#if restaurant.meta.url && restaurant.meta.urlType === 'additional' && (meal?.isCustomItem ?? false)}
												<Button
													color="light"
													href={restaurant.meta.url}
													target="_blank"
													rel="noreferrer nofollow"
													class="!p-1"
													size="xs"
													outline
												>
													<ArrowSquareOut color="currentColor" size="18" weight="duotone" />
												</Button>
											{/if}
										</div>

										{#if meal.price}
											<div class="w-full text-sm">
												{meal.price}
											</div>
										{/if}
									</div>
								</Checkbox>
							{/each}
						</div>
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

{#if allowSubmit && yourName?.trim()?.length > 0}
	{@const avatar = userData.user_metadata.avatar}
	{@const firstName = userData.user_metadata.firstName}
	{@const lastName = userData.user_metadata.lastName}

	<Banner
		bannerType="bottom"
		dismissable={false}
		innerClass="container flex flex-wrap items-center justify-between px-4 md:px-8 gap-8"
	>
		<div class="flex items-center gap-2">
			{#if Object.keys(people).includes(avatar)}
				<Avatar src={`/profile-pictures/${avatar}.jpg`} class="mr-2" />
			{:else}
				<Avatar class="mr-2">{firstName.charAt(0)}{lastName.charAt(0)}</Avatar>
			{/if}

			<P size="2xl">
				{firstName}
				{lastName}
			</P>
		</div>

		<div class="flex items-center gap-8">
			<P size="lg" class="max-md:hidden">
				Odabrano {numberOfSelections}
				{numberOfSelections.toString().endsWith('1') ? 'jelo' : 'jela'}
			</P>

			<GradientButton color="lime" on:click={handleClick} shadow size="xl">
				<div class="flex items-center gap-2">
					<PaperPlaneTilt color="currentColor" size="20" weight="duotone" />
					Ideme!
				</div>
			</GradientButton>
		</div>
	</Banner>
{/if}
