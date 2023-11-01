<script>
	import { page } from '$app/stores';

	import Sun from 'phosphor-svelte/lib/Sun';
	import Moon from 'phosphor-svelte/lib/Moon';

	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, DarkMode, Badge } from 'flowbite-svelte';

	let darkmodebtn =
		'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg';

	export let signedIn = false;

	const baseLinks = {
		'/': 'Črep simulator'
	};

	const nonLoggedInLinks = {
		'/gablec-results': 'Kaj bumo jeli?'
	};

	const loggedInLinks = {
		'/gablec-pick': 'GablecPicker',
		'/gablec-results': 'Kaj bumo jeli?'
	};

	$: links = signedIn ? { ...baseLinks, ...loggedInLinks } : { ...baseLinks, ...nonLoggedInLinks };

	$: isHome = $page.data.url === '/';

	$: console.log($page.data.url)
</script>

<Navbar let:hidden let:toggle rounded color='dark' class='bg-opacity-90 dark:bg-opacity-80 backdrop-blur-lg backdrop-brightness-125 backdrop-saturate-150 border border-gray-200 dark:border-gray-700'>
	<NavBrand href="/">
		<img
			src={isHome ? '/crepi-letido.png' : '/gableci-logo.svg'}
			class="mr-3 h-6 sm:h-9"
			alt="Črepi letido logo"
		/>
		<span
			class="self-center whitespace-nowrap text-3xl font-medium dark:text-white font-display leading-none"
		>
			{#if isHome}
				Črepi letido!
			{:else}
				GablecPicker
			{/if}
		</span>

		{#if !isHome}
			<Badge rounded border class="ml-2">BETA</Badge>
		{/if}
	</NavBrand>

	<NavHamburger on:click={toggle} />

	<NavUl {hidden}>
		{#each Object.entries(links) as [path, label]}
			<NavLi href={path} active={$page.data.url === path} class="text-lg">{label}</NavLi>
		{/each}
	</NavUl>
	<NavUl {hidden}>
		<div class="max-sm:justify-between max-sm:w-full flex items-center gap-4">
			<DarkMode class="max-sm:mr-auto">
				<svelte:fragment slot="lightIcon">
					<Sun size='24' color='currentColor' weight='duotone' />
				  </svelte:fragment>
				  <svelte:fragment slot="darkIcon">
					<Moon size='24' color='currentColor' weight='duotone' />
				  </svelte:fragment>
			</DarkMode>
			<slot />
		</div>
	</NavUl>
</Navbar>
