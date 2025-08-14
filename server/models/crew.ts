import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"

//

class Crew extends Model<
	InferAttributes<Crew>,
	InferCreationAttributes<Crew>
> {
	declare id: CreationOptional<number>
	declare userId: ForeignKey<number>
	declare greenhouseId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const crewAttributes: ModelAttributes<
	Crew,
	InferAttributes<Crew>
> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "users", key: "id" },
		onDelete: "CASCADE",
	},
	greenhouseId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "greenhouses", key: "id" },
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

const crewOptions = (sequelize: Sequelize): InitOptions<Crew> => ({
	sequelize,
	tableName: "crews",
	timestamps: true,
	indexes: [
		{
			unique: true,
			fields: ["userId", "greenhouseId"],
		}
	],
})

//

export { Crew, crewAttributes, crewOptions }
