/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui"],
  images: {
    domains: ["lh3.googleusercontent.com", "img.clerk.com"],
  },
  async redirects() {
    return [
      {
        source: "/star",
        destination:
          "https://github.com/Open-Roleplay-AI/OpenRoleplay/stargazers",
        permanent: true,
      },
    ];
  },
};
