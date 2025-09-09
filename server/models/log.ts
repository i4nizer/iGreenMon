import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
    InitOptions,
    InferAttributes,
    ForeignKey,
    CreationOptional,
    InferCreationAttributes,
} from "sequelize"
import { LogLevel } from "#shared/schema/log"

//

class Log extends Model<
    InferAttributes<Log>,
    InferCreationAttributes<Log>
> {
    declare id: CreationOptional<number>
    declare title: string
    declare message: string
    declare level: CreationOptional<LogLevel>
    declare viewed: CreationOptional<boolean>
    declare emailed: CreationOptional<boolean>
    declare messaged: CreationOptional<boolean>
    declare greenhouseId: ForeignKey<number>
    declare userId: ForeignKey<number>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

//

const logAttributes: ModelAttributes<Log, InferAttributes<Log>> = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    level: {
        type: DataTypes.ENUM(...LogLevel),
        allowNull: false,
        defaultValue: LogLevel[0],
    },
    viewed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    emailed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    messaged: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    greenhouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "greenhouses", key: "id" },
        onDelete: "CASCADE",
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

const logOptions = (sequelize: Sequelize): InitOptions<Log> => ({
    sequelize,
    tableName: "logs",
    timestamps: true,
})

//

export { Log, logAttributes, logOptions }
