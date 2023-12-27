/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.convex.cloud",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/star",
        destination:
          "https://github.com/Open-Roleplay-AI/OpenRoleplay/stargazers",
        permanent: true,
      },
      {
        source: "/github",
        destination: "https://github.com/Open-Roleplay-AI/OpenRoleplay",
        permanent: true,
      },
      {
        source: "/discord",
        destination: "https://discord.gg/bM5zzMEtdW",
        permanent: true,
      },
    ];
  },
};
