import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
	InitOptions,
	InferAttributes,
	ForeignKey,
	CreationOptional,
	InferCreationAttributes,
} from "sequelize"

//

class Esp32 extends Model<
	InferAttributes<Esp32>,
	InferCreationAttributes<Esp32>
> {
	declare id: CreationOptional<number>
	declare name: string
	declare description: CreationOptional<string>
	declare tokenId: ForeignKey<number>
	declare greenhouseId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const esp32Attributes: ModelAttributes<
	Esp32,
	InferAttributes<Esp32>
> = {
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
	tokenId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "tokens", key: "id" },
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

const esp32Options = (sequelize: Sequelize): InitOptions<Esp32> => ({
	sequelize,
	tableName: "esp32s",
	timestamps: true,
})

//

export { Esp32, esp32Attributes, esp32Options }
