import { Model, DataTypes, Sequelize } from "sequelize"
import type {
	InferAttributes,
	InferCreationAttributes,
	ForeignKey,
	CreationOptional,
	ModelAttributes,
	InitOptions,
} from "sequelize"
import { type TokenType, TokenTypes } from "~~/server/types/token-type"

//

class Token extends Model<
	InferAttributes<Token>,
	InferCreationAttributes<Token>
> {
	declare id: CreationOptional<number>
	declare type: TokenType
	declare value: string
	declare userId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const tokenAttributes: ModelAttributes<Token, InferAttributes<Token>> = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	value: {
		type: DataTypes.STRING(512),
		allowNull: false,
	},
	type: {
		type: DataTypes.ENUM(...TokenTypes),
		allowNull: false,
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "users", key: "id" },
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

const tokenOptions = (sequelize: Sequelize): InitOptions<Token> => ({
	sequelize,
	tableName: "tokens",
	timestamps: true,
})

//

export { Token, tokenAttributes, tokenOptions }
