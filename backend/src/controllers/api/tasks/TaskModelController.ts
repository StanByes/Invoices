import {Request, Response} from "express";

import CrudController from "@controllers/CrudController";
import TaskModel, {TaskModelCreationAttribute} from "@models/TaskModel";
import {BadRequest, NotFound, Conflict, Success} from "@utils/HTTPResponse";

export default class TaskModelController extends CrudController {
    async index(request: Request, response: Response) {
        return response.status(200).json(await TaskModel.findAll());
    }

    async show(request: Request, response: Response) {
        return response.status(200).json(await this.getTask(request, response));
    }

    async create(request: Request, response: Response) {
        const body = this.parseBody(request, response, true);
        if (!body)
            return;

        if ((await TaskModel.findOne({where: {name: body.name}})) != null) {
            return response.status(409).json(Conflict);
        }

        const task = await TaskModel.create(body);
        return response.status(200).json(task);
    }

    async update(request: Request, response: Response) {
        const task = await this.getTask(request, response);
        if (!task)
            return;

        const body = this.parseBody(request, response, false);
        if (!body)
            return;

        if (task.name != body.name) {
            if ((await TaskModel.findOne({where: {name: body.name}})) != null) {
                return response.status(409).json(Conflict);
            }
        }

        await task.update(body);
        return response.status(200).json(task);
    }

    async delete(request: Request, response: Response) {
        const task = await this.getTask(request, response);
        if (!task)
            return;

        await task.destroy();
        return response.status(200).json(Success);
    }

    private async getTask(request: Request, response: Response): Promise<TaskModel | undefined> {
        const id = request.params.id;
        if (!id) {
            response.status(400).json(BadRequest);
            return;
        }

        const task = await TaskModel.findByPk(id);
        if (!task) {
            response.status(404).json(NotFound);
            return;
        }

        return task;
    }

    private parseBody(request: Request, response: Response, forceOptional: boolean): TaskModelCreationAttribute | undefined {
        let { name, description, amount, default_quantity, max_quantity } = request.body;
        if (!this.checkField(name) || !this.checkField(description) || !this.checkField(amount)) {
            response.status(400).json(BadRequest);
            return;
        }

        // TODO : Validation number
        if (forceOptional) {
            default_quantity ||= 1;
            max_quantity ||= 5;
        }

        if (max_quantity < default_quantity) {
            response.status(400).json(BadRequest);
            return;
        }

        return { name, description, amount, defaultQuantity: default_quantity, maxQuantity: max_quantity };
    }
}
