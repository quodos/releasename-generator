import { usePreferredReducedMotion } from "@vueuse/core";
import { onBeforeUnmount, ref, watch } from "vue";

// Letters grouped by rough width, so a flickering glyph fits its final character's slot.
const GLYPH_GROUPS = ["fijlrt", "mw", "abcdeghknopqsuvxyz"];
const START_DELAY = 120;
const STAGGER = 45;
const FLICKER_INTERVAL = 50;

const randomGlyph = (char) => {
  const group = GLYPH_GROUPS.find((letters) => letters.includes(char)) ?? GLYPH_GROUPS.at(-1);
  return group[Math.floor(Math.random() * group.length)];
};

// Reveals a new value left to right, each character flickering through random
// letters before it settles. Returns one entry per character of the target.
export const useScramble = (source) => {
  const reducedMotion = usePreferredReducedMotion();
  const chars = ref([]);
  let frame = 0;

  const settle = (value) => {
    chars.value = [...value].map((char) => ({
      char,
      glyph: char,
      settled: true,
    }));
  };

  const run = (value) => {
    cancelAnimationFrame(frame);
    if (!value) {
      chars.value = [];
      return;
    }
    if (reducedMotion.value === "reduce") {
      settle(value);
      return;
    }

    const target = [...value];
    const start = performance.now();
    let lastFlicker = -Infinity;

    const tick = (now) => {
      const elapsed = now - start;
      const flicker = elapsed - lastFlicker >= FLICKER_INTERVAL;
      if (flicker) {
        lastFlicker = elapsed;
      }

      chars.value = target.map((char, index) => {
        const settled = char === "-" || elapsed >= START_DELAY + index * STAGGER;
        const previous = chars.value[index];
        const glyph = settled ? char : flicker || !previous ? randomGlyph(char) : previous.glyph;
        return { char, glyph, settled };
      });

      if (chars.value.some(({ settled }) => !settled)) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
  };

  watch(source, run, { immediate: true });
  onBeforeUnmount(() => cancelAnimationFrame(frame));

  return chars;
};
