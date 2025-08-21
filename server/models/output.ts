import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"

//

class Output extends Model<InferAttributes<Output>, InferCreationAttributes<Output>> {
	declare id: CreationOptional<number>
	declare name: string
	declare icon: CreationOptional<string>
	declare unit: CreationOptional<string>
	declare pinId: ForeignKey<number>
	declare sensorId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const outputAttributes: ModelAttributes<Output, InferAttributes<Output>> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	icon: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: "mdi-thermometer",
	},
	unit: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: "",
	},
	pinId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "pins", key: "id" },
		onDelete: "CASCADE",
	},
	sensorId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "sensors", key: "id" },
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

const outputOptions = (sequelize: Sequelize): InitOptions<Output> => ({
	sequelize,
	tableName: "outputs",
	timestamps: true,
})

//

export { Output, outputAttributes, outputOptions }
