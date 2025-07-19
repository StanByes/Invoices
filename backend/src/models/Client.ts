import {CreationOptional, DataTypes, Model, Optional, Sequelize} from "sequelize";
import User from "./User";

type ClientAttribute = {
    id: number,
    userId: number,
    firstName: string,
    lastName: string,
    companyId?: string;
    companyName?: string;
    phone: string;
    address: string,
    city: string,
    zip: number,
    createdAt: Date,
    updatedAt: Date
}
export type ClientCreationAttribute = Optional<ClientAttribute, "id" | "createdAt" | "updatedAt">

export default class Client extends Model<ClientAttribute, ClientCreationAttribute> {
    declare id: CreationOptional<number>;
    declare userId: number;
    declare user: CreationOptional<User>;
    declare firstName: string;
    declare lastName: string;
    declare companyId?: string;
    declare companyName?: string;
    declare phone: string;
    declare address: string;
    declare city: string;
    declare zip: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(sequelize: Sequelize) {
        Client.init({
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER.UNSIGNED,
                unique: true,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id"
                }
            },
            firstName: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            companyId: DataTypes.INTEGER,
            companyName: DataTypes.STRING(100),
            phone: {
                type: DataTypes.STRING(15),
                allowNull: false
            },
            address: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            city: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            zip: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }, {
            sequelize,
            timestamps: true,
            underscored: true
        });
    }

    static makeAssociations() {
        Client.belongsTo(User, {
            foreignKey: "user_id",
            as: "user",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
    }
}
