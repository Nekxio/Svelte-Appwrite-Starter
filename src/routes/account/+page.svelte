<script>
	import { i18n } from '$lib/i18n';

	let { data } = $props();
	const { user } = data;
</script>

<ul>
	<li>
		<strong>{i18n['profile.email']()}</strong>
		{user?.email}
	</li>
	<li>
		<strong>{i18n['profile.name']()}</strong>
		{user?.name}
	</li>
	<li>
		<strong>{i18n['profile.id']()} </strong>
		{user?.$id}
	</li>
</ul>

<a href="/logout">{i18n['buttons.logout']()}</a>
