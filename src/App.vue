<script setup>
import { onKeyStroke, useClipboard, useTimeoutFn } from "@vueuse/core";
import { computed, ref } from "vue";
import { generateName } from "@/generate.js";
import { useScramble } from "@/useScramble.js";

const name = ref(generateName());
const chars = useScramble(name);

// Splits the scrambling characters into words so long names wrap at the hyphen.
const nameWords = computed(() => {
  const groups = [[]];
  for (const char of chars.value) {
    if (char.char === "-") {
      groups.push([]);
    } else {
      groups.at(-1).push(char);
    }
  }
  return groups.map((group) => ({
    chars: group,
    text: group.map(({ char }) => char).join(""),
    settled: group.every(({ settled }) => settled),
  }));
});

const glowing = ref(false);
const { start: fadeGlow } = useTimeoutFn(() => (glowing.value = false), 700, { immediate: false });

const generate = () => {
  name.value = generateName(name.value);
  glowing.value = true;
  fadeGlow();
};

const { copy, copied, isSupported } = useClipboard({ legacy: true, copiedDuring: 1800 });
const copyName = () => copy(name.value);

const status = computed(() => (copied.value ? `Copied ${name.value} to clipboard` : `New name: ${name.value}`));

const targetMatches = (event, selector) => event.target instanceof Element && event.target.closest(selector);
const shouldIgnore = (event) =>
  event.repeat || event.metaKey || event.ctrlKey || event.altKey || targetMatches(event, "input, textarea");

onKeyStroke(" ", (event) => {
  // A focused button already reacts to Space natively.
  if (shouldIgnore(event) || targetMatches(event, "button, a")) {
    return;
  }
  event.preventDefault();
  generate();
});

onKeyStroke(["c", "C"], (event) => {
  if (!shouldIgnore(event)) {
    copyName();
  }
});
</script>

<template>
  <div class="relative isolate min-h-dvh overflow-hidden">
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10">
      <div
        class="transition-opacity duration-700"
        :class="glowing ? 'opacity-100' : 'opacity-70'"
      >
        <div
          class="absolute -top-[20vmax] -left-[15vmax] size-[55vmax] motion-safe:animate-drift-1 rounded-full bg-aurora-violet opacity-40 blur-[120px]"
        />
        <div
          class="absolute -right-[20vmax] -bottom-[25vmax] size-[60vmax] motion-safe:animate-drift-2 rounded-full bg-aurora-teal opacity-30 blur-[120px]"
        />
        <div
          class="absolute top-[30%] left-[45%] size-[35vmax] motion-safe:animate-drift-3 rounded-full bg-aurora-pink opacity-25 blur-[120px]"
        />
      </div>
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] mask-radial-from-0% mask-radial-to-70% bg-size-[64px_64px]"
      />
    </div>

    <main class="mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center gap-12 px-4 py-16 sm:gap-16">
      <h1 class="font-mono text-white/50 text-xs uppercase tracking-[0.35em] sm:text-sm">
        Release name generator
      </h1>

      <button
        type="button"
        class="group relative cursor-pointer rounded-3xl px-4 py-2 text-center focus-visible:outline-2 focus-visible:outline-aurora-teal focus-visible:outline-offset-8"
        :aria-label="`Copy ${name} to clipboard`"
        @click="copyName"
      >
        <span
          aria-hidden="true"
          class="flex flex-wrap items-baseline justify-center font-bold text-[clamp(2.75rem,9vw,7.5rem)] leading-[0.95] tracking-tight"
        >
          <template v-for="(word, index) in nameWords" :key="index">
            <span
              v-if="index > 0"
              class="px-[0.06em] text-aurora-pink"
            >-</span>
            <span class="whitespace-nowrap">
              <template v-if="word.settled">{{ word.text }}</template>
              <template v-else>
                <span
                  v-for="(char, charIndex) in word.chars"
                  :key="charIndex"
                  class="relative inline-block"
                >
                  <span :class="{ invisible: !char.settled }">{{ char.char }}</span>
                  <span
                    v-if="!char.settled"
                    class="absolute inset-0 flex justify-center text-aurora-teal/80"
                  >{{ char.glyph }}</span>
                </span>
              </template>
            </span>
          </template>
        </span>
        <span
          aria-hidden="true"
          class="-bottom-8 absolute inset-x-0 font-mono text-white/40 text-xs opacity-0 transition-opacity group-hover:opacity-100"
        >
          {{ copied ? "copied!" : "click to copy" }}
        </span>
      </button>

      <div class="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-white px-7 py-3.5 font-semibold text-ink shadow-[0_0_40px_-8px] shadow-aurora-violet transition hover:scale-105 hover:shadow-aurora-teal focus-visible:outline-2 focus-visible:outline-aurora-teal focus-visible:outline-offset-4 active:scale-95"
          @click="generate"
        >
          <svg
            aria-hidden="true"
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m18 14 4 4-4 4" />
            <path d="m18 2 4 4-4 4" />
            <path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-7.6a4 4 0 0 1 3.3-1.7H22" />
            <path d="M2 6h1.972a4 4 0 0 1 3.6 2.2" />
            <path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" />
          </svg>
          Generate
        </button>

        <button
          v-if="isSupported"
          type="button"
          class="inline-flex min-w-36 cursor-pointer items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold backdrop-blur transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-aurora-teal focus-visible:outline-offset-4 active:scale-95"
          @click="copyName"
        >
          <svg
            v-if="copied"
            aria-hidden="true"
            class="size-5 text-aurora-teal"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <svg
            v-else
            aria-hidden="true"
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          {{ copied ? "Copied" : "Copy" }}
        </button>
      </div>

      <p class="hidden items-center gap-4 font-mono text-white/40 text-xs pointer-fine:flex">
        <span><kbd class="rounded border border-white/15 bg-white/5 px-1.5 py-0.5">Space</kbd> new name</span>
        <span><kbd class="rounded border border-white/15 bg-white/5 px-1.5 py-0.5">C</kbd> copy</span>
      </p>
    </main>

    <p class="sr-only" aria-live="polite">{{ status }}</p>
  </div>
</template>
