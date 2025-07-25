import { Request, Response } from "express";

import CrudController from "@controllers/CrudController";
import {BadRequest, Forbidden, NotFound, Success} from "@utils/HTTPResponse";
import Invoice from "@models/Invoice";
import Task, {TaskCreationAttribute, TaskUpdateAttribute} from "@models/Task";
import TaskModel from "@models/TaskModel";

export default class TaskController extends CrudController {
    async index(request: Request, response: Response) {
        const invoice = await this.getInvoice(request, response, true);
        if (!invoice)
            return;

        return response.status(200).json(invoice.tasks);
    }

    async show(request: Request, response: Response) {
        const invoice = await this.getInvoice(request, response, true);
        if (!invoice)
            return;

        const task = this.getTask(request, response, invoice);
        if (!task)
            return;

        return response.status(200).json(task);
    }
    async create(request: Request, response: Response) {
        const invoice = await this.getInvoice(request, response, false);
        if (!invoice)
            return;

        const body = this.parseBody(request, response, false) as TaskCreationAttribute;
        if (!body)
            return;

        const model = await TaskModel.findByPk(body.modelId);
        if (!model) {
            response.status(400).json(BadRequest);
            return;
        }

        const task = await Task.createByModel(invoice, model);
        return response.status(200).json(task);
    }
    async update(request: Request, response: Response) {
        const invoice = await this.getInvoice(request, response, false);
        if (!invoice)
            return;

        const task = this.getTask(request, response, invoice);
        if (!task)
            return;

        const body = this.parseBody(request, response, true) as TaskUpdateAttribute;
        if (!body)
            return;

        await task.update(body);
        return response.status(200).json(task);
    }
    async delete(request: Request, response: Response) {
        const invoice = await this.getInvoice(request, response, false);
        if (!invoice)
            return;

        const task = this.getTask(request, response, invoice);
        if (!task)
            return;

        await task.destroy();
        return response.status(200).json(Success);
    }

    private async getInvoice(request: Request, response: Response, allowNonAdmin: boolean): Promise<Invoice | undefined> {
        const { invoiceId } = request.params;
        if (!invoiceId || isNaN(parseInt(invoiceId))) {
            response.status(400).json(BadRequest);
            return;
        }

        const invoice = await Invoice.findByPkWithTasks(parseInt(invoiceId));
        if (!invoice) {
            response.status(404).json(NotFound);
            return;
        }

        const user = request.user!;
        if (!user.admin) {
            if (allowNonAdmin && user.client!.id != invoice.clientId) {
                response.status(403).json(Forbidden);
                return;
            }
        }

        return invoice;
    }

    private getTask(request: Request, response: Response, invoice: Invoice): Task | undefined {
        const { id } = request.params;
        if (!id || isNaN(parseInt(id))) {
            response.status(400).json(BadRequest);
            return;
        }

        const task = invoice.tasks.find(t => t.id == parseInt(id));
        if (!task) {
            response.status(404).json(Forbidden);
            return;
        }

        return task;
    }

    private parseBody(request: Request, response: Response, update: boolean): TaskCreationAttribute | TaskUpdateAttribute | undefined {
        if (!update) {
            const {model_id} = request.body;

            if (!this.checkField(model_id) || isNaN(parseInt(model_id))) {
                response.status(400).json(BadRequest);
                return;
            }

            return {modelId: parseInt(model_id)} as TaskCreationAttribute;
        }

        let {name, description, quantity, amount, reduction, reduction_type} = request.body;
        if (!this.checkField(name) || !this.checkField(description) || !this.checkField(quantity)) {
            response.status(400).json(BadRequest);
            return;
        }

        if (isNaN(parseInt(quantity)) || isNaN(parseInt(amount))) {
            response.status(400).json(BadRequest);
            return;
        }

        if (reduction_type) {
            if (reduction_type != "PERCENTAGE" && reduction_type != "PRICE") {
                response.status(400).json(BadRequest);
                return;
            }
        }

        return {
            name,
            description,
            quantity: parseInt(quantity),
            amount: parseInt(amount),
            reduction,
            reductionType: reduction_type
        } as TaskUpdateAttribute;
    }
}
