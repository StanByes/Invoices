import {CreationOptional, DataTypes, Model, Optional, Sequelize} from "sequelize";
import Task from "@models/Task";

type TaskModelAttribute = {
    id: number,
    name: string,
    description: string,
    amount: number,
    defaultQuantity: number,
    maxQuantity: number,
    createdAt: Date,
    updatedAt: Date
}
export type TaskModelCreationAttribute = Optional<TaskModelAttribute, "id" | "createdAt" | "updatedAt">

export default class TaskModel extends Model<TaskModelAttribute, TaskModelCreationAttribute> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare description: string;
    declare amount: number;
    declare defaultQuantity: number;
    declare maxQuantity: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    declare tasks: Task[];

    static associate(sequelize: Sequelize) {
        TaskModel.init({
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
            engine: "InnoDB",
            underscored: true
        })
    }

    static makeAssociations() {
        TaskModel.hasMany(Task, {
            foreignKey: "modelId",
            as: "tasks",
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        })
    }
}
