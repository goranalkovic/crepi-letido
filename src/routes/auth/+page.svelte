<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
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
		Alert,
		Label,
		Input,
		InputAddon,
		ButtonGroup,
		Modal,
		FloatingLabelInput
	} from 'flowbite-svelte';
	import { people } from '../people.js';
	import { goto } from '$app/navigation';

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let email = '';

	const handleSignIn = async () => {
		const { data, error } = await supabase.auth.signInWithOtp({
			email: email,
			options: {
				emailRedirectTo: `${location.origin}/auth/callback`
			}
		});

		signInStep++;

		console.log(data, error);
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();

		goto('/');
	};

	const handleUserDataUpdate = async () => {
		const { data, error } = await supabase.auth.updateUser({
			data: {
				firstName: firstName,
				lastName: lastName,
				avatar: avatar
			}
		});

		console.log({ updateData: data, updateError: error });

		const { error: upsertError } = await supabase.from('users').upsert({
			email: session?.user?.email,
			firstName: firstName,
			lastName: lastName,
			avatar: avatar
		});

		console.log({ upsertError });

		editModalOpen = false;
	};

	let firstName = '';
	let lastName = '';
	let avatar = '';

	$: isLoggedIn = session?.user;

	onMount(async () => {
		if (!session?.user) {
			return;
		}

		const {
			data: {
				user: { user_metadata: meta }
			}
		} = await supabase.auth.getUser();

		firstName = meta.firstName;
		lastName = meta.lastName;
		avatar = meta.avatar;
	});

	let editModalOpen = false;
	let signInStep = 1;

	$: emailValid = email?.length > 1 && /(.+)@(.+){2,}\.(.+){2,}/.test(email);
</script>

<svelte:head>
	<title>Črepi letido | {isLoggedIn ? session?.user?.data?.name ?? 'User profile' : 'Login'}</title>
	<meta name="description" content={isLoggedIn ? 'User profile' : 'Login page'} />
</svelte:head>

<div
	class="container flex flex-col justify-center md:justify-between items-center mx-auto px-8 gap-8 mb-10 pt-10 md:mb-20"
>
	{#if isLoggedIn}
		<Heading
			tag="h1"
			class="mb-4 text-center"
			customSize="text-4xl font-bold md:text-5xl lg:text-6xl font-display"
		>
			Korisnički
			<Span gradient class="from-purple-600 to-blue-500 dark:from-pink-500 dark:to-orange-400"
				>profil</Span
			>
		</Heading>

		<Card padding="sm" class="w-80">
			<div class="flex flex-col items-center pb-4">
				{#if !avatar || avatar?.length < 1}
					<Avatar size="lg">{firstName?.charAt(0) ?? '👋'}{lastName?.charAt(0) ?? ''}</Avatar>
				{:else}
					<Avatar size="lg" src={`/profile-pictures/${avatar}.jpg`} />
				{/if}

				<h5 class="mt-4 mb-1 text-xl font-medium text-gray-900 dark:text-white">
					{firstName ?? 'Hi, welcome'}
					{lastName ?? 'to ČREPI'}
				</h5>
				<span class="text-sm text-gray-500 dark:text-gray-400"
					>{session?.user?.email ?? 'email not found'}</span
				>
				<div class="flex mt-4 space-x-3 lg:mt-6">
					<Button on:click={handleSignOut}>Sign out</Button>
					<Button on:click={() => (editModalOpen = true)} color="light" class="dark:text-white"
						>Edit</Button
					>
				</div>
			</div>
		</Card>

		<Modal bind:open={editModalOpen} size="md">
			<div class="flex flex-col gap-10">
				<!-- <Icon name="exclamation-circle-outline" class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" /> -->
				<h3 class="text-xl font-normal text-gray-500 dark:text-gray-400">Uredi si profila</h3>

				<FloatingLabelInput type="text" label="Ime" bind:value={firstName} />
				<FloatingLabelInput type="text" label="Prezime" bind:value={lastName} />

				<ButtonGroup>
					<Button
						class="!p-2"
						on:click={() => (avatar = '')}
						outline={avatar !== ''}
						color={avatar?.length < 1 ? 'primary' : 'alternative'}
					>
						<Avatar size="md">{firstName?.charAt(0) ?? '-'}{lastName?.charAt(0) ?? '-'}</Avatar>
					</Button>

					{#each Object.entries(people).filter(([slug]) => !slug.startsWith('ext')) as [slug]}
						<Button
							class="!p-2"
							on:click={() => (avatar = slug)}
							outline={avatar !== slug}
							color={avatar === slug ? 'primary' : 'alternative'}
						>
							<Avatar src={`/profile-pictures/${slug}.jpg`} size="md" />
						</Button>
					{/each}
				</ButtonGroup>

				<div class="flex items-center justify-end gap-3">
					<Button color="alternative" on:click={() => (editModalOpen = false)}>Ehh... nič</Button>
					<Button color="green" on:click={handleUserDataUpdate}>Vredu</Button>
				</div>
			</div>
		</Modal>
	{:else}
		<Heading
			tag="h1"
			class="mb-4 text-center"
			customSize="text-4xl font-bold md:text-5xl lg:text-6xl font-display"
		>
			Pri<Span gradient class="from-red-600 to-orange-500">java</Span>
		</Heading>

		{#if signInStep === 1}
			<Card padding="sm" class="w-96 flex flex-col gap-4 items-center">
				<div class="w-full">
					<FloatingLabelInput type="email" label="E-mejl" bind:value={email} />
				</div>

				<Button class="shrink-0" color="primary" disabled={!emailValid} on:click={handleSignIn}
					>Ujdi</Button
				>
			</Card>
		{:else}
			<P>Pogleč si mejl, bu ti medžik link stigel. Tam sam klikneš pa buš prijavljeni.</P>
		{/if}
	{/if}
</div>
