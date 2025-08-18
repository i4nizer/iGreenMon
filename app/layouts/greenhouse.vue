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
                        v-if="user?.id == gh?.userId"
                        link
                        title="Crew"
                        prepend-icon="mdi-account-group"
                        :to="`/user/${user?.name}/greenhouse/${ghname}/crew`"
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
                <v-toolbar-title>Greenmon</v-toolbar-title>
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
import { useDisplay } from 'vuetify';

//

// --- Get user, greenhouse & notif
const toast = useToast()
const route = useRoute()
const { user } = useUser()
const ghname = route.params?.ghname as string

// --- Remove some navs when user don't have a permission on
const ghUtil = useGreenhouse()
const gh = useState<Greenhouse|undefined>("layout-greenhouse", () => undefined)

const fetchGH = async () => {
    if (gh.value) return;
    const res = await ghUtil.retrieve(ghname)
    if (!res.success) return toast.error(res.error)
    gh.value = res.data
}

onBeforeMount(async () => await fetchGH())
onServerPrefetch(async () => await fetchGH())

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

    if (!signOutResult.success) return toast.error(signOutResult.error)
    toast.success("User signed out successfully.")
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
