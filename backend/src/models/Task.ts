import {CreationOptional, DataTypes, Model, Optional, Sequelize} from "sequelize";
import Invoice from "@models/Invoice";
import TaskModel from "@models/TaskModel";
import {ReductionType} from "@models/Enums";

type TaskAttribute = {
    id: number,
    modelId: number,
    invoiceId: number,
    name: string,
    description: string,
    quantity: number,
    amount: number,
    total?: number,
    reduction?: number,
    reductionType?: ReductionType,
    createdAt: Date,
    updatedAt: Date
}

export type TaskFrozenAttribute = Optional<TaskAttribute, "id" | "createdAt" | "updatedAt">
export type TaskCreationAttribute = Optional<TaskFrozenAttribute, "name" | "description" | "quantity" | "amount">
export type TaskUpdateAttribute = Optional<TaskFrozenAttribute, "invoiceId" | "modelId">

export default class Task extends Model<TaskAttribute, TaskCreationAttribute> {
    declare id: CreationOptional<number>;
    declare modelId: number;
    declare invoiceId: number;
    declare name: string;
    declare description: string;
    declare quantity: number;
    declare amount: number;
    declare total?: number;
    declare reduction?: number;
    declare reductionType?: ReductionType;
    declare createdAt: Date;
    declare updatedAt: Date;

    declare model: Model;
    declare invoice: Invoice;

    static associate(sequelize: Sequelize) {
        Task.init({
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            modelId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: "task_models",
                    key: "id"
                }
            },
            invoiceId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: "invoices",
                    key: "id"
                }
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            total: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            reduction: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            reductionType: {
                type: DataTypes.ENUM("PERCENTAGE", "PRICE"),
                allowNull: true
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }, {
            sequelize,
            timestamps: true,
            engine: "InnoDB",
            underscored: true
        });

        Task.afterSave(async (task: Task) => {
            await task.updateTotal();
        });
    }

    static makeAssociations() {
        Task.belongsTo(TaskModel, {
            foreignKey: "modelId",
            as: "model",
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        });

        Task.belongsTo(Invoice, {
            foreignKey: "invoiceId",
            as: "invoice",
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        });
    }

    static async createByModel(invoice: Invoice, model: TaskModel): Promise<Task> {
        return await Task.create({
            modelId: model.id,
            invoiceId: invoice.id,
            name: model.name,
            description: model.description,
            quantity: 1,
            amount: model.amount,
            total: model.amount
        });
    }

    async updateTotal() {
        let total = this.amount * this.quantity;
        if (this.reduction) {
            if (this.reductionType == "PERCENTAGE") {
                total *= (1 - (this.reduction / 100));
            } else {
                total -= this.reduction;
            }
        }

        await this.update({
            total: total
        });
    }
}
