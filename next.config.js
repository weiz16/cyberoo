/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    CORE_API_URL: process.env.CORE_API_URL
  }
}
