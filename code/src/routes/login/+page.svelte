<script lang="ts">
	import Form from '../components/authentication/Form.svelte';
	import Input from '../components/authentication/Input.svelte';
	import Footer from '../components/authentication/Footer.svelte';
	import Button from '../components/authentication/Button.svelte';
	import Divider from '../components/authentication/Divider.svelte';
	import Password from '../components/authentication/Password.svelte';
	import AuthCard from '../components/authentication/AuthCard.svelte';
	import AuthPage from '../components/authentication/AuthPage.svelte';
	import GoogleButton from '../components/authentication/GoogleButton.svelte';

	import { createForm } from 'felte';
	import { goto } from '$app/navigation';
	import { type FormState, disabledCondition } from '$lib/utils';

	let formState = $state<FormState>({
		email: '',
		password: ''
	});

	let displayErrorMessage = $state(false);

	const { form } = createForm({
		onSubmit: async (values) => {
			formState.loading = true;
			displayErrorMessage = false;

			const form = new FormData();
			form.append('email', values['Email Address']);
			form.append('password', values.password);

			const res = await fetch(`api/auth/login`, { method: 'POST', body: form });

			if (!res.ok) {
				// this is the case where the credentials entered are incorrect
				displayErrorMessage = true;
			} else {
				await goto('/');
			}

			formState.loading = false;
		}
	});
</script>

<AuthPage>
	<Form {form}>
		<AuthCard cardTitle="Welcome Back">
			<Input title="Email Address" bind:value={formState.email} />
			<Password bind:value={formState.password} signInScreen={true} bind:displayErrorMessage />
			<Button title="Sign in" bind:state={formState} {disabledCondition} />
			<Divider />
			<GoogleButton action="Continue" bind:loading={formState.loading} />
			<Footer prompt="Don't have an account?" endpoint="/register" action="Sign Up" />
		</AuthCard>
	</Form>
</AuthPage>
