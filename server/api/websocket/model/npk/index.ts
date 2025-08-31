import { NPKModel } from "~~/server/services/model"

//

export default defineWebSocketHandler({
    message: async (peer, message) => {
        // --- Do inference
        const blob = message.blob()
        const buffer = await blob.arrayBuffer()
        const result = await NPKModel.predict(buffer)
        
        // --- Send stringified version
        const config = useRuntimeConfig()
        const isProd = config.nodeEnv == "production"
        
        if (result.success) peer.send(JSON.stringify(result.data))
        if (!isProd && !result.success) console.error(result.error)
    },
})