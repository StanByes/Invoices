import {Request, Response, Router} from "express";
import Admin from "../middlewares/Admin";
import CrudController from "../controllers/CrudController";

export const initCrudRouter = (router: Router, controller: CrudController) => {
    router.get("/", Admin, (request: Request, response: Response)=> controller.index(request, response));
    router.get("/:id", (request: Request, response: Response) => controller.show(request, response));
    router.post("/", (request: Request, response: Response) => controller.create(request, response));
    router.patch("/:id", (request: Request, response: Response) => controller.update(request, response));
    router.delete("/:id", (request: Request, response: Response) => controller.delete(request, response));
}
