<script lang="ts">
	import SendEmailVerification from '$components/auth/SendEmailVerification.svelte';
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Email Verification Required</h1>

	<div class="mb-4 rounded border border-yellow-400 bg-yellow-100 px-4 py-3 text-yellow-700">
		<p>
			Your email address has not been verified yet. Please check your inbox for the verification email and click the
			link to verify your account.
		</p>
	</div>

	<SendEmailVerification />

	<a href="/logout">Logout</a>
</div>
