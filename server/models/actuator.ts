import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"

//

class Actuator extends Model<InferAttributes<Actuator>, InferCreationAttributes<Actuator>> {
	declare id: CreationOptional<number>
	declare name: string
	declare description: CreationOptional<string>
	declare disabled: CreationOptional<boolean>
	declare esp32Id: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const actuatorAttributes: ModelAttributes<Actuator, InferAttributes<Actuator>> = {
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
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: "",
	},
	disabled: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	},
	esp32Id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: "esp32s",
			key: "id",
		},
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

const actuatorOptions = (sequelize: Sequelize): InitOptions<Actuator> => ({
	sequelize,
	tableName: "actuators",
	timestamps: true,
})

//

export { Actuator, actuatorAttributes, actuatorOptions }
