export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: false },
	modules: ["vuetify-nuxt-module", "@vee-validate/nuxt", "@pinia/nuxt"],
	components: [
		{
			path: "~/components",
			pathPrefix: false,
		},
	],
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
		jwtEsp32Life: 0,
		jwtAccessSecret: "",
		jwtRefreshSecret: "",
		jwtResetSecret: "",
		jwtVerifySecret: "",
		jwtEsp32Secret: "",
		public: {
			jwtResetLife: 0,
			jwtVerifyLife: 0,
		},
	},
	vuetify: {
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
