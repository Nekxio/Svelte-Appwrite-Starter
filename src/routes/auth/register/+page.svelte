<script lang="ts">
	import { Control, FieldErrors, Fieldset, Label, Legend } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signupSchema } from '$types/user';
	import { goto } from '$app/navigation';
	import { i18n } from '$lib/i18n';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(signupSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				setTimeout(() => {
					goto('auth/register-success');
				}, 500);
			}
		}
	});
	const { form: formData, enhance, message } = form;
</script>

<div class="flex flex-col items-center justify-center gap-2">
	<form method="post" class="grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2" use:enhance>
		<Fieldset {form} name="name">
			<Legend>{i18n['form_labels.name']()}</Legend>
			<Control>
				{#snippet children({ props })}
					<Label>
						<input {...props} class="border" type="text" bind:value={$formData.name} />
					</Label>
				{/snippet}
			</Control>
			<FieldErrors class="text-sm" />
		</Fieldset>
		<Fieldset {form} name="email">
			<Legend>{i18n['form_labels.email']()}</Legend>
			<Control>
				{#snippet children({ props })}
					<Label>
						<input {...props} class="border" type="email" bind:value={$formData.email} />
					</Label>
				{/snippet}
			</Control>
			<FieldErrors class="text-sm" />
		</Fieldset>
		<Fieldset {form} name="password">
			<Legend>{i18n['form_labels.password']()}</Legend>
			<Control>
				{#snippet children({ props })}
					<Label>
						<input {...props} class="border" type="password" bind:value={$formData.password} />
					</Label>
				{/snippet}
			</Control>
			<FieldErrors class="text-sm" />
		</Fieldset>
		<Fieldset {form} name="confirmPassword">
			<Legend>{i18n['form_labels.password_confirmation']()}</Legend>
			<Control>
				{#snippet children({ props })}
					<Label>
						<input {...props} class="border" type="password" bind:value={$formData.confirmPassword} />
					</Label>
				{/snippet}
			</Control>
			<FieldErrors class="text-sm" />
		</Fieldset>
		<div class="flex items-center justify-center md:col-span-2">
			<button type="submit">{i18n['buttons.register']()}</button>
		</div>
	</form>
	{#if $message}
		<div class="error-container mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			<ul class="list-disc pl-5">
				{#each Object.values($message).flat() as error (error)}
					<li id={`${error}-error`}>{error}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
