import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"

//

class Capture extends Model<
	InferAttributes<Capture>,
	InferCreationAttributes<Capture>
> {
	declare id: CreationOptional<number>
	declare filename: string
	declare esp32CamId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const captureAttributes: ModelAttributes<Capture, InferAttributes<Capture>> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	filename: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	esp32CamId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "esp32cams", key: "id" },
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

const captureOptions = (sequelize: Sequelize): InitOptions<Capture> => ({
	sequelize,
	tableName: "captures",
	timestamps: true,
})

//

export { Capture, captureAttributes, captureOptions }
