<script>
	import { page } from '$app/stores';
	import {
		Footer,
		FooterLinkGroup,
		FooterLink,
		ImagePlaceholder,
		TextPlaceholder,
		Skeleton,
		FooterCopyright
	} from 'flowbite-svelte';

	import Sun from 'phosphor-svelte/lib/Sun';
	import Moon from 'phosphor-svelte/lib/Moon';

	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, DarkMode } from 'flowbite-svelte';
	let darkmodebtn =
		'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg';

	$: links = {
		'/': 'Črep simulator',
		'/gableci': 'GablecPicker',
		'/gableci/results': 'Rezultati'
	};

	$: isHome = $page.data.url === '/';
</script>

{#if !isHome}
	<Footer class="!rounded-none mt-auto" footerType='logo'>
		<FooterCopyright href="/" by="Goc" year={new Date().getFullYear()} />
	</Footer>
{/if}
