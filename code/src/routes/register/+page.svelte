<script lang="ts">
	import Input from '../components/authentication/Input.svelte';
	import Button from '../components/authentication/Button.svelte';
	import Divider from '../components/authentication/Divider.svelte';
	import Password from '../components/authentication/Password.svelte';
	import AuthCard from '../components/authentication/AuthCard.svelte';
	import AuthPage from '../components/authentication/AuthPage.svelte';
	import GoogleButton from '../components/authentication/GoogleButton.svelte';

	import { createForm } from 'felte';

	type FormState = {
		full_name: string;
		email: string;
		password: string;
	};

	let formState = $state<FormState>({
		full_name: '',
		email: '',
		password: ''
	});

	let errorMessage = $state('');
	let loading = $state(false);

	const { form } = createForm({
		onSubmit: async (values) => {
			loading = true;
			errorMessage = '';

			const params = new URLSearchParams({
				name: values['Full Name'],
				email: values['Email Address'],
				password: values.password
			});

			const res = await fetch(`api/register?${params.toString()}`, { method: 'POST' });
			const data = await res.json();

			if (!res.ok) {
				errorMessage = data.error;
			}

			loading = false;
		}
	});

	function disabledCondition(state: FormState) {
		const invalidEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
		const emptyField = Object.values(state).some((field) => field === '');

		return invalidEmail || emptyField || state.password.length < 8 || loading;
	}
</script>

<AuthPage>
	<form use:form>
		<div class="flex items-center">
			<AuthCard cardTitle={'Create Account'}>
				<Input title={'Full Name'} bind:value={formState.full_name} />
				<Input title={'Email Address'} bind:value={formState.email} bind:error={errorMessage} />
				<Password bind:value={formState.password} />
				<Button title={'Register'} bind:state={formState} bind:loading {disabledCondition} />
				<Divider />
				<GoogleButton action={'Sign up'} />
				<div class="text-center mt-6">
					Already have an account?
					<a href="/login" class="text-input_focus">Sign In</a>
				</div>
			</AuthCard>
		</div>
	</form>
</AuthPage>
