import { words } from "@/words.js";

const letters = Object.entries(words).map(([letter, { adjectives, nouns }]) => ({
  letter,
  adjectives,
  nouns,
  combinations: adjectives.length * nouns.length,
}));

const totalCombinations = letters.reduce((sum, { combinations }) => sum + combinations, 0);

const randomInt = (max) => crypto.getRandomValues(new Uint32Array(1))[0] % max;

const pick = (list) => list[randomInt(list.length)];

// Weights each letter by its number of combinations, so every name is equally likely.
const pickLetter = () => {
  let roll = randomInt(totalCombinations);
  for (const entry of letters) {
    roll -= entry.combinations;
    if (roll < 0) {
      return entry;
    }
  }
  return letters.at(-1);
};

export const generateName = (previous) => {
  let name;
  do {
    const { adjectives, nouns } = pickLetter();
    name = `${pick(adjectives)}-${pick(nouns)}`;
  } while (name === previous);
  return name;
};
