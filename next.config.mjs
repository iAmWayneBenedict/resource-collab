/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
	transpilePackages: ["prettier"],
	experimental: {
		webpackBuildWorker: true,
	},
	// serverExternalPackages: ["@node-rs/argon2", "@node-rs/bcrypt", "prettier"],
	// experimental: {
	// 	serverComponentsExternalPackages: ["prettier"],
	// },
	// webpack: (config) => {
	// 	config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");

	// 	config.cache = {
	// 		type: "filesystem",
	// 		store: "pack",
	// 		compression: "gzip",
	// 	};
	// 	return config;
	// },
};

export default nextConfig;
