import { Peer } from "crossws"
import { DetectionBBox } from "~~/shared/schema/detection";
import type { Esp32Cam } from "#shared/schema/esp32-cam";

//

type WebSocketEventName = "camera" | "power"
type WebSocketEventQuery = "Create" | "Retrieve" | "Update" | "Delete"

type WebSocketEventHandler = (
    peer: Peer,
	image: ArrayBuffer | SharedArrayBuffer,
    esp32Cam: Esp32Cam
) => any;

//

export type { WebSocketEventName, WebSocketEventQuery, WebSocketEventHandler }
