# Refactor Plan

What I would have done if I had time to refactor the project.

---

## Current State

The server is a Nuxt 3 monolith where all services live under `server/services/`. It works and is appropriate for the deployment target (Orange Pi Zero 3, 4GB RAM, 128GB SSD), but the file sprawl makes it hard to navigate and maintain.

---

## Target Architecture: 5 Separated Backends

### 1. UI (Nuxt SSR)

- Pages, components, composables, assets.
- Stateless, changes frequently.
- Communicates with Collaboration and IoT Config API via HTTP/REST.

### 2. Collaboration Service

- Auth (signup, signin, verification, recovery, tokens).
- User management.
- Greenhouse CRUD and permissions.
- Crew invitations.
- Standard CRUD, rarely changes once stable.

### 3. IoT Config API

- CRUD for sensors, pins, outputs, actuators, thresholds, schedules, actions, hooks, inputs.
- Pushes live updates to IoT Automation when config changes (via Redis pub/sub or HTTP callback).
- Standard CRUD, moderate change rate.

### 4. IoT Automation Engine

- ESP32 WebSocket handling (registry, bridger, emitter, handler, linker, syncer).
- Reading state machine (4-phase: Off -> Before -> During -> After -> Off).
- Action execution engine (priority-based interruption, delay/duration/timeout lifecycle).
- Threshold evaluation (condition matching, All/Any aggregation).
- Schedule system (time-based triggers).
- ESP32-CAM WebSocket handling (image capture, forwarding to ML service).
- SMS WebSocket service (log queue, acknowledgment loop).
- Email queue service.
- Adapter bridges (esp32-data, esp32-cam-data, esp32-email, esp32-cam-email).
- Frontend data WebSocket (pushing real-time updates to dashboard).
- Stateful, complex, changes carefully.

### 5. ML Inference Service (Python + FastAPI)

- NPK deficiency detection model served via FastAPI.
- Separates TensorFlow/PyTorch from the Node.js runtime.
- Benefits: access to the full Python ML ecosystem (better model tooling, easier model updates, GPU support if hardware changes), decouples model lifecycle from application lifecycle.
- IoT Automation sends captured images to this service via HTTP and receives detection results.

---

## Communication Between Services

- **UI -> Collaboration, IoT Config API**: HTTP/REST.
- **IoT Config API -> IoT Automation**: Redis pub/sub for live config updates (e.g., "sensor created", "threshold updated"). This replaces the current in-process `esp32/api/` module that directly mutates in-memory registries.
- **IoT Automation -> ML Inference**: HTTP POST with image data, receives bounding boxes and class labels.
- **IoT Automation -> UI**: WebSocket (same as current data service).
- **Redis**: Shared message bus. Also useful for persisting in-memory registries so they survive server restarts.

---

## Hardware Estimate (Orange Pi Zero 3, 4GB RAM)

| Component           | Estimated RAM  |
| ------------------- | -------------- |
| UI (Nuxt SSR)       | ~100-200MB     |
| Collaboration       | ~60-100MB      |
| IoT Config API      | ~60-100MB      |
| IoT Automation      | ~150-300MB     |
| ML Inference        | ~200-400MB     |
| Redis               | ~30-50MB       |
| DB + OS             | ~350-500MB     |
| **Total**           | **~950-1.6GB** |

Feasible on 4GB. Moving TensorFlow out of Node.js into Python may actually reduce total memory since Python ML runtimes are more optimized for inference.

---

## Incremental Path (If Time is Limited)

Before fully splitting into separate backends, the intermediate step is a **modular monolith**:

- Restructure `server/services/` into 4 clearly bounded modules, each with a strict public API (`index.ts` that exports only what other modules need).
- No cross-module imports of internal files.
- Each module gets its own test suite.
- This gives 90% of the DX benefit with 0% operational cost.
- Modules can be extracted into separate services later with minimal rework.

---

## File Reduction Within Modules

Regardless of the split, consolidate boilerplate:

- **Generic event dispatcher**: One reusable pub/sub utility instead of 6+ near-identical `event.ts` files.
- **Merge small tightly-coupled files**: e.g., `reading/output.ts` and `reading/hook.ts` into `reading/queue.ts` since only `reader.ts` uses them.
- **Flatten shallow directories**: When a subdirectory has 3-4 small files always used together, a single file with clear sections is easier to navigate.
