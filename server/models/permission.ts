import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
    InitOptions,
    InferAttributes,
    ForeignKey,
    CreationOptional,
    InferCreationAttributes,
} from "sequelize"
import { PermissionResource, PermissionType } from "~~/shared/schema/permission"

//

class Permission extends Model<
    InferAttributes<Permission>,
    InferCreationAttributes<Permission>
> {
    declare id: CreationOptional<number>
    declare type: PermissionType
    declare resource: PermissionResource
    declare crewId: ForeignKey<number>
    declare greenhouseId: ForeignKey<number>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

//

const permissionAttributes: ModelAttributes<
    Permission,
    InferAttributes<Permission>
> = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.ENUM(...PermissionType),
        allowNull: false,
    },
    resource: {
        type: DataTypes.ENUM(...PermissionResource),
        allowNull: false,
    },
    crewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "crews", key: "id" },
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

const permissionOptions = (sequelize: Sequelize): InitOptions<Permission> => ({
    sequelize,
    tableName: "permissions",
    timestamps: true,
})

//

export { Permission, permissionAttributes, permissionOptions }
