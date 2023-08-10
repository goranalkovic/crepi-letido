<script>
	import { page } from '$app/stores';

	import Sun from 'phosphor-svelte/lib/Sun';
	import Moon from 'phosphor-svelte/lib/Moon';

	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, DarkMode, Badge } from 'flowbite-svelte';

	let darkmodebtn =
		'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg';

	$: links = {
		'/': 'Črep simulator',
		'/gableci': 'GablecPicker',
		'/gableci/results': 'Rezultati'
	};

	$: isHome = $page.data.url === '/';
</script>

<Navbar let:hidden let:toggle rounded color="form">
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

		<NavLi>
			<DarkMode btnClass={darkmodebtn}>
				<svelte:fragment slot="lightIcon">
					<Sun size="20" weight="duotone" />
				</svelte:fragment>
				<svelte:fragment slot="darkIcon">
					<Moon size="20" weight="duotone" />
				</svelte:fragment>
			</DarkMode>
		</NavLi>
	</NavUl>
</Navbar>
