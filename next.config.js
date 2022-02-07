/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    DEV_API_URL: process.env.DEV_API_URL,
    PRODUCTION_API_URL: process.env.PRODUCTION_API_URL
  }
}
