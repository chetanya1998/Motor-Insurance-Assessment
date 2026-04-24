import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;
const repo = "Motor-Insurance-Assessment";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  basePath: isGithubActions ? `/${repo}` : '',
  assetPrefix: isGithubActions ? `/${repo}/` : '',
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
