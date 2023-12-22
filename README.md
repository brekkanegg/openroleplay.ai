<p align="center">
<a href="https://github.com/Open-Roleplay-AI/OpenRoleplay">
<img src="https://github.com/Open-Roleplay-AI/.github/blob/main/github-banner.png?raw=true" alt="Logo">
</a>

  <h3 align="center">OpenRoleplay.ai</h3>

  <p align="center">
    The open-source character.ai alternative.
    <br />
    <br />
    <a href="https://discord.gg/bM5zzMEtdW">Discord</a>
    ·
    <a href="https://openroleplay.ai">Website</a>
    ·
    <a href="https://github.com/Open-Roleplay-AI/OpenRoleplay/issues">Issues</a>
  </p>
</p>

<p align="center">
   <a href="https://github.com/Open-Roleplay-AI/OpenRoleplay/stargazers"><img src="https://img.shields.io/github/stars/Open-Roleplay-AI/OpenRoleplay" alt="Github Stars"></a>
   <a href="https://github.com/Open-Roleplay-AI/OpenRoleplay/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-AGPLv3-purple" alt="License"></a>
   <a href="https://github.com/Open-Roleplay-AI/OpenRoleplay/pulse"><img src="https://img.shields.io/github/commit-activity/m/Open-Roleplay-AI/OpenRoleplay" alt="Commits-per-month"></a>
   <a href="https://openroleplay.ai/pricing"><img src="https://img.shields.io/badge/Pricing-Free-brightgreen" alt="Pricing"></a>
   <a href="https://github.com/Open-Roleplay-AI/OpenRoleplay/issues?q=is:issue+is:open+label:%22%F0%9F%99%8B%F0%9F%8F%BB%E2%80%8D%E2%99%82%EF%B8%8Fhelp+wanted%22"><img src="https://img.shields.io/badge/Help%20Wanted-Contribute-blue"></a>
   <a href="https://contributor-covenant.org/version/1/4/code-of-conduct/ "><img src="https://img.shields.io/badge/Contributor%20Covenant-1.4-purple" /></a>
</p>

<br/>

# AI characters and roleplay for everyone

Open Roleplay serves is an open-source alternative to Character.ai.
You have full control over your data, model, and visual presentation.

Platforms like Character.ai and other AI agent platforms are fantastic. They sparked our interest in the potential of AI interactions. We utilize them for a variety of purposes, including productivity, entertainment, workflow automation, and more. However, these platforms often lack flexibility, transparency and customization options.

This is where Open Roleplay steps in. Whether self-hosted or hosted by us, it's ready to be deployed on your own domain with your personalized model and data.

## Features

- Chat with your favorite characters
- Customizable rate limit
- Full chat history

## Supported Models

### Smaller, Faster Models

- gpt-3.5-turbo-1106 (16k context window)
- Mistral 8x7b (Coming soon)
- Perplexity pplx-7b-chat (Coming soon)
- Perplexity pplx-7b-online (Coming soon)

### Larger, Accurate Models

- Perplexity pplx-70b-chat (Coming soon)
- Perplexity pplx-70b-online (Coming soon)
- gpt-4-1106-preview (128k context window)

### Image generation

- Coming soon

### Built With

- [Next.js](https://nextjs.org/?ref=cal.com)
- [React.js](https://reactjs.org/?ref=cal.com)
- [Tailwind CSS](https://tailwindcss.com/?ref=cal.com)
- [Vercel](https://vercel.com/)
- [Convex](https://convex.dev/)
- [Clerk](https://clerk.com/)

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

### Run Locally

To develop all apps and packages, run the following command:

```
# Run frontend server
pnpm install
pnpm dev

# Run backend server
cd apps/web
npx convex dev
```

## Deployment

### Convex and Vercel

We use convex for backend as a service and vercel for frontend cloud to ship features faster.

Check out [Using Convex with Vercel](https://docs.convex.dev/production/hosting/vercel) for detailed guide.

### Clerk

Clerk is an authentication platform providing login via passwords, social identity providers, one-time email or SMS access codes, and multi-factor authentication and basic user management.

We use Clerk for simplified and secure user authentication.

Check out [Convex Clerk](https://docs.convex.dev/auth/clerk) for detailed guide.

## Roadmap and Feedback

Giving perfect memory for agents, adding voice capabilities and image generation, improving user interactions, possibilities are endless. We value your [feedback](https://github.com/Open-Roleplay-AI/OpenRoleplay/issues).

## Support This Project

This project is entirely bootstrapped and was initiated out of personal passion and effort. Your contributions are invaluable and will ensure the continued vitality of this project.
