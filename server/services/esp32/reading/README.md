##### event.ts
 - Stores event listeners to readphase
 - Contains the event invoke function

##### hook.ts
 - Queues hooks that will wait for their finish
 - Stores event listeners to Queue, Dequeue, and Timeout
 - Contains loop for timing out hook queue

##### index.ts
 - Contains the unified init and loop

##### output.ts
 - Queues outputs that will wait for their finish
 - Stores event listeners to Queue, Dequeue, and Timeout
 - Contains loop for timing out output queue

##### reader.ts
 - Contains the loop logic that moves the sensor's readphase

##### registry.ts
 - Stores the esp32's sensors, outputs, and hooks by querying db

##### schema.ts
 - Contains the schemas for parsing and the inferred types

##### syncer.ts
 - Syncs db from readphase changes