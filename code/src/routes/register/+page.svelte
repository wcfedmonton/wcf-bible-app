<script lang="ts">
	import Logo from '../components/common/logo.svelte';
	import Input from '../components/authentication/Input.svelte';
	import Button from '../components/authentication/Button.svelte';
	import Divider from '../components/authentication/Divider.svelte';
	import Password from '../components/authentication/Password.svelte';
	import AuthCard from '../components/authentication/AuthCard.svelte';
	import GoogleButton from '../components/authentication/GoogleButton.svelte';

	import { createForm } from "felte";

    const { form } = createForm({
        onSubmit: (values) => {
            console.log(values);
        }
    });
</script>

<div class="mb-5">
	<Logo />
</div>

<form use:form>
	<div class="flex items-center justify-center h-[36rem] pt-15 ">
		<AuthCard cardTitle={"Create Account"}>
			<Input title={"Full Name"}/>
			<Input title={"Email Address"}/>
			<Password />
			<Button title={"Create Account"}/>
			<Divider />
			<GoogleButton action={"Sign up"} />

			<div class="text-center mt-6">
				Already have an account?
				<a href="#" class="text-input_focus">Sign In</a>
			</div>
		</AuthCard>
	</div>
</form>