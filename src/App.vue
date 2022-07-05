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
    <h1 class="pb-20 text-6xl text-center text-gray-700 dark:text-gray-100 transition-colors">
      releasename generator
    </h1>

    <div class="flex justify-center pb-10 space-x-4">
      <code class="text-2xl cursor-pointer" @click="copyToClipboard()">{{ name }}</code>
    </div>
    <div class="flex justify-center pb-10 space-x-4 text-gray-400">
      <button @click.prevent="generate">generate</button>
    </div>
  </main>
</template>

<style>
body {
  @apply dark:bg-gray-900 dark:text-gray-50;
}
</style>
