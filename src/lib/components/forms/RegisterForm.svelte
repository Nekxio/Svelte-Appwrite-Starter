<script lang="ts">
	import { Eye, EyeClosed } from '@lucide/svelte';
	import { Control, FieldErrors, Fieldset, Label, Legend } from 'formsnap';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { registerSchema, type Register } from '$types/user-auth';
	import { goto } from '$app/navigation';
	import { i18n } from '$lib/i18n';

	interface Props {
		form: SuperValidated<Register>;
	}

	let { form: registerForm }: Props = $props();

	const form = superForm(registerForm, {
		validators: zod(registerSchema),
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				await goto('/auth/register-success');
			}
		}
	});

	const { enhance, message, delayed, form: formData } = form;

	let passwordInputType: 'password' | 'text' = $state('password');
	let confirmPasswordInputType: 'password' | 'text' = $state('password');

	const toggleInput = (input: 'password' | 'confirmPassword') => {
		if (input === 'password') {
			passwordInputType = passwordInputType === 'password' ? 'text' : 'password';
		} else {
			confirmPasswordInputType = confirmPasswordInputType === 'password' ? 'text' : 'password';
		}
	};
</script>

<form action="?/register" method="POST" use:enhance class="max-w-xl">
	<Fieldset {form} name="name" class="fieldset">
		<Legend class="fieldset-legend">{i18n.form_labels({ field: 'name' })}</Legend>
		<Control>
			{#snippet children({ props })}
				<Label>
					<input
						{...props}
						class="input w-full"
						type="text"
						placeholder={i18n.form_placeholders({ field: 'name' })}
						disabled={$delayed}
						bind:value={$formData.name}
					/>
				</Label>
			{/snippet}
		</Control>
		<FieldErrors class="text-error text-sm" />
	</Fieldset>

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
					<button type="button" onclick={() => toggleInput('password')} class="btn btn-xs btn-ghost">
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

	<Fieldset {form} name="confirmPassword" class="fieldset">
		<Legend class="fieldset-legend">
			{i18n.form_labels({ field: 'confirmPassword' })}
		</Legend>
		<Control>
			{#snippet children({ props })}
				<Label class="input w-full">
					<input
						{...props}
						type={confirmPasswordInputType}
						placeholder={i18n.form_placeholders({ field: 'confirmPassword' })}
						disabled={$delayed}
						bind:value={$formData.confirmPassword}
					/>
					<button type="button" onclick={() => toggleInput('confirmPassword')} class="btn btn-xs btn-ghost">
						{#if confirmPasswordInputType === 'text'}
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
		<a href="/auth/login" class="link-hover">{i18n['buttons.already_have_account']()}</a>
		<button type="submit" class="btn btn-primary" disabled={$delayed}>
			{i18n['buttons.register']()}
			{#if $delayed}
				<span class="loading loading-spinner loading-sm"></span>
			{/if}
		</button>
	</div>

	{#if $message}
		<div class="text-red-500">
			<ul class="list-disc pl-5">
				{#each Object.values($message).flat() as error (error)}
					<li>{error}</li>
				{/each}
			</ul>
		</div>
	{/if}
</form>
