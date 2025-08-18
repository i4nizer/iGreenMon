<template>
	<v-container fluid class="bg-container pa-5 py-7">
		<v-row>
			<v-col>
				<h3>User Settings</h3>
			</v-col>
		</v-row>
        <v-row>
            <v-col cols="12" md="6">
                <v-card class="pa-5">
                    <account-update-form 
                        :user="(user as UserSafe)"
                        @error="onUpdateUserError"
                        @success="onUpdateUserSuccess"
                    />
                </v-card>
            </v-col>
        </v-row>
	</v-container>
</template>

<script setup lang="ts">
import type { UserSafe } from '~~/shared/schema/user'

//

// --- Notifs
const toast = useToast()

// --- User
const { user } = useUser()

const onUpdateUserError = (msg: string) => {
    toast.error(msg)
}

const onUpdateUserSuccess = async (user: UserSafe) => {
    toast.success("User updated successfully.")
    await navigateTo(`/user/${user.name}/settings`)
}

//

</script>

<style scoped></style>
