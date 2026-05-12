import adapter from "@sveltejs/adapter-vercel";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({}),
    alias: { "$ui/*": "src/lib/ui/*" },
  },
};

export default config;
