##### event.ts
 - Stores event listeners to trigger
 - Contains the event invoke function

##### index.ts
 - Runs the schedule trigger and refresh loop

##### pool.ts
 - Stores the schedule's days and time
 - Contains the logic for parsing schedule days and time

##### registry.ts
 - Contains the schedules of the currently connected esp32 ws

##### schema.ts
 - Contains the parsing schemas and types