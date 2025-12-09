import * as tf from "@tensorflow/tfjs-node"
import type { Sequelize } from "sequelize"

//

declare module "nitropack" {
	interface NitroApp {
		sequelize?: Sequelize
	}
}
