# Server Services Understanding

## Architecture Overview

The server is a Nuxt 3 application that manages IoT greenhouse monitoring. The service layer lives in `server/services/` and is organized around in-memory registries, event-driven communication, and a loop-based polling architecture. IoT devices (ESP32, ESP32-CAM) connect via WebSockets. Frontend clients (dashboard, SMS app) also connect via separate WebSockets. The adapter service bridges data between these subsystems.

---

## Core Services

### `esp32/` - ESP32 Microcontroller Service

The largest and most critical service. Manages all communication with ESP32 hardware devices.

- **`index.ts`** - Entry point. Calls `init()` on bridger, emitter, handler, linker, syncer. Runs a busy-guarded `loop()` that ticks reading, action, and schedule subsystems.
- **`registry.ts`** - Maps `Peer` -> `Esp32` (WebSocket peer to device). On register, loads sensors, thresholds, and schedules from the DB into in-memory sub-registries. On unregister (disconnect), clears all sub-registries for that peer.
- **`websocket.ts`** - `hear()` parses incoming JSON messages from ESP32 and dispatches to the event system. `talk()` sends JSON payloads to a specific ESP32 peer.
- **`event.ts`** - Simple pub/sub dispatcher. Listeners match on `(event, query)` pairs (e.g., `"reading"/"Create"`). Handlers run asynchronously via `Promise.resolve().then()`.
- **`schema.ts`** - Defines the WebSocket event protocol: event names (`pin`, `sensor`, `output`, `reading`, `action`, etc.) and CRUD queries.
- **`handler.ts`** - Handles `Retrieve` requests from ESP32. When the ESP32 boots, it asks the server for its pins, sensors, outputs, actuators, inputs, and actions.
- **`bridger.ts`** - Bridges ESP32 responses back to in-memory state. When the ESP32 sends back readings, it dequeues outputs and evaluates threshold conditions. When the ESP32 confirms input changes, it dequeues matching actions.
- **`syncer.ts`** - Persists in-memory state changes to the database. Listens to reading phase changes, action status changes, condition evaluations, and threshold activations. Updates the corresponding DB models and fires hooks.
- **`emitter.ts`** - Sends WebSocket messages to ESP32 when in-memory state changes. When a reading enters the "During" phase, it tells ESP32 to read sensors. When an action becomes "Active" or "Timeout", it notifies the ESP32.
- **`linker.ts`** - The decision engine. Links subsystems together:
  - Reading hooks trigger actions (e.g., "Before reading, turn off pump")
  - Threshold activation triggers actions (e.g., "If temp > 40, turn on fan")
  - Schedule triggers trigger actions (e.g., "At 6:00 AM, turn on lights")
  - Completed/timed-out actions dequeue their hooks
- **`input.ts`** - Sends input updates to the correct ESP32 via WebSocket (traced through Pin -> ESP32).

### `esp32/reading/` - Sensor Reading Subsystem

Implements a 4-phase state machine per sensor: **Off -> Before -> During -> After -> Off**.

- **`reader.ts`** - The state machine engine. `move()` transitions a sensor through phases:
  - **Off -> Before**: When `Date.now() - lastread > interval`. Queues "Before" hooks.
  - **Before -> During**: When all "Before" hooks are done. Queues outputs for ESP32 to read. Queues "During" hooks.
  - **During -> After**: When all hooks AND outputs are dequeued (readings received from ESP32). Queues "After" hooks. Updates `lastread`.
  - **After -> Off**: When all "After" hooks are done.
- **`registry.ts`** - Stores in-memory sensor items, their output IDs, and hook items per sensor. Populated from DB on ESP32 registration.
- **`output.ts`** - Queue of pending output reads. Has a 15-second timeout. If the ESP32 doesn't send the reading in time, the output times out.
- **`hook.ts`** - Queue of pending hooks (Before/During/After triggers). Also has 15-second timeout. Hooks block phase transitions.
- **`event.ts`** - Fires events when sensor readphase changes. Listeners include syncer and emitter.

### `esp32/action/` - Action Execution Subsystem

Manages action lifecycle with priority-based interruption.

- **`invoker.ts`** - Entry point for executing actions. Checks if the action is already queued. If another action targets the same input, compares priorities. Higher priority (lower number) interrupts lower priority. If the new action can't interrupt, it's "Discarded". Otherwise, queued as "Delayed" (if delay > 0) or "Active".
- **`pool.ts`** - In-memory queue. Maps action ID to ActionItem and birth timestamp.
- **`event.ts`** - Dispatches status events: Inactive, Delayed, Active, Discarded, Interrupted, Timeout.
- **`index.ts`** - Loop logic: transitions "Delayed" -> "Active" after delay elapses. Transitions "Active" -> "Timeout" after `delay + duration + timeout` from birth. Negative duration means endless (no timeout).

### `esp32/threshold/` - Threshold Evaluation Subsystem

Evaluates conditions against readings and determines if thresholds are activated.

- **`evaluator.ts`** - `evalcond()` matches incoming readings to conditions by outputId. Evaluates Below/Equal/Above comparisons. `evalthresh()` aggregates conditions for a threshold using All/Any operator.
- **`condition.ts`** - Event emitter for condition satisfied/desatisfied changes.
- **`registry.ts`** - Stores threshold items and their conditions in memory. Populated from DB via condition queries.
- **`event.ts`** - Fires Activate/Deactivate events for thresholds.

### `esp32/schedule/` - Schedule Subsystem

Time-based triggering.

- **`pool.ts`** - Converts schedule days/times into unix timestamps for the current month. Stores them per schedule ID.
- **`registry.ts`** - Maps peer ID to schedule items. On register, queues the schedule.
- **`index.ts`** - Loop checks if any unix timestamp has passed. If so, fires the schedule event and deletes the timestamp. Refreshes all schedules on the 1st of each month.
- **`event.ts`** - Simple listener set (no event name, just one event type).

### `esp32/api/` - Live Update API

Handles CRUD operations from the frontend that need to update in-memory state. For each entity (sensor, threshold, condition, schedule, action, hook, input, output, pin), provides `create`, `update`, and `destroy` methods that modify the in-memory registries and notify ESP32 devices via WebSocket.

### `esp32/hook/` - Hook System

Simple callback arrays per entity type (sensor, reading, action, condition, input, threshold). When syncer updates the DB, it fires the corresponding hook. The adapter service registers callbacks to forward data to the data/email services.

---

### `esp32-cam/` - ESP32-CAM Service

Handles camera devices for image capture and NPK deficiency detection.

- **`registry.ts`** - Maps peer ID to Peer and Esp32Cam objects. Updates `connected` flag in DB on register/unregister.
- **`websocket.ts`** - `hear()` receives binary image data from the camera. `talk()` sends JSON commands.
- **`event.ts`** - Simple handler list for received images.
- **`syncer.ts`** - Saves captured images to filesystem, creates Capture records, runs NPK model prediction, creates Detection records.
- **`hook/`** - Callback arrays for capture.create and detection.create events.

---

### `data/` - Frontend WebSocket Service

Manages WebSocket connections for dashboard/frontend users.

- **`registry.ts`** - Maps peer ID to Peer and UserSafe objects.
- **`websocket.ts`** - `hear()` parses incoming messages and dispatches events. `talk()` sends data to specific users.
- **`event.ts`** - Dispatches events, checking that the user is verified and not disabled.
- **`api/`** - Functions to push data to the correct user's WebSocket. Traces entity ownership through the DB model chain (e.g., Reading -> Output -> Sensor -> Esp32 -> Greenhouse -> userId).

---

### `sms/` - SMS WebSocket Service

Manages WebSocket connections for SMS notification clients (a separate app that sends SMS via a phone).

- **`registry.ts`** - On register, loads unmessaged Warning/Error logs for the user from DB into `logs` map.
- **`index.ts`** - Loop queues one log at a time per user from the registry into the log pool.
- **`log/pool.ts`** - Maps user ID to a single log ID being processed. Tracks queue time.
- **`log/index.ts`** - Timeout loop: re-sends the log to the SMS device every 60 seconds if not acknowledged.
- **`emitter.ts`** - Sends log data to the SMS device when queued or on timeout.
- **`bridger.ts`** - When the SMS device acknowledges (sends log Update with messaged=true), dequeues from pool.
- **`syncer.ts`** - Updates the DB log record with `messaged: true` (intended).

---

### `adapter/` - Service Bridge

Connects services that don't directly know about each other.

- **`esp32-data/`** - Forwards ESP32 state changes (readings, sensor, action, condition, input, threshold updates) to the data/frontend WebSocket.
- **`esp32-email/`** - Sends threshold activation emails to the greenhouse owner.
- **`esp32-cam-data/`** - Forwards capture and detection events to the frontend WebSocket.
- **`esp32-cam-email/`** - Sends NPK deficiency detection emails to the greenhouse owner.
- **`tailscaled-email/`** - Emails the dev with the Tailscale SSH IP/hostname on startup.
- **`cloudflared-email/`** - Emails all users and the admin with the Cloudflare tunnel URL on startup.

---

### `email/` - Email Queue Service

- **`config.ts`** - Holds the nodemailer transporter singleton.
- **`queue.ts`** - FIFO queue. `queueEmail()` pushes to array. `loopEmailQueue()` shifts one email, sends it, and on failure re-queues it at the front.
- **`util.ts`** - Promise wrapper around `transporter.sendMail()`.

### `log/` - Log Email Service

Continuously finds the oldest unemailed Warning/Error log and emails it to the user. Uses a `sent` flag to avoid concurrent sends.

### `auth/` - Authentication Service

- **`signing.ts`** - SignUp (hash password, create verify token, send email) and SignIn (compare password, create access/refresh tokens, send success/failure email).
- **`verification.ts`** - Email verification flow with 60-second resend cooldown.
- **`recovery.ts`** - Password reset flow with 60-second resend cooldown.

### `token/` - JWT Token Service

Wraps `jsonwebtoken` sign/verify with typed token metadata (secret, lifetime per token type).

### `cloudflared/` - Cloudflare Tunnel

Starts a quick tunnel and fires a hook with the URL when connected.

### `tailscaled/` - Tailscale

Checks Tailscale status and fires a hook with IP/hostname if online.

### `model/npk/` - NPK Deficiency Detection Model

TensorFlow.js model for plant nutrient deficiency detection. Loads a saved graph model, preprocesses images (resize to fixed size, normalize), runs inference, and postprocesses with NMS to get bounding boxes with class labels.

### `sequelize/` - Model Initialization

Initializes all Sequelize models and defines their relationships (hasMany, belongsTo, cascading deletes).

### `invitation/` - Crew Invitation Service

CRUD for greenhouse crew invitations with validation (no duplicate invitations, no inviting existing crew) and email notifications for create, cancel, accept, and reject actions.

### `greenhouse/` - Greenhouse CRUD

CRUD operations for greenhouse entities with ownership and permission validation.
