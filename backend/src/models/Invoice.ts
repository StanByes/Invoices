import {DataTypes, Model, Optional, Sequelize} from "sequelize";

import Client from "@models/Client";
import Task from "@models/Task";
import {ReductionType} from "@models/Enums";
import {calculateTotal} from "@utils/Calculator";

export type InvoiceAttribute = {
    id: number,
    clientId: number,
    total?: number,
    reduction?: number,
    reductionType?: ReductionType,
    payed: boolean,
    createdAt: Date,
    updatedAt: Date
}
export type InvoiceCreationAttribute = Optional<InvoiceAttribute, "id" | "createdAt" | "updatedAt">

export default class Invoice extends Model<InvoiceAttribute, InvoiceCreationAttribute> {
    declare id: number;
    declare clientId: number;
    declare total?: number;
    declare reduction?: number;
    declare reductionType?: ReductionType;
    declare payed: boolean;
    declare createdAt: Date;
    declare updatedAt: Date;

    declare client: Client;
    declare tasks: Task[];

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
                allowNull: true
            },
            reduction: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            reductionType: {
                type: DataTypes.ENUM("PERCENTAGE", "PRICE"),
                allowNull: true
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

        Invoice.afterSave(async (invoice: Invoice) => {
            await invoice.updateTotal();
        })
    }

    static makeAssociations() {
        Invoice.belongsTo(Client, {
            foreignKey: "clientId",
            as: "client",
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        });

        Invoice.hasMany(Task, {
            foreignKey: "invoiceId",
            as: "tasks",
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        });
    }

    static async findByPkWithTasks(primaryKey: number) {
        return await Invoice.findByPk(primaryKey, {include: [{model: Task, as: "tasks"}]});
    }

    async updateTotal() {
        let total = 0;

        if (!this.tasks)
            await this.reload({include: [{model: Task, as: "tasks"}]});

        if (this.tasks.length != 0) {
            const taskTotal = this.tasks.reduce((total: number, task: Task) => {
                if (task.total)
                    total += task.total;

                return total;
            }, 0);

            total = calculateTotal(taskTotal, this.reduction, this.reductionType);
        }

        await this.update({total}, { hooks: false });
    }
}
