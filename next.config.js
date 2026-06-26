/** @type {import('next').NextConfig} */
const nextConfig = {
  // On Linux/EC2: set STANDALONE=true to enable standalone output for Docker deployment.
  // On Windows: leave unset — symlink creation requires elevated permissions.
  ...(process.env.STANDALONE === "true" && { output: "standalone" }),
};

module.exports = nextConfig;
