<template>
	<v-card 
        class="border pa-2" 
        :color="responded ? 'grey-lighten-4' : ''"
    >
		<template #prepend>
			<span v-if="incoming" :class="responded ? 'text-grey-darken-2' : ''">
				<strong>{{ inv.inviter.name }}</strong> invited you to collaborate on
				<strong>{{ inv.greenhouse.name }}</strong>
			</span>
            <span v-else :class="responded ? 'text-grey-darken-2' : ''">
                You invited <strong>{{ inv.invitee.name }}</strong> to collaborate on
                <strong>{{ inv.greenhouse.name }}</strong>
            </span>
		</template>
		<template #text>
			<div class="d-flex flex-wrap flex-row">
				<div class="w-75 text-grey-darken-2">
					<div>
						<em>{{ invitation.message }}</em>
					</div>
					<div class="d-flex ga-5 mt-2">
						<div class="d-flex align-center ga-1">
							<v-icon size="16">mdi-calendar-outline</v-icon>
							<span>{{ creation }}</span>
						</div>
						<div 
                            v-if="invitation.emailed" 
                            class="d-flex align-center ga-1"
                        >
							<v-icon size="16">mdi-email-outline</v-icon>
							<span>Emailed</span>
						</div>
					</div>
				</div>
				<div class="w-25 text-end">
					<v-btn
						v-if="!responded && incoming"
						text="Decline"
						class="border"
						elevation="0"
                        :disabled="loading"
                        @click="onClickReject"
					></v-btn>
					<v-btn
						v-if="!responded && incoming"
						text="Accept"
						class="ml-1"
						color="green"
						elevation="0"
                        :disabled="loading"
                        @click="onClickAccept"
					></v-btn>
					<v-btn
						v-if="!responded && !incoming"
						text="Cancel"
						class="border ml-1"
						elevation="0"
                        :disabled="loading"
                        @click="onClickCancel"
					></v-btn>
                    <v-chip
                        v-if="responded"
                        :text="invitation.response"
                        :color="accepted ? 'green' : 'grey'"
                    ></v-chip>
				</div>
			</div>
		</template>
	</v-card>
</template>

<script setup lang="ts">
//

// --- Data Binding
const emit = defineEmits<{
    cancel: [inv: InvitationGet, opts: { loading: Ref<boolean> }]
    accept: [inv: InvitationGet, opts: { loading: Ref<boolean> }]
    reject: [inv: InvitationGet, opts: { loading: Ref<boolean> }]
}>()

const props = defineProps<{
	incoming?: boolean
	invitation: InvitationGet
}>()

// --- State
const inv = computed(() => props.invitation)
const accepted = computed(() => inv.value.response == "Accepted")
const responded = computed(() => inv.value.response != "Unset")

// --- Date Format
const date = useDate()
const format = "fullDateTime12h"
const creation = computed(() => date.format(inv.value.createdAt, format))

// --- State Binding
const loading = ref(false)

const onClickCancel = () => emit("cancel", props.invitation, { loading })
const onClickAccept = () => emit("accept", props.invitation, { loading })
const onClickReject = () => emit("reject", props.invitation, { loading })

//
</script>

<style scoped></style>
