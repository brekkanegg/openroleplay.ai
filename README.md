# Open Roleplay

Open Roleplay serves is an open-source alternative to Character.ai.
You have full control over your data, model, and visual presentation.

Platforms like Character.ai and other AI agent platforms are fantastic. They sparked our interest in the potential of AI interactions. We utilize them for a variety of purposes, including productivity, entertainment, workflow automation, and more. However, these platforms often lack flexibility, transparency and customization options.

This is where Open Roleplay steps in. Whether self-hosted or hosted by us, it's ready to be deployed on your own domain with your personalized model and data.

## Features

- Chat with your favorite characters
- Customizable rate limit
- Full chat history

## Supported Models

- gpt-4-1106-preview (128k context window)
- gpt-3.5-turbo-1106 (16k context window)
- Mistral 8x7b (Coming soon)
- Perplexity pplx-7b-chat (Coming soon)
- Perplexity pplx-70b-chat (Coming soon)
- Perplexity pplx-7b-online (Coming soon)
- Perplexity pplx-70b-online (Coming soon)

### Built With

- [Next.js](https://nextjs.org/?ref=cal.com)
- [React.js](https://reactjs.org/?ref=cal.com)
- [Tailwind CSS](https://tailwindcss.com/?ref=cal.com)
- [Vercel](https://vercel.com/)
- [Convex](https://convex.dev/)

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app for the service
- `docs`: a [Next.js](https://nextjs.org/) app for developer and user documentation
- `@repo/ui`: a stub React component library
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

### Run Openroleplay Locally

To develop all apps and packages, run the following command:

```
pnpm install
pnpm dev
```
