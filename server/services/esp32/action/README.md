##### event.ts
 - Stores event listeners to action status
 - Contains the event invoke function

##### index.ts
 - Contains the logic for moving action status from delayed to active
 and active to timeout

##### invoker.ts
 - Contains the action invoker who decides which action to prioritize

##### pool.ts
 - Contains the pool of invoked actions waiting to be done or timedout

##### schema.ts
 - Contains parsing schema and types

##### syncer.ts
 - Syncs action status update to the database