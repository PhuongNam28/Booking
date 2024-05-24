/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      // Remove the 'domains' configuration
      // Replace it with 'remotePatterns'
      // Add the remote patterns for image optimization 
      domains: ['firebasestorage.googleapis.com'],
      remotePatterns: [
        {
          // Add the pattern for avataaars.io
          protocol: 'https',
          hostname: 'avataaars.io',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'api.dicebear.com',
          port: '',
          pathname: '/7.x/lorelei/svg',
        },
        {
          // Add the pattern for utfs.io
          protocol: 'https',
          hostname: 'utfs.io',
          port: '',
          pathname: '/**',
        },
      ],
      dangerouslyAllowSVG: true, // Enable SVG images
    },
  };
export default nextConfig;
