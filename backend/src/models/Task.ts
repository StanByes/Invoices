import {DataTypes, Model, Optional, Sequelize} from "sequelize";

type TaskAttribute = {
    id: number,
    name: string,
    description: string,
    amount: number,
    defaultCount: number,
    maxCount: number,
    createdAt: Date,
    updatedAt: Date
}
export type TaskCreationAttribute = Optional<TaskAttribute, "id" | "createdAt" | "updatedAt">

export default class Task extends Model<TaskAttribute, TaskCreationAttribute> {
    declare id: number;
    declare name: string;
    declare description: string;
    declare amount: number;
    declare defaultCount: number;
    declare maxCount: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(sequelize: Sequelize) {
        Task.init({
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
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
            defaultCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            maxCount: {
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
