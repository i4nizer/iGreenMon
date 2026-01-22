import { setTimeout } from "timers/promises"
import tailscaled from "../services/tailscaled"

//

export default defineNitroPlugin(async (nitro) => {
    // --- Wait for the database
    while (!nitro.sequelize) await setTimeout(5000)
        
    // --- Init tailscale ssh
    const config = useRuntimeConfig()
    await tailscaled.init()
    console.info("Tailscaled service initialized.")
})