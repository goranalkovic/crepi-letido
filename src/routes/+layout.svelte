<script>
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	import '../app.postcss';

	import { fly } from 'svelte/transition';
	import { circIn, circOut } from 'svelte/easing';
	import GableciNavbar from '$lib/GableciNavbar.svelte';
	import { Avatar, Button, Dropdown, DropdownItem, DarkMode } from 'flowbite-svelte';
	import SignIn from 'phosphor-svelte/lib/SignIn';
	import SignOut from 'phosphor-svelte/lib/SignOut';
	import UserCircle from 'phosphor-svelte/lib/UserCircle';

	export let data;

	const direction = data.url === '/gablec-results' ? 1 : -1;

	let { supabase, session, userData } = data;
	$: ({ supabase, session, userData } = data);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
	};

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((_, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<header class="my-8 mx-auto px-8 container sticky top-8 z-10 flex items-center gap-4">
	<GableciNavbar signedIn={userData !== null}>
		{#if userData}
			{@const avatar = userData?.user_metadata.avatar}
			{@const firstName = userData?.user_metadata.firstName}
			{@const lastName = userData?.user_metadata.lastName}

			{#if avatar?.length < 1}
				<Avatar class="usr-navbar-dropdown cursor-pointer"
					>{firstName.charAt(0)}{lastName.charAt(0)}</Avatar
				>
			{:else}
				<Avatar
					class="usr-navbar-dropdown cursor-pointer"
					src={`/profile-pictures/${avatar}.jpg`}
				/>
			{/if}

			<Dropdown triggeredBy=".usr-navbar-dropdown">
				<div slot="header" class="px-4 py-2">
					<span class="block text-sm text-gray-900 dark:text-white"
						>{userData?.user_metadata.firstName} {userData?.user_metadata.lastName}</span
					>
					<span class="block truncate text-sm font-medium">{userData?.email}</span>
				</div>
				<DropdownItem href="/profile">
					<div class="flex items-center gap-2 leading-none">
						<UserCircle color="currentColor" size="16" />
						Profile
					</div>
				</DropdownItem>

				<DropdownItem on:click={handleSignOut} slot="footer">
					<div class="flex items-center gap-2 leading-none">
						<SignOut color="currentColor" size="16" />
						Sign out
					</div>
				</DropdownItem>
			</Dropdown>
		{:else}
			<Button pill class="!p-2 aspect-square" href="/profile">
				<SignIn color="currentColor" size="22" weight="duotone" />
			</Button>
		{/if}
	</GableciNavbar>
</header>

{#key data.url}
	<main
		in:fly={{ x: direction * -100, duration: 400, delay: 350, easing: circOut }}
		out:fly={{ x: direction * 100, duration: 300, easing: circIn }}
	>
		<slot />
	</main>
{/key}
