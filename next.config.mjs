/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
          'assets.unileversolutions.com',
          'www.elespectador.com',
          'escuelamundopastel.com',
          'badun.nestle.es',
          'res.cloudinary.com',
          'images.rappi.com'
        ],
      },
      env: {
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      },
      compiler: {
        styledComponents: true,
      },
};

export default nextConfig;
