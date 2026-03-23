<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="w-full h-50 flex justify-center items-center pt-9 mb-5">
	<div
		class="flex justify-center items-center w-[85%] h-48 rounded-sm border border-action_btn_border bg-[#d3413f2e]/60"
	>
		<div class="flex flex-col w-[85%] h-[80%] h-40">
			<p class="w-full h-7 font-serif font-semibold">Sign in to unlock all features</p>
			<p class="w-full h-10 text-[0.75rem] text-form_title">
				Save verse sets, sync preferences, and share with your team.
			</p>

			<div class="flex-1 flex flex-col gap-2 pt-2">
				<button
					onclick={() => goto('/login')}
					class="cursor-pointer w-full h-[50%] rounded-sm hover:bg-accent_btn_hover bg-accent_btn"
				>
					<p class="font-medium">Sign In</p>
				</button>
				<button
					onclick={() => goto('/register')}
					class="cursor-pointer w-full h-[50%] border border-border_accent hover:border-light_grey rounded-sm"
				>
					<p class="font-medium text-form_title">Create Account</p>
				</button>
			</div>
		</div>
	</div>
</div>
