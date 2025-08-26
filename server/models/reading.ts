import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"

//

class Reading extends Model<InferAttributes<Reading>, InferCreationAttributes<Reading>> {
	declare id: CreationOptional<number>
	declare name: string
	declare icon: CreationOptional<string>
	declare unit: CreationOptional<string>
	declare value: number
	declare outputId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const readingAttributes: ModelAttributes<Reading, InferAttributes<Reading>> = {
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
	value: {
		type: DataTypes.FLOAT,
		allowNull: false,
		defaultValue: 0,
	},
	outputId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "outputs", key: "id" },
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

const readingOptions = (sequelize: Sequelize): InitOptions<Reading> => ({
	sequelize,
	tableName: "readings",
	timestamps: true,
})

//

export { Reading, readingAttributes, readingOptions }
