
//

export default defineWebSocketHandler({
    upgrade: async (request) => {
        
    },
    open: async (peer) => {
        peer.send("Welcome to Greenmon!")
    },
    message: async (peer, message) => {
        console.info(`Messenger::Received ${message.text()}.`)
    },
    error: (peer, error) => {
        console.error(error)
    },
    close: async (peer, details) => {
        console.warn(`Messenger ${peer.id} disconnected.`, details)
    }
})
