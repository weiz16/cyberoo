/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: false,
  env: {
    DEV_API_URL: process.env.DEV_API_URL,
    PRODUCTION_API_URL: process.env.PRODUCTION_API_URL
  }
}
