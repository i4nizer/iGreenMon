import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"

//

class Greenhouse extends Model<
	InferAttributes<Greenhouse>,
	InferCreationAttributes<Greenhouse>
> {
	declare id: CreationOptional<number>
	declare name: string
	declare description: CreationOptional<string>
	declare userId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const greenhouseAttributes: ModelAttributes<
	Greenhouse,
	InferAttributes<Greenhouse>
> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: "user_greenhouse_name_unique",
	},
	description: {
		type: DataTypes.STRING(500),
		allowNull: false,
		defaultValue: "",
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "users", key: "id" },
		onDelete: "CASCADE",
		unique: "user_greenhouse_name_unique",
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

const greenhouseOptions = (sequelize: Sequelize): InitOptions<Greenhouse> => ({
	sequelize,
	tableName: "greenhouses",
	timestamps: true,
})

//

export { Greenhouse, greenhouseAttributes, greenhouseOptions }
