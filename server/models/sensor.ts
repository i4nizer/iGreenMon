import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"
import { SensorReadPhase } from "#shared/schema/sensor"

//

class Sensor extends Model<InferAttributes<Sensor>, InferCreationAttributes<Sensor>> {
	declare id: CreationOptional<number>
	declare name: string
	declare description: CreationOptional<string>
	declare interval: CreationOptional<number>
	declare lastread: CreationOptional<number>
	declare readphase: CreationOptional<SensorReadPhase>
	declare disabled: CreationOptional<boolean>
	declare esp32Id: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const sensorAttributes: ModelAttributes<Sensor, InferAttributes<Sensor>> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.STRING(500),
		allowNull: false,
		defaultValue: "",
	},
	interval: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 15 * 60000,
	},
	lastread: {
		type: DataTypes.BIGINT,
		allowNull: false,
		defaultValue: 0,
	},
	readphase: {
		type: DataTypes.ENUM(...SensorReadPhase),
		allowNull: false,
		defaultValue: SensorReadPhase[0],
	},
	disabled: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true,
	},
	esp32Id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "esp32s", key: "id" },
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

const sensorOptions = (sequelize: Sequelize): InitOptions<Sensor> => ({
	sequelize,
	tableName: "sensors",
	timestamps: true,
})

//

export { Sensor, sensorAttributes, sensorOptions }
