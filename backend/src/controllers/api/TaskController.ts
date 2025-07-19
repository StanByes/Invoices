import Task, {TaskCreationAttribute} from "../../models/Task";
import BaseController from "../BaseController";
import {Request, Response} from "express";
import {BadRequest, NotFound, Conflict, Success} from "../../utils/HTTPResponse";

export default class TaskController extends BaseController {
    async index(request: Request, response: Response) {
        return response.status(200).json(await Task.findAll());
    }

    async show(request: Request, response: Response) {
        return response.status(200).json(await this.getTask(request, response));
    }

    async create(request: Request, response: Response) {
        const body = this.parseBody(request, response, true);
        if (!body)
            return;

        if ((await Task.findOne({where: {name: body.name}})) != null) {
            return response.status(409).json(Conflict);
        }

        const task = await Task.create(body);
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
            if ((await Task.findOne({where: {name: body.name}})) != null) {
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

    private async getTask(request: Request, response: Response): Promise<Task | undefined> {
        const id = request.params.id;
        if (!id) {
            response.status(400).json(BadRequest);
            return;
        }

        const task = await Task.findByPk(id);
        if (!task) {
            response.status(404).json(NotFound);
            return;
        }

        return task;
    }

    private parseBody(request: Request, response: Response, forceOptional: boolean): TaskCreationAttribute | undefined {
        let { name, description, amount, defaultQuantity, maxQuantity } = request.body;
        if (!this.checkField(name) || !this.checkField(description) || !this.checkField(amount)) {
            response.status(400).json(BadRequest);
            return;
        }

        if (forceOptional) {
            defaultQuantity ||= 1;
            maxQuantity ||= 5;
        }

        if (maxQuantity < defaultQuantity) {
            response.status(400).json(BadRequest);
            return;
        }

        return { name, description, amount, defaultQuantity, maxQuantity };
    }
}
