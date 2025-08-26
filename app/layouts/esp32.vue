<template>
	<v-layout full-height>
		<v-app>
			<!-- The Left Navigation Drawer -->
			<v-navigation-drawer
				class="bg-green-darken-4 position-fixed"
				:rail="isTablet"
				:permanent="!isMobile"
				:expand-on-hover="isTablet"
				v-model="isDrawer"
			>
				<template #prepend>
					<v-list>
						<v-list-item
							link
							prepend-icon="mdi-account"
							:to="`/user/${user?.name}/greenhouse`"
							:title="user?.name"
							:subtitle="user?.email"
						></v-list-item>
					</v-list>
				</template>
				<v-divider></v-divider>
				<v-list density="compact" nav>
					<v-list-item
						link
						prepend-icon="mdi-sprout"
						:to="`/user/${user?.name}/greenhouse/${ghname}/dashboard`"
						:title="`${ghname}`"
					></v-list-item>
				</v-list>
				<v-divider></v-divider>
				<v-list density="compact" nav>
					<v-list-item
						link
						title="Dashboard"
						prepend-icon="mdi-view-dashboard"
						:to="`/user/${user?.name}/greenhouse/${ghname}/esp32/${esp32?.id}/${esp32?.name}/dashboard`"
					></v-list-item>
					<v-list-item
						v-if="isOwnGH || canAccessPin"
						link
						title="Pin"
						prepend-icon="mdi-sine-wave"
						:to="`/user/${user?.name}/greenhouse/${ghname}/esp32/${esp32?.id}/${esp32?.name}/pin`"
					></v-list-item>
					<v-list-item 
						v-if="isOwnGH || canAccessSensor"
						link 
						title="Sensor" 
						prepend-icon="mdi-thermometer"
						:to="`/user/${user?.name}/greenhouse/${ghname}/esp32/${esp32?.id}/${esp32?.name}/sensor`"
					></v-list-item>
					<v-list-item 
						v-if="isOwnGH || canAccessActuator"
						link 
						title="Actuator" 
						prepend-icon="mdi-fan"
						:to="`/user/${user?.name}/greenhouse/${ghname}/esp32/${esp32?.id}/${esp32?.name}/actuator`"
					></v-list-item>
					<v-list-item 
						v-if="isOwnGH || canModifyEsp32"
						link 
						title="Settings" 
						prepend-icon="mdi-cog"
						:to="`/user/${user?.name}/greenhouse/${ghname}/esp32/${esp32?.id}/${esp32?.name}/settings`"
					></v-list-item>
				</v-list>
				<template #append>
					<v-divider></v-divider>
					<v-list density="compact">
						<v-list-item
							link
							title="Sign Out"
							prepend-icon="mdi-logout"
							:disabled="isSigningOut"
							@click="onClickSignOut"
						></v-list-item>
					</v-list>
				</template>
			</v-navigation-drawer>

			<!-- Contains Controls -->
			<v-app-bar class="bg-green">
				<v-app-bar-nav-icon
					v-if="isMobile"
					@click="isDrawer = !isDrawer"
				/>
				<v-icon size="large" class="pl-6 pl-md-8">mdi-leaf</v-icon>
				<v-toolbar-title>iGreenMon</v-toolbar-title>
			</v-app-bar>

			<!-- All Contents Goes Here -->
			<v-main>
				<div class="w-100 h-100 bg-doa-centered">
					<slot></slot>
				</div>
			</v-main>
		</v-app>
	</v-layout>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify"
import { useEsp32 } from "~/composables/use-esp32"
import type { Esp32 } from "~~/shared/schema/esp32"
import type { Greenhouse } from "~~/shared/schema/greenhouse"

//

// --- Nuxt CTX
const nctx = useNuxtApp()
const rwnctx = nctx.runWithContext

// --- User
const userUtil = useUser()
const { user } = userUtil

// --- Notif
const toastUtil = useToast()

// --- Route Data
const routeUtil = useRoute()
const ghname = routeUtil.params?.ghname as string
const esp32id = routeUtil.params?.esp32id as string

// --- Greenhouse
const ghUtil = useGreenhouse()
const gh = useState<Greenhouse | undefined>(`gh-${ghname}`)
const isOwnGH = computed(() => gh.value?.userId == user.value?.id)

const fetchGH = async () => {
	if (gh.value) return;
	const res = await ghUtil.retrieve(ghname)
	if (!res.success) return toastUtil.error(res.error)
	gh.value = res.data
}

// --- Permissions
const permUtil = usePermission()
const permStore = usePermissionStore()
const { canAccess, canModify } = permUtil
const { permissions } = permStore

const canAccessPin = computed(() => canAccess("Pin", permissions))
const canAccessSensor = computed(() => canAccess("Sensor", permissions))
const canAccessActuator = computed(() => canAccess("Actuator", permissions))

const fetchPerms = async () => {
	if (isOwnGH.value || permissions.length > 0) return
	const res = await permUtil.retrieveAll(ghname)
	if (!res.success) return toastUtil.error(res.error)
	res.data.forEach((p) => permStore.append(p))
}

// --- Esp32
const esp32Util = useEsp32()
const esp32 = useState<Esp32 | undefined>(`${esp32id}-esp32`)

const canAccessEsp32 = computed(() => canAccess("Esp32", permissions))
const canModifyEsp32 = computed(() => canModify("Esp32", permissions))

const fetchEsp32 = async () => {
	if (!isOwnGH.value && !canAccessEsp32.value) return;
	if (esp32.value) return;
	const esp32Id = parseInt(esp32id)
	const res = await esp32Util.retrieve(esp32Id)
	if (!res.success) return toastUtil.error(res.error)
	esp32.value = res.data
}

// --- Data Fetching
const fetchData = async () => {
	await rwnctx(fetchGH)
	await rwnctx(fetchPerms)
	await rwnctx(fetchEsp32)
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

// --- Responsive
const { mdAndDown, smAndDown } = useDisplay()
const isDrawer = ref(!smAndDown.value)
const isMobile = computed(() => smAndDown.value)
const isTablet = computed(() => !isMobile.value && mdAndDown.value)

// --- Auth signing out
const auth = useAuth()
const isSigningOut = ref(false)

const onClickSignOut = async () => {
	isSigningOut.value = true
	const signOutResult = await auth.signOut()
	isSigningOut.value = false

	if (!signOutResult.success) return toastUtil.error(signOutResult.error)
	toastUtil.success("User signed out successfully.")
	await navigateTo("/")
}

//

</script>

<style scoped>
.bg-doa-centered {
	position: relative;
	overflow: hidden;
}

.bg-doa-centered::before {
	content: "";
	position: absolute;
	inset: 0;
	background-image: url("https://res.cloudinary.com/dqgnetjlz/image/upload/f_auto,q_auto/bg-doa.png");
	background-size: clamp(200px, 40vw, 400px);
	background-repeat: no-repeat;
	background-position: center;
	filter: opacity(0.5);
	z-index: 0;
	pointer-events: none;
}
</style>
