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
    import { type FormState, disabledCondition } from "$lib/utils";

	let formState = $state<FormState>({
		email: '',
		password: ''
	});

	let errorMessage = $state('');

	const { form } = createForm({
		onSubmit: async (values) => {
			formState.loading = true;
			errorMessage = '';

			const params = new URLSearchParams({
				email: values['Email Address'],
				password: values.password
			});

			/*const res = await fetch(`api/register?${params.toString()}`, { method: 'POST' });
			const data = await res.json();

			if (!res.ok) { // this is the case where the email entered is already attached to another user
				errorMessage = data.error;
			}*/

			formState.loading = false;
		}
	});
</script>

<AuthPage>
	<Form {form}>
		<AuthCard cardTitle={'Welcome Back'}>
			<Input title={'Email Address'} bind:value={formState.email} />
			<Password bind:value={formState.password} />
			<Button title={'Sign in'} bind:state={formState} {disabledCondition} />
			<Divider />
			<GoogleButton action={'Continue'} bind:loading={formState.loading} />
			<Footer prompt={"Don't have an account?"} endpoint={'/register'} action={'Sign Up'} />
		</AuthCard>
	</Form>
</AuthPage>
