##### bridger.ts
 - Dequeues outputs of reading once readings are received

##### emitter.ts
 - Listens to during readphase from reading and emits it to the esp32 ws

##### event.ts
 - Stores the websocket event listeners

##### handler.ts
 - Responds to data requests of esp32 ws

##### index.ts
 - Contains the main init and loop

##### linker.ts
 - Linker listens from one service to call another

##### registry.ts
 - Stores ws peer and esp32
 - Registers all sensors of esp32 ws from db

##### schema.ts
 - Contains schemas for parsing and types for websocket events

##### syncer.ts
 - Saves the readings to the db

##### websocket.ts
 - Contains the websocket comms