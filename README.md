# releasename-generator

Generates alliterative release names like `cosmic-capybara` or `jazzy-jellyfish`.
Live at [rng.thomaswilhelm.at](https://rng.thomaswilhelm.at).

Press <kbd>Space</kbd> for a new name and <kbd>C</kbd> to copy it, or click the name.

## Development

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev       # start the dev server
npm run build     # build for production into dist/
npm run lint      # check formatting and lint with Biome
npm run lint:fix  # apply safe fixes
```

Word lists live in [`src/words.js`](src/words.js), grouped by first letter.

Built with Vue, Vite and Tailwind CSS, deployed via Cloudflare Pages.
