import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"
import { DetectionBox } from "#shared/schema/detection"

//

class Detection extends Model<
	InferAttributes<Detection>,
	InferCreationAttributes<Detection>
> {
	declare id: CreationOptional<number>
	declare box: DetectionBox
	declare class: string
	declare confidence: number
	declare captureId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const detectionAttributes: ModelAttributes<
	Detection,
	InferAttributes<Detection>
> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	box: {
		type: DataTypes.JSON,
		allowNull: false,
	},
	class: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	confidence: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	captureId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "captures", key: "id" },
		onDelete: "CASCADE",
	},
	createdAt: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
	},
	updatedAt: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
	},
}

//

const detectionOptions = (
	sequelize: Sequelize
): InitOptions<Detection> => ({
	sequelize,
	tableName: "detections",
	timestamps: true,
})

//

export { Detection, detectionAttributes, detectionOptions }
