import { Request, Response } from "express";

import CrudController from "@controllers/CrudController";

export default class TaskController extends CrudController {
    index(request: Request, response: Response) {
        throw new Error("Method not implemented.");
    }
    show(request: Request, response: Response) {
        throw new Error("Method not implemented.");
    }
    create(request: Request, response: Response) {
        throw new Error("Method not implemented.");
    }
    update(request: Request, response: Response) {
        throw new Error("Method not implemented.");
    }
    delete(request: Request, response: Response) {
        throw new Error("Method not implemented.");
    }

}
