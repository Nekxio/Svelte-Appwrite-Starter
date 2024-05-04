<script>
	import { i18n } from '$lib/i18n';

	let { data } = $props();
	const { user } = data;
</script>

{#if user}
	<div class="chat chat-start ml-10">
		<div class="chat-bubble">{i18n['account.hello_name']({ name: user.name })}</div>
	</div>
	<div class="chat chat-start">
		<div class="chat-image avatar">
			<div class="w-10 rounded-full">
				<img alt="Tailwind CSS chat bubble component" src={user.prefs.picture} />
			</div>
		</div>
		<div class="chat-bubble">{i18n['account.hello_email']({ email: user.email })}</div>
	</div>
{/if}
