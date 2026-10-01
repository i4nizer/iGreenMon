export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	css: ["@mdi/font/css/materialdesignicons.css"],
	devtools: { enabled: false },
	$production: { ssr: true },
	nitro: {
		preset: "node-server",
		experimental: { websocket: true },
	},
	modules: [
		"vuetify-nuxt-module",
		"motion-v/nuxt",
		"@vee-validate/nuxt",
		"@pinia/nuxt",
	],
	components: [
		{
			path: "~/components",
			pathPrefix: false,
		},
	],
	runtimeConfig: {
		nodeEnv: "",
		databaseUser: "",
		databasePass: "",
		databaseHost: "",
		databasePort: 3306,
		databaseName: "",
		databaseLog: false,
		databaseSync: false,
		databaseAlter: false,
		databaseForce: false,
		databaseDialect: "mysql",
		databaseCertificate: "",
		gmailAddress: "",
		gmailPassword: "",
		devGmailAddress: "",
		archmailUrl: "",
		archmailApikey: "",
		jwtAccessLife: 0,
		jwtRefreshLife: 0,
		jwtResetLife: 0,
		jwtVerifyLife: 0,
		jwtEsp32Life: 0,
		jwtEsp32CamLife: 0,
		jwtSmsLife: 0,
		jwtAccessSecret: "",
		jwtRefreshSecret: "",
		jwtResetSecret: "",
		jwtVerifySecret: "",
		jwtEsp32Secret: "",
		jwtEsp32CamSecret: "",
		jwtSmsSecret: "",
		public: {
			jwtResetLife: 0,
			jwtVerifyLife: 0,
		},
	},
	vite: {
		server: {
			allowedHosts: [".trycloudflare.com"],
		},
	},
	vuetify: {
		moduleOptions: {
			prefixComposables: true,
		},
		vuetifyOptions: {
			defaults: {
				VBtn: { class: "text-none" },
				VTextField: {
					variant: "outlined",
					density: "compact",
					class: "mt-1",
				},
				VNumberInput: {
					variant: "outlined",
					density: "compact",
					class: "mt-1",
				},
				VSelect: {
					variant: "outlined",
					density: "compact",
					class: "mt-1",
				},
				VTextarea: {
					variant: "outlined",
					density: "compact",
					class: "mt-1",
				},
			},
		},
	},
	veeValidate: {
		autoImports: true,
		componentNames: {
			Form: "VeeForm",
			Field: "VeeField",
			FieldArray: "VeeFieldArray",
			ErrorMessage: "VeeErrorMessage",
		},
	},
})
