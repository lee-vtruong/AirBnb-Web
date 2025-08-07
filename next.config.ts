/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
      {
        protocol: 'http',
        hostname: '**', 
      }
    ],
    
    domains: [
      'thesinhcafetouronline.com',
      'airbnb.cybersoft.edu.vn', 
      'airbnbnew.cybersoft.edu.vn',
      'images.unsplash.com',
      'plus.unsplash.com'
    ]
  }
}

module.exports = nextConfig