<template>
	<v-layout full-height>
		<v-app>
			<!-- Top Navigation -->
			<v-app-bar class="border-b bg-green" elevation="0">
				<v-icon size="large" class="pl-8 pl-md-10">mdi-leaf</v-icon>
				<v-toolbar-title>Greenmon</v-toolbar-title>
				<template #append>
					<v-btn
						link
						to="/auth/sign-in"
						text="Sign In"
						class="bg-white ml-1 mr-4 mr-md-6"
					></v-btn>
				</template>
			</v-app-bar>

			<!-- Contents -->
			<v-main>
				<slot></slot>
			</v-main>
		</v-app>
	</v-layout>
</template>
