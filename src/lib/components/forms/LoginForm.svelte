<script lang="ts">
	import { Eye, EyeClosed } from '@lucide/svelte';
	import { Control, FieldErrors, Fieldset, Label, Legend } from 'formsnap';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { loginSchema, type Login } from '$types/user-auth';
	import { goto } from '$app/navigation';
	import { i18n } from '$lib/i18n';

	interface Props {
		form: SuperValidated<Login>;
		redirectTo?: string;
	}

	let { form: loginForm, redirectTo }: Props = $props();

	const form = superForm(loginForm, {
		validators: zod(loginSchema),
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				await goto(redirectTo || '/account');
			}
		}
	});

	const { enhance, delayed, message, form: formData, errors } = form;

	let passwordInputType: 'password' | 'text' = $state('password');

	const togglePassword = () => {
		passwordInputType = passwordInputType === 'password' ? 'text' : 'password';
	};
</script>

<form action="?/login" method="POST" use:enhance class="max-w-xl">
	<Fieldset {form} name="email" class="fieldset">
		<Legend class="fieldset-legend">{i18n.form_labels({ field: 'email' })}</Legend>
		<Control>
			{#snippet children({ props })}
				<Label>
					<input
						{...props}
						class="input w-full"
						type="email"
						placeholder={i18n.form_placeholders({ field: 'email' })}
						disabled={$delayed}
						bind:value={$formData.email}
					/>
				</Label>
			{/snippet}
		</Control>
		<FieldErrors class="text-error text-sm" />
	</Fieldset>

	<Fieldset {form} name="password" class="fieldset">
		<Legend class="fieldset-legend">
			{i18n.form_labels({ field: 'password' })}
		</Legend>
		<Control>
			{#snippet children({ props })}
				<Label class="input w-full">
					<input
						{...props}
						type={passwordInputType}
						placeholder={i18n.form_placeholders({ field: 'password' })}
						disabled={$delayed}
						bind:value={$formData.password}
					/>
					<button type="button" onclick={togglePassword} class="btn btn-xs btn-ghost">
						{#if passwordInputType === 'text'}
							<EyeClosed size={16} />
						{:else}
							<Eye size={16} />
						{/if}
					</button>
				</Label>
			{/snippet}
		</Control>
		<FieldErrors class="text-error text-sm" />
	</Fieldset>

	<div class="mt-4 flex items-center justify-end gap-8">
		<a href="/auth/register" class="link-hover" aria-busy={$delayed}>{i18n['buttons.need_account']()}</a>
		<button type="submit" class="btn btn-primary" disabled={$delayed}>
			{i18n['buttons.login']()}
			{#if $delayed}
				<span class="loading loading-spinner loading-sm"></span>
			{/if}
		</button>
	</div>

	{#if $errors}
		<div class="text-red-500">
			<ul class="list-none">
				{#each $errors._errors ?? [] as error (error)}
					<li>{error}</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if $message}
		<p class="text-success">{$message}</p>
	{/if}
</form>
