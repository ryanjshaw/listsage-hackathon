<script lang="ts">
	import { AppwriteService } from '$lib/AppwriteService';
    import { browser } from '$app/environment';
    import { page } from '$app/stores';

    let error = false;

    if (browser) {
        try {
            process();
        } catch {
            console.error(error);
            error = true;
        }

        async function process() {
            const userId = $page.url.searchParams.get('userId');
            const secret = $page.url.searchParams.get('secret');
            const listId = $page.url.searchParams.get('listId');
            const sectionId = $page.url.searchParams.get('sectionId');

            if (userId && secret && listId && sectionId)
            {
                // While we could handle the login on the /list route,
                // that would produce an ugly URL containing the userId
                // and secret. If the user tries to share that URL with
                // somebody, it wouldn't look good at all. Instead, we
                // handle magic login on /magic and then redirect to
                // the appropriate /list route to generate a clean URL.
                await AppwriteService.updateMagicURLSession(userId, secret);

                let target = `${window.location.origin}/list/${listId}`;
                if (sectionId !== "undefined")
                    target += `?sectionId=${sectionId}`;

                window.location.href = target;
            }
            else
            {
                throw "Missing critical parameter(s)";
            }
        }
    }
</script>

<!-- Should never happen, but just in case we break something, let's
     give users a way out -->
{#if error}
    <h1>Something went wrong</h1>
    <p>Please try <a href="/">logging in again</a>.</p>
{/if}
