/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    CORE_API_URL: process.env.DEV_CORE_API_URL
  }
}
