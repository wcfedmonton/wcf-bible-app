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

	const { form } = createForm({
		onSubmit: async (values) => {
			const params = new URLSearchParams({ 
				name: values['Full Name'], 
				email: values['Email Address'],
				password: values.password
			});

			await fetch(`api/register?${params.toString()}`, { method: "POST" });
		}
	});

	function disabledCondition(state: FormState) {
		const emptyField = Object.values(state).some((field) => field === '');
		const invalidEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);

		return emptyField || invalidEmail || state.password.length < 8;
	}
</script>

<AuthPage>
	<form use:form>
		<div class="flex items-center">
			<AuthCard cardTitle={'Create Account'}>
				<Input title={'Full Name'} bind:value={formState.full_name} />
				<Input title={'Email Address'} bind:value={formState.email} />
				<Password bind:value={formState.password} />
				<Button title={'Register'} bind:state={formState} {disabledCondition} />
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