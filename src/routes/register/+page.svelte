<!-- <script lang="ts">
	import { goto } from '$app/navigation';
	import { AppwriteService } from '$lib/AppwriteService';
	import { authStore } from '$lib/stores/authStore';

	let name = '';
	let email = '';
	let password = '';
	let passwordAgain = '';

	let error = '';

	async function onSubmit() {
		if (password !== passwordAgain) {
			error = 'Passwords do not match.';
			return;
		}

		try {
			await AppwriteService.register(name, email, password);
			await AppwriteService.login(email, password);
			$authStore = await AppwriteService.getAccount();
			goto('/');
		} catch (err: any) {
			error = err.message;
		}
	}
</script> -->