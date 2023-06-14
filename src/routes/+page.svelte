<script lang="TS">
	import { onMount } from 'svelte';
    import { crossfade, fade } from 'svelte/transition';  
    import { fly } from 'svelte/transition';

    const [send, receive] = crossfade({});

    let slideNo = 0;
    let slideCount = 3;
    let images = ["/example-list-1.png", "/example-list-2.png", "/example-list-3.png"];

    onMount(() => {
        const interval = setInterval(() => {
            slideNo = (slideNo + 1) % slideCount;
        }, 5000);
        
        return () => {
            clearInterval(interval);
        };
    });
</script>

<div class="w-full pt-2 px-6">
    <div class="mt-2 relative rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 container mx-auto flex flex-col items-center pt-12 sm:pt-24 pb-24 sm:pb-32 md:pb-48 lg:pb-56 xl:pb-64">
       
        <div class="w-11/12 sm:w-2/3 mb-5 sm:mb-10">
            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center text-white font-bold leading-tight">Create and share lists.</h1>
            <div class="mt-2 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center text-white font-bold leading-tight">Everybody gets their own copy of the list, plus any updates you make.</div>
        </div>
        <div class="flex justify-center items-center">
            <a class="hover:text-white hover:bg-transparent lg:text-xl hover:border-white border bg-white transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-pink-700	focus:ring-white rounded text-pink-700 px-4 sm:px-8 py-1 sm:py-3 text-sm" href="/create">Get Started</a>
            <a class="ml-4 hover:text-white hover:bg-transparent lg:text-xl hover:border-white border bg-white transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-pink-700	focus:ring-white rounded text-pink-700 px-4 sm:px-8 py-1 sm:py-3 text-sm" href="browse">Browse Lists</a>
        </div>
    </div>
    <div class="container mx-auto flex justify-center -mt-20 md:-mt-44 xl:-mt-56">
        <div class="relative sm:w-2/3 w-11/12">
            {#each images as image, index (index)}
                {#if slideNo == index}
                    <div class="absolute top-0" transition:fly={{ x: -200, duration: 1000 }}>
                        <img 
                            src={image} 
                            alt="Example of a list"
                        />
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>
<div class="w-full px-6 mt-80 xl:mt-96 bg-gray-100">
    <div class="mt-2 relative rounded-lg container mx-auto flex flex-col items-center pt-12 xl:pt-44 sm:pt-24 pb-24 sm:pb-32 md:pb-48 lg:pb-56 xl:pb-64">
        <div class="w-11/12 sm:w-2/3 mb-5 sm:mb-10">
            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center text-gray-800 font-bold leading-tight">How it Works</h1>
        </div>
        <img class="lg:w-1/2 md:w-2/3" src="/how-it-works.png" alt="How it works" />
    </div>
</div>

<style class="style-fonts">
    @font-face {
        font-family: "Virgil";
        src: url("https://excalidraw.com/Virgil.woff2");
    }
    @font-face {
        font-family: "Cascadia";
        src: url("https://excalidraw.com/Cascadia.woff2");
    }
</style>