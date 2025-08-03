export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	runtimeConfig: {
		nodeEnv: "",
		databaseUrl: "",
		databaseSync: "",
		gmailAddress: "",
		gmailPassword: "",
		jwtAccessLife: 0,
		jwtRefreshLife: 0,
		jwtResetLife: 0,
		jwtVerifyLife: 0,
		jwtAccessSecret: "",
		jwtRefreshSecret: "",
		jwtResetSecret: "",
		jwtVerifySecret: "",
		public: {
			jwtResetLife: 0,
			jwtVerifyLife: 0,
		},
	},
})
