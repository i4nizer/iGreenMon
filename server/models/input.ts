import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"
import { InputType } from "#shared/schema/input"

//

class Input extends Model<InferAttributes<Input>, InferCreationAttributes<Input>> {
	declare id: CreationOptional<number>
	declare name: string
	declare icon: CreationOptional<string>
	declare type: CreationOptional<InputType>
	declare flag: CreationOptional<number>
	declare status: CreationOptional<number>
	declare pinId: ForeignKey<number>
	declare actuatorId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const inputAttributes: ModelAttributes<Input, InferAttributes<Input>> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	icon: {
        type: DataTypes.STRING,
        allowNull: false,
		defaultValue: "mdi-fan",
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	type: {
		type: DataTypes.ENUM(...InputType),
        allowNull: false,
        defaultValue: InputType[0],
	},
	flag: {
		type: DataTypes.INTEGER,
		defaultValue: -1,
	},
	status: {
		type: DataTypes.INTEGER,
		defaultValue: -1,
	},
	pinId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "pins", key: "id" },
		onDelete: "CASCADE",
	},
	actuatorId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "actuators", key: "id" },
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

const inputOptions = (sequelize: Sequelize): InitOptions<Input> => ({
	sequelize,
	tableName: "inputs",
	timestamps: true,
})

//

export { Input, inputAttributes, inputOptions }
