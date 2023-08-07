<script>
	// @ts-nocheck
	import { slide } from 'svelte/transition';
	import { goto } from '$app/navigation';

	import Van from 'phosphor-svelte/lib/Van';
	import Phone from 'phosphor-svelte/lib/Phone';
	import CloudX from 'phosphor-svelte/lib/CloudX';
	import XCircle from 'phosphor-svelte/lib/XCircle';
	import PaperPlaneTilt from 'phosphor-svelte/lib/PaperPlaneTilt';
	import ForkKnife from 'phosphor-svelte/lib/ForkKnife';
	import { people } from './people';

	let selections = {};

	const getData = async () => {
		const response = await fetch('/get-gableci');
		const data = await response.json();

		selections = data?.restaurants?.filter(Boolean)?.reduce((current, { slug, meals }) => {
			return {
				...current,
				[slug]: Array(meals.length).fill(false)
			};
		}, {});

		return data;
	};

	$: allowSubmit = Object.values(selections)?.some((r) => r.some((m) => m)) ?? false;

	let yourName = '';

	const handleClick = async () => {
		const response = await fetch('/db', {
			method: 'POST',
			body: JSON.stringify({
				name: yourName,
				selections: Object.entries(selections)?.filter(Boolean)?.reduce((current, [key, value]) => {
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
				}, {})
			}),
			headers: {
				'content-type': 'application/json'
			}
		});

		const data = await response.json();

		goto('/gableci/results');
	};
</script>

<div class="p-10 pt-40 flex justify-center">
	<h1 class="text-6xl font-semibold tracking-tight">Ke bumo denes jeli?</h1>
</div>

<a class="btn btn-outline btn-sm fixed top-4 right-4 normal-case" href="/gableci/results">Rezultati</a>

{#await getData()}
	<div class="w-full py-40 flex items-center justify-center">
		<span class="loading loading-spinner loading-lg" />
	</div>
{:then value}
	{@const tst = console.log(value)}
	{#if !value}
		<div class="w-full py-40 flex flex-col gap-4 items-center justify-center">
			<div class="alert alert-error text-white dark:text-black w-96">
				<XCircle color="currentColor" size="24" weight="duotone" />
				<span>Neke je crklo, nema nijenog jela. <br /> Reči Gocu da je sjebal.</span>
			</div>

			<a
				class="btn btn-outline btn-xs normal-case"
				href="https://gableci.hr/vz/"
				target="_blank"
				rel="noreferrer nofollow"
			>
				Jæbiga, ideme ručno
			</a>
		</div>
	{:else}
		<div class:pb-40={!allowSubmit} class="flex flex-wrap gap-8 p-10 justify-center">
			{#each value.restaurants as restaurant}
				<div class="card w-full max-w-md bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">{restaurant.name}</h2>
						<div class="card-actions justify-between text-sm">
							{#if restaurant.meta.phone}
								<div class="flex items-center gap-2">
									<Phone color="currentColor" size="20" weight="duotone" />
									{restaurant.meta.phone}
								</div>
							{/if}

							{#if restaurant.meta.url}
								<a
									href={restaurant.meta.url}
									target="_blank"
									rel="noreferrer nofollow"
									class="btn btn-sm normal-case flex items-center gap-2"
								>
									<ForkKnife color="currentColor" size="20" weight="duotone" />

									Pogleč kaj ima
								</a>
							{/if}

							{#if restaurant.meta.delivery}
								<div class="flex items-center gap-2">
									<Van color="currentColor" size="20" weight="duotone" />
									{restaurant.meta.delivery}
								</div>
							{/if}
						</div>
						<div class="border-t border-t-base-300 mt-1.5 pt-2">
							{#each restaurant.meals as meal, i}
								<div class="form-control">
									<label class="label cursor-pointer">
										<span class="label-text">
											<span class="flex items-center gap-1">
												{meal.name}

												{#if meal?.meta?.isVegetarian}
												<abrr title="Vegetarian">🥬</abrr>
												{/if}

												{#if meal?.meta?.isVegan}
												<abrr title="Vegan">🌱</abrr>
												{/if}
											</span>

											{#if meal.price}
												<span class="badge badge-ghost mt-0.5 px-1.5">{meal.price}</span>
											{/if}
										</span>
										<input
											type="checkbox"
											bind:checked={selections[restaurant.slug][i]}
											class="checkbox checkbox-accent"
										/>
									</label>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if allowSubmit}
			<div transition:slide class="px-10 pt-10 pb-40 flex justify-center">
				<div class="join">
					<select class="select select-lg w-96 join-item" bind:value={yourName}>
						<option disabled selected>Tu mi reči koji si</option>
						{#each Object.entries(people) as [slug, name]}
							<option value={slug}>{name}</option>
						{/each}
					</select>

					<button
						disabled={yourName?.trim()?.length < 1}
						class="flex gap-2 btn btn-lg btn-primary normal-case join-item"
						on:click={handleClick}
					>
						<PaperPlaneTilt color="currentColor" size="32" weight="duotone" />
						Ideme
					</button>
				</div>
			</div>
		{/if}
	{/if}
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
