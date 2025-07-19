import {DataTypes, Model, Optional, Sequelize} from "sequelize";

type TaskAttribute = {
    id: number,
    name: string,
    description: string,
    amount: number,
    defaultQuantity: number,
    maxQuantity: number,
    createdAt: Date,
    updatedAt: Date
}
export type TaskCreationAttribute = Optional<TaskAttribute, "id" | "createdAt" | "updatedAt">

export default class Task extends Model<TaskAttribute, TaskCreationAttribute> {
    declare id: number;
    declare name: string;
    declare description: string;
    declare amount: number;
    declare defaultQuantity: number;
    declare maxQuantity: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(sequelize: Sequelize) {
        Task.init({
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            defaultQuantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            maxQuantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 5
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }, {
            sequelize,
            timestamps: true,
            underscored: true
        })
    }
}
