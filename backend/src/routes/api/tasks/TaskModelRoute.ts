import {Request, Response, Router} from "express";
import TaskModelController from "@controllers/api/tasks/TaskModelController";

const controller = new TaskModelController();

const router = Router();
router.get("/", (request: Request, response: Response)=> controller.index(request, response));
router.get("/:id", (request: Request, response: Response) => controller.show(request, response));
router.post("/", (request: Request, response: Response) => controller.create(request, response));
router.patch("/:id", (request: Request, response: Response) => controller.update(request, response));
router.delete("/:id", (request: Request, response: Response) => controller.delete(request, response));

export default router;
