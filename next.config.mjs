/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { 
        loader: 'worker-loader',
        options: { 
          esModule: true  // ✅ Enable ES module support correctly
        }  // Ensure worker is loaded correctly
      }
    });
    return config;
  },
  reactStrictMode: true,
  images: {
    domains: ['example.com', 'dummyimage.com'],
  },
};

export default nextConfig;
