import { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	images: {
		domains: ["m.media-amazon.com"],
	},
};

export default nextConfig;
