/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
    N8N_BEARER_TOKEN: process.env.N8N_BEARER_TOKEN,
  },
  // Deshabilitar Vercel Analytics en desarrollo
  ...(process.env.NODE_ENV === "development" && {
    experimental: {
      instrumentationHook: false,
    },
  }),
};

export default nextConfig;
