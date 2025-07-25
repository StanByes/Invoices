import {DataTypes, Model, Optional, Sequelize} from "sequelize";
import Client from "./Client";

export type InvoiceAttribute = {
    id: number,
    clientId: number,
    total: number,
    payed: boolean,
    createdAt: Date,
    updatedAt: Date
}
export type InvoiceCreationAttribute = Optional<InvoiceAttribute, "id" | "createdAt" | "updatedAt">

export default class Invoice extends Model<InvoiceAttribute, InvoiceCreationAttribute> {
    declare id: number;
    declare clientId: number;
    declare total: number;
    declare payed: boolean;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(sequelize: Sequelize) {
        Invoice.init({
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            clientId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: "clients",
                    key: "id"
                }
            },
            total: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            payed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }, {
            sequelize,
            timestamps: true,
            engine: "InnoDB",
            underscored: true
        });
    }

    static makeAssociations() {
        Invoice.belongsTo(Client, {
            foreignKey: "clientId",
            as: "client",
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        })
    }
}
