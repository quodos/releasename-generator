<script setup>
import { onMounted, ref } from 'vue';
import Haikunator from 'haikunator';
import { useClipboard, useWebNotification } from '@vueuse/core';

const haikunator = new Haikunator({
  seed: performance.now().toString(),
  defaults: {
    tokenLength: 0,
  },
});

const name = ref(null);

const generate = () => {
  name.value = haikunator.haikunate({ tokenLength: 0, delimiter: '-' });
};
onMounted(() => {
  generate();
});

const { copy } = useClipboard({ source: name });
const { show } = useWebNotification({
  title: 'Release name copied to clipboard!',
  dir: 'auto',
  lang: 'en',
  renotify: true,
  tag: 'test',
});

const copyToClipboard = () => {
  copy();
  show();
};
</script>

<template>
  <main class="flex flex-col justify-center items-center py-16 px-4 mx-auto max-w-3xl h-screen">
    <h1 class="mb-20 text-6xl text-center text-gray-600 transition-colors">
      releasename generator
    </h1>

    <div class="group flex justify-center items-center mb-20 space-x-4 cursor-pointer" @click="copyToClipboard()">
      <code class="text-2xl">{{ name }}</code>
      <span class="opacity-20 group-hover:opacity-60 transition-opacity">
        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5625 3.40186V1.33936C12.5625 0.925145 12.2267 0.589355 11.8125 0.589355H1.3125C0.89829 0.589355 0.5625 0.925138 0.5625 1.33936V11.8394C0.5625 12.2536 0.89829 12.5894 1.3125 12.5894H3.375" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5.4375 6.21436C5.4375 5.80014 5.77329 5.46436 6.1875 5.46436H16.6875C17.1017 5.46436 17.4375 5.80015 17.4375 6.21436V16.7144C17.4375 17.1286 17.1017 17.4644 16.6875 17.4644H6.1875C5.77328 17.4644 5.4375 17.1286 5.4375 16.7144V6.21436Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
    <div class="flex justify-center space-x-4 text-gray-400">
      <button class="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors" @click.prevent="generate">Generate</button>
    </div>
  </main>
</template>

<style>
html,
body {
  @apply bg-gray-900 text-gray-50;
}
</style>
